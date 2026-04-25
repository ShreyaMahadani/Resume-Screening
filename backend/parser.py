def parse_jd(jd):
    jd = jd.lower()

    skills = []

    if "python" in jd:
        skills.append("Python")
    if "django" in jd:
        skills.append("Django")
    if "sql" in jd:
        skills.append("SQL")

    # experience detection
    experience = 0
    if "2" in jd:
        experience = 2
    elif "3" in jd:
        experience = 3

    return {
        "skills": skills,
        "experience": experience
    }