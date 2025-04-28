'''from flask import Flask, request, render_template
from resume_parser import extract_text
from keyword_matcher import keyword_match
from ats_checker import ats_check
from grammar_check import grammar_check

import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# ✅ Automatically create the uploads folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/refine', methods=['GET', 'POST'])
def refine():
    if request.method == 'POST':
        file = request.files['resume']
        job_desc = request.form['job_description']

        # Save file
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        file_ext = os.path.splitext(filename)[1].lower()
        good_format = file_ext == '.pdf'  # PDFs preferred

        # Extract text
        resume_text = extract_text(filename)

        # Run evaluations
        match_score = keyword_match(resume_text, job_desc)
        ats_score, ats_details = ats_check(resume_text)
        grammar_errors, grammar_suggestions = grammar_check(resume_text)

        # Insert good_format into ats_details
        ats_details['good_file_format'] = good_format

        return render_template('results.html',
                               match_score=match_score,
                               ats_score=ats_score,
                               ats_details=ats_details,
                               grammar_errors=grammar_errors,
                               grammar_suggestions=grammar_suggestions)
    
    return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)'''

'''from flask import Flask, request, render_template
from resume_parser import extract_text
from keyword_matcher import keyword_match
from ats_checker import ats_check
from grammar_check import grammar_check

import os
import re

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# ✅ Automatically create the uploads folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def check_contact_info(resume_text):
    # Simple regex to check for phone number or email
    phone_pattern = r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
    email_pattern = r"[\w\.-]+@[\w\.-]+\.\w+"
    phone_found = re.search(phone_pattern, resume_text)
    email_found = re.search(email_pattern, resume_text)
    return phone_found is not None and email_found is not None

def check_resume_length(resume_text):
    # Checking if the resume is too short or too long (just an example)
    word_count = len(resume_text.split())
    if word_count < 300 or word_count > 1500:
        return False
    return True

def check_sections(resume_text):
    # Check for presence of key sections in the resume
    required_sections = ['experience', 'education', 'skills']
    return all(section in resume_text.lower() for section in required_sections)

@app.route('/refine', methods=['GET', 'POST'])
def refine():
    if request.method == 'POST':
        file = request.files['resume']
        job_desc = request.form['job_description']

        # Save file
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        file_ext = os.path.splitext(filename)[1].lower()
        good_format = file_ext == '.pdf'  # PDFs preferred

        # Extract text
        resume_text = extract_text(filename)

        # Run evaluations
        match_score = keyword_match(resume_text, job_desc)
        ats_score, ats_details = ats_check(resume_text)
        grammar_errors, grammar_suggestions = grammar_check(resume_text)

        # Additional ATS checks
        ats_details['good_file_format'] = good_format
        ats_details['has_contact_info'] = check_contact_info(resume_text)
        ats_details['has_appropriate_length'] = check_resume_length(resume_text)
        ats_details['has_required_sections'] = check_sections(resume_text)

        return render_template('results.html',
                               match_score=match_score,
                               ats_score=ats_score,
                               ats_details=ats_details,
                               grammar_errors=grammar_errors,
                               grammar_suggestions=grammar_suggestions)
    
    return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)'''

