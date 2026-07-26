import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "./api";
import { Icon } from "./icons";

const gradients = [
  "linear-gradient(145deg,#764ba2,#d66d75)",
  "linear-gradient(145deg,#1d976c,#93f9b9)",
  "linear-gradient(145deg,#4568dc,#b06ab3)",
  "linear-gradient(145deg,#e65c00,#f9d423)",
  "linear-gradient(145deg,#134e5e,#71b280)",
  "linear-gradient(145deg,#c33764,#1d2671)",
];

const getId = (item) => item?._id || item?.id;
const artistName = (artist) => artist?.username || "Independent artist";

function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", roles: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = mode === "login"
        ? { username: form.username, password: form.password }
        : form;
      const data = await api(`/auth/${mode}`, { method: "POST", body: JSON.stringify(payload) });
      if (mode === "register") {
        const login = await api("/auth/login", {
          method: "POST",
          body: JSON.stringify({ username: form.username, password: form.password }),
        });
        onAuth(login.user);
      } else {
        onAuth(data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-art">
        <div className="brand"><span className="brand-mark"><Icon name="music" /></span> PULSE</div>
        <div className="orb orb-one" /><div className="orb orb-two" />
        <div className="auth-copy">
          <span className="eyebrow">YOUR SOUND. YOUR SPACE.</span>
          <h1>Every beat<br />belongs <em>here.</em></h1>
          <p>Stream fresh releases, build your library, and turn every moment into a soundtrack.</p>
        </div>
        <div className="wave">{Array.from({ length: 32 }, (_, i) => <i key={i} style={{ height: `${15 + ((i * 17) % 60)}px` }} />)}</div>
      </section>
      <section className="auth-panel">
        <form className="auth-card" onSubmit={submit}>
          <span className="mobile-brand">PULSE</span>
          <h2>{mode === "login" ? "Welcome back" : "Join the rhythm"}</h2>
          <p>{mode === "login" ? "Sign in to continue listening." : "Create an account and start exploring."}</p>
          {error && <div className="alert">{error}</div>}
          <label>Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Your username" /></label>
          {mode === "register" && <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>}
          <label>Password<input required minLength="6" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /></label>
          {mode === "register" && <div className="role-picker"><button type="button" className={form.roles === "user" ? "active" : ""} onClick={() => setForm({ ...form, roles: "user" })}>Listener</button><button type="button" className={form.roles === "artist" ? "active" : ""} onClick={() => setForm({ ...form, roles: "artist" })}>Artist</button></div>}
          <button className="primary-btn" disabled={loading}>{loading ? "One moment…" : mode === "login" ? "Sign in" : "Create account"} <Icon name="chevron" /></button>
          <div className="switch-auth">{mode === "login" ? "New to Pulse?" : "Already have an account?"}<button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "Create account" : "Sign in"}</button></div>
        </form>
      </section>
    </main>
  );
}

function Sidebar({ view, setView, user, onOpenModal }) {
  const items = [["home", "Home"], ["search", "Search"], ["library", "Your Library"]];
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark"><Icon name="music" /></span> PULSE</div>
    <nav>{items.map(([icon, label]) => <button key={label} className={view === label ? "active" : ""} onClick={() => setView(label)}><Icon name={icon} />{label}</button>)}</nav>
    {user.roles === "artist" && <div className="artist-tools"><small>ARTIST STUDIO</small><button onClick={() => onOpenModal("upload")}><span><Icon name="upload" /></span>Upload music</button><button onClick={() => onOpenModal("album")}><span><Icon name="album" /></span>Create album</button></div>}
    <div className="sidebar-foot"><div className="avatar">{user.username?.[0]?.toUpperCase()}</div><div><strong>{user.username}</strong><span>{user.roles}</span></div></div>
  </aside>;
}

function TrackRow({ track, index, current, playing, onPlay }) {
  const active = getId(current) === getId(track);
  return <button className={`track-row ${active ? "active" : ""}`} onClick={() => onPlay(track)}>
    <span className="track-index">{active && playing ? <span className="equalizer"><i/><i/><i/></span> : String(index + 1).padStart(2, "0")}</span>
    <span className="mini-cover" style={{ background: gradients[index % gradients.length] }}><Icon name="music" size={18}/></span>
    <span className="track-main"><strong>{track.title}</strong><small>{artistName(track.artist)}</small></span>
    <span className="track-album">Pulse Originals</span>
    <span className="track-time">—</span>
    <span className="row-play"><Icon name={active && playing ? "pause" : "play"} size={17}/></span>
  </button>;
}

function AlbumCard({ album, index, onOpen }) {
  return <button className="album-card" onClick={() => onOpen(album)}>
    <div className="album-cover" style={{ background: gradients[index % gradients.length] }}>
      <span>{album.title?.slice(0, 2).toUpperCase()}</span><i/><b><Icon name="play" size={20}/></b>
    </div>
    <strong>{album.title}</strong><small>{artistName(album.artist)} · {album.musics?.length || 0} tracks</small>
  </button>;
}

