from flask import Flask, request, jsonify, make_response
import json

app = Flask(__name__)

@app.route('/add_to_cart', methods=['POST', 'GET'])
def add_to_cart():
    product_id = request.json.get('id')
    common_name = request.json.get('common_name')
    price = request.json.get('price')
    quantity = request.json.get('quantity', 1)  # Default quantity to 1 if not provided

    # Retrieve existing cart data from cookie
    cart_cookie = request.cookies.get('cart')
    if cart_cookie:
        cart = json.loads(cart_cookie)
    else:
        cart = []

    # Add or update the product in the cart
    for item in cart:
        if item['id'] == product_id:
            item['quantity'] += quantity
            break
    else:
        cart.append({
            'id': product_id,
            'common_name': common_name,
            'price': price,
            'quantity': quantity
        })

    # Convert cart to JSON and store it in a cookie
    cart_json = json.dumps(cart)
    response = make_response(jsonify(cart))
    response.set_cookie('cart', cart_json)
    print(cart) #check what is added to cart
    return response

@app.route('/view_cart', methods=['POST', 'GET'])
def view_cart():
    print(cart_cookie) #check what is being retrieved
    cart_cookie = request.cookies.get('cart')
    if cart_cookie:
        cart = json.loads(cart_cookie)
        return jsonify(cart)
    else:
        return jsonify([])  # Return an empty cart if the cookie is not set

@app.route('/', methods=['POST', 'GET'])
def index():
    return "Welcome to the shopping cart!"

if __name__ == '__main__':
    app.run(port=4242)
