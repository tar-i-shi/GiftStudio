# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)


# Sample gift data
gift_data = [
    {"name": "Pink Birthday Balloons", "price": "₹1,499", "image": "src/assets/birth_balloon_pink.webp", "occasion": "Birthday"},
    {"name": "Chocoholic", "price": "₹1,999", "image": "src/assets/b_chocoholic.webp", "occasion": "Birthday"},
    {"name": "Tea Time Moments", "price": "₹2,999", "image": "src/assets/b_tea_time_moments.webp", "occasion": "Birthday"},
    {"name": "Yellow Black Birthday Balloons", "price": "₹499", "image": "src/assets/birth_balloon.webp", "occasion": "Birthday"},
    {"name": "The Glitter & Ganache Gift Box", "price": "₹1,599", "image": "src/assets/b_the_glitter_&_ganache_gift.webp", "occasion": "Birthday"},
    {"name": "Candle & Crave Hamper", "price": "₹3,999", "image": "src/assets/Candle & Crave Hamper.webp", "occasion": "Birthday"},

    {"name": "Anniversary Gift Box", "price": "₹2,099", "image": "src/assets/food_trunk.webp", "occasion": "Anniversary"},
    {"name": "Cupid's Treasure", "price": "₹3,599", "image": "src/assets/w_cupid_s_treasure.webp", "occasion": "Anniversary"},
    {"name": "Coffee & Conversation", "price": "₹3,999", "image": "src/assets/a_coffee_&_conversation_bag.webp", "occasion": "Anniversary"},
    {"name": "Promise of Love", "price": "₹4,999", "image": "src/assets/a_promise_of_love.webp", "occasion": "Anniversary"},
    {"name": "Candle & Crave Hamper", "price": "₹3,999", "image": "src/assets/Candle & Crave Hamper.webp", "occasion": "Anniversary"},

    {"name": "Jenga Wedding Version", "price": "₹3,299", "image": "src/assets/w_jenga.webp", "occasion": "Wedding"},
    {"name": "Evening_Gaze", "price": "₹6,799", "image": "src/assets/w_evening_gaze.webp", "occasion": "Wedding"},
    {"name": "Gift of Blessings", "price": "₹5,299", "image": "src/assets/w_gift_of_blessings.webp", "occasion": "Wedding"},
    {"name": "Golden Glance", "price": "₹2,299", "image": "src/assets/w_GoldenGlance.webp", "occasion": "Wedding"},
    {"name": "Wedding Wow Hamper", "price": "₹5,299", "image": "src/assets/w_wow_hamper.webp", "occasion": "Wedding"},
    {"name": "Cupid's Treasure", "price": "₹3,599", "image": "src/assets/w_cupid_s_treasure.webp", "occasion": "Wedding"},
    {"name": "Festive Sweet Treat", "price": "₹5,299", "image": "src/assets/w_festive sweet_treat.webp", "occasion": "Wedding"},

    {"name": "Knitted Soft Teddy Bear Gift Set", "price": "₹2,799", "image": "src/assets/bs_knitted_soft_teddy_bear.webp", "occasion": "Baby Shower"},
    {"name": "Knitted Soft Lion Basket", "price": "₹2,599", "image": "src/assets/bs_knitted_lion_basket.webp", "occasion": "Baby Shower"},
    {"name": "Little Wonder Baby Record Book", "price": "₹599", "image": "src/assets/bs_little_wonder_baby_record_book.webp", "occasion": "Baby Shower"},
    {"name": "Carvaan Mini Kids with MIC", "price": "₹4,799", "image": "src/assets/bs_carvaan_mini_kids_with_mic.webp", "occasion": "Baby Shower"},

    {"name": "Buddha's Green Blessings", "price": "₹2,099", "image": "src/assets/h_buddha_green_blessing.webp", "occasion": "Housewarming"},
    {"name": "Cactus Cheer", "price": "₹1,899", "image": "src/assets/h_cactus_cheer.webp", "occasion": "Housewarming"},
    {"name": "Elegant Charm", "price": "₹1,799", "image": "src/assets/h_elegant_charm.webp", "occasion": "Housewarming"},
    {"name": "Elegant Jade Delight", "price": "₹2,499", "image": "src/assets/h_elegant_jade_delight_in grey_pot.webp", "occasion": "Housewarming"},

    {"name": "Guess Who", "price": "₹1,299", "image": "src/assets/p_guess_who.jpg", "occasion": "Games and More"},
    {"name": "Jenga", "price": "₹1,599", "image": "src/assets/p_jenga.webp", "occasion": "Games and More"},
    {"name": "Snakes & Ladders", "price": "₹1,599", "image": "src/assets/p_snake_ladders.webp", "occasion": "Games and More"},
    {"name": "Monopoly", "price": "₹1,599", "image": "src/assets/p_monopoly.webp", "occasion": "Games and More"},

    {"name": "Elephant Luxe", "price": "₹1,799", "image": "src/assets/f_elephant_luxe.webp", "occasion": "Farewell"},
    {"name": "Heirloom Candle", "price": "₹1,599", "image": "src/assets/f_heirloom_candle.webp", "occasion": "Farewell"},
    {"name": "Silent Guardian", "price": "₹1,799", "image": "src/assets/f_silent_gaurdian.webp", "occasion": "Farewell"},
    {"name": "Signature Candle - Mandarin", "price": "₹1,799", "image": "src/assets/f_signature_candle_mandarin.webp", "occasion": "Farewell"},

    {"name": "Classic Charm", "price": "₹1,399", "image": "src/assets/p_classic_charm.webp", "occasion": "Proposal"},
    {"name": "Gracefull Charm", "price": "₹1,399", "image": "src/assets/p_Gracefull_charm.webp", "occasion": "Proposal"},
    {"name": "Ravishing Roses with Carnations", "price": "₹1,399", "image": "src/assets/p_ravishing_roses_with_carnations.webp", "occasion": "Proposal"},
    {"name": "Vivid Serenity", "price": "₹1,299", "image": "src/assets/p_vivid_serenity.webp", "occasion": "Proposal"},
    {"name": "Whisper's of Love", "price": "₹1,399", "image": "src/assets/p_whisper_of_love.webp", "occasion": "Proposal"},
    {"name": "Whisper's of Nature", "price": "₹1,399", "image": "src/assets/p_whisper_of_nature.webp", "occasion": "Proposal"},

    {"name": "Healing Hamper", "price": "₹1,199", "image": "src/assets/grand_box.webp", "occasion": "Get Well Soon"},
]


model = SentenceTransformer('all-MiniLM-L6-v2')
gift_names = [gift["name"] for gift in gift_data]
gift_embeddings = model.encode(gift_names, convert_to_tensor=True)

@app.route('/semantic-search', methods=['GET'])
def semantic_search():
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    query_embedding = model.encode(query, convert_to_tensor=True)
    scores = util.cos_sim(query_embedding, gift_embeddings)[0]
    top_k = min(5, len(scores))
    top_results = scores.topk(k=top_k)
    results = [gift_data[int(idx)] for idx in top_results[1].tolist()]
    return jsonify(results)

@app.route('/search', methods=['POST'])
def search_post():
    data = request.get_json()
    query = data.get("query", "")
    if not query:
        return jsonify([])
    query_embedding = model.encode(query, convert_to_tensor=True)
    scores = util.cos_sim(query_embedding, gift_embeddings)[0]
    top_k = min(5, len(scores))
    top_results = scores.topk(k=top_k)
    results = [gift_data[int(idx)] for idx in top_results[1].tolist()]
    return jsonify(results)

if __name__ == '__main__':
    app.run(port=5000)