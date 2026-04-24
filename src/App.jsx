import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Gamepad2, Star, Trophy, Zap, Filter, X } from "lucide-react";

const PLATFORMS = {
  ALL:    { label: "All Platforms", color: "#a855f7", glow: "#a855f733" },
  PS:     { label: "PlayStation",   color: "#0070d1", glow: "#0070d133" },
  XBOX:   { label: "Xbox",          color: "#107c10", glow: "#107c1033" },
  SWITCH: { label: "Switch 2",      color: "#e4000f", glow: "#e4000f33" },
};

// ── Brand SVG Logos ──────────────────────────────────────────────

function PSLogo({ size = 48, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* PlayStation "P" mark — iconic shape */}
      <path d="M18 34 L18 12 C18 12 24 11 27 14 C30 17 29 22 26 24 C24 25 22 25.5 22 25.5 L30 34 L26 34 L18.5 25.5 L18.5 34 Z" fill={color}/>
      <path d="M18 25.5 L22 25.5 L22 12 L18 12 Z" fill={color}/>
      {/* Underline swoosh */}
      <path d="M10 37 Q24 33 38 37 L38 39 Q24 35 10 39 Z" fill={color} opacity="0.7"/>
    </svg>
  );
}

// Proper PlayStation logo — the "P" over "S" overlap mark
function PSLogoV2({ size = 44, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <g fill={color}>
        {/* Big P */}
        <rect x="18" y="20" width="9" height="60"/>
        <rect x="27" y="20" width="22" height="9"/>
        <rect x="27" y="46" width="22" height="9"/>
        <rect x="49" y="20" width="9" height="35"/>
        {/* Small S, bottom right */}
        <path d="M58 62 L58 55 Q58 50 63 50 L76 50 L76 43 L63 43 Q53 43 53 55 L53 62 Q53 72 63 72 L76 72 L76 79 L63 79 Q53 79 53 72" stroke={color} strokeWidth="6" fill="none"/>
      </g>
    </svg>
  );
}

// PlayStation logo: proper iconic symbol (circle with P)
function PlayStationLogo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="white">
      {/* The iconic PlayStation "PS" unit mark */}
      <path d="
        M 20 72 L 20 20
        C 20 20 20 15 30 15
        C 35 15 40 17 42 24
        C 44 31 40 38 34 40
        L 28 42 L 42 72 L 34 72 L 20.5 42 L 20.5 72 Z
      "/>
      <rect x="20" y="20" width="8" height="52" fill="white"/>
      <path d="M 28 20 L 28 15 C 28 12 35 10 40 13 C 46 16 46 26 40 30 C 37 32 28 35 28 35 L 28 20 Z" fill="white"/>
      {/* Bottom S */}
      <path d="M 50 50 L 50 45 Q 50 38 57 38 L 75 38 L 75 45 L 57 45 Q 56 45 56 50 L 56 55 Q 56 60 62 60 L 75 60 L 75 67 Q 75 72 68 72 L 50 72 L 50 65 L 68 65 Q 69 65 69 60 L 57 60 Q 50 60 50 55 Z" fill="white"/>
    </svg>
  );
}

// Clean PlayStation button symbols logo
function PSSymbolLogo({ size = 40 }) {
  // The 4 PlayStation symbols: △ ○ ✕ □
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* Triangle - top, green */}
      <polygon points="40,8 50,26 30,26" fill="#5dbb63" opacity="0.9"/>
      {/* Circle - right, red */}
      <circle cx="60" cy="40" r="9" stroke="#eb4d4b" strokeWidth="3.5" fill="none"/>
      {/* Cross/X - bottom, blue */}
      <line x1="32" y1="54" x2="48" y2="70" stroke="#5b9cf6" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="48" y1="54" x2="32" y2="70" stroke="#5b9cf6" strokeWidth="3.5" strokeLinecap="round"/>
      {/* Square - left, pink */}
      <rect x="9" y="31" width="18" height="18" stroke="#e9a0c8" strokeWidth="3.5" fill="none"/>
    </svg>
  );
}

