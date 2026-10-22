"""Editable SVG + high-resolution PNG diagrams of the implemented Milestone 2."""
from pathlib import Path
from html import escape
import math
from PIL import Image, ImageDraw, ImageFont

OUT = Path('Architecture Diagrams')
OUT.mkdir(exist_ok=True)
W, H, SCALE = 2560, 1500, 2
BG, PANEL, PANEL2 = '#0c191f', '#142a30', '#1b343b'
FG, MUTED, MINT, GOLD, LAV = '#f1f5eb', '#b7cbd0', '#bce9d5', '#f1ca86', '#bdc7ed'

class Canvas:
    def __init__(self):
        self.im = Image.new('RGB', (W*SCALE, H*SCALE), BG)
        self.draw = ImageDraw.Draw(self.im)
        self.svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
                    f'<rect width="{W}" height="{H}" fill="{BG}"/>']
    def font(self, size, bold=False):
        return ImageFont.truetype('C:/Windows/Fonts/seguisb.ttf' if bold else 'C:/Windows/Fonts/segoeui.ttf', round(size*SCALE))
    def rect(self, x,y,w,h,fill=PANEL,stroke='#34515a',radius=24,width=2):
        self.draw.rounded_rectangle(tuple(round(v*SCALE) for v in (x,y,x+w,y+h)), radius=radius*SCALE, fill=fill, outline=stroke, width=width*SCALE)
        self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')
    def text(self,x,y,text,size=30,color=FG,bold=False,maxw=None,line=1.35):
        font=self.font(size,bold); lines=[]
        for para in text.split('\n'):
            if not maxw:
                lines.append(para);continue
            row=''
            for word in para.split():
                trial=(row+' '+word).strip()
                if row and font.getlength(trial)>maxw*SCALE:lines.append(row);row=word
                else:row=trial
            lines.append(row)
        for i,row in enumerate(lines):
            yy=y+i*size*line
            self.draw.text((round(x*SCALE),round(yy*SCALE)),row,font=font,fill=color,anchor='lt')
            self.svg.append(f'<text x="{x}" y="{yy}" font-family="Segoe UI,Arial,sans-serif" font-size="{size}" font-weight="{600 if bold else 400}" fill="{color}" dominant-baseline="text-before-edge">{escape(row)}</text>')
        return y+len(lines)*size*line
    def arrow(self, points, color=MINT, width=4, both=False):
        self.draw.line([(round(x*SCALE),round(y*SCALE)) for x,y in points], fill=color,width=width*SCALE,joint='curve')
        self.svg.append(f'<polyline points="{" ".join(f"{x},{y}" for x,y in points)}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round" stroke-linecap="round"/>')
        def head(a,b):
            angle=math.atan2(b[1]-a[1],b[0]-a[0]);length=17
            tri=[b,(b[0]-length*math.cos(angle-.45),b[1]-length*math.sin(angle-.45)),(b[0]-length*math.cos(angle+.45),b[1]-length*math.sin(angle+.45))]
            self.draw.polygon([(round(x*SCALE),round(y*SCALE)) for x,y in tri],fill=color)
            self.svg.append(f'<polygon points="{" ".join(f"{x},{y}" for x,y in tri)}" fill="{color}"/>')
        head(points[-2],points[-1])
        if both:head(points[1],points[0])
    def label(self,x,y,text,color=MUTED,size=25):
        self.text(x,y,text,size,color)
    def save(self,name):
        self.im.resize((W,H),Image.Resampling.LANCZOS).save(OUT/f'{name}.png')
        (OUT/f'{name}.svg').write_text('\n'.join(self.svg+['</svg>']),encoding='utf-8')

def header(c,heading,sub):
    c.text(90,60,'TONIGHT TOGETHER',30,MINT,True)
    c.text(90,124,heading,58,FG,True)
    c.text(90,211,sub,30,MUTED)

