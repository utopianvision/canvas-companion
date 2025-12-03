from flask import Flask, request, jsonify
from flask_cors import CORS
from canvasapi import Canvas
from canvasapi.exceptions import InvalidAccessToken, ResourceDoesNotExist
import google.generativeai as genai
from datetime import datetime, timedelta, UTC
import re
from html import unescape

app = Flask(__name__)
CORS(app)

# Configure Gemini
GEMINI_API_KEY = ""
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')
chat = model.start_chat() # Start a chat session

# Store active Canvas sessions
canvas_sessions = {}


def strip_html(text):
    """Remove HTML tags and clean up text"""
    if not text:
        return ''
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Unescape HTML entities
    text = unescape(text)
    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Authenticate with Canvas and validate credentials"""
    data = request.json
    canvas_url = data.get('canvasUrl')
    api_key = data.get('apiKey')
    
    if not canvas_url or not api_key:
        return jsonify({'error': 'Canvas URL and API key are required'}), 400
    
    try:
        canvas = Canvas(canvas_url, api_key)
        user = canvas.get_current_user()
        
        session_id = f"{user.id}_{datetime.now().timestamp()}"
        canvas_sessions[session_id] = {
            'canvas': canvas,
            'user': user,
            'canvas_url': canvas_url
        }
        
        return jsonify({
            'success': True,
            'sessionId': session_id,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': getattr(user, 'email', ''),
                'avatar': getattr(user, 'avatar_url', '')
            }
        })
        
    except InvalidAccessToken:
        return jsonify({'error': 'Invalid API key. Please check your credentials.'}), 401
    except Exception as e:
        return jsonify({'error': f'Failed to connect to Canvas: {str(e)}'}), 500


@app.route('/api/user', methods=['GET'])
def get_user():
    """Get current user information"""
    session_id = request.headers.get('X-Session-Id')
    
    if not session_id or session_id not in canvas_sessions:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        user = canvas_sessions[session_id]['user']
        canvas_url = canvas_sessions[session_id]['canvas_url']
        
        return jsonify({
            'id': user.id,
            'name': user.name,
            'email': getattr(user, 'email', ''),
            'avatar': getattr(user, 'avatar_url', ''),
            'canvasUrl': canvas_url
        })
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch user: {str(e)}'}), 500


@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Fetch all courses for the authenticated user"""
    session_id = request.headers.get('X-Session-Id')
    
    if not session_id or session_id not in canvas_sessions:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        canvas = canvas_sessions[session_id]['canvas']
        user = canvas_sessions[session_id]['user']
        
        courses = []
        for course in user.get_courses(enrollment_state='active'):
            course_data = {
                'id': str(course.id),
                'name': course.name,
                'courseCode': getattr(course, 'course_code', ''),
                'term': getattr(course, 'term', {}).get('name', 'Current Term') if hasattr(course, 'term') else 'Current Term',
                'instructor': '',
                'color': f"#{hash(course.name) % 0xFFFFFF:06x}",
                'grade': None,
                'credits': 3,
                'schedule': []
            }
            
            try:
                enrollments = course.get_enrollments()
                for enrollment in enrollments:
                    if enrollment.type == 'student':
                        grades = getattr(enrollment, 'grades', {})
                        if grades and 'current_score' in grades:
                            course_data['grade'] = grades['current_score']
                    elif enrollment.type == 'teacher':
                        user_info = getattr(enrollment, 'user', {})
                        course_data['instructor'] = user_info.get('name', 'Instructor')
            except:
                pass
            
            courses.append(course_data)
        
        return jsonify(courses)
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch courses: {str(e)}'}), 500


@app.route('/api/assignments', methods=['GET'])
def get_assignments():
    """Fetch assignments from 1 week ago to future"""
    session_id = request.headers.get('X-Session-Id')
    
    if not session_id or session_id not in canvas_sessions:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        canvas = canvas_sessions[session_id]['canvas']
        user = canvas_sessions[session_id]['user']
        
        assignments = []
        courses = user.get_courses(enrollment_state='active')
        
        for course in courses:
            course_assignments = course.get_assignments()
            
            for assignment in course_assignments:
                due_date = getattr(assignment, 'due_at', None)
                
                if not due_date:
                    continue
                
                try:
                    status = "past"
                    
                    due_datetime = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
                    if due_datetime >= datetime.now(UTC):
                        status = "upcoming"
                    
                    try:
                        submission = assignment.get_submission(user.id)
                        if getattr(submission, 'submitted_at', None):
                            if getattr(submission, 'grade', None):
                                status = "graded"
                            else:
                                status = "submitted"
                    except:
                        pass
                    
                    # Clean HTML from description
                    raw_description = getattr(assignment, 'description', '')
                    clean_description = strip_html(raw_description)
                    
                    assignment_data = {
                        'id': str(assignment.id),
                        'courseId': str(course.id),
                        'courseName': course.name,
                        'courseColor': f"#{hash(course.name) % 0xFFFFFF:06x}",
                        'title': assignment.name,
                        'description': clean_description,
                        'dueDate': due_date,
                        'points': getattr(assignment, 'points_possible', 0),
                        'submissionType': getattr(assignment, 'submission_types', ['none'])[0],
                        'status': status,
                    }
                    
                    assignments.append(assignment_data)
                except:
                    continue
        
        return jsonify(assignments)
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch assignments: {str(e)}'}), 500


