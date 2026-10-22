import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, staticFile, Sequence, useCurrentFrame, useVideoConfig, Easing, interpolate, delayRender, continueRender} from 'remotion';

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const cl = (x) => Math.max(0, Math.min(1, x));
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const bn = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);
const money = (n) => bn(String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
const FONTS = 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;700&display=swap';
const GLASS = 'linear-gradient(135deg, rgba(255,255,255,.2), rgba(255,255,255,.05))';
const NOISE = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")";

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const done = () => continueRender(h);
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = FONTS;
    l.onload = () => Promise.all(['700 40px "Hind Siliguri"', '500 40px "Hind Siliguri"'].map((f) => document.fonts.load(f, 'আ'))).then(done, done);
    l.onerror = done;
    document.head.appendChild(l);
  }, [h]);
};

const Orbs = ({c}) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: c.bg, overflow: 'hidden'}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', width: width * 0.95, height: width * 0.95, borderRadius: '50%',
          left: width * (0.5 + 0.45 * Math.sin(f / 90 + i * 2.1)), top: height * (0.5 + 0.38 * Math.cos(f / 110 + i * 3)),
          transform: 'translate(-50%,-50%)', background: `radial-gradient(circle, ${i === 1 ? c.accent : c.c2}60, transparent 65%)`}} />
      ))}
    </AbsoluteFill>
  );
};

const Grid = ({c}) => {
  const f = useCurrentFrame();
  const {height} = useVideoConfig();
  const mask = 'linear-gradient(to top, #000, transparent)';
  return (
    <AbsoluteFill style={{perspective: 700, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: '-60%', width: '220%', bottom: -height * 0.22, height: height * 0.6, transform: 'rotateX(68deg)', transformOrigin: '50% 100%',
        backgroundImage: `linear-gradient(${c.c2}66 1px, transparent 1px), linear-gradient(90deg, ${c.c2}66 1px, transparent 1px)`, backgroundSize: '90px 90px',
        backgroundPosition: `0 ${(f * 1.4) % 90}px`, WebkitMaskImage: mask, maskImage: mask}} />
    </AbsoluteFill>
  );
};

const Sparks = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill>
      {Array.from({length: 40}, (_, i) => {
        const x = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1) * width;
        const sp = 0.6 + ((i * 7) % 10) / 8;
        const y = height - ((f * sp * 2 + i * 97) % (height + 120)) + 60;
        const tw = 0.25 + 0.75 * Math.abs(Math.sin(f / 14 + i));
        const r = 2 + (i % 4) * 1.3;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: '50%', background: '#fff', opacity: tw * 0.55, boxShadow: `0 0 ${r * 3}px #fff`}} />;
      })}
    </AbsoluteFill>
  );
};

const Finish = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,.6) 100%)'}} />
      <AbsoluteFill style={{opacity: 0.09, mixBlendMode: 'overlay', backgroundImage: NOISE, backgroundPosition: `${(f * 37) % 200}px ${(f * 53) % 200}px`}} />
    </AbsoluteFill>
  );
};

const Wipe = ({c}) => {
  const f = useCurrentFrame();
  const {width} = useVideoConfig();
  if (f > 18) return null;
  const x = interpolate(f, [0, 18], [-width * 0.6, width * 1.3], CLAMP);
  return <div style={{position: 'absolute', top: '-10%', bottom: '-10%', left: 0, width: width * 0.5, transform: `translateX(${x}px) skewX(-18deg)`,
    background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)`, opacity: 0.5, filter: 'blur(10px)'}} />;
};

const Scene = ({d, c, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = Math.round(d * fps);
  const o = interpolate(f, [0, 8, n - 8, n], [0, 1, 1, 0], CLAMP);
  const s = interpolate(f, [0, n], [1, 1.07]);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: o, transform: `scale(${s})`, alignItems: 'center', justifyContent: 'center'}}>{children}</AbsoluteFill>
      <Wipe c={c} />
    </AbsoluteFill>
  );
};

const Words = ({text, size, color, delay = 0, accent, accentColor}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.25}px`, textAlign: 'center'}}>
      {text.split(' ').map((w, i) => {
        const p = ease(cl((f - delay - i * 6) / 22));
        const isA = accent && w.includes(accent);
        const shake = isA ? Math.sin(f * 1.4) * size * 0.03 * cl((f - delay - 30) / 10) : 0;
        const grad = isA ? {backgroundImage: `linear-gradient(90deg, ${accentColor}, #ffffff, ${accentColor})`, backgroundSize: '200% 100%', backgroundPosition: `${(f * 3) % 200}% 0`,
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textShadow: 'none'} : {color};
        return <span key={i} style={{display: 'inline-block', opacity: p, fontSize: size, fontWeight: 700, lineHeight: 1.3, ...grad,
          filter: `blur(${(1 - p) * 8}px)`, transform: `translateY(${(1 - p) * size * 0.8}px) rotate(${(1 - p) * 4}deg) translateX(${shake}px)`}}>{w}</span>;
      })}
    </div>
  );
};