def flow():
    c=Canvas()
    header(c,'From different tastes to a shared evening.',
           'A household viewing companion designed for the shared Fire TV screen.')
    c.rect(90,292,2376,112,PANEL2,stroke='#49616a',radius=20)
    c.text(125,329,'THE PROBLEM',25,GOLD,True)
    c.text(380,324,'Different tastes  ·  firm boundaries  ·  limited time  ·  one shared screen',33,FG)
    xs=[90,576,1062,1548,2034]; cardw=432; y=535; h=485
    data=[
      ('Share your needs',MINT,'Shared remote or\nindependent browsers',
       ['Choose tonight’s viewers, time and preferences.','Host-approved joining gives everyone a way to contribute.']),
      ('Understand the fit',MINT,'Hard boundaries first',
       ['See each viewer’s fit, the minimum fit and the tradeoffs.','Exclusions filter choices before ranking.']),
      ('Resolve disagreement',GOLD,'People control the change',
       ['A firm no removes that title from tonight.','A focused proposal can adjust time or mood, with consent.']),
      ('Accept one choice',LAV,'Fresh agreement matters',
       ['A revised choice clears earlier acceptances.','Every viewer accepts the current revision before saving.']),
      ('Watch and remember',MINT,'Choosing is not watching',
       ['Play original test media through a controlled provider.','Mark watched separately; add optional feedback.'])]
    for x,(title,color,kicker,paras) in zip(xs,data):
        c.rect(x,y,cardw,h,PANEL,stroke='#3b565e')
        c.rect(x+28,y+29,62,7,color,stroke=color,radius=3,width=1)
        c.text(x+28,y+68,title,37,FG,True,maxw=cardw-56,line=1.15)
        c.text(x+28,y+176,kicker,25,color,True,maxw=cardw-56,line=1.25)
        yy=y+264
        for para in paras:
            yy=c.text(x+28,yy,para,28,MUTED,maxw=cardw-56,line=1.3)+24
    for x in xs[:-1]:c.arrow([(x+cardw+8,y+240),(x+478,y+240)])
    c.arrow([(1278,y-8),(1278,467),(792,467),(792,y-8)],GOLD)
    c.text(705,425,'Revisit the choices after a confirmed change',25,GOLD)
    c.arrow([(2250,1033),(2250,1110),(792,1110),(792,1033)],MINT)
    c.rect(1015,1080,1110,60,BG,stroke=BG,radius=1,width=1)
    c.text(1035,1091,'Explicit watched ratings inform future fit — within a small bound',25,MINT)
    c.rect(90,1203,2376,155,PANEL2,stroke='#587667')
    c.text(128,1235,'A choice people understand, accept and can return to.',44,FG,True)
    c.text(128,1301,'Saved evenings stay local. People can inspect, disable or reset feedback learning.',29,MUTED)
    c.text(90,1410,'Controlled test playback is shown separately from commercial streaming. Fit scores explain preferences; they do not predict satisfaction.',25,MUTED)
    c.save('Tonight-Together-Household-Decision-Flow')