'''from flask import Flask, request, render_template
from resume_parser import extract_text
from keyword_matcher import keyword_match
from ats_checker import ats_check
from grammar_check import grammar_check
import os
import re

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Automatically create the uploads folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def extended_ats_check(resume_text, good_format):
    checks = {
        "has_contact_info": bool(re.search(r"\d{10}|[\w\.-]+@[\w\.-]+", resume_text)),
        "has_section_headers": any(kw in resume_text.lower() for kw in ["experience", "education", "skills", "projects", "certifications", "achievements"]),
        "has_bullet_points": bool(re.search(r"[\u2022\-*]", resume_text)),
        "appropriate_length": 300 <= len(resume_text.split()) <= 900,  # 1-2 pages
        "uses_action_verbs": bool(re.search(r"\b(led|developed|created|implemented|managed|designed|initiated|improved|coordinated|analyzed|optimized|negotiated|supervised|executed|increased|decreased)\b", resume_text, re.I)),
        "mentions_education": bool(re.search(r"(bachelor|master|ph\.d|b\.s\.|m\.s\.|mba|associate)", resume_text, re.I)),
        "mentions_certifications": bool(re.search(r"certified|certification|certificate", resume_text, re.I)),
        "mentions_numbers": bool(re.search(r"\d+%|\$\d+", resume_text)),
        "no_excessive_caps": len(re.findall(r"\b[A-Z]{4,}\b", resume_text)) < 15,  # limit random full-caps words
        "minimal_spelling_mistakes": True,  # Will assume grammar tool handles it separately
        "good_file_format": good_format
    }
    score = round(sum(checks.values()) / len(checks) * 100, 2)
    return score, checks

@app.route('/refine', methods=['GET', 'POST'])
def refine():
    if request.method == 'POST':
        file = request.files['resume']
        job_desc = request.form['job_description']

        # Save file
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        # Check file format (prefer PDF)
        file_ext = os.path.splitext(filename)[1].lower()
        good_format = file_ext == '.pdf'

        # Extract text from resume
        resume_text = extract_text(filename)

        # Run evaluations
        match_score = keyword_match(resume_text, job_desc)
        ats_score, ats_details = extended_ats_check(resume_text, good_format)
        grammar_errors, grammar_suggestions = grammar_check(resume_text)

        # Combine the scores into a final resume score
        final_resume_score = round((0.3 * match_score) + (0.3 * ats_score) + (0.2 * (100 - (grammar_errors * 2))) + (0.2 * (100 if good_format else 70)), 2)

        return render_template('results.html',
                               match_score=match_score,
                               ats_score=ats_score,
                               ats_details=ats_details,
                               grammar_errors=grammar_errors,
                               grammar_suggestions=grammar_suggestions,
                               final_resume_score=final_resume_score)

    return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)'''

#consider this in case of error 
'''from flask import Flask, request, render_template
from resume_parser import extract_text
from keyword_matcher import keyword_match
from ats_checker import ats_check
from grammar_check import grammar_check
import os
import re

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Automatically create the uploads folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def extended_ats_check(resume_text, good_format):
    basic_checks = {
        "has_contact_info": bool(re.search(r"\d{10}|[\w\.-]+@[\w\.-]+", resume_text)),
        "has_section_headers": any(kw in resume_text.lower() for kw in ["experience", "education", "skills", "projects", "certifications", "achievements"]),
        "has_bullet_points": bool(re.search(r"[\u2022\-*]", resume_text)),
        "appropriate_length": 300 <= len(resume_text.split()) <= 900,
        "uses_action_verbs": bool(re.search(r"\b(led|developed|created|implemented|managed|designed|initiated|improved|coordinated|analyzed|optimized|negotiated|supervised|executed|increased|decreased)\b", resume_text, re.I)),
        "mentions_education": bool(re.search(r"(bachelor|master|ph\.d|b\.s\.|m\.s\.|mba|associate)", resume_text, re.I)),
        "mentions_certifications": bool(re.search(r"certified|certification|certificate", resume_text, re.I)),
        "mentions_numbers": bool(re.search(r"\d+%|\$\d+", resume_text)),
        "no_excessive_caps": len(re.findall(r"\b[A-Z]{4,}\b", resume_text)) < 15,
        "minimal_spelling_mistakes": True,
        "good_file_format": good_format
    }

    additional_keywords = [
        "python", "sql", "data analysis", "machine learning", "deep learning", "project management", "team leadership",
        "communication skills", "problem solving", "critical thinking", "cloud computing", "aws", "azure", "gcp",
        "business analysis", "risk management", "cybersecurity", "devops", "agile", "scrum", "pmp", "six sigma",
        "customer service", "marketing", "sales", "budget management", "financial analysis", "data visualization",
        "tableau", "power bi", "excel", "pivot tables", "data mining", "big data", "hadoop", "spark", "kubernetes", "docker",
        "software development", "java", "javascript", "html", "css", "git", "github", "linux", "windows server",
        "network security", "penetration testing", "incident response", "IT support", "technical support",
        "business strategy", "process improvement", "lean methodology", "automation", "AI", "NLP", "computer vision",
        "supply chain management", "logistics", "operations management", "accounting", "auditing", "ERP", "SAP",
        "human resources", "talent acquisition", "training and development", "organizational development",
        "conflict resolution", "time management", "adaptability", "creativity", "entrepreneurship", "innovation",
        "blockchain", "cryptocurrency", "mobile development", "android development", "ios development",
        "product management", "product design", "UX/UI design", "graphic design", "content creation", "SEO",
        "social media management", "digital marketing", "e-commerce", "market research", "quality assurance",
        "testing", "unit testing", "integration testing", "systems analysis", "business intelligence", "data engineering",
        "ETL pipelines", "data warehousing", "snowflake", "redshift", "data governance", "regulatory compliance",
        "GDPR", "HIPAA", "project scheduling", "resource management", "vendor management", "contract negotiation"
    ]

    keyword_checks = {f"mentions_{kw.replace(' ', '_')}": kw in resume_text.lower() for kw in additional_keywords}

    all_checks = {**basic_checks, **keyword_checks}

    score = round(sum(all_checks.values()) / len(all_checks) * 100, 2)
    return score, all_checks

@app.route('/refine', methods=['GET', 'POST'])
def refine():
    if request.method == 'POST':
        file = request.files['resume']
        job_desc = request.form['job_description']

        # Save file
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        # Check file format (prefer PDF)
        file_ext = os.path.splitext(filename)[1].lower()
        good_format = file_ext == '.pdf'

        # Extract text from resume
        resume_text = extract_text(filename)

        # Run evaluations
        match_score = keyword_match(resume_text, job_desc)
        ats_score, ats_details = extended_ats_check(resume_text, good_format)
        grammar_errors, grammar_suggestions = grammar_check(resume_text)

        # Combine the scores into a final resume score
        final_resume_score = round((0.3 * match_score) + (0.3 * ats_score) + (0.2 * (100 - (grammar_errors * 2))) + (0.2 * (100 if good_format else 70)), 2)

        return render_template('results.html',
                               match_score=match_score,
                               ats_score=ats_score,
                               ats_details=ats_details,
                               grammar_errors=grammar_errors,
                               grammar_suggestions=grammar_suggestions,
                               final_resume_score=final_resume_score)

    return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)'''