// Xbox "X" sphere logo
function XboxLogo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Outer circle */}
      <circle cx="50" cy="50" r="46" fill="#107c10" opacity="0.15" stroke="#107c10" strokeWidth="2"/>
      {/* The X mark */}
      <path d="M 22 20 C 28 20 33 23 36 27 L 50 46 L 64 27 C 67 23 72 20 78 20 C 74 26 58 44 50 54 C 42 44 26 26 22 20 Z" fill="white"/>
      <path d="M 15 78 C 20 72 38 54 50 44 C 62 54 80 72 85 78 C 79 78 74 75 71 71 L 50 48 L 29 71 C 26 75 21 78 15 78 Z" fill="white"/>
    </svg>
  );
}

// Nintendo Switch 2 logo — the Joy-Con + screen shape
function SwitchLogo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 80" fill="none">
      {/* Left Joy-Con */}
      <rect x="3" y="8" width="22" height="64" rx="11" fill="#e4000f"/>
      {/* Right Joy-Con */}
      <rect x="75" y="8" width="22" height="64" rx="11" fill="#e4000f"/>
      {/* Screen body */}
      <rect x="25" y="14" width="50" height="52" rx="4" fill="#1a1a2e" stroke="#e4000f" strokeWidth="2"/>
      {/* Screen display */}
      <rect x="29" y="18" width="42" height="44" rx="2" fill="#0a0a1a"/>
      {/* Left button */}
      <circle cx="14" cy="28" r="5" fill="white" opacity="0.9"/>
      {/* Right buttons */}
      <circle cx="86" cy="28" r="3.5" fill="#e4000f" opacity="0.8" stroke="white" strokeWidth="1.5"/>
      <circle cx="86" cy="38" r="3.5" fill="white" opacity="0.6"/>
    </svg>
  );
}

// All-platforms gamepad icon
function AllPlatformsIcon({ size = 44 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 100 70" fill="none">
      <rect x="8" y="20" width="84" height="40" rx="20" fill="none" stroke="#a855f7" strokeWidth="4"/>
      {/* D-pad */}
      <rect x="22" y="36" width="18" height="6" rx="2" fill="#a855f7"/>
      <rect x="28" y="30" width="6" height="18" rx="2" fill="#a855f7"/>
      {/* Buttons right */}
      <circle cx="72" cy="34" r="4" fill="#a855f7" opacity="0.7"/>
      <circle cx="80" cy="40" r="4" fill="#a855f7" opacity="0.9"/>
      <circle cx="64" cy="40" r="4" fill="#a855f7" opacity="0.5"/>
      <circle cx="72" cy="46" r="4" fill="#a855f7" opacity="0.6"/>
      {/* Center buttons */}
      <circle cx="44" cy="38" r="3" fill="#a855f7" opacity="0.5"/>
      <circle cx="54" cy="38" r="3" fill="#a855f7" opacity="0.5"/>
      {/* Handles */}
      <path d="M 18 55 Q 8 60 5 68 Q 20 68 28 58" fill="#a855f7" opacity="0.3"/>
      <path d="M 82 55 Q 92 60 95 68 Q 80 68 72 58" fill="#a855f7" opacity="0.3"/>
    </svg>
  );
}

function PlatformIcon({ id, size = 44 }) {
  if (id === "PS")     return <PSSymbolLogo size={size} />;
  if (id === "XBOX")   return <XboxLogo size={size} />;
  if (id === "SWITCH") return <SwitchLogo size={size} />;
  return <AllPlatformsIcon size={size} />;
}

// Pill in table rows — use simple logo + text
function PlatformPill({ platform }) {
  const cfg = PLATFORMS[platform] ?? PLATFORMS.ALL;
  const short = { PS:"PS", XBOX:"Xbox", SWITCH:"Switch", ALL:"All" }[platform] ?? platform;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider"
      style={{ background:`${cfg.color}22`, border:`1px solid ${cfg.color}66`, color:cfg.color, boxShadow:`0 0 8px ${cfg.color}44` }}>
      <PlatformMiniIcon id={platform} size={12}/>
      {short}
    </span>
  );
}

