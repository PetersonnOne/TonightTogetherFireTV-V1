"""Verify the actual narrated export and prepare a ten-chapter visual review sheet."""
from pathlib import Path
import hashlib, json, re, subprocess
from PIL import Image, ImageDraw, ImageFont
B=Path('build/official-demo'); out=Path('Submission Video'); movie=out/'Tonight-Together-Official-Demo.mp4'
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(movie)]))
duration=float(probe['format']['duration']); video=next(s for s in probe['streams'] if s['codec_type']=='video'); audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert duration<180 and video['width']==1280 and video['height']==720
decode=subprocess.run(['ffmpeg','-v','error','-i',str(movie),'-f','null','-'],capture_output=True,text=True)
assert decode.returncode==0 and not decode.stderr.strip(),decode.stderr
script=Path('docs/official-demo/OFFICIAL_DEMO_NARRATION.txt').read_text(encoding='utf-8-sig').strip()
srt=(out/'Tonight-Together-Official-Demo.srt').read_text(encoding='utf-8')
caption_text=' '.join(' '.join(cue.splitlines()[2:]) for cue in srt.strip().split('\n\n'))
assert caption_text.split()==script.split(),'Caption text differs from script'
timeline=json.loads((out/'edit-timeline.json').read_text())
chapters=[]
for scene in range(1,11):
    shots=[s for s in timeline['shots'] if s['scene']==scene]
    chapters.append({'scene':scene,'start':shots[0]['outputStart'],'end':shots[-1]['outputStart']+shots[-1]['duration']})
sheet=Image.new('RGB',(1280,5*395),'#0c191f'); draw=ImageDraw.Draw(sheet);font=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',18)
for i,ch in enumerate(chapters):
    sample=ch['start']+(ch['end']-ch['start'])*.55
    frame=B/f'final-chapter-{i+1:02}.jpg'
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(sample),'-i',str(movie),'-frames:v','1','-update','1',str(frame)],check=True)
    im=Image.open(frame);im.thumbnail((630,355));x=(i%2)*640;y=(i//2)*395
    sheet.paste(im,(x,y));draw.text((x+10,y+357),f'Chapter {i+1} | {sample:.2f}s',font=font,fill='white')
sheet.save(B/'narrated-final-contact-sheet.jpg',quality=90)
levels=subprocess.run(['ffmpeg','-hide_banner','-i',str(movie),'-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
level_data=json.loads(re.findall(r'\{[^{}]*"input_i"[^{}]*\}',levels.stderr,re.S)[-1])
assert float(level_data['input_i'])>-30,'Unexpectedly quiet audio'
assert float(level_data['input_tp'])<0,'True peak clipping risk'
report={'file':str(movie),'durationSeconds':duration,'underThreeMinutes':duration<180,
    'video':{k:video[k] for k in ['codec_name','width','height','r_frame_rate']},
    'audio':{k:audio[k] for k in ['codec_name','sample_rate','channels']},
    'bytes':movie.stat().st_size,'sha256':hashlib.sha256(movie.read_bytes()).hexdigest(),
    'fullDecodePassed':True,'captionCount':len(srt.strip().split('\n\n')),'captionWords':len(caption_text.split()),
    'captionTextMatchesApprovedScript':True,'speechCheck':json.loads((B/'narration-script-check.json').read_text()),
    'measuredAudio':level_data,'chapters':chapters,
    'subjectiveListening':'User approved the Sarah audition; full production take has transcript and technical checks, not assistant subjective listening signoff',
    'publicUploadPerformed':False}
(out/'verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({k:report[k] for k in ['durationSeconds','bytes','sha256','fullDecodePassed','captionCount','captionWords','measuredAudio']},indent=2))
