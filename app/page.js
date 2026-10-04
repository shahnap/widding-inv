'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { D } from './data';

const ease = [0.22, 1, 0.36, 1];

/* Scroll-linked: slides in from the left / right / bottom to the centre */
function Side({ from = 'left', children, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 100%', 'start 62%'] });
  const x = useTransform(scrollYProgress, [0, 1], [from === 'left' ? -170 : from === 'right' ? 170 : 0, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [from === 'up' ? 60 : 0, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);
  return <motion.div ref={ref} className={className} style={{ x, y, opacity, willChange: 'transform, opacity' }}>{children}</motion.div>;
}
/* Botanical line art (wild grass + flowers) */
function Sprig({ x, h, lean, bloom }) {
  const P = (t) => [x + lean * t * t, 400 - h * (1.2 * t - 0.2 * t * t)];
  const [tx, ty] = P(1);
  return (
    <g>
      <path d={`M${x} 400Q${x} ${400 - h * 0.6} ${tx} ${ty}`} />
      {[0.2, 0.32, 0.44, 0.56, 0.68, 0.8].map((t) => {
        const [px, py] = P(t);
        return (
          <g key={t}>
            <path d={`M${px} ${py}q-12-3-20-20q14-1 20 20z`} />
            <path d={`M${px} ${py - 8}q12-3 20-20q-14-1-20 20z`} />
          </g>
        );
      })}
      {bloom && [-22, -11, 0, 11, 22].map((d) => (
        <g key={d}><path d={`M${tx} ${ty}L${tx + d} ${ty - 20}`} /><circle cx={tx + d} cy={ty - 22} r="2.6" /></g>
      ))}
    </g>
  );
}

function Sprigs() {
  const set = (
    <>
      <Sprig x={34} h={290} lean={-18} />
      <Sprig x={84} h={370} lean={12} bloom />
      <Sprig x={136} h={250} lean={26} />
      <Sprig x={184} h={330} lean={-8} bloom />
    </>
  );
  return (
    <>
      <svg className="sprigs l" viewBox="0 0 220 420" aria-hidden>{set}</svg>
      <svg className="sprigs r" viewBox="0 0 220 420" aria-hidden>{set}</svg>
    </>
  );
}
  function Corner() {
  const art = (
    <>
      <path d="M156 4C108 6 66 26 56 66C48 98 80 116 100 98C114 85 104 64 86 68" />
      <path d="M156 28C128 32 108 46 104 68" />
      <path d="M154 4C150 40 140 70 118 92" />
      <path d="M56 66c-22-2-34-24-36-40c24 0 36 16 36 40z" />
      <path d="M118 92c-4 22-20 34-38 40c-2-22 14-38 38-40z" />
      <circle cx="86" cy="68" r="3" /><circle cx="156" cy="52" r="2.4" /><circle cx="130" cy="14" r="2.4" />
    </>
  );
  return (
    <>
      <svg className="corner tr" viewBox="0 0 160 160" aria-hidden>{art}</svg>
      <svg className="corner bl" viewBox="0 0 160 160" aria-hidden>{art}</svg>
    </>
  );
}
function Envelope({ onOpen, startOpen }) {
  const [s, setS] = useState(startOpen ? { seal: 1, flap: 1, inn: 1, full: 1 } : { seal: 0, flap: 0, inn: 0, full: 0 });
  const [lift, setLift] = useState(!!startOpen);
  const busy = useRef(!!startOpen);
  const timers = useRef([]);
  const set = (o) => setS((p) => ({ ...p, ...o }));
  const run = (steps) => steps.forEach(([ms, fn]) => timers.current.push(setTimeout(fn, ms)));

  useEffect(() => {
    if (startOpen) {
      run([
        [500, () => set({ full: 0 })],
        [1500, () => set({ inn: 0 })],
        [2600, () => setLift(false)],
        [2800, () => set({ flap: 0 })],
        [4000, () => set({ seal: 0 })],
        [4900, () => { busy.current = false; }],
      ]);
    }
    return () => timers.current.forEach(clearTimeout);
  }, []);

 const open = () => {
  if (busy.current) return;
  busy.current = true;
  try { // go full screen on tap (hides the URL bar)
    const el = document.documentElement;
    const f = el.requestFullscreen || el.webkitRequestFullscreen;
    if (f) { const r = f.call(el); if (r && r.catch) r.catch(() => {}); }
  } catch (e) {}
  run([
    [0, () => set({ seal: 1 })],
    [1000, () => set({ flap: 1 })],
    [2200, () => set({ inn: 1 })],
    [3400, () => { setLift(true); set({ full: 1 }); }],
    [4500, onOpen],
  ]);
};

  const L = s.full
    ? { left: '0%', top: '0%', width: '100%', height: '100%', y: '0%', borderRadius: 0 }
    : { left: '8%', top: '10%', width: '84%', height: '90%', y: s.inn ? '0%' : '75%', borderRadius: 6 };

  return (
    <motion.div className="env deep grain" onClick={open}
      initial={{ opacity: startOpen ? 0 : 1 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9 } }} transition={{ duration: 0.4 }}>
      <div className="liner" />

 <motion.div className="letter deep bgimg grain" initial={false} style={{ zIndex: lift ? 6 : 2 }}
  animate={{ ...L, opacity: s.inn ? 1 : 0 }} transition={{ duration: 1.1, ease }}>
  <motion.span className="mono script gold" animate={{ opacity: s.full ? 0 : 1 }} transition={{ duration: 0.6 }}>
    A &amp; S
  </motion.span>
</motion.div>

      <div className="pocket grain">
        <Sprigs />
        <svg className="edge" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <polyline points="0,0 50,66 100,0" />
        </svg>
      </div>

      <motion.div className="flapW" initial={false}
        animate={{ rotateX: s.flap ? 180 : 0, opacity: s.flap ? [1, 1, 0] : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], opacity: { duration: 1.2, times: [0, 0.55, 0.56] } }}>
        <div className="flap grain">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <polygon className="e1" points="0,0 100,0 50,100" />
            <polygon className="e2" points="4,2.5 96,2.5 50,91" />
          </svg>
        </div>
      </motion.div>

      <motion.button className="seal" aria-label="Open invitation" initial={false}
        animate={s.seal ? { rotate: 360, scale: [1, 1.25, 0.4], opacity: [1, 1, 0], y: [0, 0, 30] } : { rotate: 0, scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}>
        <span className="script">A&amp;S</span>
      </motion.button>
      <motion.p className="tap" initial={false} animate={{ opacity: s.seal ? 0 : 1 }} transition={{ duration: 0.5 }}>
        Tap to open
      </motion.p>
    </motion.div>
  );
}

function Countdown() {
  const [t, setT] = useState(null);
  useEffect(() => {
    const tick = () => {
      const s = Math.max(0, Math.floor((new Date(D.start) - Date.now()) / 1000));
      setT({ Days: Math.floor(s / 86400), Hours: Math.floor((s % 86400) / 3600), Minutes: Math.floor((s % 3600) / 60), Seconds: s % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="count">
      {['Days', 'Hours', 'Minutes', 'Seconds'].map((k) => (
        <div key={k}><b>{t ? String(t[k]).padStart(2, '0') : '--'}</b><span>{k}</span></div>
      ))}
    </div>
  );
}

export default function Page() {
  const [opened, setOpened] = useState(false);
  const [showEnv, setShowEnv] = useState(true);
  const [round, setRound] = useState(0);
  const [startOpen, setStartOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = opened ? '' : 'hidden'; }, [opened]);

  const close = () => {
    setStartOpen(true); setShowEnv(true); setOpened(false);
    setTimeout(() => { window.scrollTo(0, 0); setRound((r) => r + 1); }, 500);
  };

  const show = (d) => ({
    initial: { opacity: 0, x: d },
    animate: opened ? { opacity: 1, x: 0 } : {},
    transition: { duration: 1.4, ease, delay: 0.2 },
  });

  return (
    <>
   <main className={opened ? 'on' : ''}>
  <div className="bgfixed" aria-hidden />

  <section className="hero" key={round}>
    <motion.p className="small" initial={{ opacity: 0 }} animate={opened ? { opacity: 1 } : {}} transition={{ duration: 1.2 }}>
      Wedding Reception
    </motion.p>
    <motion.h1 className="script gold" {...show(-140)}>{D.groom}</motion.h1>
    <motion.span className="amp script" initial={{ opacity: 0, scale: 0.3 }} animate={opened ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.2, delay: 0.7, ease }}>&amp;</motion.span>
    <motion.h1 className="script gold" {...show(140)}>{D.bride}</motion.h1>
    <motion.p className="small down" initial={{ opacity: 0 }} animate={opened ? { opacity: 1 } : {}} transition={{ delay: 1.8, duration: 1 }}>
      Scroll<i />
    </motion.p>
  </section>

  <section className="sec">
    <Side from="up"><p className="blessing">With joy and blessings of our family elders,<br /><b>{D.hosts}</b><br />cordially invite you to the wedding reception of our son</p></Side>
    <Side from="left"><h2 className="script gold">{D.groom}</h2><p className="fam">{D.groomLine}</p></Side>
    <Side from="up"><span className="amp script">&amp;</span></Side>
    <Side from="right"><h2 className="script gold">{D.bride}</h2><p className="fam">{D.brideLine}</p></Side>
  </section>

  <section className="sec">
    <Side from="up"><h3 className="script gold">Countdown</h3><Countdown /></Side>
  </section>

  <section className="sec">
    <div className="datebox">
      <Side from="left"><div className="side"><span>{D.day}</span></div></Side>
      <Side from="up"><div className="mid"><small>{D.month}</small><strong className="gold">{D.date}</strong><small>{D.year}</small></div></Side>
      <Side from="right"><div className="side"><span>{D.time}</span></div></Side>
    </div>
    <Side from="up">
      <h3 className="venue">{D.venue}</h3>
      <p className="fam">{D.address}</p>
      <div className="btns">
        <a href={D.mapsUrl} target="_blank" rel="noreferrer">Open in Maps</a>
      </div>
    </Side>
  </section>

  <section className="sec last">
    <Side from="up"><p className="note">{D.weddingNote}</p></Side>
    <Side from="left"><p className="big gold">We look forward to celebrating</p></Side>
    <Side from="right"><p className="big gold">with you at the reception.</p></Side>
    <Side from="up"><p className="fam">Best compliments: {D.compliments}</p></Side>
  </section>
</main>

      <AnimatePresence>
        {opened && (
          <motion.button key="x" className="closeBtn" aria-label="Close invitation" onClick={close}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }} transition={{ delay: 1.2 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence onExitComplete={() => setShowEnv(false)}>
        {showEnv && !opened && (
          <Envelope startOpen={startOpen} onOpen={() => { setStartOpen(false); setOpened(true); }} />
        )}
      </AnimatePresence>
    </>
  );
}