const Line = ({children, delay = 0, size, color = '#fff', weight = 700}) => {
  const f = useCurrentFrame();
  const p = ease(cl((f - delay) / 24));
  return (
    <div style={{overflow: 'hidden', padding: `${size * 0.18}px 0`, textAlign: 'center'}}>
      <div style={{transform: `translateY(${(1 - p) * 115}%)`, opacity: p, fontSize: size, color, fontWeight: weight, lineHeight: 1.25, textShadow: '0 4px 24px rgba(0,0,0,.35)'}}>{children}</div>
    </div>
  );
};

const Chip = ({text, delay, size}) => {
  const f = useCurrentFrame();
  const p = ease(cl((f - delay) / 18));
  const sx = (((f + delay * 3) % 100) / 100) * 160 - 30;
  return (
    <div style={{position: 'relative', overflow: 'hidden', opacity: p, transform: `translateY(${(1 - p) * size + Math.sin(f / 20 + delay) * size * 0.06}px) scale(${0.9 + 0.1 * p})`,
      background: GLASS, backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,.28)', boxShadow: '0 10px 30px rgba(0,0,0,.25)',
      color: '#fff', padding: `${size * 0.35}px ${size * 0.8}px`, borderRadius: 999, fontSize: size, fontWeight: 500, whiteSpace: 'nowrap'}}>
      {text}
      <div style={{position: 'absolute', top: 0, bottom: 0, left: `${sx}%`, width: '25%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent)', transform: 'skewX(-20deg)'}} />
    </div>
  );
};

const Toast = ({text, delay, size, side, top}) => {
  const f = useCurrentFrame();
  const p = ease(cl((f - delay) / 20));
  const dir = side === 'right' ? 1 : -1;
  return (
    <div style={{position: 'absolute', [side]: -size * 1.2, top, opacity: p, background: GLASS, backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.3)', borderRadius: size * 0.6,
      padding: `${size * 0.4}px ${size * 0.7}px`, color: '#fff', fontSize: size, fontWeight: 500, whiteSpace: 'nowrap', boxShadow: '0 16px 40px rgba(0,0,0,.35)',
      transform: `translateX(${dir * (1 - p) * size * 4}px) translateY(${Math.sin(f / 25 + delay) * size * 0.2}px)`}}>{text}</div>
  );
};

