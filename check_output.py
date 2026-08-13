import json
with open(r'C:\Users\theob\Desktop\UKOM\soal_ukom_ners.json', encoding='utf-8') as f:
    qs = json.load(f)
print(f"Total questions: {len(qs)}")
print()
print("=== First 3 questions ===")
for q in qs[:3]:
    print(f'Q{q["question_number"]} [{q["topic"]}]: {q["question_text"][:100]}')
    for k,v in q['options'].items():
        print(f'  {k}: {v[:80]}')
    print()
print("=== Last 3 questions ===")
for q in qs[-3:]:
    print(f'Q{q["question_number"]} [{q["topic"]}]: {q["question_text"][:100]}')
    for k,v in q['options'].items():
        print(f'  {k}: {v[:80]}')
    print()
print("=== Per-topic count ===")
for t in ['mkb', 'komunitas', 'manajemen', 'maternitas', 'jiwa', 'anak', 'gadar']:
    cnt = sum(1 for q in qs if q['topic'] == t)
    print(f'  {t}: {cnt}')
print()
print("=== Check empty options ===")
empty_opts = [(q['question_number'], [k for k,v in q['options'].items() if not v]) for q in qs if any(not v for v in q['options'].values())]
if empty_opts:
    print(f"Questions with empty options: {len(empty_opts)}")
    for qnum, missing in empty_opts[:5]:
        print(f"  Q{qnum}: missing {missing}")
else:
    print("No empty options found.")
