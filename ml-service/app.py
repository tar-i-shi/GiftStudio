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
    {"name": "Pink Birthday Balloons", "price": "₹1,499", "image": f"{BASE_URL}/assets/birth_balloon_pink.webp", "occasion": "Birthday"},
    {"name": "Chocoholic", "price": "₹1,999", "image": f"{BASE_URL}/assets/b_chocoholic.webp", "occasion": "Birthday"},
    {"name": "Tea Time Moments", "price": "₹2,999", "image": f"{BASE_URL}/assets/b_tea_time_moments.webp", "occasion": "Birthday"},
    {"name": "Yellow Black Birthday Balloons", "price": "₹499", "image": f"{BASE_URL}/assets/birth_balloon.webp", "occasion": "Birthday"},
    {"name": "The Glitter & Ganache Gift Box", "price": "₹1,599", "image": f"{BASE_URL}/assets/b_the_glitter_&_ganache_gift.webp", "occasion": "Birthday"},
    {"name": "Candle & Crave Hamper", "price": "₹3,999", "image": f"{BASE_URL}/assets/candle_crave_hamper.webp", "occasion": "Birthday"},

    {"name": "Anniversary Gift Box", "price": "₹2,099", "image": f"{BASE_URL}/assets/food_trunk.webp", "occasion": "Anniversary"},
    {"name": "Cupid's Treasure", "price": "₹3,599", "image": f"{BASE_URL}/assets/w_cupid_s_treasure.webp", "occasion": "Anniversary"},
    {"name": "Coffee & Conversation", "price": "₹3,999", "image": f"{BASE_URL}/assets/a_coffee_conversation.webp", "occasion": "Anniversary"},
    {"name": "Promise of Love", "price": "₹4,999", "image": f"{BASE_URL}/assets/a_promise_of_love.webp", "occasion": "Anniversary"},

    {"name": "Jenga Wedding Version", "price": "₹3,299", "image": f"{BASE_URL}/assets/w_jenga.webp", "occasion": "Wedding"},
    {"name": "Evening Gaze", "price": "₹6,799", "image": f"{BASE_URL}/assets/w_evening_gaze.webp", "occasion": "Wedding"},
    {"name": "Gift of Blessings", "price": "₹5,299", "image": f"{BASE_URL}/assets/w_gift_of_blessings.webp", "occasion": "Wedding"},
    {"name": "Golden Glance", "price": "₹2,299", "image": f"{BASE_URL}/assets/w_golden_glance.webp", "occasion": "Wedding"},

    {"name": "Healing Hamper", "price": "₹1,199", "image": f"{BASE_URL}/assets/grand_box.webp", "occasion": "Get Well Soon"},
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