const ShotView = ({src, w, h, delay, fallback}) => {
  const f = useCurrentFrame();
  const [handle] = useState(() => delayRender('shot'));
  const [ratio, setRatio] = useState(null);
  const [err, setErr] = useState(false);
  const done = () => { try { continueRender(handle); } catch (e) {} };
  if (err) return fallback;
  const imgH = ratio ? w * ratio : h;
  const sy = interpolate(f, [delay + 40, delay + 170], [0, -Math.max(0, imgH - h)], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  return <Img src={staticFile(src)} onLoad={(e) => { setRatio(e.currentTarget.naturalHeight / e.currentTarget.naturalWidth); done(); }}
    onError={() => { setErr(true); done(); }} style={{width: '100%', display: 'block', transform: `translateY(${sy}px)`}} />;
};

const Browser = ({bw, c, kind, url, shot, delay = 0}) => {
  const f = useCurrentFrame();
  const p = ease(cl((f - delay) / 28));
  const bh = bw * 0.72;
  const bar = bw * 0.07;
  const sc = interpolate(f, [delay + 40, delay + 150], [0, -bh * 0.55], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const frames = [[0.08, 0.1, 0.36, 0.5], [0.52, 0.1, 0.4, 0.3], [0.52, 0.46, 0.4, 0.3]];
  const cx = interpolate(f, [delay + 20, delay + 60, delay + 100, delay + 140], [0.1, 0.3, 0.6, 0.75], CLAMP);
  const cy = interpolate(f, [delay + 20, delay + 60, delay + 100, delay + 140], [0.1, 0.25, 0.3, 0.55], CLAMP);
  const wx = interpolate(f, [delay + 30, delay + 90], [0.15, 0.62], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const wy = interpolate(f, [delay + 30, delay + 90], [0.75, 0.42], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const rp = cl((f - delay - 92) / 22);
  const tri = {position: 'absolute', width: 0, height: 0, borderLeft: `${bw * 0.025}px solid #fff`, borderTop: `${bw * 0.04}px solid transparent`, borderBottom: `${bw * 0.04}px solid transparent`, transform: 'rotate(-25deg)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.5))'};
  return (
    <div style={{perspective: bw * 3}}>
      <div style={{width: bw, height: bh, borderRadius: bw * 0.03, overflow: 'hidden', background: kind === 'figma' ? '#1e1e24' : '#fff',
        boxShadow: `0 ${bw * 0.06}px ${bw * 0.14}px rgba(0,0,0,.6), 0 0 ${bw * 0.2}px ${c.c2}88`, opacity: p,
        transform: `translateY(${(1 - p) * bw * 0.15 + Math.sin(f / 35) * bw * 0.012}px) rotateY(${Math.sin(f / 50) * 9}deg) rotateX(${(1 - p) * 12 + 4 + Math.cos(f / 60) * 3}deg)`}}>
        <div style={{height: bar, background: kind === 'figma' ? '#2b2b33' : '#e5e7eb', display: 'flex', alignItems: 'center', gap: bar * 0.25, padding: `0 ${bar * 0.4}px`}}>
          {[0, 1, 2].map((i) => <div key={i} style={{width: bar * 0.3, height: bar * 0.3, borderRadius: '50%', background: ['#ef4444', '#f59e0b', '#22c55e'][i]}} />)}
          <div style={{marginLeft: bar * 0.4, background: kind === 'figma' ? '#3a3a44' : '#fff', borderRadius: 99, padding: `0 ${bar * 0.5}px`, fontSize: bar * 0.4, color: '#888', lineHeight: `${bar * 0.6}px`}}>{url}</div>
        </div>
        <div style={{position: 'relative', height: bh - bar, overflow: 'hidden'}}>
          {shot ? <ShotView src={shot} w={bw} h={bh - bar} delay={delay} fallback={<div style={{color:'#888',padding:bw*0.05}}>screenshot পাওয়া যায়নি</div>} /> : kind === 'figma' ? (
            <>
              {frames.map((fr, i) => {
                const q = ease(cl((f - delay - 20 - i * 14) / 18));
                return <div key={i} style={{position: 'absolute', left: `${fr[0] * 100}%`, top: `${fr[1] * 100}%`, width: `${fr[2] * 100}%`, height: `${fr[3] * 100}%`, borderRadius: bw * 0.02,
                  background: i === 0 ? c.accent : i === 1 ? c.c2 : '#fff', opacity: q, transform: `scale(${0.8 + 0.2 * q})`, outline: `2px solid ${c.accent}`, outlineOffset: 4}} />;
              })}
              <div style={{...tri, left: `${cx * 100}%`, top: `${cy * 100}%`}} />
            </>
          ) : (
            <>
              <div style={{transform: `translateY(${sc}px)`}}>
                <div style={{height: bh * 0.5, background: `linear-gradient(135deg, ${c.c2}, ${c.accent})`, padding: bw * 0.06}}>
                  <div style={{width: '55%', height: bw * 0.045, background: 'rgba(255,255,255,.9)', borderRadius: 99, marginBottom: bw * 0.025}} />
                  <div style={{width: '38%', height: bw * 0.045, background: 'rgba(255,255,255,.6)', borderRadius: 99, marginBottom: bw * 0.05}} />
                  <div style={{width: bw * 0.2, height: bw * 0.07, background: '#0b0f1a', borderRadius: 99}} />
                </div>
                <div style={{display: 'flex', gap: bw * 0.03, padding: bw * 0.04}}>
                  {[0, 1, 2].map((i) => <div key={i} style={{flex: 1, height: bh * 0.3, background: '#eef0f6', borderRadius: bw * 0.02}} />)}
                </div>
                <div style={{height: bh * 0.4, margin: `0 ${bw * 0.04}px`, background: '#f4f5fa', borderRadius: bw * 0.02}} />
              </div>
              {rp > 0 && rp < 1 ? <div style={{position: 'absolute', left: `${wx * 100}%`, top: `${wy * 100}%`, width: bw * 0.2 * rp, height: bw * 0.2 * rp, borderRadius: '50%', border: `3px solid ${c.accent}`, opacity: 1 - rp, transform: 'translate(-50%,-50%)'}} /> : null}
              <div style={{...tri, left: `${wx * 100}%`, top: `${wy * 100}%`}} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const HookScene = ({s, c, u}) => (
  <div style={{width: '88%'}}><Words text={s.text} size={u * 1.15} color="#fff" accent={s.accent} accentColor={c.accent} delay={4} /></div>
);

const MockScene = ({s, c, u, tall}) => {
  const {width} = useVideoConfig();
  const bw = tall ? width * 0.78 : width * 0.4;
  const ts = u * 0.34;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: u * 0.5, width: '92%'}}>
      <Line size={u * 0.72} delay={2}>{s.title}</Line>
      <div style={{position: 'relative'}}>
        <Browser bw={bw} c={c} kind={s.kind} url={s.url} shot={s.shot} delay={12} />
        {(s.toasts || []).map((t, i) => <Toast key={i} text={t} delay={60 + i * 28} size={ts} side={i % 2 ? 'left' : 'right'} top={bw * (0.12 + i * 0.32)} />)}
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: u * 0.2}}>
        {s.chips.map((t, i) => <Chip key={i} text={t} delay={50 + i * 10} size={u * 0.42} />)}
      </div>
    </div>
  );
};

const OfferScene = ({s, c, u}) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [8, 55], [0, s.price], {...CLAMP, easing: Easing.out(Easing.cubic)}));
  const pop = ease(cl((f - 4) / 20));
  const glow = 0.6 + 0.4 * Math.sin(f / 8);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: u * 0.3, width: '92%'}}>
      <div style={{transform: `scale(${pop})`, background: c.accent, color: '#0b0f1a', fontWeight: 700, fontSize: u * 0.5, padding: `${u * 0.1}px ${u * 0.5}px`, borderRadius: 999, boxShadow: `0 0 ${u * 0.6}px ${c.accent}99`}}>{s.badge}</div>
      {s.old ? <div style={{fontSize: u * 0.6, color: 'rgba(255,255,255,.6)', textDecoration: 'line-through', opacity: pop}}>{s.old}</div> : null}
      <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {[0, 1, 2].map((i) => {
          const q = ((f + i * 20) % 60) / 60;
          return <div key={i} style={{position: 'absolute', width: u * 4 * q, height: u * 4 * q, borderRadius: '50%', border: `2px solid ${c.accent}`, opacity: (1 - q) * 0.5 * pop}} />;
        })}
        <div style={{fontSize: u * 2.1, fontWeight: 700, color: c.accent, lineHeight: 1.1, textShadow: `0 0 ${u * 1.1 * glow}px ${c.accent}99`}}>{s.prefix}{money(n)}</div>
      </div>
      {s.suffix ? <div style={{fontSize: u * 0.6, color: '#fff', fontWeight: 500}}>{s.suffix}</div> : null}
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: u * 0.2, marginTop: u * 0.2}}>
        {s.bullets.map((t, i) => <Chip key={i} text={'✔ ' + t} delay={50 + i * 9} size={u * 0.44} />)}
      </div>
      {s.note ? <Line size={u * 0.38} delay={95} color="rgba(255,255,255,.75)" weight={500}>{s.note}</Line> : null}
    </div>
  );
};

