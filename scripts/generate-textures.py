# Generates the light-leak textures in assets/textures/ (run from that folder: python3 ../../scripts/generate-textures.py)
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter
W,H=1600,1000
def hexc(h): h=h.lstrip('#'); return np.array([int(h[i:i+2],16) for i in (0,2,4)],float)
def streaks(seed, n, angle, spread, blur, xb=(0,1), yb=(0,1), lmin=.35, lmax=.8):
    rng=np.random.default_rng(seed)
    yy,xx=np.mgrid[0:H,0:W].astype(float)
    f=np.zeros((H,W))
    for _ in range(n):
        cx=rng.uniform(*xb)*W; cy=rng.uniform(*yb)*H
        a=np.deg2rad(angle+rng.normal(0,spread))
        L=rng.uniform(lmin,lmax)*W*0.5; T=rng.uniform(.025,.07)*H
        dx=xx-cx; dy=yy-cy
        u=dx*np.cos(a)+dy*np.sin(a); v=-dx*np.sin(a)+dy*np.cos(a)
        f+=rng.uniform(.4,1)*np.exp(-(u/L)**2-(v/T)**2)
    f=gaussian_filter(f,blur)
    return f/f.max()
def ramp(t, stops):
    t=np.clip(t,0,1); out=np.zeros(t.shape+(3,))
    ps=[p for p,_ in stops]; cs=[hexc(c) for _,c in stops]
    for k in range(3): out[...,k]=np.interp(t,ps,[c[k] for c in cs])
    return out
def save(img,name,q=82):
    Image.fromarray(np.clip(img,0,255).astype(np.uint8)).save(name+'.webp',quality=q,method=6)
    Image.fromarray(np.clip(img,0,255).astype(np.uint8)).save(name+'.jpg',quality=85,optimize=True,progressive=True)
yy,xx=np.mgrid[0:H,0:W]/np.array([H,W])[:,None,None]
# dark hero: navy base, teal/sky light leaking from upper right
s=streaks(3,26,-28,9,38,xb=(.25,1.1),yb=(-.1,.9))
glow=np.exp(-(((xx-.85)/.55)**2+((yy-.05)/.6)**2))
t=0.12+0.6*s*(0.35+0.65*glow)+0.2*glow
save(ramp(t,[(0,'#06101f'),(.2,'#0b1d3c'),(.45,'#14406b'),(.7,'#2a86b8'),(.9,'#7cc8ec'),(1,'#cdeefa')]),'dark-hero')
# dark band: calmer, light from lower left
s=streaks(11,20,-18,7,45,xb=(-.1,.7),yb=(.3,1.1))
glow=np.exp(-(((xx-.15)/.6)**2+((yy-.95)/.7)**2))
t=0.06+0.5*s*(0.3+0.7*glow)+0.12*glow
save(ramp(t,[(0,'#06101f'),(.25,'#0b1d3c'),(.5,'#163f69'),(.75,'#2a86b8'),(1,'#9ad6f1')]),'dark-band')
# light wash: paper with pale sky streaks
s=streaks(5,22,-24,10,50,xb=(.1,1.1),yb=(-.2,.8))
t=0.15+0.85*s
save(ramp(t,[(0,'#f6f4ee'),(.35,'#eaf2f2'),(.7,'#c6e6f4'),(1,'#9fd4ee')]),'light-wash')
# grain tile 256 (mono, mid-gray, for overlay blending)
rng=np.random.default_rng(7); g=rng.normal(128,46,(256,256)); g=gaussian_filter(g,.55); g=(g-g.mean())/g.std()*40+128
a=np.full((256,256),255.0)
Image.fromarray(np.clip(g,0,255).astype(np.uint8),'L').save('grain.png',optimize=True)

# CTA: light rising from bottom center
s=streaks(21,24,-12,14,42,xb=(.1,.95),yb=(.45,1.15))
glow=np.exp(-(((xx-.5)/.7)**2+((yy-1.05)/.55)**2))
t=0.1+0.6*s*(0.3+0.7*glow)+0.22*glow
save(ramp(t,[(0,'#06101f'),(.2,'#0b1d3c'),(.45,'#14406b'),(.7,'#2a86b8'),(.9,'#7cc8ec'),(1,'#cdeefa')]),'dark-cta')
