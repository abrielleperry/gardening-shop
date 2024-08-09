"""
server.py
Stripe Sample.
Python 3.6 or newer required.
"""
import os
from flask import Flask, session, redirect, render_template, request, url_for, jsonify
import stripe
import json
# stripe.api_key = 'sk_test_4eC39HqLyjWDarjtT1zdp7dc'

app = Flask(__name__)

app.config['STRIPE_PUBLIC_KEY'] = 'pk_test_51J4u0IEYLRwiTz0PHTGslxBoGFtRVzT6906tDUGwgdkQBYKe8KVunyayFs9yfB2uOZIqmrpUaFx746DKQmMYq1UN00sUFrBBmd';
app.config['STRIPE_PRIVATE_KEY'] = 'sk_test_51J4u0IEYLRwiTz0P9ijaLBqhNc5kfx1yuijAUgQ4w4qCspcRIdf53U2BuK3lcOsl5Ts63izbH1ZnkX72YZoMOeZB00Y60M84jn';
stripe.api_key = app.config['STRIPE_PRIVATE_KEY'];

YOUR_DOMAIN = 'http://localhost:4242/'

# Load your product data from the JSON file
with open('shoppingcart.json') as f:
    products_data = json.load(f)

def find_product(product_id):
    for product in products_data['products']:
        if product['id'] == product_id:
            return product
    return None

@app.route('/checkout.html')
def checkout():
    # This will render the index.html file located in the 'templates' directory
    return render_template('checkout.html')

@app.route('/success.html')
def success():
    # This will render the index.html file located in the 'templates' directory
    return render_template('success.html')

@app.route('/cancel.html')
def cancel():
    # This will render the index.html file located in the 'templates' directory
    return render_template('cancel.html')

@app.route('/index.html')
def index():
    # This will render the index.html file located in the 'templates' directory
    return render_template('index.html')

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    product_id = request.json.get('id')
    quantity = request.json.get('quantity', 1)
    
    if 'cart' not in session:
        session['cart'] = []
        
    cart = session['cart']
    
    product = find_product(product_id)
    if product:
        for item in cart:
            if item['id'] == product_id:
                item['quantity'] += quantity
                break
            else:
                cart.append({
                    'id': product_id,
                    'name': product['name'],
                    'price': 20,
                    'quantity': quantity
                })
    session['cart'] = cart
    return jsonify(session['cart'])

@app.route('/cart')
def view_cart():
    if 'cart' in session:
        return jsonify(session['cart'])
    return jsonify([])

@app.route('/remove_from_cart', methods=['POST'])
def remove_from_cart():
    product_id = request.gson.get('id')
    
    if 'cart' in session:
        session['cart'] = [item for item in session['cart'] if item['id'] != product_id]
            
    return jsonify(session['cart'])

@app.route('/clear_cart')
def clear_cart():
    session.pop('cart', None)
    return jsonify({"message": "Cart cleared"})
    
@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        cart_items = request.json.get('cartItems', [])
        line_items = []

        for item in cart_items:
            product = find_product(item['id'])
            if product:
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': product['common_name'],
                        },
                        'unit_amount': '25.00',
                    },
                    'quantity': '1',
                })

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url = YOUR_DOMAIN + '/success.html',
            cancel_url = YOUR_DOMAIN + '/cancel.html',
        )
        return jsonify({'id': checkout_session.id})
    
    except Exception as e:
        return jsonify(error=str(e)), 403

if __name__ == '__main__':
    app.run(port=4242)