def architecture():
    c=Canvas()
    header(c,'One shared decision. Clear technical boundaries.',
           'Local-first TV experience, connected participation and a separate controlled media path.')
    # Handoff is an Android activity transition, not a room-service media connection.
    c.arrow([(435,350),(435,292),(2140,292),(2140,350)],GOLD,both=True)
    c.rect(1130,269,750,48,BG,stroke=BG,radius=1,width=1)
    c.text(1150,276,'Android handoff  /  real Back return',25,GOLD)
    # Left column: durable TV host and independent browser clients.
    c.rect(90,350,690,305,PANEL,stroke='#5d8d7d')
    c.text(124,380,'TV host',40,FG,True)
    c.text(124,443,'Java Android shell + bundled WebView UI',29,MINT)
    c.text(124,495,'HTML / CSS / JavaScript · D-pad navigation\nLocal ranking and shared-remote path\nOwns saved evenings and watched state',28,MUTED,line=1.5)
    c.arrow([(435,662),(435,744)],both=True)
    c.rect(475,678,287,43,BG,stroke=BG,radius=1,width=1)
    c.text(491,684,'Read / atomic write',25,MINT)
    c.rect(90,752,690,215,PANEL,stroke='#5d8d7d')
    c.text(124,783,'App-private household file',35,FG,True)
    c.text(124,841,'Android AtomicFile · durable local memory',28,MINT)
    c.text(124,894,'Profiles, catalogue, saved choices and explicit ratings',25,MUTED)
    c.rect(90,1060,690,270,PANEL,stroke='#657393')
    c.text(124,1093,'Participant browsers',38,FG,True)
    c.text(124,1154,'QR / link / code → host approval',29,LAV)
    c.text(124,1210,'Separate responses · own preference details\nShared shortlist and agreement progress',28,MUTED,line=1.5)
    # Center column: in-memory authoritative connected session plus shared pure engine.
    c.rect(990,350,650,980,PANEL,stroke='#638a82')
    c.text(1026,385,'Connected room service',37,FG,True)
    c.text(1026,451,'Node.js · bounded HTTP polling every 2s',27,MINT)
    c.text(1026,511,'Short-lived rooms and participant capabilities\nHost approval, revisions and request IDs',26,MUTED,maxw=570,line=1.5)
    c.rect(1026,638,578,340,PANEL2,stroke='#658777',radius=18)
    c.text(1054,667,'Shared pure JavaScript core',31,FG,True)
    c.text(1054,725,'Eligibility → fit + fairness → shortlist',27,MINT)
    c.text(1054,780,'Focused negotiation proposals\nFeedback: ≥2 genre ratings; bound −3 to +3\nSame modules power the TV’s local path',26,MUTED,maxw=510,line=1.5)
    c.rect(1026,1014,578,160,fill='#292f32',stroke='#8c7b53',radius=18)
    c.text(1054,1042,'Revision-safe agreement',31,GOLD,True)
    c.text(1054,1092,'Material changes clear votes; save needs unanimity.',25,FG,maxw=520)
    c.text(1026,1199,'Room state lives in service memory.\nRestart expires active rooms; TV records remain.',25,MUTED,maxw=570,line=1.5)
    # Connected commands/polls return current room facts; no direct participant-storage edge.
    c.arrow([(792,524),(978,524)],MINT,both=True)
    c.text(806,432,'Commands',22,MINT)
    c.text(806,467,'+ shared state',22,MINT)
    c.arrow([(792,1196),(948,1196),(948,966),(978,966)],LAV,both=True)
    c.text(804,1005,'Join',22,LAV)
    c.text(804,1040,'respond',22,LAV)
    c.text(804,1075,'and poll',22,LAV)
    # Right column: separate activity -> loopback provider -> original test bytes.
    c.rect(1810,350,660,285,PANEL,stroke='#8e7f5c')
    c.text(1846,383,'Separate Android provider',36,FG,True)
    c.text(1846,446,'Explicit component handoff to its WebView',27,GOLD)
    c.text(1846,502,'Ticket: test title + scenario + expiry\nNo profiles, aliases, notes or votes sent',27,MUTED,maxw=580,line=1.5)
    c.arrow([(2140,647),(2140,756)],GOLD,both=True)
    c.rect(1855,675,600,44,BG,stroke=BG,radius=1,width=1)
    c.text(1872,683,'Loopback HTTP · resolve + media ranges',25,GOLD)
    c.rect(1810,768,660,330,PANEL,stroke='#8e7f5c')
    c.text(1846,804,'Controlled media service',36,FG,True)
    c.text(1846,866,'Node.js · HMAC + expiry validation',28,GOLD)
    c.text(1846,920,'Original MP4 bytes with HTTP range support\nPlay / pause / seek · labelled failure cases\nDemo access; no real sign-in or purchase',27,MUTED,maxw=585,line=1.5)
    c.rect(1810,1177,660,153,PANEL2,stroke='#638a82')
    c.text(1846,1207,'Playback does not mark watched.',32,MINT,True)
    c.text(1846,1261,'People record watched status and ratings explicitly.',25,MUTED)
    c.text(90,1410,'Fire OS target · Android TV Emulator evidence · local services · no AWS or runtime LLM required · controlled media, not commercial streaming',25,MUTED)
    c.save('Tonight-Together-Technical-Architecture')

flow()
architecture()
print('Two architecture diagrams exported as PNG and editable SVG.')
