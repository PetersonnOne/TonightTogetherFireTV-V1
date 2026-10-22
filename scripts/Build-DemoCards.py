"""Original editable text/shape cards. No third-party logo artwork or media."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
OUT=Path('build/official-demo/cards');OUT.mkdir(parents=True,exist_ok=True)
W,H=1280,720
BG='#0c191f'; FG='#f1f5eb'; MINT='#c2ead7'; GOLD='#f1ca86'; MUTED='#b1c5c7'
def font(size,bold=False):return ImageFont.truetype('C:/Windows/Fonts/seguisb.ttf' if bold else 'C:/Windows/Fonts/segoeui.ttf',size)
def base():
 im=Image.new('RGB',(W,H));p=im.load()
 for y in range(H):
  for x in range(W):
   glow=max(0,1-((x-1080)**2+(y-160)**2)**.5/1000)
   p[x,y]=(int(12+10*glow),int(25+15*glow),int(31+14*glow))
 d=ImageDraw.Draw(im)
 for x,y,c in [(1080,185,MINT),(1128,185,GOLD),(1104,227,'#b7c8e8')]:d.ellipse((x-65,y-65,x+65,y+65),outline=c,width=2)
 d.text((72,50),'TONIGHT TOGETHER',font=font(22,True),fill=MINT)
 d.line((72,102,1208,102),fill='#344c52',width=1)
 return im,d
def line(d,y,text,size=48,color=FG):d.text((72,y),text,font=font(size,True),fill=color)
def foot(d,text):d.text((72,655),text,font=font(19),fill=MUTED)
im,d=base();line(d,176,'You made time for each other.',48);line(d,242,'Now comes the hard part.',48)
for x,text,c in [(72,'Comedy',MINT),(340,'Adventure',GOLD),(670,'A firm no','#eab09a')]:
 d.rounded_rectangle((x,368,x+230,436),radius=18,outline=c,width=2);d.text((x+26,383),text,font=font(26,True),fill=c)
line(d,494,'What can everyone enjoy tonight?',35,MINT);foot(d,'A household decision. A shared evening.');im.save(OUT/'hook.png')
im,d=base();line(d,176,'Tonight Together',76);line(d,292,'A say for everyone.',49,MINT);line(d,363,'A night worth sharing.',49)
foot(d,'Designed for Amazon Fire TV  /  Fire OS target');im.save(OUT/'title.png')
im,d=base();line(d,176,'Fire TV.',76);line(d,270,'Where the shared decision belongs.',44,MINT)
for y,a,b in [(365,'ONE SHARED SCREEN','Understand the compromise'),(435,'REMOTE NAVIGATION','Keep the decision accessible'),(505,'INDEPENDENT RESPONSES','Give every viewer a voice')]:
 d.text((76,y),a,font=font(21,True),fill=GOLD);d.text((450,y-3),b,font=font(28),fill=FG)
foot(d,'Fire OS target  /  Demonstrated on Android TV Emulator');im.save(OUT/'platform.png')
im,d=base();line(d,158,'Built. Tested. Demonstrated.',51)
for x,num,desc in [(74,'31','automated tests'),(474,'3','participant browsers'),(890,'TV','native emulator checks')]:
 d.text((x,288),num,font=font(88,True),fill=MINT);d.text((x,406),desc,font=font(24),fill=FG)
foot(d,'Local evaluation evidence  /  Controlled provider  /  No physical-device claim');im.save(OUT/'proof.png')
im,d=base();line(d,170,'Tonight Together',75);line(d,295,'One screen. Different tastes.',43,MINT);line(d,356,'A night worth sharing.',43)
d.text((74,506),'Thank you, Amazon Developer.',font=font(30,True),fill=GOLD);foot(d,'Fire TV track  /  Fire OS target  /  Original app and demo artwork');im.save(OUT/'end.png')
print('Created five original text and shape cards.')