'''
from flask import Flask, request, render_template
from resume_parser import extract_text
from keyword_matcher import keyword_match
from ats_checker import ats_check
from grammar_check import grammar_check
import os
import re

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Automatically create the uploads folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def extended_ats_check(resume_text, good_format):
    # Basic checks for resume content
    basic_checks = {
        "has_contact_info": bool(re.search(r"\d{10}|[\w\.-]+@[\w\.-]+", resume_text)),
        "has_section_headers": any(kw in resume_text.lower() for kw in ["experience", "education", "skills", "projects", "certifications", "achievements"]),
        "has_bullet_points": bool(re.search(r"[\u2022\-*]", resume_text)),
        "appropriate_length": 300 <= len(resume_text.split()) <= 900,  # 1-2 pages
        "uses_action_verbs": bool(re.search(r"\b(led|developed|created|implemented|managed|designed|initiated|improved|coordinated|analyzed|optimized|negotiated|supervised|executed|increased|decreased)\b", resume_text, re.I)),
        "mentions_education": bool(re.search(r"(bachelor|master|ph\.d|b\.s\.|m\.s\.|mba|associate)", resume_text, re.I)),
        "mentions_certifications": bool(re.search(r"certified|certification|certificate", resume_text, re.I)),
        "mentions_numbers": bool(re.search(r"\d+%|\$\d+", resume_text)),
        "no_excessive_caps": len(re.findall(r"\b[A-Z]{4,}\b", resume_text)) < 15,  # limit random full-caps words
        "minimal_spelling_mistakes": True,  # Will assume grammar tool handles it separately
        "good_file_format": good_format
    }

    # List of technical and non-technical keywords
    additional_keywords = [
        "python", "sql", "data analysis", "machine learning", "deep learning", "project management", "team leadership",
        "communication skills", "problem solving", "critical thinking", "cloud computing", "aws", "azure", "gcp",
        "business analysis", "risk management", "cybersecurity", "devops", "agile", "scrum", "pmp", "six sigma",
        "customer service", "marketing", "sales", "budget management", "financial analysis", "data visualization",
        "tableau", "power bi", "excel", "pivot tables", "data mining", "big data", "hadoop", "spark", "kubernetes", "docker",
        "software development", "java", "javascript", "html", "css", "git", "github", "linux", "windows server",
        "network security", "penetration testing", "incident response", "IT support", "technical support",
        "business strategy", "process improvement", "lean methodology", "automation", "AI", "NLP", "computer vision",
        "supply chain management", "logistics", "operations management", "accounting", "auditing", "ERP", "SAP",
        "human resources", "talent acquisition", "training and development", "organizational development",
        "conflict resolution", "time management", "adaptability", "creativity", "entrepreneurship", "innovation",
        "blockchain", "cryptocurrency", "mobile development", "android development", "ios development",
        "product management", "product design", "UX/UI design", "graphic design", "content creation", "SEO",
        "social media management", "digital marketing", "e-commerce", "market research", "quality assurance",
        "testing", "unit testing", "integration testing", "systems analysis", "business intelligence", "data engineering",
        "ETL pipelines", "data warehousing", "snowflake", "redshift", "data governance", "regulatory compliance",
        "GDPR", "HIPAA", "project scheduling", "resource management", "vendor management", "contract negotiation"
    ]

    # Check for the presence of additional keywords
    keyword_checks = {f"mentions_{kw.replace(' ', '_')}": bool(re.search(r"\b" + re.escape(kw) + r"\b", resume_text, re.I)) for kw in additional_keywords}

    # Combine the basic checks and keyword checks
    all_checks = {**basic_checks, **keyword_checks}

    # Calculate the ATS score
    score = round(sum(all_checks.values()) / len(all_checks) * 100, 2)
    return score, all_checks

@app.route('/refine', methods=['GET', 'POST'])
def refine():
    if request.method == 'POST':
        file = request.files['resume']
        job_desc = request.form['job_description']

        # Save file
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        # Check file format (prefer PDF)
        file_ext = os.path.splitext(filename)[1].lower()
        good_format = file_ext == '.pdf'

        # Extract text from resume
        resume_text = extract_text(filename)

        # Run evaluations
        match_score = keyword_match(resume_text, job_desc)
        ats_score, ats_details = extended_ats_check(resume_text, good_format)
        grammar_errors, grammar_suggestions = grammar_check(resume_text)

        # Combine the scores into a final resume score
        final_resume_score = round((0.3 * match_score) + (0.3 * ats_score) + (0.2 * (100 - (grammar_errors * 2))) + (0.2 * (100 if good_format else 70)), 2)

        return render_template('results.html',
                               match_score=match_score,
                               ats_score=ats_score,
                               ats_details=ats_details,
                               grammar_errors=grammar_errors,
                               grammar_suggestions=grammar_suggestions,
                               final_resume_score=final_resume_score)

    return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)'''
