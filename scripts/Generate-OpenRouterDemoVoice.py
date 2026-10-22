"""Approved Sarah production take; preserve originals and obtain real word timestamps."""
from pathlib import Path
import base64, hashlib, json, subprocess, urllib.request, urllib.error

B = Path('build/official-demo')
values = {}
for line in Path('.env').read_text(encoding='utf-8-sig').splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        k, v = line.split('=', 1)
        values[k.strip()] = v.strip().strip('\"\'')
key = values['OPENROUTER_API_KEY']
text = Path('docs/official-demo/OFFICIAL_DEMO_NARRATION.txt').read_text(encoding='utf-8-sig').strip()

def post(endpoint, body):
    request = urllib.request.Request('https://openrouter.ai/api/v1/audio/' + endpoint,
        data=json.dumps(body).encode(), headers={'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(request, timeout=180) as response:
            return response.read()
    except urllib.error.HTTPError as error:
        raise SystemExit(f'OpenRouter HTTP {error.code}: {error.read().decode()[:1500]}')

audio = B / 'narration.mp3'
if not audio.exists():
    result = post('speech', {'model': 'elevenlabs/eleven-v4', 'voice': 'sarah', 'input': text, 'response_format': 'mp3'})
    audio.write_bytes(result)
    print('Original Sarah production narration saved.', flush=True)
duration = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(audio)]))
if duration + 2 >= 180:
    raise SystemExit(f'Original take is {duration}s; revise the edit before submission, without time stretching.')
manifest = {'provider': 'ElevenLabs through OpenRouter', 'model': 'elevenlabs/eleven-v4', 'voice': 'sarah',
    'approvedByUser': True, 'scriptSha256': hashlib.sha256(text.encode()).hexdigest(),
    'audioSha256': hashlib.sha256(audio.read_bytes()).hexdigest(), 'durationSeconds': duration,
    'timeStretching': False, 'effects': False}
(B/'narration-generation.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
transcript = B / 'narration-transcription.json'
if not transcript.exists():
    result = post('transcriptions', {'model': 'elevenlabs/scribe-v2',
        'input_audio': {'data': base64.b64encode(audio.read_bytes()).decode(), 'format': 'mp3'},
        'response_format': 'verbose_json', 'timestamp_granularities': ['word'], 'language': 'en'})
    transcript.write_bytes(result)
    print('Scribe transcription saved.', flush=True)
data = json.loads(transcript.read_text(encoding='utf-8'))
print(json.dumps({'durationSeconds': duration, 'transcriptionKeys': list(data), 'wordCount': len(data.get('words', []))}), flush=True)