function Dashboard({ user, onLogout }) {
  const [view, setView] = useState("Home");
  const [music, setMusic] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [notice, setNotice] = useState("");
  const audioRef = useRef(null);

  const loadData = async () => {
    try {
      const [songsData, albumData] = await Promise.all([api("/music/"), api("/music/albums")]);
      setMusic(songsData.music || []);
      setAlbums(albumData.albums || []);
    } catch (err) { setNotice(err.message); }
  };
  useEffect(() => { loadData(); }, []);
  useEffect(() => {
    if (!audioRef.current || !current) return;
    audioRef.current.src = current.uri;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [current]);

  const play = (track) => {
    if (getId(track) === getId(current)) {
      if (playing) audioRef.current.pause(); else audioRef.current.play();
      setPlaying(!playing);
    } else setCurrent(track);
  };
  const filtered = useMemo(() => music.filter((song) => `${song.title} ${artistName(song.artist)}`.toLowerCase().includes(query.toLowerCase())), [music, query]);
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return <div className="app-shell">
    <Sidebar view={view} setView={setView} user={user} onOpenModal={setModal} />
    <main className="content">
      <header><div className="history"><button>‹</button><button>›</button></div><div className="header-actions">{view === "Search" && <div className="search-box"><Icon name="search"/><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="What do you want to play?"/></div>}<button className="user-pill"><span>{user.username?.[0]?.toUpperCase()}</span>{user.username}</button><button className="icon-btn" onClick={onLogout} title="Log out"><Icon name="logout"/></button></div></header>
      {notice && <div className="toast" onClick={() => setNotice("")}>{notice}</div>}
      {selectedAlbum ? <AlbumDetail album={selectedAlbum} onBack={() => setSelectedAlbum(null)} onPlay={play} current={current} playing={playing}/> :
      view === "Search" ? <SearchView query={query} tracks={filtered} current={current} playing={playing} onPlay={play}/> :
      view === "Your Library" ? <Library albums={albums} music={music} onOpen={setSelectedAlbum} onPlay={play} current={current} playing={playing}/> :
      <Home greeting={greeting} user={user} music={music} albums={albums} current={current} playing={playing} onPlay={play} onOpen={setSelectedAlbum}/>}
    </main>
    <Player audioRef={audioRef} current={current} playing={playing} setPlaying={setPlaying} tracks={music} setCurrent={setCurrent}/>
    {modal && <CreateModal type={modal} tracks={music} onClose={() => setModal(null)} onCreated={() => { setModal(null); loadData(); setNotice(modal === "upload" ? "Track published successfully" : "Album created successfully"); }}/>}
  </div>;
}

function Home({ greeting, user, music, albums, current, playing, onPlay, onOpen }) {
  return <div className="page home-page">
    <section className="hero"><div><span className="eyebrow">CURATED FOR {user.username?.toUpperCase()}</span><h1>{greeting},<br/><em>{user.username}.</em></h1><p>Fresh sounds, familiar favorites, and everything in between.</p>{music[0] && <button className="hero-play" onClick={() => onPlay(music[0])}><Icon name="play"/>Start listening</button>}</div><div className="hero-vinyl"><div className="vinyl"><i/><span>PULSE<br/><small>SELECTS</small></span></div></div></section>
    <SectionTitle title="Recently added" subtitle="New sounds in your world"/>
    <div className="track-list">{music.length ? music.slice(0, 6).map((track, i) => <TrackRow key={getId(track)} track={track} index={i} current={current} playing={playing} onPlay={onPlay}/>) : <Empty text="No music has been uploaded yet."/>}</div>
    <SectionTitle title="Albums to explore" subtitle="Made for unhurried listening"/>
    <div className="album-grid">{albums.length ? albums.map((album, i) => <AlbumCard key={getId(album)} album={album} index={i} onOpen={onOpen}/>) : <Empty text="Albums will appear here."/ >}</div>
  </div>;
}

function SearchView({ query, tracks, current, playing, onPlay }) {
  return <div className="page"><div className="page-heading"><span className="eyebrow">DISCOVER</span><h1>{query ? `Results for “${query}”` : "Find your next favorite"}</h1><p>Search songs and artists across Pulse.</p></div><div className="track-list">{query ? tracks.map((t,i)=><TrackRow key={getId(t)} track={t} index={i} current={current} playing={playing} onPlay={onPlay}/>) : <div className="search-prompt"><Icon name="search" size={42}/><span>Start typing to search the catalogue</span></div>}</div></div>;
}

function Library({ albums, music, onOpen, ...playerProps }) {
  return <div className="page"><div className="page-heading"><span className="eyebrow">YOUR COLLECTION</span><h1>Your Library</h1><p>{music.length} tracks · {albums.length} albums</p></div><SectionTitle title="Albums"/><div className="album-grid">{albums.map((a,i)=><AlbumCard key={getId(a)} album={a} index={i} onOpen={onOpen}/>)}</div><SectionTitle title="All tracks"/><div className="track-list">{music.map((t,i)=><TrackRow key={getId(t)} track={t} index={i} {...playerProps}/>)}</div></div>;
}

function AlbumDetail({ album, onBack, onPlay, current, playing }) {
  return <div className="page album-detail"><button className="back-link" onClick={onBack}>← Back to albums</button><section className="album-hero"><div className="large-cover" style={{background:gradients[2]}}>{album.title?.slice(0,2).toUpperCase()}</div><div><span className="eyebrow">ALBUM</span><h1>{album.title}</h1><p>By {artistName(album.artist)} · {album.musics?.length || 0} tracks</p>{album.musics?.[0] && <button className="round-play" onClick={()=>onPlay(album.musics[0])}><Icon name="play"/></button>}</div></section><div className="track-list">{album.musics?.map((t,i)=><TrackRow key={getId(t)} track={t} index={i} current={current} playing={playing} onPlay={onPlay}/>)}</div></div>;
}

function SectionTitle({ title, subtitle }) { return <div className="section-title"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></div>; }
function Empty({ text }) { return <div className="empty"><Icon name="music" size={30}/><span>{text}</span></div>; }

function CreateModal({ type, tracks, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      if (type === "upload") {
        const body = new FormData(); body.append("title", title); body.append("music", file);
        await api("/music/upload", { method: "POST", body });
      } else {
        await api("/music/albums", { method: "POST", body: JSON.stringify({ title, musics: selected }) });
      }
      onCreated();
    } catch (err) { setError(err.message); setLoading(false); }
  };
  return <div className="modal-backdrop" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}><form className="modal" onSubmit={submit}><button type="button" className="modal-close" onClick={onClose}><Icon name="close"/></button><span className="eyebrow">ARTIST STUDIO</span><h2>{type === "upload" ? "Upload a new track" : "Create an album"}</h2><p>{type === "upload" ? "Share your sound with everyone on Pulse." : "Group your tracks into a new release."}</p>{error && <div className="alert">{error}</div>}<label>Title<input required value={title} onChange={(e)=>setTitle(e.target.value)} placeholder={type === "upload" ? "Track title" : "Album title"}/></label>{type === "upload" ? <label className="file-drop"><Icon name="upload" size={28}/><strong>{file?.name || "Choose an audio file"}</strong><span>MP3, WAV, M4A or OGG</span><input required type="file" accept="audio/*" onChange={(e)=>setFile(e.target.files[0])}/></label> : <div className="track-picker">{tracks.map((t)=><label key={getId(t)}><input type="checkbox" checked={selected.includes(getId(t))} onChange={()=>setSelected(selected.includes(getId(t))?selected.filter(id=>id!==getId(t)):[...selected,getId(t)])}/><span>{t.title}<small>{artistName(t.artist)}</small></span></label>)}</div>}<button className="primary-btn" disabled={loading || (type==="album"&&!selected.length)}>{loading ? "Publishing…" : type === "upload" ? "Publish track" : "Create album"}</button></form></div>;
}