const CtaScene = ({s, c, u}) => {
  const f = useCurrentFrame();
  const p = ease(cl((f - 20) / 20));
  const pulse = 1 + 0.05 * Math.sin(f / 5);
  const sx = ((f % 70) / 70) * 160 - 30;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: u * 0.35, width: '92%'}}>
      <Line size={u * 1.05} delay={2}>{s.title}</Line>
      <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        {[0, 1].map((i) => {
          const q = ((f + i * 25) % 50) / 50;
          return <div key={i} style={{position: 'absolute', width: u * (3 + 3 * q), height: u * (1.2 + 1.2 * q), borderRadius: 999, border: `2px solid ${c.accent}`, opacity: (1 - q) * 0.6 * p}} />;
        })}
        <div style={{position: 'relative', overflow: 'hidden', opacity: p, transform: `scale(${(0.8 + 0.2 * p) * pulse})`, background: c.accent, color: '#0b0f1a', fontWeight: 700, fontSize: u * 0.62,
          padding: `${u * 0.28}px ${u * 0.8}px`, borderRadius: 999, boxShadow: `0 0 ${u * 0.9}px ${c.accent}99`}}>
          {s.button}
          <div style={{position: 'absolute', top: 0, bottom: 0, left: `${sx}%`, width: '25%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)', transform: 'skewX(-20deg)'}} />
        </div>
      </div>
      <Line size={u * 0.5} delay={34} color="#fff" weight={500}>{s.sub}</Line>
    </div>
  );
};

