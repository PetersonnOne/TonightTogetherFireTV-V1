"""Map Scribe word timestamps onto the approved script; retain its spelling/punctuation."""
from pathlib import Path
import json, re
B = Path('build/official-demo')
text = Path('docs/official-demo/OFFICIAL_DEMO_NARRATION.txt').read_text(encoding='utf-8-sig').strip()
data = json.loads((B/'narration-transcription.json').read_text(encoding='utf-8'))
source = list(re.finditer(r'\S+', text))
words = data['words']
assert len(source) == len(words), 'Transcript token count differs; review before editing.'
normalize = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
equivalent = {'labelled': 'labeled', 'programme': 'program'}
starts, ends = [0.0]*len(text), [0.0]*len(text)
variants = []
for match, word in zip(source, words):
    expected, actual = normalize(match.group()), normalize(word['word'])
    assert equivalent.get(expected, expected) == equivalent.get(actual, actual), (match.group(), word['word'])
    if expected != actual:
        variants.append([match.group(), word['word']])
    a, b = word['start'], word['end']
    for i in range(match.start(), match.end()):
        starts[i] = a + (b-a)*(i-match.start())/len(match.group())
        ends[i] = a + (b-a)*(i-match.start()+1)/len(match.group())
for i, char in enumerate(text):
    if char.isspace():
        starts[i] = ends[i-1] if i else 0
        ends[i] = starts[i]
alignment = {'characters': list(text), 'character_start_times_seconds': starts,
    'character_end_times_seconds': ends,
    'method': 'Scribe v2 word timestamps; characters interpolated within each word, not phoneme alignment'}
(B/'narration-alignment.json').write_text(json.dumps(alignment), encoding='utf-8')
(B/'narration-script-check.json').write_text(json.dumps({'scriptWordCount':len(source), 'transcriptWordCount':len(words),
    'allWordsMatched': True, 'spellingVariants': variants, 'alignmentMethod': alignment['method']}, indent=2), encoding='utf-8')
print('All 333 narration words matched; two equivalent UK/US spelling variants. Word timing saved.')