function PlatformMiniIcon({ id, size = 12 }) {
  if (id === "PS") return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <polygon points="40,6 50,24 30,24" fill="#5dbb63"/>
      <circle cx="60" cy="40" r="8" stroke="#eb4d4b" strokeWidth="3" fill="none"/>
      <line x1="31" y1="53" x2="47" y2="69" stroke="#5b9cf6" strokeWidth="3" strokeLinecap="round"/>
      <line x1="47" y1="53" x2="31" y2="69" stroke="#5b9cf6" strokeWidth="3" strokeLinecap="round"/>
      <rect x="8" y="31" width="17" height="17" stroke="#e9a0c8" strokeWidth="3" fill="none"/>
    </svg>
  );
  if (id === "XBOX") return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M22 20C28 20 33 23 36 27L50 46L64 27C67 23 72 20 78 20C74 26 58 44 50 54C42 44 26 26 22 20Z" fill="currentColor"/>
      <path d="M15 78C20 72 38 54 50 44C62 54 80 72 85 78C79 78 74 75 71 71L50 48L29 71C26 75 21 78 15 78Z" fill="currentColor"/>
    </svg>
  );
  if (id === "SWITCH") return (
    <svg width={size} height={size * 0.8} viewBox="0 0 100 80" fill="none">
      <rect x="3" y="6" width="20" height="68" rx="10" fill="currentColor"/>
      <rect x="77" y="6" width="20" height="68" rx="10" fill="currentColor"/>
      <rect x="23" y="12" width="54" height="56" rx="3" fill="none" stroke="currentColor" strokeWidth="4"/>
    </svg>
  );
  return <Gamepad2 size={size}/>;
}

