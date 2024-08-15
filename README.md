# BloomHouse


## Project Overview

This project showcases an online platform where users can browse and purchase a variety of plants, as well as manage their shopping cart. The project uses modern web technologies to deliver an interactive user experience.

## Objective

BloomHouse is an e-commerce website that allows gardening enthusiasts to explore and purchase plants online. The website features a dynamic shopping cart system where users can add, update, or remove items, and proceed to checkout seamlessly.

## Features

-   **Homepage:**  Displays an overview of BloomHouse, About Us, and product listing of plants.
-   **Product Filtering:**  Users can filter plants by various criteria such as hardiness zone, sunlight requirements, watering needs, and more.
-   **Shopping Cart:**  A fully functional cart that allows users to manage their selected items and view the total amount.
-   **Checkout Process:**  Users can proceed to checkout with the items in their cart.

## ## Technologies Used

-   **HTML & CSS:**  For the structure and styling of the website.
-   **JavaScript:**  For dynamic content and interactivity.
-   **Bootstrap:**  To create a responsive and modern UI.
-   **Splide:**  A lightweight, flexible, and accessible slider/carousel plugin for showcasing images.
-   **Stripe:**  To simulate a payment during check out.


## Technologies Used

- **HTML/CSS**: I ensured semantic HTML and well-structured CSS.
- **Accessibility**: I implemented accessibility best practices to make the web pages accessible to all users.
- **Responsive Design**: The web pages were responsive and worked well on various screen sizes.
- **Bootstrap**: I utilized Bootstrap components and grid system for faster development.
- **JavaScript**: I used JavaScript to add interactivity and dynamic functionality.

## Installation

 Step 1: Clone repository
 

     git clone https://[PERSONAL ACCESS TOKEN]@github.com/abrielleperry/gardening-shop.git

 

Step 2: Build Server
  ````
pip3 install -r requirements.txt
````

Step 3: Run server

    python3 server.py

 Step 4: 
 To access BloomHouse webpage  [click here](http://127.0.0.1:4242)

## Additional Resources


### Environment Variables (already in requirements.txt file)
 1.  `pip install pyyaml`
 2.  Put your keys in config.yml file

Development:

      SECRET_KEY: your_secret_key
      STRIPE_PRIVATE_KEY: sk_test_your_stripe_secret_key
      FLASK_ENV: development

Production:

      SECRET_KEY: your_production_secret_key
      STRIPE_PRIVATE_KEY: sk_live_your_stripe_secret_key
      FLASK_ENV: production


#### Test app with these card numbers


Click the checkout button to be redirected to the Stripe Checkout page. Use any of these test cards to simulate a payment.

 - Payment success `4242 4242 4242 4242`


 - Payment requires authentication `4000 0025 0000 3155` 
- Payment is decline `4000 0000 0000 9995`

## Authors
-   Allyson Ugarte  [allyson.ugarte@atlasschool.com](mailto:allyson.ugarte@atlasschool.com)
-   Abrielle Perry  [abrielle.perry@atlasschool.com](mailto:abrielle.perry@atlasschool.com)
