from flask import Flask, render_template, request
from utils.resume_parser import extract_text
from utils.keyword_matcher import keyword_match
from utils.ats_checker import ats_check
from utils.grammar_check import grammar_check
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure the uploads folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Remove frame-blocking header if you ever embed via iframe
@app.after_request
def allow_iframe(response):
    response.headers.pop('X-Frame-Options', None)
    return response

# Serve at both /refine and /resume_refinement
@app.route('/refine', methods=['GET', 'POST'])
@app.route('/resume_refinement', methods=['GET', 'POST'])
def resume_refinement():
    # GET → show upload form
    if request.method == 'GET':
        return render_template('resume_upload.html')

    # POST → process the uploaded resume
    file = request.files.get('resume')
    job_desc = request.form.get('job_description', '')

    # Save file
    filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filename)

    # Extract text & file format
    resume_text = extract_text(filename)
    file_ext = os.path.splitext(filename)[1].lower()
    good_format = (file_ext == '.pdf')

    # Compute scores
    match_score = keyword_match(resume_text, job_desc)
    ats_score, ats_details = ats_check(resume_text, good_format)
    grammar_errors, grammar_suggestions = grammar_check(resume_text)
    final_resume_score = round(
        (0.3 * match_score) +
        (0.3 * ats_score) +
        (0.2 * (100 - (grammar_errors * 2))) +
        (0.2 * (100 if good_format else 70)),
        2
    )

    # Render results template
    return render_template(
        'resume_result.html',
        match_score=match_score,
        ats_score=ats_score,
        ats_details=ats_details,
        grammar_errors=grammar_errors,
        grammar_suggestions=grammar_suggestions,
        final_resume_score=final_resume_score
    )

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)
