# gardening-shop
## Available Scripts

To install requirements to run using flask and html and python:
# Accept a Payment with Stripe Checkout

Stripe Checkout is the fastest way to get started with payments. Included are some basic build and run scripts you can use to start up the application.

## Running the sample

1. Build the server

~~~
pip3 install -r requirements.txt
~~~

2. Run the server

~~~
export FLASK_APP=server.py
python3 -m flask run --port=4242
~~~

3. Go to [http://localhost:4242/checkout.html](http://localhost:4242/checkout.html)

~~~

## Environment Variables (already in requirements.txt file)
 1.  pip install pyyaml
 2.  Put your keys in config.yml file

development:
  SECRET_KEY: your_secret_key
  STRIPE_PRIVATE_KEY: sk_test_your_stripe_secret_key
  FLASK_ENV: development

production:
  SECRET_KEY: your_production_secret_key
  STRIPE_PRIVATE_KEY: sk_live_your_stripe_secret_key
  FLASK_ENV: production
~~~