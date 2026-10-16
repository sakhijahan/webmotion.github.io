import React from 'react';
import {Composition} from 'remotion';
import project from '../project.json';
import {Video} from './Video';
import {PremiumVideo, SCRIPTS} from './premium/Premium';

const even = (n) => Math.round(n / 2) * 2;
const SIZES = [['916', 1080, 1920], ['11', 1080, 1080], ['169', 1920, 1080]];

export const Root = () => {
  const ex = project.exportSettings || {};
  const fps = ex.fps || 30;
  const s = ex.resolution || 1080;
  const ratio = ex.ratio || '16:9';
  const [w, h] = ratio === '9:16' ? [s, even(s * 16 / 9)] : ratio === '1:1' ? [s, s] : [even(s * 16 / 9), s];
  const secs = project.scenes.reduce((a, x) => a + x.d, 0);
  return (
    <>
      <Composition id="WebMotion" component={Video} durationInFrames={Math.max(1, Math.round(secs * fps))} fps={fps} width={w} height={h} defaultProps={{project, ratio}} />
      {Object.keys(SCRIPTS).flatMap((name) => SIZES.map(([k, pw, ph]) => (
        <Composition key={name + k} id={name + '-' + k} component={PremiumVideo} fps={30} width={pw} height={ph}
          durationInFrames={Math.round(SCRIPTS[name].scenes.reduce((a, x) => a + x.d, 0) * 30)} defaultProps={{script: SCRIPTS[name]}} />
      )))}
    </>
  );
};
