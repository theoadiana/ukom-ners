import re

with open('kumpulan-latihan-soal-ukom-profesi-ners.txt', encoding='latin-1') as f:
    content = f.read()

# Split by question number pattern
pattern = r'\n(\d+)\.\s+(.+?)(?=\n[A-E]\.|$)'

# Find all question numbers and text
q_starts = list(re.finditer(r'\n(\d+)\.\s+', content))
print(f"Question markers found: {len(q_starts)}")

# Find all option lines
opt_lines = list(re.finditer(r'\n([A-E])\.\s+(.+?)(?=\n[A-E]\.|\n\d+\.|\nPEMBAHASAN|$)', content))
print(f"Option lines found: {len(opt_lines)}")

# Group by question
questions = {}
i = 0
for m in q_starts:
    qnum = int(m.group(1))
    start = m.end()
    if q_starts.index(m) + 1 < len(q_starts):
        end = q_starts[q_starts.index(m) + 1].start()
    else:
        end = len(content)
    q_text = content[start:end].strip()
    # Split options from question text
    lines = q_text.split('\n')
    q_main = lines[0].strip()
    opts = {}
    for line in lines[1:]:
        om = re.match(r'^([A-E])\.\s+(.+)$', line.strip())
        if om:
            opts[om.group(1)] = om.group(2).strip()
    questions[qnum] = {'text': q_main, 'options': opts}

print(f"Parsed questions: {len(questions)}")
# Show first 3
for qnum in sorted(questions.keys())[:3]:
    q = questions[qnum]
    print(f"\nQ{qnum}: {q['text'][:60]}...")
    for opt, val in q['options'].items():
        print(f"  {opt}: {val[:50]}...")
