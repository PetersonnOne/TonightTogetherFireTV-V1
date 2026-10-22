"""Editable narration-led edit. Without generated audio, exports a labelled workprint only."""
from pathlib import Path
import json,subprocess,textwrap,re,argparse,shutil
from PIL import Image,ImageDraw,ImageFont
ROOT=Path.cwd();B=Path('build/official-demo');EDIT=B/'edit';EDIT.mkdir(exist_ok=True)
meta=json.loads((B/'browser-events.json').read_text(encoding='utf-8-sig'));host=Path(meta['hostVideo']);native=B/'native-v2.mp4';provider=B/'native-provider.mp4'
paras=Path('docs/official-demo/OFFICIAL_DEMO_NARRATION.txt').read_text(encoding='utf-8-sig').strip().split('\n\n')
durations=[13,15,19,18,17,18,18,16,16,17]
has_audio=(B/'narration.mp3').exists() and (B/'narration-alignment.json').exists()
if has_audio:
 alignment=json.loads((B/'narration-alignment.json').read_text(encoding='utf-8-sig'));chars=''.join(alignment['characters']);times=alignment['character_start_times_seconds'];ends=alignment['character_end_times_seconds'];cursor=0;starts=[]
 for p in paras:
  i=chars.find(p,cursor)
  if i<0:raise ValueError('Narration alignment and script differ')
  starts.append(times[i]);cursor=i+len(p)
 end=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(B/'narration.mp3')]))+2
 durations=[starts[i+1]-starts[i] for i in range(9)]+[end-starts[-1]]
 if starts[0]>.01:durations[0]+=starts[0]
def vid(path,start,length,weight=1,label='BROWSER DEVELOPMENT PREVIEW / LOCAL SERVICES'):
 return dict(kind='video',path=str(path),start=start,length=length,weight=weight,label=label)
def nat(start,length,weight=1):return vid(native,start,length,weight,'NATIVE ANDROID APP / ANDROID TV EMULATOR')
def card(name,weight=1):return dict(kind='card',path=str(B/'cards'/f'{name}.png'),weight=weight)
scenes=[
 [card('hook',.45),nat(0,6,.55)],
 [card('title',.30),nat(0,6,.36),nat(19.4,3.8,.34)],
 [vid(host,17.2,3.5,.22),vid(host,23.5,3,.20),dict(kind='phones',weight=.58)],
 [nat(30.5,5.5,.30),vid(host,130.8,3.2,.22),vid(host,134.5,3.3,.24),vid(host,138.7,3.8,.24)],
 [vid(host,64,8.2,.35),vid(host,76.4,10.8,.45),vid(host,88.7,3.5,.20)],
 [vid(host,112.5,3.5,.28),vid(host,116.8,5,.47),vid(host,123.3,3,.25)],
 [vid(provider,7.5,3.4,.12,'NATIVE APP / SAVED CHOICE'),vid(provider,34.8,6.7,.42,'SEPARATE CONTROLLED PROVIDER / ORIGINAL TEST MEDIA'),vid(provider,44.9,2,.14,'NATIVE PROVIDER / PAUSE'),vid(provider,50.6,1.8,.14,'NATIVE PROVIDER / SEEK'),vid(provider,61.5,4.3,.18,'REAL BACK / SAVED STATE PRESERVED')],
 [vid(host,147.2,3.5,.27,'CONTROLLED CONNECTION INTERRUPTION'),vid(host,152,2.8,.20,'LOCAL ROOM / RECONNECTED'),vid(Path(meta['unavailableVideo']),7,4,.23,'SIMULATED PROVIDER UNAVAILABLE'),nat(98.2,3.5,.30)],
 [card('platform',.52),nat(0,6,.24),nat(19.4,3.5,.24)],
 [card('proof',.40),card('end',.60)]
]
def run(cmd):subprocess.run(cmd,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
encode=['-an','-c:v','libx264','-threads','2','-preset','fast','-crf','20','-pix_fmt','yuv420p','-r','24','-video_track_timescale','24000']
def normalize_hold(out,d):
 actual=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(out)]))
 if abs(actual-d)<=.06:return
 fixed=out.with_name(out.stem+'-fixed.mp4')
 run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(out),'-vf',f'tpad=stop_mode=clone:stop_duration={d},fps=24','-t',str(d)]+encode+[str(fixed)])
 fixed.replace(out)