const VIEW = {hook: HookScene, mock: MockScene, offer: OfferScene, cta: CtaScene};

export const PremiumVideo = ({script}) => {
  useFonts();
  const {fps, width, height} = useVideoConfig();
  const tall = height > width * 1.2;
  const u = width * (tall ? 0.115 : height > width * 0.9 ? 0.1 : 0.062);
  let from = 0;
  return (
    <AbsoluteFill>
      <Orbs c={script} />
      <Grid c={script} />
      <Sparks />
      {script.scenes.map((s, i) => {
        const dur = Math.round(s.d * fps);
        const f0 = from;
        from += dur;
        const V = VIEW[s.t];
        return <Sequence key={i} from={f0} durationInFrames={dur}><Scene d={s.d} c={script}><V s={s} c={script} u={u} tall={tall} /></Scene></Sequence>;
      })}
      <Finish />
    </AbsoluteFill>
  );
};

export const SCRIPTS = {
  Websitesdeal: {bg: '#0b0f1a', accent: '#c6ff3d', c2: '#2b50ff', scenes: [
    {t: 'hook', d: 3.5, text: 'ব্যবসার ওয়েবসাইট নেই?', accent: 'নেই?'},
    {t: 'mock', d: 5, title: 'ক্লায়েন্ট এবার আপনাকে খুঁজে পাবে', kind: 'web', url: 'apnarbusiness.com', toasts: ['🔔 নতুন অর্ডার এসেছে', '📩 নতুন মেসেজ'], chips: ['✅ অ্যাপয়েন্টমেন্ট', '🛒 অনলাইন অর্ডার', '📱 মোবাইল-ফ্রেন্ডলি']},
    {t: 'offer', d: 5.5, badge: 'মাত্র', price: 499, prefix: '৳', suffix: 'টাকা / মাস', bullets: ['ফ্রি SSL', 'দ্রুত লোড', 'ডিজাইন বদলানো যায়'], note: 'ডোমেইন আপনি নিজে কিনবেন'},
    {t: 'cta', d: 6, title: 'আজই শুরু করুন', button: 'মেসেজ করুন', sub: 'Websitesdeal'}]},
  SnkCourse: {bg: '#06121c', accent: '#ffc93c', c2: '#14b8a6', scenes: [
    {t: 'hook', d: 3.5, text: 'UI/UX শিখে ক্যারিয়ার গড়তে চাও?', accent: 'ক্যারিয়ার'},
    {t: 'mock', d: 5.5, title: 'AI-Powered UI/UX Career Program', kind: 'figma', url: 'figma.com/design', toasts: ['🎨 Wireframe সম্পন্ন', '⚡ Prototype তৈরি'], chips: ['৩ মাস', 'Figma ও Prototyping', 'AI ডিজাইন ওয়ার্কফ্লো']},
    {t: 'offer', d: 6, badge: 'Special Offer', old: '৳১১,৫০০', price: 7490, prefix: '৳', suffix: '', bullets: ['১০০% প্র্যাকটিক্যাল', 'সার্টিফিকেট', 'এক্সপার্ট ইন্সট্রাক্টর', 'ক্যারিয়ার গাইডেন্স'], note: 'SNK IT Institute · Learn To Lead'},
    {t: 'cta', d: 6, title: 'এখনই ভর্তি হও', button: 'WhatsApp: 01705633700', sub: 'SNK IT Institute · Learn To Lead'}]},
};