function Particles() {
  const colors = ["#a855f7","#0070d1","#107c10","#e4000f","#f59e0b"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
      {Array.from({length:28},(_,i)=>(
        <motion.div key={i} className="absolute rounded-full"
          style={{ width:Math.random()*3+1, height:Math.random()*3+1, background:colors[i%5],
            left:`${Math.random()*100}%`, top:`${Math.random()*100}%` }}
          animate={{ y:[0,-30,0], opacity:[0.2,0.8,0.2], scale:[1,1.5,1] }}
          transition={{ duration:3+Math.random()*4, repeat:Infinity, delay:Math.random()*5, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}

function PlatformCard({ id, count, active, onClick }) {
  const cfg = PLATFORMS[id];
  const ref = useRef(null);
  const onMove = e => {
    const el = ref.current; if(!el) return;
    const { left,top,width,height } = el.getBoundingClientRect();
    const x=(e.clientX-left)/width-0.5, y=(e.clientY-top)/height-0.5;
    el.style.transform=`perspective(600px) rotateY(${x*15}deg) rotateX(${-y*15}deg) scale(1.05)`;
  };
  const onLeave = () => { if(ref.current) ref.current.style.transform="perspective(600px) rotateY(0) rotateX(0) scale(1)"; };
  const label = { ALL:"All Platforms", PS:"PlayStation", XBOX:"Xbox", SWITCH:"Switch 2" }[id];

  return (
    <motion.button ref={ref}
      initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
      transition={{delay:0.1*Object.keys(PLATFORMS).indexOf(id)}}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      className="relative w-40 h-44 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: active ? `linear-gradient(135deg,${cfg.color}44,${cfg.color}22)` : "rgba(255,255,255,0.04)",
        border:`1px solid ${active?cfg.color:"rgba(255,255,255,0.1)"}`,
        boxShadow: active?`0 0 30px ${cfg.glow},inset 0 0 30px ${cfg.glow}`:"none",
        transition:"box-shadow 0.3s,border-color 0.3s,transform 0.2s ease",
      }}
    >
      {/* Corner accents */}
      {[["top-2 left-2","border-l-2 border-t-2"],["top-2 right-2","border-r-2 border-t-2"],
        ["bottom-2 left-2","border-l-2 border-b-2"],["bottom-2 right-2","border-r-2 border-b-2"]]
        .map(([pos,border],i)=>(
          <div key={i} className={`absolute ${pos} w-3 h-3 ${border}`} style={{borderColor:cfg.color,opacity:0.6}}/>
        ))}

      {/* Logo area */}
      <div className="flex items-center justify-center mb-3 w-14 h-14 rounded-full"
        style={{
          background: id === "ALL" ? "rgba(168,85,247,0.12)" : `${cfg.color}18`,
          boxShadow: active ? `0 0 22px ${cfg.color}66` : "none",
          transition: "box-shadow 0.3s",
        }}>
        <PlatformIcon id={id} size={id === "SWITCH" ? 38 : 36} />
      </div>

      <p className="text-white font-bold text-xs tracking-wide leading-tight text-center px-2">{label}</p>
      <p className="text-xs mt-1" style={{color: active ? cfg.color : "#6b7280"}}>
        {count} {count===1?"game":"games"}
      </p>

      {active && (
        <motion.div className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{background:`linear-gradient(90deg,transparent,${cfg.color},transparent)`}}
          animate={{opacity:[0.5,1,0.5]}} transition={{duration:1.5,repeat:Infinity}}/>
      )}
    </motion.button>
  );
}

function GameRow({ game, index }) {
  return (
    <motion.tr initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}
      transition={{duration:0.22,delay:Math.min(index*0.025,0.4)}}
      className="group border-t" style={{borderColor:"rgba(255,255,255,0.05)"}}>
      <td className="px-5 py-3.5 font-medium text-white group-hover:text-purple-300 transition-colors text-sm">
        <div className="flex items-center gap-2">
          {game.collector&&<Star size={12} className="text-yellow-400 fill-yellow-400 shrink-0"/>}
          {game.name}
        </div>
      </td>
      <td className="px-5 py-3.5"><PlatformPill platform={game.console}/></td>
      <td className="px-5 py-3.5">
        {game.collector ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{background:"linear-gradient(135deg,#f59e0b33,#ef444433)",border:"1px solid #f59e0b66",color:"#f59e0b",boxShadow:"0 0 10px #f59e0b33"}}>
            <Trophy size={10}/> Collector
          </span>
        ) : <span className="text-gray-600 text-xs">Standard</span>}
      </td>
    </motion.tr>
  );
}