timeline=[];clips=[];t=0
for si,(duration,shots) in enumerate(zip(durations,scenes)):
 for j,shot in enumerate(shots):
  d=duration*shot['weight'];out=EDIT/f'{si:02}-{j:02}.mp4';entry={**shot,'scene':si+1,'outputStart':t,'duration':d};timeline.append(entry);t+=d
  # Reuse only an exact matching render specification.
  stamp=out.with_suffix('.json')
  if out.exists() and stamp.exists() and json.loads(stamp.read_text(encoding='utf-8-sig'))==entry:
   normalize_hold(out,d);clips.append(out);continue
  cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-filter_complex_threads','1']
  if shot['kind']=='card':
   cmd+=['-loop','1','-framerate','24','-i',shot['path'],'-vf',f'format=yuv420p,fade=t=in:st=0:d=0.18','-t',str(d)]
  elif shot['kind']=='video':
   overlay=EDIT/f'{si:02}-{j:02}-overlay.png';im=Image.new('RGBA',(1280,720),(0,0,0,0));draw=ImageDraw.Draw(im);draw.text((96,8),shot['label'],font=ImageFont.truetype('C:/Windows/Fonts/seguisb.ttf',15),fill='#c2ead7');im.save(overlay)
   cmd+=['-ss',str(shot['start']),'-t',str(shot['length']),'-i',shot['path'],'-i',str(overlay)]
   cmd+=['-filter_complex',f"[0:v]setpts=(PTS-STARTPTS)*{d/shot['length']},fps=24,scale=1088:612,pad=1280:720:96:36:color=0x0c191f,setsar=1,tpad=stop_mode=clone:stop_duration={d}[v];[v][1:v]overlay=0:0:format=auto,format=yuv420p[out]",'-map','[out]','-t',str(d)]
  else:
   overlay=EDIT/'phones-overlay.png';im=Image.new('RGBA',(1280,720),(0,0,0,0));draw=ImageDraw.Draw(im);f=ImageFont.truetype('C:/Windows/Fonts/seguisb.ttf',18)
   draw.text((96,12),'THREE INDEPENDENT PARTICIPANT BROWSERS / LOCAL SERVICES',font=f,fill='#c2ead7')
   for x,n in [(130,'Viewer A'),(510,'Viewer B'),(890,'Viewer C')]:draw.text((x,46),n,font=f,fill='#f1ca86')
   im.save(overlay)
   for p in meta['phoneVideos']:cmd+=['-ss','9','-t','7','-i',p]
   cmd+=['-i',str(overlay)]
   filters=f'color=c=0x0c191f:s=1280x720:r=24:d={d}[bg];'
   for i in range(3):filters+=f'[{i}:v]setpts=(PTS-STARTPTS)*{d/7},fps=24,scale=260:562,setsar=1[p{i}];'
   filters+='[bg][p0]overlay=130:78[a];[a][p1]overlay=510:78[b];[b][p2]overlay=890:78[c];[c][3:v]overlay=0:0:format=auto,format=yuv420p[out]'
   cmd+=['-filter_complex',filters,'-map','[out]','-t',str(d)]
  try:run(cmd+encode+[str(out)])
  except subprocess.CalledProcessError as e:print(e.stderr.decode(errors='replace')[-2500:]);raise
  probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-of','json',str(out)]))
  if not any(s.get('codec_type')=='video' for s in probe['streams']):raise ValueError(f'Empty video shot: {out}')
  normalize_hold(out,d)
  stamp.write_text(json.dumps(entry));clips.append(out);print(f'Rendered scene {si+1}, shot {j+1}',flush=True)
