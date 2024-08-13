import json
import random

with open('copy-detailed-plants.json', 'r') as file:
    plants = json.load(file)

def generate_price():
    return round(random.uniform(5, 50), 2)  

for plant in plants:
    plant['price'] = generate_price()

with open('plants_with_prices.json', 'w') as file:
    json.dump(plants, file, indent=4)

print("Prices have been added to the plants.")
