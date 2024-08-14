#! /usr/bin/env python3.6
"""
server.py
Stripe Sample.
Python 3.6 or newer required.
"""
import os
from flask import Flask, session, redirect, make_response, render_template, request, url_for, jsonify
from dotenv import load_dotenv
import yaml
import stripe
import json

app = Flask(__name__)

#load config.yml
env = os.getenv('FLASK_ENV', 'development')
with open('config.yml', 'r') as f:
    config = yaml.safe_load(f)
  
# Apply the configuration from config.yml
app.config.update(config[env])

# Load sensitive data from .env
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['STRIPE_PRIVATE_KEY'] = os.getenv('STRIPE_PRIVATE_KEY')
stripe.api_key = app.config['STRIPE_PRIVATE_KEY'];
YOUR_DOMAIN = 'http://localhost:4242'




def get_cart_from_cookie():
    cart_cookie = request.cookies.get('cart')
    if cart_cookie:
        return json.loads(cart_cookie)
    return []

def save_cart_to_cookie(cart):
    response = make_response(jsonify(cart))
    response.set_cookie('cart', json.dumps(cart), httponly=True, path='/')
    return response

@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html')

@app.route('/checkout.html', methods=['POST', 'GET'])
def checkout():
    # This will render the index.html file located in the 'templates' directory
    return render_template('checkout.html')

@app.route('/cart.html', methods=['POST', 'GET'])
def cart():
    # This will render the index.html file located in the 'templates' directory
    return render_template('cart.html')

@app.route('/success.html')
def success():
    # This will render the index.html file located in the 'templates' directory
    return render_template('success.html')

@app.route('/cancel.html')
def cancel():
    # This will render the index.html file located in the 'templates' directory
    return render_template('cancel.html')

@app.route('/create-checkout-session', methods=['POST', 'GET'])
def create_checkout_session():
    cart = get_cart_from_cookie()
    if not cart:
        return jsonify({"error": "Your cart is empty"}), 400
    
    line_items = []
    total_amount = 0
    
    for item in cart:
        unit_amount = int(item['price']) 
        line_items.append({
             'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': item['commonName'],
                },
                'unit_amount': item['price'],
            },
            'quantity': item['quantity'],
        })
    total_amount += item['price'] * item['quantity']
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url= YOUR_DOMAIN + '/success.html',
            cancel_url= YOUR_DOMAIN + '/cart.html',
        )
    except Exception as e:
        return str(e)

    return redirect(checkout_session.url, code=303)



@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    cart = get_cart_from_cookie()

    product_id = request.json.get('id')
    quantity = request.json.get('quantity', 1)

    product = products.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    # Check if the product is already in the cart
    for item in cart:
        if item['id'] == product_id:
            item['quantity'] += quantity  # Update quantity
            break
    else:
        # Add new item to the cart
        cart.append({
            'id': product_id,
            'name': product['commonName'],
            'price': product['price'],
            'quantity': quantity
        })

    return save_cart_to_cookie(cart)

@app.route('/view_cart', methods=['GET'])
def view_cart():
    cart = get_cart_from_cookie()
    return jsonify(cart)

@app.route('/remove_from_cart', methods=['POST'])
def remove_from_cart():
    cart = get_cart_from_cookie()

    product_id = request.json.get('id')
    cart = [item for item in cart if item['id'] != product_id]

    return save_cart_to_cookie(cart)

@app.route('/add_to_cart2', methods=['POST', 'GET'])
def add_to_cart2():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error:"  "Missing JSON in request body"}), 400
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
    #cart_json = json.dumps(cart)
    #response = make_response(jsonify(cart))
    #response.set_cookie('cart', cart_json)
    #print(cart) #check what is added to cart
    #return response-->

#@app.route('/view_cart', methods=['POST', 'GET'])
#def view_cart():
  #  cart_cookie = request.cookies.get('cart')
  #  if cart_cookie:
  #      print(cart_cookie) #check what is being retrieved
  #      cart = json.loads(cart_cookie)
  #      return jsonify(cart)
  #  else:
  #      return jsonify([])  # Return an empty cart if the cookie is not set



if __name__ == '__main__':
    app.run(port=4242)
