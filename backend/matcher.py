import json
from utils import get_skill_match, calculate_percentage, round_score

def match_candidates(parsed_jd):
    # ✅ FIXED PATH
    with open("data/candidates.json") as f:
        candidates = json.load(f)

    results = []

    for c in candidates:
        skill_match = get_skill_match(c["skills"], parsed_jd["skills"])

        # ✅ FIX division by zero
        if len(parsed_jd["skills"]) == 0:
            skill_score = 0
        else:
            skill_score = calculate_percentage(skill_match, len(parsed_jd["skills"]))

        exp_score = 100 if c["experience"] >= parsed_jd["experience"] else 50

        match_score = (skill_score * 0.7) + (exp_score * 0.3)

        results.append({
            "name": c["name"],
            "skills": c["skills"],
            "experience": c["experience"],
            "match_score": round_score(match_score)
        })

    return results