export function Icon({ name, size = 20 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    library: <><path d="M4 4v16"/><path d="M9 4v16"/><path d="m14 5 6-1v15l-6 1z"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></>,
    album: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/></>,
    play: <path d="m8 5 11 7-11 7z" fill="currentColor"/>,
    pause: <><path d="M8 5v14M16 5v14"/></>,
    next: <><path d="m6 5 10 7-10 7z"/><path d="M18 5v14"/></>,
    prev: <><path d="m18 5-10 7 10 7z"/><path d="M6 5v14"/></>,
    volume: <><path d="M5 10H2v4h3l4 4V6z"/><path d="M13 9c1.5 1.5 1.5 4.5 0 6"/><path d="M16 6c3 3 3 9 0 12"/></>,
    logout: <><path d="M10 5H5v14h5"/><path d="M14 8l4 4-4 4M8 12h10"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    music: <><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
