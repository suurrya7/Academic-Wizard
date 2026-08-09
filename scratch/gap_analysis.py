import json

with open('/Users/surya/Desktop/Academic Wizard Latest./public/data/posts.json', 'r') as f:
    posts = json.load(f)

# Categories: assignment-help, essay-writing, literature-review, dissertation, research, editing, study-guidance
# Countries: uk, usa, australia, canada, india, ireland, singapore, germany

matrix = {}
services = ['assignment-help', 'essay-writing', 'literature-review', 'dissertation', 'research', 'editing', 'study-guidance']
countries = ['UK', 'USA', 'Australia', 'Canada', 'India', 'Ireland', 'Singapore', 'Germany']

for s in services:
    matrix[s] = {c: 0 for c in countries}

for post in posts:
    cat = post.get('category', 'assignment-help')
    country = post.get('targetCountry', 'UK')
    if cat in matrix and country in matrix[cat]:
        matrix[cat][country] += 1

print("Topical Gap Analysis (Current Posts):")
print(f"{'Service':<20} | " + " | ".join(f"{c:<10}" for c in countries))
print("-" * 120)

total_gaps = 0
for s in services:
    row = f"{s:<20} | "
    for c in countries:
        count = matrix[s][c]
        if count == 0:
            total_gaps += 1
            row += f"\033[91m{count:<10}\033[0m | "
        else:
            row += f"{count:<10} | "
    print(row)

print(f"\nTotal topical gaps (0 posts): {total_gaps} out of {len(services) * len(countries)} combinations")