export default function GameLibraryApp() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [glitch, setGlitch] = useState(false);

  const toTitleCase = s => s?.trim().toLowerCase().split(/\s+/)
    .map(w=>["of","the","and","in","on"].includes(w)?w:w.charAt(0).toUpperCase()+w.slice(1)).join(" ");

  useEffect(()=>{
    fetch("https://opensheet.elk.sh/1G66a7iv9rM3W5oXpQ6OiWm34B3vPd_-aj3pARmHBg6k/1")
      .then(r=>r.json()).then(data=>{
        setGames(data.map((g,i)=>({id:i,name:toTitleCase(g.Name),console:g.Console,collector:String(g.Collector).toLowerCase()==="true"}))
          .sort((a,b)=>a.name.localeCompare(b.name)));
        setLoading(false);
      }).catch(e=>{console.error(e);setLoading(false);});
  },[]);

  useEffect(()=>{
    const t=setInterval(()=>{setGlitch(true);setTimeout(()=>setGlitch(false),180);},7000);
    return()=>clearInterval(t);
  },[]);

  const filtered = games.filter(g=>
    g.name.toLowerCase().includes(search.toLowerCase()) &&
    (platformFilter==="ALL"||g.console===platformFilter)
  );

  const counts = { ALL:games.length, PS:games.filter(g=>g.console==="PS").length,
    XBOX:games.filter(g=>g.console==="XBOX").length, SWITCH:games.filter(g=>g.console==="SWITCH").length };

  const ap = PLATFORMS[platformFilter];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box}
        body{background:#030308;font-family:'Rajdhani',sans-serif;margin:0}
        .glitch{animation:ga 0.18s steps(2) forwards}
        @keyframes ga{
          0%{clip-path:inset(20% 0 60% 0);transform:translate(-4px,0)}
          33%{clip-path:inset(60% 0 10% 0);transform:translate(4px,0);color:#0070d1}
          66%{clip-path:inset(10% 0 80% 0);transform:translate(-2px,0);color:#e4000f}
          100%{clip-path:inset(0 0 0 0);transform:translate(0,0)}
        }
        .hex-bg{
          background-image:
            linear-gradient(rgba(168,85,247,0.04) 1px,transparent 1px),
            linear-gradient(90deg,rgba(168,85,247,0.04) 1px,transparent 1px);
          background-size:50px 50px;
        }
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#0a0a12}
        ::-webkit-scrollbar-thumb{background:#a855f755;border-radius:3px}
        tr:hover td{background:rgba(168,85,247,0.05)}
        .ni:focus{box-shadow:0 0 0 1px #a855f7,0 0 20px #a855f733;outline:none}
        @keyframes pulse2{0%,100%{opacity:0.4}50%{opacity:0.8}}
        .skel{animation:pulse2 1.5s ease-in-out infinite;border-radius:4px;background:rgba(255,255,255,0.06)}
      `}</style>

      <div className="relative min-h-screen hex-bg text-white overflow-x-hidden" style={{background:"#030308"}}>
        <Particles/>
        <div className="pointer-events-none fixed inset-0 opacity-[0.025]" style={{zIndex:10,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,1) 2px,rgba(255,255,255,1) 4px)"}}/>

        <div className="relative max-w-5xl mx-auto px-4 py-12" style={{zIndex:20}}>

          {/* HEADER */}
          <motion.div initial={{opacity:0,y:-40}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-5">
              <motion.div className="h-px flex-1 max-w-32" style={{background:"linear-gradient(90deg,transparent,#a855f7)"}} initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:0.4,duration:0.6}}/>
              <Gamepad2 size={18} className="text-purple-400"/>
              <motion.div className="h-px flex-1 max-w-32" style={{background:"linear-gradient(90deg,#a855f7,transparent)"}} initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:0.4,duration:0.6}}/>
            </div>
            <h1 className={`text-5xl md:text-7xl font-black tracking-widest uppercase mb-2 ${glitch?"glitch":""}`}
              style={{fontFamily:"'Orbitron',monospace",background:"linear-gradient(135deg,#ffffff 0%,#a855f7 50%,#0070d1 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",filter:"drop-shadow(0 0 30px rgba(168,85,247,0.4))"}}>
              Game Vault
            </h1>
            <p className="text-gray-500 text-xs tracking-[0.35em] uppercase mt-2 mb-6">Personal Collection · {loading?"…":games.length} Titles</p>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}} className="flex justify-center gap-4 text-xs tracking-widest uppercase flex-wrap">
              {[{label:"Total",value:games.length,icon:<Gamepad2 size={11}/>,c:"#a855f7"},{label:"Collector",value:games.filter(g=>g.collector).length,icon:<Star size={11}/>,c:"#f59e0b"},{label:"Platforms",value:3,icon:<Zap size={11}/>,c:"#0070d1"}]
                .map(s=>(
                  <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{background:`${s.c}11`,border:`1px solid ${s.c}33`,color:s.c}}>
                    {s.icon}<span className="font-bold">{loading?"–":s.value}</span><span className="text-gray-600">{s.label}</span>
                  </div>
                ))}
            </motion.div>
          </motion.div>

          {/* PLATFORM CARDS */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.keys(PLATFORMS).map(id=>(
              <PlatformCard key={id} id={id} count={counts[id]??0} active={platformFilter===id}
                onClick={()=>setPlatformFilter(platformFilter===id&&id!=="ALL"?"ALL":id)}/>
            ))}
          </div>

          {/* SEARCH */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}} className="relative max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500" size={15}/>
              <input className="ni w-full pl-11 pr-10 py-3.5 rounded-xl text-sm text-white placeholder-gray-600 transition-all duration-300"
                style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(168,85,247,0.3)",fontFamily:"'Rajdhani',sans-serif",letterSpacing:"0.05em"}}
                placeholder="Search your collection…" value={search} onChange={e=>setSearch(e.target.value)}/>
              {search&&<button onClick={()=>setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"><X size={13}/></button>}
            </div>
            <AnimatePresence>
              {platformFilter!=="ALL"&&(
                <motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} className="absolute -bottom-7 left-0 flex items-center gap-2 text-xs">
                  <Filter size={10} style={{color:ap.color}}/>
                  <span style={{color:ap.color}}>Filtered: {{ PS:"PlayStation", XBOX:"Xbox", SWITCH:"Switch 2" }[platformFilter]}</span>
                  <button onClick={()=>setPlatformFilter("ALL")} className="text-gray-600 hover:text-white transition-colors underline underline-offset-2">clear</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* TABLE */}
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.6}} className="rounded-2xl overflow-hidden"
            style={{border:"1px solid rgba(168,85,247,0.2)",background:"rgba(10,10,20,0.85)",backdropFilter:"blur(20px)",boxShadow:"0 0 60px rgba(168,85,247,0.07),0 20px 60px rgba(0,0,0,0.5)"}}>
            <div className="px-5 py-3 flex items-center justify-between border-b"
              style={{borderColor:"rgba(168,85,247,0.15)",background:"rgba(168,85,247,0.06)"}}>
              <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-purple-400 font-bold" style={{fontFamily:"'Orbitron',monospace"}}>
                <span className="w-2 h-2 rounded-full" style={{background:"#a855f7",boxShadow:"0 0 8px #a855f7"}}/>
                Collection
              </div>
              <span className="text-xs text-gray-600 tracking-wider">{loading?"Loading…":`${filtered.length} / ${games.length} titles`}</span>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  {["Game Title","Platform","Edition"].map(h=>(
                    <th key={h} className="px-5 py-3 text-left text-gray-600 font-semibold" style={{fontFamily:"'Orbitron',monospace",fontSize:"0.6rem",letterSpacing:"0.15em",textTransform:"uppercase"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="sync">
                  {loading ? Array.from({length:8}).map((_,i)=>(
                    <motion.tr key={`s${i}`} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}}>
                      {[1,2,3].map(j=>(
                        <td key={j} className="px-5 py-4"><div className="skel h-3" style={{width:j===1?"60%":j===2?"25%":"35%"}}/></td>
                      ))}
                    </motion.tr>
                  )) : filtered.length===0 ? (
                    <tr><td colSpan={3} className="px-5 py-16 text-center text-gray-600">
                      <Gamepad2 size={30} className="mx-auto mb-3 opacity-20"/>
                      <p className="text-sm tracking-wider">No games found</p>
                    </td></tr>
                  ) : filtered.map((g,i)=><GameRow key={g.id} game={g} index={i}/>)}
                </AnimatePresence>
              </tbody>
            </table>
            {!loading&&filtered.length>0&&(
              <div className="px-5 py-3 border-t text-xs text-gray-700 text-right tracking-wider" style={{borderColor:"rgba(255,255,255,0.05)"}}>
                {filtered.filter(g=>g.collector).length} collector editions in view
              </div>
            )}
          </motion.div>

          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1}}
            className="text-center mt-10 text-xs text-gray-800 tracking-widest uppercase"
            style={{fontFamily:"'Orbitron',monospace"}}>
            Game Vault · Personal Collection
          </motion.p>
        </div>
      </div>
    </>
  );
}
