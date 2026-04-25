def simulate_interest(candidate):
    exp = candidate.get("experience", 0)

    if exp >= 3:
        return 90
    elif exp == 2:
        return 70
    else:
        return 40


def chat_about_candidate(candidate, message):
    name           = candidate.get("name", "This candidate")
    skills         = candidate.get("skills", [])
    experience     = candidate.get("experience", "N/A")
    match_score    = candidate.get("match_score", "N/A")
    interest_score = candidate.get("interest_score", "N/A")
    final_score    = candidate.get("final_score", "N/A")

    msg = message.lower().strip()

    # Skills
    if any(w in msg for w in ["skill", "tech", "stack", "know", "expertise", "language"]):
        skills_str = ", ".join(skills) if skills else "not listed"
        return f"{name} is skilled in: {skills_str}."

    # Experience
    elif any(w in msg for w in ["experience", "exp", "year", "senior", "junior"]):
        level = "Senior" if experience >= 4 else "Mid-level" if experience >= 2 else "Junior"
        return f"{name} has {experience} year(s) of experience — classified as {level}."

    # Scores
    elif any(w in msg for w in ["score", "match", "final", "rating", "rank"]):
        return (
            f"{name}'s scores:\n"
            f"• Match Score:    {match_score}%\n"
            f"• Interest Score: {interest_score}%\n"
            f"• Final Score:    {final_score}%"
        )

    # Interest
    elif any(w in msg for w in ["interest", "motivation", "eager", "willing"]):
        return f"{name} has an interest score of {interest_score}%, derived from their {experience} year(s) of experience."

    # Interview questions
    elif any(w in msg for w in ["interview", "question", "ask", "assess"]):
        q_skill  = skills[0] if skills else "their domain"
        q_skill2 = skills[1] if len(skills) > 1 else "related technologies"
        return (
            f"Suggested interview questions for {name}:\n"
            f"1. Walk me through a real project you built using {q_skill}.\n"
            f"2. How have you used {q_skill2} to solve a production problem?\n"
            f"3. Describe the most complex bug you debugged and how you fixed it.\n"
            f"4. How do you handle tight deadlines and shifting priorities?"
        )

    # Hire / fit recommendation
    elif any(w in msg for w in ["hire", "recommend", "shortlist", "fit", "good", "worth"]):
        score = float(final_score) if final_score != "N/A" else 0
        if score >= 80:
            verdict = f"Strong hire ✅ — {name} scores {final_score}% and is a top candidate."
        elif score >= 60:
            verdict = f"Potential hire 🟡 — {name} scores {final_score}%. Worth a screening call."
        else:
            verdict = f"Weak fit ❌ — {name} scores {final_score}%. May not meet the bar."
        return verdict

    # Summary / overview
    elif any(w in msg for w in ["summary", "overview", "tell", "about", "who", "describe"]):
        skills_str = ", ".join(skills) if skills else "various skills"
        level = "Senior" if experience >= 4 else "Mid-level" if experience >= 2 else "Junior"
        return (
            f"{name} is a {level} candidate with {experience} year(s) of experience. "
            f"They are skilled in {skills_str}. "
            f"Their final score is {final_score}% (Match: {match_score}%, Interest: {interest_score}%)."
        )

    # Fallback
    else:
        return (
            f"I can tell you about {name}'s skills, experience, scores, "
            f"hire recommendation, or generate interview questions. What would you like to know?"
        )