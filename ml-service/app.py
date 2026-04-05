from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)

# ✅ Enable CORS
CORS(app)

@app.route('/')
def home():
    return "ML Service is running 🚀"

# ✅ Gift Data (WITH IDs)
gift_data = [
    {"id": 1, "name": "Pink Birthday Balloons"},
    {"id": 2, "name": "Chocoholic"},
    {"id": 3, "name": "Tea Time Moments"},
    {"id": 4, "name": "Yellow Black Birthday Balloons"},
    {"id": 5, "name": "The Glitter & Ganache Gift Box"},
    {"id": 6, "name": "Candle & Crave Hamper"},
    {"id": 7, "name": "Anniversary Gift Box"},
    {"id": 8, "name": "Cupid's Treasure"},
    {"id": 9, "name": "Coffee & Conversation"},
    {"id": 10, "name": "Promise of Love"},
    {"id": 12, "name": "Jenga Wedding Version"},
    {"id": 13, "name": "Evening Gaze"},
    {"id": 14, "name": "Gift of Blessings"},
    {"id": 15, "name": "Golden Glance"},
    {"id": 16, "name": "Healing Hamper"}
]

# -------------------------------
# ✅ TF-IDF MODEL (FIXED)
# -------------------------------
gift_names = [gift["name"].lower() for gift in gift_data]

vectorizer = TfidfVectorizer()
gift_vectors = vectorizer.fit_transform(gift_names)

# -------------------------------
# 🔍 SEARCH ROUTE
# -------------------------------
@app.route('/semantic-search', methods=['GET'])
def semantic_search():
    try:
        query = request.args.get('q', '').strip().lower()

        print("➡️ Query:", query)

        # ✅ Empty query
        if not query:
            return jsonify([])

        # -------------------------------
        # ✅ Keyword Match (FAST)
        # -------------------------------
        keyword_results = [
            gift for gift in gift_data
            if query in gift["name"].lower()
        ]

        if keyword_results:
            ids = [gift["id"] for gift in keyword_results[:5]]
            print("✅ Keyword IDs:", ids)
            return jsonify(ids)

        # -------------------------------
        # ✅ TF-IDF SEARCH
        # -------------------------------
        query_vector = vectorizer.transform([query])
        scores = cosine_similarity(query_vector, gift_vectors)[0]

        # fallback
        if len(scores) == 0 or max(scores) < 0.1:
            fallback_ids = [gift["id"] for gift in gift_data[:5]]
            print("⚠️ Fallback IDs:", fallback_ids)
            return jsonify(fallback_ids)

        # top matches
        top_indices = scores.argsort()[::-1][:5]
        result_ids = [gift_data[i]["id"] for i in top_indices]

        print("✅ TF-IDF IDs:", result_ids)

        return jsonify(result_ids)

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({"error": "Search failed"}), 500


# -------------------------------
# 🚀 RUN SERVER
# -------------------------------
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)