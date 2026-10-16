import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, Easing, interpolate, delayRender, continueRender} from 'remotion';

const TH = ['#0f5132', '#2b50ff', '#7c3aed', '#ea580c'];
const UF = {'16:9': 0.05, '9:16': 0.09, '1:1': 0.065};
const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const graphemes = (x) => (typeof Intl !== 'undefined' && Intl.Segmenter
  ? Array.from(new Intl.Segmenter('bn', {granularity: 'grapheme'}).segment(x), (y) => y.segment)
  : Array.from(x));
const FONTS = 'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;700&family=Noto+Serif+Bengali:wght@400;700&family=Atma:wght@400;600&family=Baloo+Da+2:wght@500;700&display=swap';

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const done = () => continueRender(handle);
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = FONTS;
    l.onload = () => {
      Promise.all(['700 40px "Hind Siliguri"', '500 40px "Hind Siliguri"', '700 40px "Noto Serif Bengali"', '400 40px "Atma"', '700 40px "Baloo Da 2"'].map((f) => document.fonts.load(f, 'আ'))).then(done, done);
    };
    l.onerror = done;
    document.head.appendChild(l);
  }, [handle]);
};

const Txt = ({t, d, u, k}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sec = frame / fps;
  const p = ease(clamp01((sec - t.delay) / Math.max(0.05, t.dur)));
  let style = {};
  let inner = t.x;
  if (t.anim === 'fade') style = {opacity: p};
  else if (t.anim === 'slideL') style = {opacity: p, transform: `translateX(${-90 * k * (1 - p)}px)`};
  else if (t.anim === 'slideR') style = {opacity: p, transform: `translateX(${90 * k * (1 - p)}px)`};
  else if (t.anim === 'slideU') style = {opacity: p, transform: `translateY(${70 * k * (1 - p)}px)`};
  else if (t.anim === 'slideD') style = {opacity: p, transform: `translateY(${-70 * k * (1 - p)}px)`};
  else if (t.anim === 'zoom') style = {opacity: p, transform: `scale(${0.3 + 0.7 * p})`};
  else if (t.anim === 'typewriter') {
    const g = graphemes(t.x);
    inner = g.slice(0, Math.floor(clamp01((sec - t.delay) / Math.max(0.05, t.dur)) * g.length)).join('');
  } else if (t.anim === 'word' || t.anim === 'stagger') {
    const parts = t.anim === 'word' ? t.x.split(/(\s+)/).filter((x) => x.length) : graphemes(t.x);
    const n = Math.max(1, t.anim === 'word' ? parts.filter((x) => x.trim()).length : parts.length);
    let j = 0;
    inner = parts.map((x, i) => {
      if (t.anim === 'word' && !x.trim()) return x;
      const st = t.delay + (j++) * t.dur / n;
      const q = ease(clamp01((sec - st) / 0.5));
      return <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', opacity: q, transform: `translateY(${(1 - q) * 0.5}em)`}}>{x}</span>;
    });
  }
  const out = t.out ? interpolate(sec, [Math.max(0, d - 0.6), d], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return (
    <div style={{position: 'absolute', left: `${t.px}%`, top: `${t.py}%`, width: '90%', transform: 'translate(-50%,-50%)', textAlign: t.align, whiteSpace: 'pre-line', lineHeight: 1.25,
      fontFamily: `'${t.font}', sans-serif`, fontSize: (t.size / 10) * u, fontWeight: t.weight, color: t.color, opacity: out}}>
      <div style={style}>{inner}</div>
    </div>
  );
};

const SceneView = ({sc, u, k, width}) => (
  <AbsoluteFill style={{background: `linear-gradient(150deg, ${sc.bg || TH[sc.t || 0]}, #000)`}}>
    {sc.img ? (
      <div style={{position: 'absolute', left: '7%', right: '7%', top: '6%', height: '52%', borderRadius: width * 0.01, overflow: 'hidden', background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,.5)'}}>
        <img src={sc.img} style={{width: '100%', display: 'block'}} />
      </div>
    ) : null}
    {sc.texts.map((t, i) => <Txt key={i} t={t} d={sc.d} u={u} k={k} />)}
  </AbsoluteFill>
);

export const Video = ({project, ratio}) => {
  useFonts();
  const {fps, width} = useVideoConfig();
  const u = width * (UF[ratio] || 0.05);
  const k = width / 800;
  let from = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {project.scenes.map((sc, i) => {
        const dur = Math.max(1, Math.round(sc.d * fps));
        const f = from;
        from += dur;
        return <Sequence key={i} from={f} durationInFrames={dur}><SceneView sc={sc} u={u} k={k} width={width} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};