def srt_time(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
captions=[];base=0
if has_audio:
 words=[]
 for m in re.finditer(r'\S+',chars):words.append((m.group(),times[m.start()],ends[m.end()-1]))
 group=[]
 for item in words:
  if group and (len(' '.join(x[0] for x in group))+len(item[0])+1>76 or item[1]-group[0][1]>4.7):
   captions.append((group[0][1],group[-1][2],' '.join(x[0] for x in group)));group=[]
  group.append(item)
 if group:captions.append((group[0][1],group[-1][2],' '.join(x[0] for x in group)))
else:
 for p,d in zip(paras,durations):
  groups=textwrap.wrap(p,width=76,break_long_words=False,break_on_hyphens=False);total=sum(len(s.split()) for s in groups);offset=base
  for g in groups:
   length=d*len(g.split())/total;captions.append((offset,offset+length,g));offset+=length
  base+=d
srt='\n\n'.join(f'{i}\n{srt_time(a)} --> {srt_time(b)}\n'+ '\n'.join(textwrap.wrap(txt,42,break_long_words=False,break_on_hyphens=False)) for i,(a,b,txt) in enumerate(captions,1))+'\n'
(B/'captions.srt').write_text(srt,encoding='utf8');(B/'edit-timeline.json').write_text(json.dumps({'voiceGenerated':has_audio,'duration':t,'shots':timeline},indent=2))
def ass_time(t):
 cs=round(t*100);return f'{cs//360000}:{cs//6000%60:02}:{cs//100%60:02}.{cs%100:02}'
ass='''[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Segoe UI,24,&H00EBF5F1,&H000000FF,&H30201B10,&H30201B10,0,0,0,0,100,100,0,0,3,3,0,2,80,80,9,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
for a,b,txt in captions:
 lines='\\N'.join(textwrap.wrap(txt,42,break_long_words=False,break_on_hyphens=False))
 ass+=f'Dialogue: 0,{ass_time(a)},{ass_time(b)},Default,,0,0,0,,{lines}\n'
(B/'captions.ass').write_text(ass,encoding='utf8')
concat=EDIT/'concat.txt';concat.write_text('\n'.join("file '"+p.name+"'" for p in clips))
joined=B/'picture-lock.mp4';run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(concat),'-c','copy',str(joined)])
output=Path('Submission Video') if has_audio else B;output.mkdir(exist_ok=True)
final=output/('Tonight-Together-Official-Demo.mp4' if has_audio else 'Tonight-Together-EDIT-PREVIEW-VOICE-PENDING.mp4')
cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(joined)]
if has_audio:cmd+=['-i',str(B/'narration.mp3')]
cmd+=['-vf','subtitles=build/official-demo/captions.ass','-c:v','libx264','-threads','2','-preset','fast','-crf','20','-pix_fmt','yuv420p']
if has_audio:cmd+=['-map','0:v:0','-map','1:a:0','-af','loudnorm=I=-16:TP=-1.5:LRA=11,apad','-c:a','aac','-b:a','192k','-t',str(t)]
else:cmd+=['-an']
cmd+=['-movflags','+faststart',str(final)]
try:run(cmd)
except subprocess.CalledProcessError as e:print(e.stderr.decode(errors='replace')[-2500:]);raise
if has_audio:
 for src,name in [(B/'captions.srt','Tonight-Together-Official-Demo.srt'),(B/'narration.mp3','Tonight-Together-Female-Narration.mp3'),(B/'edit-timeline.json','edit-timeline.json')]:shutil.copyfile(src,output/name)
print(json.dumps({'output':str(final),'duration':t,'voiceGenerated':has_audio,'captionCount':len(captions)}))
