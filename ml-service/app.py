from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)

# ✅ Allow all (safe for now, restrict later if needed)
CORS(app)

# ✅ Base URL for images (IMPORTANT)
BASE_URL = os.environ.get("FRONTEND_URL", "https://gift-studio-gumt.vercel.app")

@app.route('/')
def home():
    return "ML Service is running 🚀"

# ✅ Data (FIXED IMAGE PATHS)
gift_data = [
    {"name": "Pink Birthday Balloons"},
    {"name": "Chocoholic"},
    {"name": "Tea Time Moments"},
    {"name": "Yellow Black Birthday Balloons"},
    {"name": "The Glitter & Ganache Gift Box"},
    {"name": "Candle & Crave Hamper"},
    {"name": "Anniversary Gift Box"},
    {"name": "Cupid's Treasure"},
    {"name": "Coffee & Conversation"},
    {"name": "Promise of Love"},
    {"name": "Jenga Wedding Version"},
    {"name": "Evening Gaze"},
    {"name": "Gift of Blessings"},
    {"name": "Golden Glance"},
    {"name": "Healing Hamper"},
]

# -------------------------------
# ✅ TF-IDF MODEL
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

        print("Incoming query:", query)

        # ✅ Handle empty query
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
            return jsonify(keyword_results[:5])

        # -------------------------------
        # ✅ TF-IDF SEARCH
        # -------------------------------
        query_vector = vectorizer.transform([query])
        scores = cosine_similarity(query_vector, gift_vectors)[0]

        # ✅ fallback if weak match
        if len(scores) == 0 or max(scores) < 0.1:
            return jsonify(gift_data[:5])

        # ✅ top matches
        top_indices = scores.argsort()[::-1][:5]
        results = [gift_data[i] for i in top_indices]

        return jsonify(results)

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({"error": "Search failed"}), 500

# -------------------------------
# 🚀 RUN SERVER
# -------------------------------
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)