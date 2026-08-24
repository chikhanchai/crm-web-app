import json

with open('batches_state.json', 'r', encoding='utf-8') as f:
    state = json.load(f)

pending = [b for b in state['batches'] if b['status'] == 'pending']

for b in pending[:3]:
    prompt = f'Research the estimated number of employees for the following {len(b["companies"])} companies in Thailand. Return your findings as a JSON array of objects, with each object having exactly two keys: "company_name" and "employee_count_est". Try to provide a specific number or a range. If not found, return "-". Do not output any other markdown or text outside the JSON array.\n\nCompanies:\n'
    for idx, c in enumerate(b['companies']):
        prompt += f"{idx+1}. {c}\n"
    
    with open(f'prompt_batch_{b["batch_id"]}.txt', 'w', encoding='utf-8') as pf:
        pf.write(prompt)

print(f"Generated prompts for {min(3, len(pending))} batches.")