@app.route('/api/study-plan/generate', methods=['POST'])
def generate_study_plan():
    """Generate AI study plan focused on actual assignments"""
    session_id = request.headers.get('X-Session-Id')
    
    if not session_id or session_id not in canvas_sessions:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        canvas = canvas_sessions[session_id]['canvas']
        user = canvas_sessions[session_id]['user']
        
        data = request.json or {}
        start_date_str = data.get('startDate')
        end_date_str = data.get('endDate')
        
        if start_date_str:
            start_date = datetime.fromisoformat(start_date_str.replace('Z', ''))
        else:
            start_date = datetime.now()
        
        if end_date_str:
            end_date = datetime.fromisoformat(end_date_str.replace('Z', ''))
        else:
            end_date = start_date + timedelta(days=7)
        
        courses = list(user.get_courses(enrollment_state='active'))
        all_assignments = []
        
        for course in courses:
            assignments = course.get_assignments()
            for assignment in assignments:
                due_date = getattr(assignment, 'due_at', None)
                if due_date:
                    try:
                        due_datetime = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
                        
                        if start_date.replace(tzinfo=due_datetime.tzinfo) <= due_datetime <= end_date.replace(tzinfo=due_datetime.tzinfo):
                            raw_description = getattr(assignment, 'description', '')
                            clean_description = strip_html(raw_description)
                            
                            all_assignments.append({
                                'course': course.name,
                                'title': assignment.name,
                                'description': clean_description[:200] if clean_description else 'No description',
                                'due_date': due_datetime.strftime('%B %d, %Y at %I:%M %p'),
                                'points': getattr(assignment, 'points_possible', 0),
                                'submission_type': getattr(assignment, 'submission_types', ['none'])[0]
                            })
                    except:
                        continue
        
        num_days = (end_date - start_date).days + 1
        
        # Enhanced prompt focused on assignment completion
        assignments_detail = ""
        if all_assignments:
            assignments_detail = "\n".join([
                f"- [{a['course']}] {a['title']}\n  Due: {a['due_date']} | {a['points']} points | Type: {a['submission_type']}\n  Description: {a['description']}"
                for a in all_assignments
            ])
        else:
            assignments_detail = "No assignments due in this period"
        
        prompt = f"""You are a study planning assistant helping a college student efficiently complete their assignments.

STUDENT'S WORKLOAD ({start_date.strftime('%B %d, %Y')} to {end_date.strftime('%B %d, %Y')}):

Courses: {', '.join([course.name for course in courses])}

ASSIGNMENTS TO COMPLETE:
{assignments_detail}

CREATE A STRATEGIC STUDY PLAN:

Your goal is to help the student complete these specific assignments efficiently. For each day from {start_date.strftime('%B %d')} to {end_date.strftime('%B %d')}:

1. Break down each assignment into actionable tasks (e.g., "Read Chapter 9 for Bio assignment", "Complete WebAssign 6.3 problems", "Draft lab report introduction")
2. Prioritize based on due dates and point values
3. Balance workload across days to avoid cramming

For each task, specify:
- Exact assignment it relates to (use assignment title)
- Specific action to take (not just "study Biology")
- Estimated duration in hours
- Priority level based on due date proximity

Also provide 5 study tips specifically for completing these types of assignments efficiently.

Format as JSON:
{{
  "weekStart": "{start_date.strftime('%Y-%m-%d')}",
  "weekEnd": "{end_date.strftime('%Y-%m-%d')}",
  "dailyPlans": [
    {{
      "date": "YYYY-MM-DD",
      "dayName": "Monday",
      "tasks": [
        {{
          "duration": 2,
          "subject": "Course Name",
          "task": "Specific action for specific assignment (e.g., 'Complete Chapter 9 Reading Guide questions 1-15')",
          "priority": "high"
        }}
      ],
      "totalHours": 5
    }}
  ],
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}}"""

        response = model.generate_content(prompt)
        
        import json
        import re
        
        text = response.text
        json_match = re.search(r'```json\s*(.*?)\s*```', text, re.DOTALL)
        if json_match:
            text = json_match.group(1)
        
        study_plan = json.loads(text)
        study_plan['id'] = f"plan_{datetime.now().timestamp()}"
        study_plan['generatedAt'] = datetime.now().isoformat()
        
        return jsonify(study_plan)
        
    except Exception as e:
        return jsonify({'error': f'Failed to generate study plan: {str(e)}'}), 500


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout and clear session"""
    session_id = request.headers.get('X-Session-Id')
    
    if session_id and session_id in canvas_sessions:
        del canvas_sessions[session_id]
    
    return jsonify({'success': True})


@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    data = request.get_json()
    message = data.get('message')

    if not message:
        return jsonify({'error': 'Message is required'}), 400

    try:
        response = chat.send_message(message) # Use chat.send_message
        reply = response.text
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000, ssl_context=('cert.pem', 'key.pem'))
