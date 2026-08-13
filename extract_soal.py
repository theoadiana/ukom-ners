import json
import re

with open(r'C:\Users\theob\Desktop\UKOM\kumpulan-latihan-soal-ukom-profesi-ners.txt', 'rb') as f:
    raw = f.read()

# CRLF line endings - split by \n and strip \r
lines = [ln.rstrip(b'\r').decode('latin-1') for ln in raw.split(b'\n')]

topics = {
    'mkb':      (1,    562),
    'komunitas': (1647, 1816),
    'manajemen': (2116, 2263),
    'maternitas':(2542, 2864),
    'jiwa':     (3481, 3866),
    'anak':     (4577, 4890),
    'gadar':    (5513, 5630),
}

questions = []
global_q_num = 0

for topic, (sline, eline) in topics.items():
    s = sline - 1   # 0-indexed
    e = eline        # exclusive

    topic_lines = lines[s:e]

    # Skip header (first 2 lines)
    i = 2
    while i < len(topic_lines):
        l = topic_lines[i]

        # Stop at pembahasan
        if re.match(r'^PEMBAHASAN', l, re.IGNORECASE):
            break

        # Question line: starts with digit(s), followed by period/space
        m = re.match(r'^(\d+)\.?\s+(.+)', l)
        if not m:
            i += 1
            continue

        # Collect full block
        block = [l]
        j = i + 1
        while j < len(topic_lines):
            nl = topic_lines[j]
            if re.match(r'^PEMBAHASAN', nl, re.IGNORECASE):
                break
            if re.match(r'^\d+\.?\s+[A-Z]', nl):
                break
            block.append(nl)
            j += 1

        # Parse options from block lines directly
        opts = {}
        for bl in block[1:]:   # skip question line
            om = re.match(r'^([a-e])\.\s+(.+)', bl)
            if om:
                letter = om.group(1).upper()
                text = re.sub(r'\s+', ' ', om.group(2).strip())
                opts[letter] = text

        # Question text from block[0]
        q_text = re.sub(r'^\d+\.?\s+', '', block[0]).strip()
        q_text = re.sub(r'\s+', ' ', q_text)

        if not q_text or len(opts) < 2:
            i = j
            continue

        global_q_num += 1
        for k in ['A', 'B', 'C', 'D', 'E']:
            if k not in opts:
                opts[k] = ''

        questions.append({
            'question_number': global_q_num,
            'topic': topic,
            'question_text': q_text,
            'options': {k: opts[k] for k in ['A', 'B', 'C', 'D', 'E']}
        })
        i = j

print(f"Total: {len(questions)}")
for t in ['mkb', 'komunitas', 'manajemen', 'maternitas', 'jiwa', 'anak', 'gadar']:
    c = sum(1 for q in questions if q['topic'] == t)
    print(f"  {t}: {c}")

with open(r'C:\Users\theob\Desktop\UKOM\soal_ukom_ners.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Done.")
