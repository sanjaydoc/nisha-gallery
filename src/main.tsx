import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { listArtworks, type Artwork, type PayInfo } from './api';
import { ArtPage, Home, Nav } from './Site';
import { Admin } from './Admin';
import './styles.css';

const route = () => location.hash.replace(/^#/, '') || '/';

function App() {
  const [r, setR] = useState(route());
  const [data, setData] = useState<{ artworks: Artwork[]; pay: PayInfo } | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => { const f = () => { setR(route()); window.scrollTo(0, 0); }; window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  useEffect(() => { if (!r.startsWith('/admin')) listArtworks().then(setData, (e) => setErr(e.message)); }, [r]);
  const go = (h: string) => { if (h.includes('#about')) { location.hash = '#/'; setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 50); return; } location.hash = h; };

  if (r.startsWith('/admin')) return <Admin go={go} />;
  const slug = /^\/art\/([^/?]+)/.exec(r)?.[1];
  const art = slug && data ? data.artworks.find((a) => a.slug === slug) : null;
  return <div className="ng">
    <Nav go={go} />
    {err ? <div className="ng-wrap ng-empty">{err}</div> : !data ? <div className="ng-wrap ng-empty">Loading…</div>
      : slug ? (art ? <ArtPage a={art} pay={data.pay} go={go} /> : <div className="ng-wrap ng-empty">This artwork is not here any more. <a href="#/">See all works</a></div>)
      : <Home arts={data.artworks} go={go} />}
    <footer className="ng-foot"><div className="ng-wrap">Nisha Gallery · Chennai · Pay by UPI, card or netbanking (Razorpay), or with Polygon, Ethereum, BNB, Bitcoin or Solana · <a href="#/admin">Admin</a></div></footer>
  </div>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