function Player({ audioRef, current, playing, setPlaying, tracks, setCurrent }) {
  const [progress, setProgress] = useState(0); const [duration, setDuration] = useState(0);
  const jump = (direction) => { const i=tracks.findIndex(t=>getId(t)===getId(current)); if(i<0)return; setCurrent(tracks[(i+direction+tracks.length)%tracks.length]); };
  const format=(s)=>Number.isFinite(s)?`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`:"0:00";
  return <footer className="player"><audio ref={audioRef} onTimeUpdate={(e)=>setProgress(e.currentTarget.currentTime)} onLoadedMetadata={(e)=>setDuration(e.currentTarget.duration)} onEnded={()=>jump(1)} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/><div className="now-playing"><span className="player-cover" style={{background:gradients[0]}}><Icon name="music"/></span><div><strong>{current?.title || "Choose a track"}</strong><small>{current ? artistName(current.artist) : "Pulse"}</small></div></div><div className="player-center"><div className="controls"><button onClick={()=>jump(-1)}><Icon name="prev"/></button><button className="main-control" disabled={!current} onClick={()=>{if(playing)audioRef.current.pause();else audioRef.current.play();}}><Icon name={playing?"pause":"play"}/></button><button onClick={()=>jump(1)}><Icon name="next"/></button></div><div className="timeline"><span>{format(progress)}</span><input type="range" min="0" max={duration||0} value={progress} onChange={(e)=>{audioRef.current.currentTime=e.target.value;setProgress(+e.target.value)}}/><span>{format(duration)}</span></div></div><div className="volume"><Icon name="volume"/><input type="range" min="0" max="1" step=".01" defaultValue=".8" onChange={(e)=>{audioRef.current.volume=e.target.value}}/></div></footer>;
}

export default function App() {
  const [user, setUser] = useState(null); const [checking, setChecking] = useState(true);
  useEffect(()=>{api("/auth/me").then(d=>setUser(d.user)).catch(()=>{}).finally(()=>setChecking(false));},[]);
  const logout=async()=>{await api("/auth/logout",{method:"POST"}).catch(()=>{});setUser(null);};
  if(checking)return <div className="splash"><div className="brand-mark"><Icon name="music" size={30}/></div><span>PULSE</span></div>;
  return user?<Dashboard user={user} onLogout={logout}/>:<Auth onAuth={setUser}/>;
}
