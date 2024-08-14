from flask import Flask, request, jsonify, make_response, render_template
import json


app = Flask(__name__)





@app.route('/', methods=['POST', 'GET'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(port=4242)