# Final code in case 
'''from flask import Flask, request, render_template
from resume_parser import extract_text
from keyword_matcher import keyword_match
from ats_checker import ats_check
from grammar_check import grammar_check
import os
import re

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Automatically create the uploads folder if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def extended_ats_check(resume_text, good_format):
    # Basic checks for resume content
    basic_checks = {
        "has_contact_info": bool(re.search(r"\d{10}|[\w\.-]+@[\w\.-]+", resume_text)),
        "has_section_headers": any(kw in resume_text.lower() for kw in ["experience", "education", "skills", "projects", "certifications", "achievements"]),
        "has_bullet_points": bool(re.search(r"[\u2022\-*]", resume_text)),
        "appropriate_length": 300 <= len(resume_text.split()) <= 900,  # 1-2 pages
        "uses_action_verbs": bool(re.search(r"\b(led|developed|created|implemented|managed|designed|initiated|improved|coordinated|analyzed|optimized|negotiated|supervised|executed|increased|decreased)\b", resume_text, re.I)),
        "mentions_education": bool(re.search(r"(bachelor|master|ph\.d|b\.s\.|m\.s\.|mba|associate)", resume_text, re.I)),
        "mentions_certifications": bool(re.search(r"certified|certification|certificate", resume_text, re.I)),
        "mentions_numbers": bool(re.search(r"\d+%|\$\d+", resume_text)),
        "no_excessive_caps": len(re.findall(r"\b[A-Z]{4,}\b", resume_text)) < 15,  # limit random full-caps words
        "minimal_spelling_mistakes": True,  # Will assume grammar tool handles it separately
        "good_file_format": good_format
    }

    # List of technical and non-technical keywords
    additional_keywords = [
        "python", "sql", "data analysis", "machine learning", "deep learning", "project management", "team leadership",
        "communication skills", "problem solving", "critical thinking", "cloud computing", "aws", "azure", "gcp",
        "business analysis", "risk management", "cybersecurity", "devops", "agile", "scrum", "pmp", "six sigma",
        "customer service", "marketing", "sales", "budget management", "financial analysis", "data visualization",
        "tableau", "power bi", "excel", "pivot tables", "data mining", "big data", "hadoop", "spark", "kubernetes", "docker",
        "software development", "java", "javascript", "html", "css", "git", "github", "linux", "windows server",
        "network security", "penetration testing", "incident response", "IT support", "technical support",
        "business strategy", "process improvement", "lean methodology", "automation", "AI", "NLP", "computer vision",
        "supply chain management", "logistics", "operations management", "accounting", "auditing", "ERP", "SAP",
        "human resources", "talent acquisition", "training and development", "organizational development",
        "conflict resolution", "time management", "adaptability", "creativity", "entrepreneurship", "innovation",
        "blockchain", "cryptocurrency", "mobile development", "android development", "ios development",
        "product management", "product design", "UX/UI design", "graphic design", "content creation", "SEO",
        "social media management", "digital marketing", "e-commerce", "market research", "quality assurance",
        "testing", "unit testing", "integration testing", "systems analysis", "business intelligence", "data engineering",
        "ETL pipelines", "data warehousing", "snowflake", "redshift", "data governance", "regulatory compliance",
        "GDPR", "HIPAA", "project scheduling", "resource management", "vendor management", "contract negotiation"
    ]

    # Check for the presence of additional keywords
    keyword_checks = {f"mentions_{kw.replace(' ', '_')}": bool(re.search(r"\b" + re.escape(kw) + r"\b", resume_text, re.I)) for kw in additional_keywords}

    # Combine the basic checks and keyword checks
    all_checks = {**basic_checks, **keyword_checks}

    # Calculate the ATS score
    score = round(sum(all_checks.values()) / len(all_checks) * 100, 2)
    return score, all_checks

@app.route('/refine', methods=['GET', 'POST'])
def refine():
    if request.method == 'POST':
        file = request.files['resume']
        job_desc = request.form['job_description']

        # Save file
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        # Check file format (prefer PDF)
        file_ext = os.path.splitext(filename)[1].lower()
        good_format = file_ext == '.pdf'

        # Extract text from resume
        resume_text = extract_text(filename)

        # Run evaluations
        match_score = keyword_match(resume_text, job_desc)
        ats_score, ats_details = extended_ats_check(resume_text, good_format)
        #grammar_errors, grammar_suggestions = grammar_check(resume_text)

        # Combine the scores into a final resume score
       # final_resume_score = round((0.3 * match_score) + (0.3 * ats_score) + (0.2 * (100 - (grammar_errors * 2))) + (0.2 * (100 if good_format else 70)), 2)
        final_resume_score = round((0.3 * match_score) + (0.3 * ats_score) +  (0.2 * (100 if good_format else 70)), 2)

        return render_template('results.html',
                               match_score=match_score,
                               ats_score=ats_score,
                               ats_details=ats_details,
                               #grammar_errors=grammar_errors,
                               #grammar_suggestions=grammar_suggestions,
                               final_resume_score=final_resume_score)

    return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)'''


from flask import Flask, render_template, request
from utils.resume_parser import extract_text
from utils.ats_checker import ats_check
from utils.grammar_check import grammar_check
from utils.keyword_matcher import keyword_match
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
@app.route('/resume_refinement', methods=['GET', 'POST'])
def resume_refinement():
    if request.method == 'POST':
        file = request.files['resume']
        job_desc = request.form['job_description']

        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        resume_text = extract_text(filename)
        file_ext = os.path.splitext(filename)[1].lower()
        good_format = file_ext == '.pdf'

        match_score = keyword_match(resume_text, job_desc)
        ats_score, ats_details = ats_check(resume_text, good_format)
        grammar_errors, grammar_suggestions = grammar_check(resume_text)

        final_resume_score = round((0.3 * match_score) + (0.3 * ats_score) + (0.2 * (100 - (grammar_errors * 2))) + (0.2 * (100 if good_format else 70)), 2)

        return render_template('resume_result.html',
                               match_score=match_score,
                               ats_score=ats_score,
                               ats_details=ats_details,
                               grammar_errors=grammar_errors,
                               grammar_suggestions=grammar_suggestions,
                               final_resume_score=final_resume_score)

    return render_template('resume_upload.html')  # IMPORTANT for GET method

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000, debug=True)