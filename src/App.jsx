import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Gamepad2, Star, Trophy, Zap, Filter, X } from "lucide-react";

const PLATFORMS = {
  ALL:    { label: "All Platforms", color: "#a855f7", glow: "#a855f733", short: "ALL"  },
  PS:     { label: "PlayStation",   color: "#0070d1", glow: "#0070d133", short: "PS"   },
  XBOX:   { label: "Xbox",          color: "#107c10", glow: "#107c1033", short: "X"    },
  SWITCH: { label: "Switch 2",      color: "#e4000f", glow: "#e4000f33", short: "S2"   },
};

function Particles() {
  const colors = ["#a855f7","#0070d1","#107c10","#e4000f","#f59e0b"];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{zIndex:0}}>
      {Array.from({length:28},(_,i)=>(
        <motion.div key={i} className="absolute rounded-full"
          style={{
            width: Math.random()*3+1, height: Math.random()*3+1,
            background: colors[i%5],
            left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
          }}
          animate={{ y:[0,-30,0], opacity:[0.2,0.8,0.2], scale:[1,1.5,1] }}
          transition={{ duration:3+Math.random()*4, repeat:Infinity, delay:Math.random()*5, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}

function PlatformPill({ platform }) {
  const cfg = PLATFORMS[platform] ?? PLATFORMS.ALL;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase"
      style={{ background:`${cfg.color}22`, border:`1px solid ${cfg.color}66`, color:cfg.color, boxShadow:`0 0 8px ${cfg.color}44` }}>
      {cfg.short}
    </span>
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
  return (
    <motion.button ref={ref}
      initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
      transition={{delay:0.1*Object.keys(PLATFORMS).indexOf(id)}}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      className="relative w-40 h-40 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: active ? `linear-gradient(135deg,${cfg.color}44,${cfg.color}22)` : "rgba(255,255,255,0.04)",
        border:`1px solid ${active?cfg.color:"rgba(255,255,255,0.1)"}`,
        boxShadow: active?`0 0 30px ${cfg.glow},inset 0 0 30px ${cfg.glow}`:"none",
        transition:"box-shadow 0.3s,border-color 0.3s,transform 0.2s ease",
      }}
    >
      {[["top-2 left-2","border-l-2 border-t-2"],["top-2 right-2","border-r-2 border-t-2"],
        ["bottom-2 left-2","border-l-2 border-b-2"],["bottom-2 right-2","border-r-2 border-b-2"]]
        .map(([pos,border],i)=>(
          <div key={i} className={`absolute ${pos} w-3 h-3 ${border}`} style={{borderColor:cfg.color,opacity:0.6}}/>
        ))}
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black mb-2"
        style={{ background:`linear-gradient(135deg,${cfg.color},${cfg.color}88)`, boxShadow:`0 0 20px ${cfg.color}88`, fontFamily:"'Orbitron',monospace" }}>
        {cfg.short}
      </div>
      <p className="text-white font-bold text-xs tracking-wide">{cfg.label}</p>
      <p className="text-xs mt-1" style={{color:cfg.color}}>{count} {count===1?"game":"games"}</p>
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
        {/* scanlines */}
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
                  <span style={{color:ap.color}}>Filtered: {ap.label}</span>
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
