import re

def ats_check(resume_text, good_format=True):
    checks = {
        "has_contact_info": bool(re.search(r"\d{10}|[\w\.-]+@[\w\.-]+", resume_text)),
        "has_section_headers": any(kw in resume_text.lower() for kw in ["experience", "education", "skills", "projects", "certifications", "achievements"]),
        "has_bullet_points": bool(re.search(r"[•\-\*]", resume_text)),  # ✅ fixed here
        "appropriate_length": 300 <= len(resume_text.split()) <= 900,
        "uses_action_verbs": bool(re.search(r"\b(led|developed|created|implemented|managed|designed|initiated|improved|coordinated|analyzed|optimized|negotiated|supervised|executed|increased|decreased)\b", resume_text, re.I)),
        "mentions_education": bool(re.search(r"(bachelor|master|ph\.d|b\.s\.|m\.s\.|mba|associate)", resume_text, re.I)),
        "mentions_certifications": bool(re.search(r"certified|certification|certificate", resume_text, re.I)),
        "mentions_numbers": bool(re.search(r"\d+%|\$\d+", resume_text)),
        "no_excessive_caps": len(re.findall(r"\b[A-Z]{4,}\b", resume_text)) < 15,
        "good_file_format": good_format
    }

    score = round(sum(checks.values()) / len(checks) * 100, 2)
    return score, checks
