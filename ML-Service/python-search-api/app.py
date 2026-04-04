# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)

# ✅ Health check route (IMPORTANT for Render)
@app.route('/')
def home():
    return "ML Service is running 🚀"


# ✅ Gift data (UPDATED IMAGE PATHS)
gift_data = [
    {"name": "Pink Birthday Balloons", "price": "₹1,499", "image": "/assets/birth_balloon_pink.webp", "occasion": "Birthday"},
    {"name": "Chocoholic", "price": "₹1,999", "image": "/assets/b_chocoholic.webp", "occasion": "Birthday"},
    {"name": "Tea Time Moments", "price": "₹2,999", "image": "/assets/b_tea_time_moments.webp", "occasion": "Birthday"},
    {"name": "Yellow Black Birthday Balloons", "price": "₹499", "image": "/assets/birth_balloon.webp", "occasion": "Birthday"},
    {"name": "The Glitter & Ganache Gift Box", "price": "₹1,599", "image": "/assets/b_the_glitter_&_ganache_gift.webp", "occasion": "Birthday"},
    {"name": "Candle & Crave Hamper", "price": "₹3,999", "image": "/assets/candle_crave_hamper.webp", "occasion": "Birthday"},

    {"name": "Anniversary Gift Box", "price": "₹2,099", "image": "/assets/food_trunk.webp", "occasion": "Anniversary"},
    {"name": "Cupid's Treasure", "price": "₹3,599", "image": "/assets/w_cupid_s_treasure.webp", "occasion": "Anniversary"},
    {"name": "Coffee & Conversation", "price": "₹3,999", "image": "/assets/a_coffee_conversation.webp", "occasion": "Anniversary"},
    {"name": "Promise of Love", "price": "₹4,999", "image": "/assets/a_promise_of_love.webp", "occasion": "Anniversary"},

    {"name": "Jenga Wedding Version", "price": "₹3,299", "image": "/assets/w_jenga.webp", "occasion": "Wedding"},
    {"name": "Evening Gaze", "price": "₹6,799", "image": "/assets/w_evening_gaze.webp", "occasion": "Wedding"},
    {"name": "Gift of Blessings", "price": "₹5,299", "image": "/assets/w_gift_of_blessings.webp", "occasion": "Wedding"},
    {"name": "Golden Glance", "price": "₹2,299", "image": "/assets/w_golden_glance.webp", "occasion": "Wedding"},

    {"name": "Healing Hamper", "price": "₹1,199", "image": "/assets/grand_box.webp", "occasion": "Get Well Soon"},
]

# ✅ Load model once (IMPORTANT for performance)
model = SentenceTransformer('all-MiniLM-L6-v2')

gift_names = [gift["name"] for gift in gift_data]
gift_embeddings = model.encode(gift_names, convert_to_tensor=True)


# 🔍 GET search
@app.route('/semantic-search', methods=['GET'])
def semantic_search():
    query = request.args.get('q', '').strip()

    if not query:
        return jsonify([])

    query_embedding = model.encode(query, convert_to_tensor=True)
    scores = util.cos_sim(query_embedding, gift_embeddings)[0]

    top_k = min(5, len(scores))
    top_results = scores.topk(k=top_k)

    results = [gift_data[int(idx)] for idx in top_results[1].tolist()]

    return jsonify(results)


# 🔍 POST search
@app.route('/search', methods=['POST'])
def search_post():
    data = request.get_json()
    query = data.get("query", "").strip()

    if not query:
        return jsonify([])

    query_embedding = model.encode(query, convert_to_tensor=True)
    scores = util.cos_sim(query_embedding, gift_embeddings)[0]

    top_k = min(5, len(scores))
    top_results = scores.topk(k=top_k)

    results = [gift_data[int(idx)] for idx in top_results[1].tolist()]

    return jsonify(results)


# 🚀 Run app (Render compatible)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)