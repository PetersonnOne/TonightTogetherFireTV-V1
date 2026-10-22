"""ElevenLabs original female voice and timestamped narration; credentials stay local."""
from pathlib import Path
import urllib.request,urllib.error,json,base64,argparse,hashlib
p=argparse.ArgumentParser();p.add_argument('action',choices=['design','select','narrate']);p.add_argument('--preview',type=int,default=1);args=p.parse_args()
B=Path('build/official-demo');B.mkdir(parents=True,exist_ok=True)
values={}
for line in Path('.env').read_text(encoding='utf-8-sig').splitlines():
 if '=' in line and not line.lstrip().startswith('#'):
  k,v=line.split('=',1);values[k.strip()]=v.strip().strip('\"\'')
key=values['ELEVENLABS_API_KEY']
def post(path,body):
 req=urllib.request.Request('https://api.elevenlabs.io'+path,data=json.dumps(body).encode(),headers={'xi-api-key':key,'Content-Type':'application/json'})
 try:
  with urllib.request.urlopen(req,timeout=240) as r:return json.load(r)
 except urllib.error.HTTPError as e:
  result=json.loads(e.read());detail=result.get('detail',{});print(json.dumps({'httpStatus':e.code,'detail':detail}));raise SystemExit(1)
description='An original adult female narrator with a warm, clear, confident voice. Conversational and engaging for an intelligent product demonstration, gentle enthusiasm, articulate English, natural pauses and a reassuring finish. Moderate unhurried pace. Clean studio sound, no exaggerated announcer style, no whispering, no imitation of a named person. No specific regional accent requested.'
if args.action=='design':
 if (B/'voice-previews.json').exists():raise SystemExit('Previews already exist; preserve them.')
 result=post('/v1/text-to-voice/design',{'model_id':'eleven_multilingual_ttv_v2','voice_description':description,'text':'Everyone finally sits down. One person wants comedy. Another wants adventure. You made time for each other. Meet Tonight Together. Give everyone a say, understand the compromise, and find common ground.','seed':42})
 previews=[]
 for i,v in enumerate(result['previews']):
  (B/f'voice-preview-{i+1}.mp3').write_bytes(base64.b64decode(v['audio_base_64']));previews.append({k:x for k,x in v.items() if k!='audio_base_64'})
 (B/'voice-previews.json').write_text(json.dumps({'description':description,'previews':previews},indent=2));print('Original female previews saved:',len(previews))
elif args.action=='select':
 if (B/'voice-selection.json').exists():raise SystemExit('Voice already saved; preserve its identity.')
 previews=json.loads((B/'voice-previews.json').read_text(encoding='utf-8-sig'));choice=previews['previews'][args.preview-1]
 result=post('/v1/text-to-voice',{'voice_name':'Tonight Together — Original Female Narrator','voice_description':description,'generated_voice_id':choice['generated_voice_id']})
 (B/'voice-selection.json').write_text(json.dumps({'voice_id':result['voice_id'],'selectedPreview':args.preview,'description':description,'provider':'ElevenLabs','originalDesignedVoice':True,'clonedPerson':False},indent=2));print('Original voice saved to the ElevenLabs library.')
else:
 if (B/'narration.mp3').exists():raise SystemExit('Narration exists; preserve the original take.')
 voice=json.loads((B/'voice-selection.json').read_text(encoding='utf-8-sig'));text=Path('docs/official-demo/OFFICIAL_DEMO_NARRATION.txt').read_text(encoding='utf-8-sig').strip()
 settings={'stability':.55,'similarity_boost':.75,'style':.18,'use_speaker_boost':True,'speed':.96}
 result=post('/v1/text-to-speech/'+voice['voice_id']+'/with-timestamps?output_format=mp3_44100_192',{'text':text,'model_id':'eleven_multilingual_v2','voice_settings':settings,'seed':42})
 (B/'narration.mp3').write_bytes(base64.b64decode(result['audio_base64']));(B/'narration-alignment.json').write_text(json.dumps(result['alignment']))
 (B/'narration-generation.json').write_text(json.dumps({'provider':'ElevenLabs','model':'eleven_multilingual_v2','voice_id':voice['voice_id'],'settings':settings,'scriptSha256':hashlib.sha256(text.encode()).hexdigest(),'audioSha256':hashlib.sha256((B/'narration.mp3').read_bytes()).hexdigest()},indent=2));print('Female narration and character timing saved.')
