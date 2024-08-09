#! /usr/bin/env python3.6

"""
server.py
Stripe Sample.
Python 3.6 or newer required.
"""
import os
from flask import Flask, redirect, request, url_for

import stripe
# stripe.api_key = 'sk_test_4eC39HqLyjWDarjtT1zdp7dc'


app = Flask(__name__,
            static_url_path='',
            static_folder='public')

app.config['STRIPE_PUBLIC_KEY'] = 'pk_test_51J4u0IEYLRwiTz0PHTGslxBoGFtRVzT6906tDUGwgdkQBYKe8KVunyayFs9yfB2uOZIqmrpUaFx746DKQmMYq1UN00sUFrBBmd';
app.config['STRIPE_PRIVATE_KEY'] = 'sk_test_51J4u0IEYLRwiTz0P9ijaLBqhNc5kfx1yuijAUgQ4w4qCspcRIdf53U2BuK3lcOsl5Ts63izbH1ZnkX72YZoMOeZB00Y60M84jn';
stripe.api_key = app.config['STRIPE_PRIVATE_KEY'];

YOUR_DOMAIN = 'http://localhost:4242/'


@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
             line_items=[{
                'price': 'price_1PkKCGEYLRwiTz0PY7kj6Oza', 
                'quantity': 1,
            }],
            mode='payment',
            success_url=YOUR_DOMAIN + '/success.html',
            cancel_url=YOUR_DOMAIN + '/cancel.html',
        )
    except Exception as e:
        return str(e)

    return redirect(checkout_session.url, code=303)

if __name__ == '__main__':
    app.run(port=4242)