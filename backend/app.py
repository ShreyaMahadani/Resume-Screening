from flask import Flask, request, jsonify
from flask_cors import CORS

from parser import parse_jd
from matcher import match_candidates
from chatbot import simulate_interest, chat_about_candidate

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend is running ✅"

@app.route("/process", methods=["POST"])
def process():
    try:
        data = request.get_json()

        if not data or "jd" not in data:
            return jsonify({"error": "Job description (jd) required"}), 400

        jd = data["jd"]
        print("JD:", jd)

        parsed = parse_jd(jd)
        print("Parsed:", parsed)

        candidates = match_candidates(parsed)
        print("Matched:", candidates)

        for c in candidates:
            c["interest_score"] = simulate_interest(c)
            c["final_score"] = round(
                (0.7 * c["match_score"]) + (0.3 * c["interest_score"]), 2
            )

        candidates.sort(key=lambda x: x["final_score"], reverse=True)

        return jsonify(candidates)

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        if not data or "candidate" not in data or "message" not in data:
            return jsonify({"error": "candidate and message required"}), 400

        candidate = data["candidate"]
        message   = data["message"].lower().strip()

        reply = chat_about_candidate(candidate, message)

        return jsonify({"reply": reply})

    except Exception as e:
        print("CHAT ERROR:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)