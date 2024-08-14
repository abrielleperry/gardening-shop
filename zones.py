import asyncio
import aiohttp
import json
import time

api_key = "sk-MUcv66aba393b03a26392"
start_id = 1
end_id = 10104
batch_size = 100
all_data = []
requests_per_minute = 300
delay_between_requests = 60 / requests_per_minute
max_retries = 3
concurrent_requests = 50  

async def fetch_data(session, species_id):
    url = f"https://perenual.com/api/species/details/{species_id}?key={api_key}"
    for attempt in range(max_retries):
        try:
            async with session.get(url) as response:
                if response.status == 200:
                    return await response.json()
                elif response.status == 429:
                    wait_time = (attempt + 1) * delay_between_requests
                    print(f"Rate limit exceeded for species_id {species_id}. Retrying in {wait_time} seconds...")
                    await asyncio.sleep(wait_time)
                else:
                    print(f"Failed to retrieve data for species_id {species_id}: {response.status}")
                    return None
        except Exception as e:
            print(f"Error fetching data for species_id {species_id}: {e}")
            return None
    return None

async def fetch_batch(start, end):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_data(session, species_id) for species_id in range(start, end + 1)]
        results = await asyncio.gather(*tasks)
        all_data.extend([data for data in results if data])
    print(f"Batch {start} to {end} processed.")

async def main():
    for batch_start in range(start_id, end_id + 1, batch_size):
        batch_end = min(batch_start + batch_size - 1, end_id)
        await fetch_batch(batch_start, batch_end)
        await asyncio.sleep(delay_between_requests * batch_size / concurrent_requests) 

asyncio.run(main())

with open('combined_species_details.json', 'w') as json_file:
    json.dump(all_data, json_file, indent=4)

print("All data saved successfully in combined_species_details.json.")
