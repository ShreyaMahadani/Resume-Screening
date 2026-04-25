def normalize_text(text):
    return text.lower().strip()

def normalize_skills(skills):
    return [normalize_text(skill) for skill in skills]

def calculate_percentage(part, total):
    if total == 0:
        return 0
    return (part / total) * 100

def round_score(score):
    return round(score, 2)

def get_skill_match(candidate_skills, jd_skills):
    candidate_skills = set(normalize_skills(candidate_skills))
    jd_skills = set(normalize_skills(jd_skills))

    return len(candidate_skills & jd_skills)