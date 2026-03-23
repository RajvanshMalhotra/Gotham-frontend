// import { useState, useEffect, useRef, useCallback } from "react";

// // ─────────────────────────────────────────────────────────────────────────────
// // GOTHAM ORBITAL v9 — CesiumJS Edition
// // Photorealistic Earth · 3D orbital paths · Satellite markers · Palantir UI
// // ─────────────────────────────────────────────────────────────────────────────

// const SAT_CATALOG = [
//   { id:"ISS",        name:"ISS (ZARYA)",      owner:"NASA/Roscosmos", color:"#00eeff", orbitColor:"#00eeff", threat:0, type:"CIVILIAN"    },
//   { id:"TIANGONG",   name:"CSS Tiangong",     owner:"CNSA",           color:"#ffcc00", orbitColor:"#ffcc00", threat:1, type:"MILITARY"    },
//   { id:"NOAA19",     name:"NOAA-19",          owner:"NOAA",           color:"#44ffaa", orbitColor:"#44ffaa", threat:0, type:"WEATHER"     },
//   { id:"TERRA",      name:"Terra EOS AM-1",   owner:"NASA",           color:"#66ccff", orbitColor:"#66ccff", threat:0, type:"SCIENCE"     },
//   { id:"AQUA",       name:"Aqua EOS PM-1",    owner:"NASA",           color:"#4488ff", orbitColor:"#4488ff", threat:0, type:"SCIENCE"     },
//   { id:"SENTINEL2B", name:"Sentinel-2B",      owner:"ESA",            color:"#44ff88", orbitColor:"#44ff88", threat:0, type:"OBSERVATION" },
//   { id:"STARLINK30", name:"Starlink-1007",    owner:"SpaceX",         color:"#88aacc", orbitColor:"#88aacc", threat:0, type:"COMMERCIAL"  },
//   { id:"STARLINK31", name:"Starlink-2341",    owner:"SpaceX",         color:"#88aacc", orbitColor:"#88aacc", threat:0, type:"COMMERCIAL"  },
//   { id:"IRIDIUM140", name:"IRIDIUM-140",      owner:"Iridium",        color:"#aabbcc", orbitColor:"#aabbcc", threat:0, type:"COMMERCIAL"  },
//   { id:"GPS001",     name:"GPS IIF-2",        owner:"USAF",           color:"#bb88ff", orbitColor:"#bb88ff", threat:1, type:"NAVIGATION"  },
//   { id:"GLONASS",    name:"GLONASS-M 730",    owner:"Russia",         color:"#ff4466", orbitColor:"#ff4466", threat:1, type:"NAVIGATION"  },
//   { id:"COSMOS2543", name:"COSMOS-2543",      owner:"Russia",         color:"#ff1133", orbitColor:"#ff1133", threat:3, type:"MILITARY"    },
//   { id:"YAOGAN30",   name:"YAOGAN-30F",       owner:"China/PLA",      color:"#ff8800", orbitColor:"#ff8800", threat:2, type:"MILITARY"    },
//   { id:"LACROSSE5",  name:"USA-182",          owner:"NRO",            color:"#ff6600", orbitColor:"#ff6600", threat:2, type:"INTEL"       },
// ];

// const THREAT_META = [
//   { label:"NOMINAL",  color:"#1a7a4a", bg:"#e8f5ee", border:"#a8d8bc" },
//   { label:"MONITOR",  color:"#7a6a00", bg:"#fdf7e0", border:"#d4c060" },
//   { label:"ELEVATED", color:"#8a3800", bg:"#fdf0e8", border:"#d4906a" },
//   { label:"CRITICAL", color:"#8a0015", bg:"#fde8ea", border:"#d46070" },
// ];

// const SITUATIONS = [
//   { id:"COSMOS2543", classification:"SECRET//NOFORN",              affColor:"#c0192c" },
//   { id:"YAOGAN30",   classification:"SECRET",                      affColor:"#c14b2a" },
//   { id:"ISS",        classification:"UNCLASSIFIED//FOR OFFICIAL USE ONLY", affColor:"#2a7fc1" },
// ];

// // ── Fallback TLEs ─────────────────────────────────────────────────────────────
// const FALLBACK_TLES = {
//   ISS:        { line1:"1 25544U 98067A   25074.50000000  .00006000  00000-0  11000-3 0  9991", line2:"2 25544  51.6400 110.8400 0003400  85.0000 275.1000 15.49560000498765" },
//   TIANGONG:   { line1:"1 48274U 21035A   25074.50000000  .00002800  00000-0  32000-4 0  9993", line2:"2 48274  41.4700 253.1200 0006100 181.0000 179.0000 15.61200000215432" },
//   NOAA19:     { line1:"1 33591U 09005A   25074.50000000  .00000300  00000-0  20000-3 0  9990", line2:"2 33591  99.1200  46.2300 0013400 258.0000 101.9000 14.12400000823456" },
//   TERRA:      { line1:"1 25994U 99068A   25074.50000000  .00000100  00000-0  30000-4 0  9992", line2:"2 25994  98.2100 100.5400 0001200  90.0000 270.1000 14.57300000312345" },
//   AQUA:       { line1:"1 27424U 02022A   25074.50000000  .00000100  00000-0  32000-4 0  9991", line2:"2 27424  98.2000 100.1200 0001100  85.0000 275.2000 14.57300000421234" },
//   SENTINEL2B: { line1:"1 42063U 17013A   25074.50000000  .00000100  00000-0  28000-4 0  9993", line2:"2 42063  98.5700 106.7800 0001100  90.0000 270.1000 14.30900000512345" },
//   STARLINK30: { line1:"1 44932U 19074B   25074.50000000  .00002000  00000-0  14000-3 0  9997", line2:"2 44932  53.0500  23.4500 0001400 102.0000 258.1000 15.05600000289012" },
//   STARLINK31: { line1:"1 46045U 20073C   25074.50000000  .00002100  00000-0  15000-3 0  9994", line2:"2 46045  53.0500  18.2300 0001200  98.0000 262.1000 15.05500000301234" },
//   IRIDIUM140: { line1:"1 43571U 18061E   25074.50000000  .00000200  00000-0  50000-4 0  9995", line2:"2 43571  86.3900 312.4500 0002100  90.0000 270.1000 14.34200000198765" },
//   GPS001:     { line1:"1 37753U 11036A   25074.50000000 -.00000100  00000-0  00000+0 0  9993", line2:"2 37753  55.4500 160.2300 0103400 245.0000 114.1000  2.00560000102345" },
//   GLONASS:    { line1:"1 39155U 13015A   25074.50000000  .00000000  00000-0  00000+0 0  9991", line2:"2 39155  64.8500 212.3400 0013400 280.0000  79.9000  2.13100000187654" },
//   COSMOS2543: { line1:"1 44547U 19075A   25074.50000000  .00000200  00000-0  00000+0 0  9998", line2:"2 44547  97.7700 101.2300 0012100  95.0000 265.2000 14.77200000298765" },
//   YAOGAN30:   { line1:"1 43163U 18010A   25074.50000000  .00000500  00000-0  50000-4 0  9992", line2:"2 43163  35.0200  85.6700 0005600 201.0000 158.9000 15.21100000412345" },
//   LACROSSE5:  { line1:"1 28646U 05016A   25074.50000000  .00000300  00000-0  00000+0 0  9990", line2:"2 28646  57.0000  92.3400 0012300 180.0000 179.9000 15.02300000301234" },
// };

// // ── Metal ticker ──────────────────────────────────────────────────────────────
// // function useMetals() {
// //   const [p,setP]=useState({gold:2347.80,silver:27.924,gd:0.12,sd:-0.031});
// //   useEffect(()=>{
// //     const iv=setInterval(()=>setP(prev=>({
// //       gold:+(prev.gold+(Math.random()-.48)*1.6).toFixed(2),
// //       silver:+(prev.silver+(Math.random()-.48)*.07).toFixed(3),
// //       gd:+((Math.random()-.48)*1.6).toFixed(2),
// //       sd:+((Math.random()-.48)*.07).toFixed(3),
// //     })),2800);
// //     return()=>clearInterval(iv);
// //   },[]);
// //   return p;
// // }
// function useMetals() {
//   const [p, setP] = useState({ gold: 0, silver: 0, gd: 0, sd: 0 });

//   useEffect(() => {
//     const fetchPrices = async () => {
//       try {
//         const API_KEY = import.meta.env.VITE_METALS_API_KEY;

//         const [goldRes, silverRes] = await Promise.all([
//           fetch("https://www.goldapi.io/api/XAU/USD", {
//             headers: { "x-access-token": API_KEY, "Content-Type": "application/json" }
//           }),
//           fetch("https://www.goldapi.io/api/XAG/USD", {
//             headers: { "x-access-token": API_KEY, "Content-Type": "application/json" }
//           })
//         ]);

//         const goldData   = await goldRes.json();
//         const silverData = await silverRes.json();

//         const gold   = +goldData.price.toFixed(2);
//         const silver = +silverData.price.toFixed(3);

//         setP(prev => ({
//           gold,
//           silver,
//           gd: +(goldData.ch).toFixed(2),   // use API's own change value
//           sd: +(silverData.ch).toFixed(3),  // use API's own change value
//         }));
//       } catch (e) {
//         console.warn("Metals fetch failed:", e.message);
//       }
//     };

//     fetchPrices(); // fetch immediately on load
//     const iv = setInterval(fetchPrices, 28800000); // then every 8 hours
//     return () => clearInterval(iv);
//   }, []);

//   return p;
// }


// // ── Backend helpers ───────────────────────────────────────────────────────────
// async function apiAgent(url,sec,groq,tav,role,msg,snap){
//   const r=await fetch(`${url}/agent`,{
//     method:"POST",
//     headers:{"Content-Type":"application/json","x-api-key":sec,"x-groq-key":groq,"x-tavily-key":tav},
//     body:JSON.stringify({role,user_message:msg,satellite_snapshot:snap}),
//   });
//   if(!r.ok)throw new Error(`HTTP ${r.status}`);
//   const d=await r.json();
//   return d.response||d.output||d.result||d.message||JSON.stringify(d);
// }

// async function apiQuery(url,sec,groq,tav,query,snap){
//   const r=await fetch(`${url}/intel-query`,{
//     method:"POST",
//     headers:{"Content-Type":"application/json","x-api-key":sec,"x-groq-key":groq,"x-tavily-key":tav},
//     body:JSON.stringify({query,satellite_snapshot:snap}),
//   });
//   if(!r.ok)throw new Error(`HTTP ${r.status}`);
//   const d=await r.json();
//   return{response:d.response||d.output||d.result||JSON.stringify(d),relevant_ids:d.relevant_ids||[]};
// }

// // ── SGP4 helpers ──────────────────────────────────────────────────────────────
// function propagate(satrec,t){
//   try{
//     const pv=window.satellite.propagate(satrec,t);
//     if(!pv?.position)return null;
//     const gmst=window.satellite.gstime(t);
//     const geo=window.satellite.eciToGeodetic(pv.position,gmst);
//     return{lat:window.satellite.degreesLat(geo.latitude),lon:window.satellite.degreesLong(geo.longitude),alt:geo.height};
//   }catch{return null;}
// }

// // Convert lat/lon/alt to Cesium Cartesian3
// function toCesium(Cesium,lat,lon,altKm){
//   return Cesium.Cartesian3.fromDegrees(lon, lat, altKm * 1000);
// }

// // ── Entity highlighting ───────────────────────────────────────────────────────
// const ENTITIES_RE = ["COSMOS-2543","GPS IIF-2","YAOGAN-30F","South China Sea","PLA","PLAAF","VKS","ISS","Tiangong","NRO","SpaceX","Iridium","Guam","Okinawa"];
// function HighlightText({text}){
//   if(!text)return null;
//   let parts=[{t:text,k:"r0"}];
//   ENTITIES_RE.forEach((ent,ei)=>{
//     parts=parts.flatMap((p,pi)=>{
//       if(typeof p.t!=="string")return[p];
//       const segs=p.t.split(new RegExp(`(${ent.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")})`,"gi"));
//       return segs.map((s,i)=>({
//         t:i%2===1?<mark key={`e${ei}p${pi}s${i}`} style={{background:"rgba(42,143,192,0.25)",color:"#7ec8e8",borderRadius:1,padding:"0 2px",fontWeight:600}}>{s}</mark>:s,
//         k:`e${ei}p${pi}s${i}`,
//       }));
//     });
//   });
//   return<>{parts.map((p,i)=><span key={p.k+i}>{p.t}</span>)}</>;
// }

// // ── Classification banner ─────────────────────────────────────────────────────
// function ClassBanner({cls}){
//   const isSecret=cls?.includes("SECRET");
//   const isU=cls?.includes("UNCLASSIFIED");
//   const c=isSecret?"#8a0015":isU?"#1a5c2a":"#444";
//   const bg=isSecret?"#fde8ea":isU?"#e8f5ee":"#f0f0f0";
//   return(
//     <div style={{background:bg,padding:"2px 16px",fontSize:9,letterSpacing:2,color:c,fontWeight:700,fontFamily:"monospace",textAlign:"center",borderBottom:`1px solid ${c}33`}}>
//       {cls}
//     </div>
//   );
// }

// // ── MilSymbol unit ────────────────────────────────────────────────────────────
// function MilUnit({sym,label,role,count,color}){
//   return(
//     <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
//       <div style={{width:40,height:40,border:`2px solid ${color}`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.4)",position:"relative",boxShadow:`0 1px 4px ${color}22`}}>
//         <span style={{fontSize:18,color}}>{sym}</span>
//         {count>1&&<div style={{position:"absolute",top:-6,right:-6,width:16,height:16,borderRadius:"50%",background:"#2a7fc1",color:"white",fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace"}}>{count}x</div>}
//       </div>
//       <div style={{textAlign:"center"}}>
//         <div style={{fontSize:8,fontWeight:700,color:"#2a3540",letterSpacing:0.5}}>{label}</div>
//         <div style={{fontSize:7.5,color:"#6a7a88"}}>{role}</div>
//       </div>
//     </div>
//   );
// }

// // ── Section head ──────────────────────────────────────────────────────────────
// function PHead({icon,title,sub,right}){
//   return(
//     <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 12px",background:"rgba(255,255,255,0.025)",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
//       <div style={{display:"flex",alignItems:"center",gap:6}}>
//         {icon&&<span style={{fontSize:9,color:"rgba(200,216,232,0.35)"}}>{icon}</span>}
//         <span style={{fontSize:8,color:"#9ab8cc",letterSpacing:1.8,fontFamily:"monospace",fontWeight:700}}>{title}</span>
//         {sub&&<span style={{fontSize:7.5,color:"rgba(200,216,232,0.25)",letterSpacing:1}}>/ {sub}</span>}
//       </div>
//       {right}
//     </div>
//   );
// }

// // ── Agent card ────────────────────────────────────────────────────────────────
// function AgentCard({a}){
//   const [open,setOpen]=useState(true);
//   const sc={idle:"#1e3040",running:"#4dd9a0",done:"#4ab8f5",error:"#ff4455"};
//   return(
//     <div style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
//       <div onClick={()=>setOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 10px",cursor:"pointer",borderLeft:`2px solid ${sc[a.status]}`,background:a.status==="running"?"rgba(77,217,160,0.03)":"transparent"}}>
//         <div style={{width:5,height:5,borderRadius:"50%",flexShrink:0,background:sc[a.status],boxShadow:a.status==="running"?`0 0 7px ${sc[a.status]}`:"none",animation:a.status==="running"?"dp 1s ease-in-out infinite":"none"}}/>
//         <span style={{flex:1,fontSize:8,color:"rgba(200,216,232,0.5)",letterSpacing:1.5,fontFamily:"monospace"}}>{a.name}</span>
//         {a.status==="running"&&<span style={{fontSize:7.5,color:"#4dd9a0",animation:"blt .8s step-end infinite"}}>●</span>}
//         <span style={{fontSize:8,color:sc[a.status],letterSpacing:1,opacity:0.7}}>{a.status.toUpperCase()}</span>
//         <span style={{fontSize:7.5,color:"rgba(200,216,232,0.15)"}}>{open?"▾":"▸"}</span>
//       </div>
//       {open&&(
//         <div style={{margin:"0 10px 6px 18px",padding:"6px 10px",background:"rgba(0,0,0,0.22)",border:"1px solid rgba(255,255,255,0.05)",fontSize:9.5,lineHeight:1.72,fontFamily:"'Courier New',monospace",color:a.status==="error"?"#ff8888":a.output?"#7aaabb":"rgba(200,216,232,0.14)",whiteSpace:"pre-wrap",wordBreak:"break-word",maxHeight:150,overflowY:"auto"}}>
//           {a.output||(a.status==="idle"?"— awaiting activation —":a.status==="running"?"Querying backend...":"no output")}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN
// // ─────────────────────────────────────────────────────────────────────────────
// export default function GothamOrbital(){
//   const cesiumContainerRef = useRef(null);
//   const viewerRef          = useRef(null);
//   const satEntitiesRef     = useRef({});   // cesium entity per sat
//   const orbitEntitiesRef   = useRef({});   // cesium orbit path per sat
//   const satrecsRef         = useRef({});
//   const posRef             = useRef({});
//   const selRef             = useRef(null);
//   const hlRef              = useRef([]);
//   const agentTimer         = useRef(null);
//   const updateTimer        = useRef(null);

//   const metals = useMetals();

//   const [ready,     setReady]     = useState(false);
//   const [tleStatus, setTleStatus] = useState("loading");
//   const [bUrl, setBUrl] = useState(import.meta.env.VITE_BACKEND_URL || "/api");
//   const [bSec,      setBSec]      = useState("");
//   const [groq,      setGroq]      = useState("");
//   const [tavily,    setTavily]    = useState("");
//   const [selUI,     setSelUI]     = useState(null);
//   const [selPos,    setSelPos]    = useState(null);
//   const [running,   setRunning]   = useState(false);
//   const [cycle,     setCycle]     = useState(0);
//   const [nlQ,       setNlQ]       = useState("");
//   const [nlR,       setNlR]       = useState(null);
//   const [nlLoad,    setNlLoad]    = useState(false);
//   const [alerts,    setAlerts]    = useState([]);
//   const [tab,       setTab]       = useState("summary");
//   const [activeSit, setActiveSit] = useState(SITUATIONS[0]);
//   const [search,    setSearch]    = useState("");
//   const [clock,     setClock]     = useState("");
//   const [classification, setClassification] = useState("SECRET//NOFORN");
//   const [leftPanelOpen,  setLeftPanelOpen]  = useState(true);
//   const [rightPanelOpen, setRightPanelOpen] = useState(true);
//   const [intelText,      setIntelText]      = useState("");
//   const [intelLoading,   setIntelLoading]   = useState(false);
//   const [intelSitId,     setIntelSitId]     = useState(null);
//   const [tabLiveText,    setTabLiveText]    = useState({intel:"",sigact:""});
//   const [tabLiveLoading, setTabLiveLoading] = useState({intel:false,sigact:false});
//   const [tabLiveSitId,   setTabLiveSitId]   = useState({intel:null,sigact:null});
//   const [agents, setAgents] = useState([
//     {id:"orbital",name:"ORBITAL MONITOR",   status:"idle",output:""},
//     {id:"news",   name:"GEOPOLITICAL FEED", status:"idle",output:""},
//     {id:"analyst",name:"SYNTHESIS ENGINE",  status:"idle",output:""},
//   ]);

//   useEffect(()=>{const iv=setInterval(()=>setClock(new Date().toUTCString()),1000);return()=>clearInterval(iv);},[]);

//   // ── Live Intel Overview fetch ──────────────────────────────────────────────
//   const fetchIntelOverview = useCallback(async(sit)=>{
//     if(!sit)return;
//     setIntelLoading(true);
//     setIntelSitId(sit.id);
//     try{
//       const snap = SAT_CATALOG.map(m=>{
//         const s=satrecsRef.current[m.id];if(!s)return null;
//         const p=propagate(s,new Date());if(!p)return null;
//         return`${m.id}(${m.owner},T${m.threat}): lat=${p.lat.toFixed(2)} lon=${p.lon.toFixed(2)} alt=${p.alt.toFixed(0)}km`;
//       }).filter(Boolean).join("\n");
//       const q=`Provide a concise 3-sentence operational intelligence summary for satellite ${sit.id} (classification: ${sit.classification}). Focus on current threat posture, orbital behavior, and risk to US/allied assets based on the live satellite snapshot.`;
//       const{response}=await apiQuery(bUrl,bSec,groq,tavily,q,snap);
//       setIntelText(response);
//     }catch{
//       setIntelText("");
//     }
//     setIntelLoading(false);
//   },[bUrl,bSec,groq,tavily]);

//   // Re-fetch when active situation changes
//   useEffect(()=>{ fetchIntelOverview(activeSit); },[activeSit]);// eslint-disable-line

//   // Re-fetch after each completed agent cycle (only if monitor is running)
//   useEffect(()=>{ if(running&&cycle>0) fetchIntelOverview(activeSit); },[cycle]);// eslint-disable-line

//   // ── Live tab content (Intel / SIGACTs) ────────────────────────────────────
//   const fetchTabContent = useCallback(async(sit, tabName)=>{
//     if(!sit||!groq) return;
//     setTabLiveLoading(p=>({...p,[tabName]:true}));
//     setTabLiveSitId(p=>({...p,[tabName]:sit.id}));
//     try{
//       const snap = SAT_CATALOG.map(m=>{
//         const s=satrecsRef.current[m.id]; if(!s)return null;
//         const p=propagate(s,new Date()); if(!p)return null;
//         return`${m.id}(${m.owner},T${m.threat}): lat=${p.lat.toFixed(2)} lon=${p.lon.toFixed(2)} alt=${p.alt.toFixed(0)}km`;
//       }).filter(Boolean).join("\n");
//       const prompts = {
//         intel: `You are a space intelligence analyst. For satellite object ${sit.id} (classification: ${sit.classification}), provide 3-4 structured intelligence reports covering recent orbital activity, threat assessment, and operational significance. Format each as: [TIMESTAMP] SOURCE: text. Be concise and technical.`,
//         sigact: `You are a space domain awareness operator. For object ${sit.id}, generate 4-5 significant activity entries in chronological order (most recent first). Format each as JSON array: [{ts, type, cls, src, title, body, color}] where color is a hex code based on severity (red=#c0192c, amber=#ff8800, yellow=#f0c040). Types: MANEUVER, SEPARATION, TRACK INIT, CONJUNCTION, LAUNCH PHASE. Return only the JSON array, no markdown.`,
//       };
//       const out = await apiAgent(bUrl,bSec,groq,tavily,"analyst",prompts[tabName],snap);
//       setTabLiveText(p=>({...p,[tabName]:out}));
//     }catch(e){
//       setTabLiveText(p=>({...p,[tabName]:`[Backend unavailable: ${e.message}]`}));
//     }
//     setTabLiveLoading(p=>({...p,[tabName]:false}));
//   },[bUrl,bSec,groq,tavily]);

//   // ── Real conjunction distances from live SGP4 positions ───────────────────
//   function computeConjunctions(){
//     const now = new Date();
//     const positions = {};
//     SAT_CATALOG.forEach(m=>{
//       const s=satrecsRef.current[m.id]; if(!s)return;
//       const p=propagate(s,now); if(!p)return;
//       // Convert to ECEF km for distance calc
//       const R=6371+p.alt;
//       const lat=p.lat*Math.PI/180, lon=p.lon*Math.PI/180;
//       positions[m.id]={x:R*Math.cos(lat)*Math.cos(lon),y:R*Math.cos(lat)*Math.sin(lon),z:R*Math.sin(lat),meta:m};
//     });
//     const pairs=[];
//     const ids=Object.keys(positions);
//     for(let i=0;i<ids.length;i++) for(let j=i+1;j<ids.length;j++){
//       const a=positions[ids[i]], b=positions[ids[j]];
//       const dx=a.x-b.x, dy=a.y-b.y, dz=a.z-b.z;
//       const dist=Math.sqrt(dx*dx+dy*dy+dz*dz);
//       if(dist<1500) pairs.push({obj1:ids[i],obj2:ids[j],dca:dist.toFixed(0),risk:dist<200?3:dist<500?2:dist<1000?1:0});
//     }
//     return pairs.sort((a,b)=>a.dca-b.dca).slice(0,5);
//   }

//   const pushAlert  = useCallback((msg,lvl=1)=>setAlerts(p=>[{msg,lvl,ts:new Date().toISOString().slice(11,19)},...p].slice(0,30)),[]);
//   const patchAgent = useCallback((id,patch)=>setAgents(p=>p.map(a=>a.id===id?{...a,...patch}:a)),[]);
//   const setSel     = useCallback((sat)=>{selRef.current=sat;setSelUI(sat);setSelPos(null);},[]);
//   const setHl      = useCallback((ids)=>{hlRef.current=ids;},[]);

//   const snapshot = useCallback(()=>SAT_CATALOG.map(m=>{
//     const s=satrecsRef.current[m.id];if(!s)return null;
//     const p=propagate(s,new Date());if(!p)return null;
//     return`${m.id}(${m.owner},T${m.threat}): lat=${p.lat.toFixed(2)} lon=${p.lon.toFixed(2)} alt=${p.alt.toFixed(0)}km`;
//   }).filter(Boolean).join("\n"),[]);

//   // ── Boot ──────────────────────────────────────────────────────────────────
//   useEffect(()=>{
//     let dead=false;
//     const load=(src,global)=>new Promise((res,rej)=>{
//       if(global&&window[global]){res();return;}
//       if(document.querySelector(`script[src="${src}"]`)&&(!global||window[global])){res();return;}
//       const s=document.createElement("script");s.src=src;
//       s.onload=()=>res();s.onerror=()=>rej(new Error(`Failed: ${src}`));
//       document.head.appendChild(s);
//     });
//     const loadCss=(href)=>{
//       if(document.querySelector(`link[href="${href}"]`))return;
//       const l=document.createElement("link");l.rel="stylesheet";l.href=href;
//       document.head.appendChild(l);
//     };

//     (async()=>{
//       try{
//         // Load satellite.js
//         await load("https://cdnjs.cloudflare.com/ajax/libs/satellite.js/4.0.0/satellite.min.js","satellite");
//         // Load Cesium
//         loadCss("https://cesium.com/downloads/cesiumjs/releases/1.114/Build/Cesium/Widgets/widgets.css");
//         await load("https://cesium.com/downloads/cesiumjs/releases/1.114/Build/Cesium/Cesium.js","Cesium");
//         if(dead)return;

//         // Fetch TLEs
//         let tles=FALLBACK_TLES, source="fallback";
//         try{
//           const ctrl=new AbortController();
//           const timer=setTimeout(()=>ctrl.abort(),8000);
//           const r=await fetch(`${bUrl}/tles`,{headers:{"x-api-key":bSec||""},signal:ctrl.signal,mode:"cors"});
//           clearTimeout(timer);
//           if(r.ok){const d=await r.json();tles=d.tles;source="live";}
//           else pushAlert(`TLE endpoint returned ${r.status}`,2);
//         }catch(e){pushAlert(`TLE fallback: ${e.message}`,1);}

//         // Parse TLEs
//         let n=0;
//         SAT_CATALOG.forEach(({id})=>{
//           const t=tles[id];if(!t)return;
//           try{satrecsRef.current[id]=window.satellite.twoline2satrec(t.line1,t.line2);n++;}
//           catch(e){console.warn(id,e);}
//         });

//         setTleStatus(source);
//         if(dead)return;

//         initCesium();
//         setReady(true);
//         pushAlert(source==="live"?`Live TLEs — ${n} sats`:`Fallback TLEs — ${n} sats`,source==="live"?0:1);
//       }catch(e){setTleStatus("error");pushAlert(`Boot: ${e.message}`,3);}
//     })();

//     return()=>{
//       dead=true;
//       if(updateTimer.current)clearInterval(updateTimer.current);
//       if(agentTimer.current)clearInterval(agentTimer.current);
//       if(viewerRef.current){
//         if(viewerRef.current._rotateInterval) clearInterval(viewerRef.current._rotateInterval);
//         if(!viewerRef.current.isDestroyed())viewerRef.current.destroy();
//       }
//     };
//   },[]); // eslint-disable-line
//   console.log("Backend URL:", bUrl);
//   // ── Cesium init ───────────────────────────────────────────────────────────
//   function initCesium(){
//     const Cesium = window.Cesium;
//     if(!Cesium||!cesiumContainerRef.current)return;

//     // Suppress Ion token warning with a placeholder (not used — offline imagery only)
//     Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN || "";

//     const viewer = new Cesium.Viewer(cesiumContainerRef.current,{
//       baseLayerPicker:      false,
//       geocoder:             false,
//       homeButton:           false,
//       sceneModePicker:      false,
//       navigationHelpButton: false,
//       animation:            false,
//       timeline:             false,
//       fullscreenButton:     false,
//       infoBox:              false,
//       selectionIndicator:   false,
//       creditContainer:      document.createElement("div"),
//     });
//     viewerRef.current = viewer;

//     // ── Fix sharpness for high-DPI screens ──
//     viewer.resolutionScale = window.devicePixelRatio || 1;

//     // ── Replace default imagery with blue marble from Ion, fallback to OSM ──
//     viewer.imageryLayers.removeAll();
//     try {
//       viewer.imageryLayers.addImageryProvider(
//         new Cesium.IonImageryProvider({ assetId: 3845 }) // Blue Marble
//       );
//     } catch(e) {
//       viewer.imageryLayers.addImageryProvider(
//         new Cesium.OpenStreetMapImageryProvider({ url: "https://tile.openstreetmap.org/" })
//       );
//     }

//     // ── Scene settings ──
//     viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#000810");
//     viewer.scene.globe.enableLighting = true;
//     viewer.scene.skyAtmosphere.show = true;
//     viewer.scene.fog.enabled = false;
//     viewer.scene.skyAtmosphere.atmosphereLightIntensity = 10.0;

//     // Camera initial position
//     viewer.camera.setView({
//       destination: Cesium.Cartesian3.fromDegrees(15, 20, 22000000),
//       orientation:{ heading:0, pitch:-Math.PI/2, roll:0 },
//     });

//     // ── Auto-rotation: slowly spin the globe when user isn't interacting ──
//     let isUserInteracting = false;
//     let interactTimer = null;
//     const setInteracting = (val) => {
//       isUserInteracting = val;
//       if(val) {
//         clearTimeout(interactTimer);
//         interactTimer = setTimeout(()=>{ isUserInteracting = false; }, 3000);
//       }
//     };
//     viewer.scene.canvas.addEventListener("mousedown",  ()=> setInteracting(true));
//     viewer.scene.canvas.addEventListener("touchstart", ()=> setInteracting(true), {passive:true});
//     viewer.scene.canvas.addEventListener("wheel",      ()=> setInteracting(true), {passive:true});

//     // Use setInterval — more reliable than clock.onTick for steady rotation
//     const rotateInterval = setInterval(()=>{
//       if(!isUserInteracting && viewerRef.current && !viewerRef.current.isDestroyed()){
//         viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -0.00012);
//       }
//     }, 33); // ~30fps

//     // Store for cleanup
//     viewer._rotateInterval = rotateInterval;

//     // ── Add satellite entities ──
//     SAT_CATALOG.forEach(meta=>{
//       const pos = propagate(satrecsRef.current[meta.id], new Date());
//       if(!pos)return;

//       // Satellite point + billboard label
//       const entity = viewer.entities.add({
//         id: meta.id,
//         position: toCesium(Cesium, pos.lat, pos.lon, pos.alt),
//         point:{
//           pixelSize: meta.threat>=2 ? 10 : 7,
//           color: Cesium.Color.fromCssColorString(meta.color),
//           outlineColor: Cesium.Color.fromCssColorString(meta.color+"66"),
//           outlineWidth: meta.threat>=2 ? 3 : 1,
//           heightReference: Cesium.HeightReference.NONE,
//           scaleByDistance: new Cesium.NearFarScalar(1.5e6, 2.0, 5.0e8, 0.5),
//           translucencyByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 5.0e8, 0.8),
//           disableDepthTestDistance: Number.POSITIVE_INFINITY,
//         },
//         label:{
//           text: meta.id,
//           font: "bold 11px 'Share Tech Mono', monospace",
//           fillColor: Cesium.Color.fromCssColorString(meta.color),
//           outlineColor: Cesium.Color.BLACK,
//           outlineWidth: 3,
//           style: Cesium.LabelStyle.FILL_AND_OUTLINE,
//           pixelOffset: new Cesium.Cartesian2(14, -4),
//           horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
//           verticalOrigin: Cesium.VerticalOrigin.CENTER,
//           scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.2, 3.0e8, 0.4),
//           translucencyByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 4.0e8, 0.0),
//           disableDepthTestDistance: Number.POSITIVE_INFINITY,
//           show: meta.threat>=1,
//         },
//       });
//       satEntitiesRef.current[meta.id] = entity;
//     });

//     // ── Draw orbit paths ──
//     drawOrbitPaths(Cesium, viewer);

//     // ── Click handler ──
//     viewer.screenSpaceEventHandler.setInputAction(movement=>{
//       const picked = viewer.scene.pick(movement.position);
//       if(Cesium.defined(picked)&&picked.id){
//         const id = picked.id.id || picked.id;
//         const meta = SAT_CATALOG.find(m=>m.id===id);
//         if(meta){
//           setSel(meta.id===selRef.current?.id?null:meta);
//           const sit = SITUATIONS.find(s=>s.id===meta.id);
//           if(sit){setActiveSit(sit);setTab("summary");}
//           highlightSat(Cesium, meta.id);
//         }
//       }
//     }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

//     // ── Start position update loop ──
//     updateTimer.current = setInterval(()=>updatePositions(Cesium, viewer), 1000);
//   }

//   function drawOrbitPaths(Cesium, viewer){
//     SAT_CATALOG.forEach(meta=>{
//       const satrec = satrecsRef.current[meta.id];
//       if(!satrec)return;

//       // Generate one full orbit of positions
//       const period = getPeriodMinutes(satrec);
//       const steps  = 120;
//       const nowMs  = Date.now();
//       const positions = [];

//       for(let i=0;i<=steps;i++){
//         const t = new Date(nowMs + (i/steps)*period*60*1000);
//         const p = propagate(satrec, t);
//         if(p) positions.push(toCesium(Cesium, p.lat, p.lon, p.alt));
//       }

//       if(positions.length < 2)return;

//       const isHighThreat = meta.threat>=2;
//       orbitEntitiesRef.current[meta.id] = viewer.entities.add({
//         id: `orbit_${meta.id}`,
//         polyline:{
//           positions,
//           width: isHighThreat ? 1.5 : 0.8,
//           material: new Cesium.PolylineGlowMaterialProperty({
//             glowPower: isHighThreat ? 0.25 : 0.12,
//             color: Cesium.Color.fromCssColorString(meta.orbitColor + (isHighThreat?"cc":"55")),
//           }),
//           arcType: Cesium.ArcType.NONE,
//           clampToGround: false,
//         },
//       });
//     });
//   }

//   function getPeriodMinutes(satrec){
//     // Period from mean motion (revs/day)
//     const n = satrec.no * (1440 / (2*Math.PI)); // rev/day
//     return 1440 / n; // minutes
//   }

//   function updatePositions(Cesium, viewer){
//     const now = new Date();
//     SAT_CATALOG.forEach(meta=>{
//       const satrec = satrecsRef.current[meta.id];
//       if(!satrec)return;
//       const p = propagate(satrec, now);
//       if(!p)return;
//       posRef.current[meta.id] = p;

//       const entity = satEntitiesRef.current[meta.id];
//       if(entity){
//         entity.position = new Cesium.ConstantPositionProperty(toCesium(Cesium, p.lat, p.lon, p.alt));
//       }

//       // Update selected position
//       if(selRef.current?.id===meta.id){
//         setSelPos({...p});
//       }
//     });

//     // Redraw orbit paths every 60s (they drift)
//     if(Math.floor(Date.now()/1000)%60===0){
//       // Remove old orbits
//       Object.values(orbitEntitiesRef.current).forEach(e=>{
//         if(e&&!e.isDestroyed)viewer.entities.remove(e);
//       });
//       orbitEntitiesRef.current={};
//       drawOrbitPaths(Cesium, viewer);
//     }
//   }

//   function highlightSat(Cesium, satId){
//     // Reset all, highlight selected
//     SAT_CATALOG.forEach(meta=>{
//       const entity = satEntitiesRef.current[meta.id];
//       if(!entity)return;
//       const isSel  = meta.id===satId;
//       const isHl   = hlRef.current.includes(meta.id);
//       entity.point.pixelSize     = isSel?16:isHl?12:meta.threat>=2?10:7;
//       entity.point.color         = isSel
//         ? Cesium.Color.WHITE
//         : Cesium.Color.fromCssColorString(meta.color);
//       entity.label.show          = isSel||isHl||meta.threat>=1;
//       entity.label.scale         = isSel?1.4:1;
//       // Orbit line width
//       const orb = orbitEntitiesRef.current[meta.id];
//       if(orb&&orb.polyline) orb.polyline.width = isSel?2.5:isHl?1.5:meta.threat>=2?1.5:0.8;
//     });
//   }

//   function flyToSat(satId){
//     const Cesium = window.Cesium;
//     const viewer = viewerRef.current;
//     if(!Cesium||!viewer)return;
//     const p = posRef.current[satId];
//     if(!p)return;
//     // Fly to a position 2500km behind+above the sat at a ~35° downward pitch
//     // so the satellite dot is clearly visible against the globe
//     const satCart = Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.alt * 1000);
//     const offset = new Cesium.HeadingPitchRange(
//       0,                          // heading: north-up
//       Cesium.Math.toRadians(-25), // pitch: 25° below horizon — sat visible in lower frame
//       3800000                     // range: ~3800km back — globe fills frame nicely
//     );
//     viewer.camera.flyToBoundingSphere(
//       new Cesium.BoundingSphere(satCart, 1),
//       { offset, duration: 2.2, easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT }
//     );
//   }

//   function flyHome(){
//     const Cesium = window.Cesium;
//     const viewer = viewerRef.current;
//     if(!Cesium||!viewer)return;
//     viewer.camera.flyTo({
//       destination: Cesium.Cartesian3.fromDegrees(15,20,22000000),
//       orientation:{ heading:0, pitch:-Math.PI/2, roll:0 },
//       duration:2,
//     });
//   }

//   // ── Retry TLE ─────────────────────────────────────────────────────────────
//   const retryTle = useCallback(async()=>{
//     setTleStatus("loading");
//     try{
//       const ctrl=new AbortController();
//       const timer=setTimeout(()=>ctrl.abort(),8000);
//       const r=await fetch(`${bUrl}/tles`,{headers:{"x-api-key":bSec||""},signal:ctrl.signal,mode:"cors"});
//       clearTimeout(timer);
//       if(!r.ok)throw new Error(`HTTP ${r.status}`);
//       const{tles}=await r.json();
//       let n=0;
//       SAT_CATALOG.forEach(({id})=>{
//         const t=tles[id];if(!t)return;
//         try{satrecsRef.current[id]=window.satellite.twoline2satrec(t.line1,t.line2);n++;}
//         catch(e){console.warn(id,e);}
//       });
//       setTleStatus("live");
//       pushAlert(`Live TLEs reloaded — ${n} sats`,0);
//     }catch(e){
//       setTleStatus("fallback");
//       pushAlert(`Retry failed: ${e.message}`,2);
//     }
//   },[bUrl,bSec,pushAlert]);

//   // ── Agent monitor ─────────────────────────────────────────────────────────
//   const startMonitor=useCallback(async()=>{
//     if(running)return;
//     setRunning(true);let c=cycle;
//     const runCycle=async()=>{
//       c++;setCycle(c);
//       const snap=snapshot();
//       fetch(`${bUrl}/ingest`,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":bSec,"x-groq-key":groq},body:JSON.stringify({snapshot:snap,cycle:c})}).catch(()=>{});
//       for(const role of["orbital","news","analyst"]){
//         patchAgent(role,{status:"running",output:""});
//         try{
//           const out=await apiAgent(bUrl,bSec,groq,tavily,role,`Cycle ${c}`,snap);
//           patchAgent(role,{status:"done",output:out});
//           const m=out.match(/RELEVANT[_ ]OBJECTS?:?\s*([A-Z0-9,\s_\-]+)/i);
//           if(m){
//             const ids=m[1].split(/[,\s]+/).map(s=>s.trim()).filter(s=>s.length>2);
//             setHl(ids);
//             if(window.Cesium&&viewerRef.current) highlightSat(window.Cesium, selRef.current?.id||"");
//           }
//           pushAlert(`${role.toUpperCase()} cycle ${c} complete`,0);
//         }catch(e){
//           patchAgent(role,{status:"error",output:`Error: ${e.message}`});
//           pushAlert(`${role} error: ${e.message}`,2);
//         }
//       }
//     };
//     await runCycle();
//     agentTimer.current=setInterval(runCycle,90000);
//   },[running,cycle,bUrl,bSec,groq,tavily,snapshot,patchAgent,setHl,pushAlert]);

//   const stopMonitor=useCallback(()=>{
//     setRunning(false);
//     if(agentTimer.current)clearInterval(agentTimer.current);
//     setHl([]);
//     setAgents(p=>p.map(a=>({...a,status:"idle"})));
//   },[setHl]);

//   const handleNL=useCallback(async()=>{
//     if(!nlQ.trim()||nlLoad)return;
//     setNlLoad(true);setNlR(null);
//     try{
//       const{response,relevant_ids}=await apiQuery(bUrl,bSec,groq,tavily,nlQ,snapshot());
//       setNlR(response);
//       if(relevant_ids?.length){
//         setHl(relevant_ids);
//         if(window.Cesium&&viewerRef.current) highlightSat(window.Cesium,"");
//       }
//     }catch(e){setNlR(`Error: ${e.message}`);}
//     setNlLoad(false);
//   },[nlQ,nlLoad,bUrl,bSec,groq,tavily,snapshot,setHl]);

//   const filteredSats=SAT_CATALOG.filter(m=>
//     search===""||m.id.toLowerCase().includes(search.toLowerCase())||
//     m.name.toLowerCase().includes(search.toLowerCase())||
//     m.owner.toLowerCase().includes(search.toLowerCase())
//   );

//   // ── Position row ──────────────────────────────────────────────────────────
//   function PosRow({m}){
//     const [,setT]=useState(0);
//     useEffect(()=>{const iv=setInterval(()=>setT(n=>n+1),1500);return()=>clearInterval(iv);},[]);
//     const p=posRef.current[m.id];
//     const sel=selUI?.id===m.id;
//     return(
//       <div onClick={()=>{
//         setSel(sel?null:m);
//         if(!sel){
//           const sit=SITUATIONS.find(s=>s.id===m.id);
//           if(sit){setActiveSit(sit);setTab("summary");}
//           if(window.Cesium&&viewerRef.current) highlightSat(window.Cesium,m.id);
//         }
//       }} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",cursor:"pointer",background:sel?"rgba(42,143,192,0.1)":"transparent",borderBottom:"1px solid rgba(255,255,255,0.05)",borderLeft:`3px solid ${sel?m.color:"transparent"}`,transition:"background 0.1s"}}>
//         <div style={{width:7,height:7,borderRadius:"50%",flexShrink:0,background:m.color,boxShadow:`0 0 3px ${m.color}88`}}/>
//         <div style={{flex:1,minWidth:0}}>
//           <div style={{fontSize:11,fontWeight:600,color:sel?"#7ec8e8":"#9ab8cc",letterSpacing:0.3}}>{m.id}</div>
//           <div style={{fontSize:9.5,color:"rgba(200,216,232,0.35)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.owner}</div>
//         </div>
//         <div style={{textAlign:"right",flexShrink:0}}>
//           {p&&<div style={{fontSize:9,color:"rgba(200,216,232,0.5)",fontFamily:"monospace"}}>{p.alt.toFixed(0)}km</div>}
//           <span style={{fontSize:7.5,letterSpacing:0.5,padding:"1px 5px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(200,216,232,0.45)",borderRadius:2,fontWeight:600,display:"inline-block",marginTop:1}}>{m.type.slice(0,4)}</span>
//         </div>
//       </div>
//     );
//   }

//   const sit = activeSit;

//   // ─────────────────────────────────────────────────────────────────────────
//   // RENDER
//   // ─────────────────────────────────────────────────────────────────────────
//   return(
//     <div style={{display:"flex",flexDirection:"column",height:"100vh",background:"#0a0e14",color:"#c8d8e8",fontFamily:"'Inter',system-ui,sans-serif",overflow:"hidden"}}>
//       <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet"/>
//       <style>{`
//         @keyframes dp{0%,100%{opacity:1}50%{opacity:.25}}
//         @keyframes blt{0%,100%{opacity:1}50%{opacity:0}}
//         @keyframes spin{to{transform:rotate(360deg)}}
//         @keyframes fadein{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
//         *{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:rgba(77,180,220,.08) transparent;outline:none}
//         *:not(hr):not([class*="cesium"]):not([class*="Cesium"]):focus{outline:none!important;box-shadow:none}
//         *:focus-visible{outline:none!important}
//         button,input,select,textarea{outline:none!important;-webkit-tap-highlight-color:transparent}
//         button:focus,input:focus,select:focus{outline:none!important}
//         ::-webkit-scrollbar{width:3px;height:3px}
//         ::-webkit-scrollbar-thumb{background:rgba(77,180,220,.1);border-radius:1px}
//         ::-webkit-scrollbar-track{background:transparent}
//         /* Hide Cesium credits */
//         .cesium-widget-credits{display:none!important}
//         .cesium-credit-logoContainer{display:none!important}
//         .cesium-viewer-bottom{display:none!important}
//         .tbtn{background:transparent;border:1px solid rgba(77,217,160,0.4);color:rgba(200,216,232,0.7);font-family:'Share Tech Mono',monospace;font-size:8.5px;letter-spacing:1.5px;padding:4px 12px;border-radius:2px;cursor:pointer;transition:all .15s}
//         .tbtn:hover{border-color:#4dd9a0;color:#fff;background:rgba(77,217,160,0.12)}
//         .tbtn.active{border-color:#4dd9a0;color:#4dd9a0;background:rgba(77,217,160,0.15)}
//         .tbtn.danger{border-color:rgba(255,68,85,0.45);color:#ff5566}
//         .tbtn.danger:hover{background:rgba(255,68,85,0.1);border-color:#ff5566}
//         .tbtn:disabled{opacity:.18;cursor:not-allowed}
//         .kin{background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.08);color:#9ab8cc;font-family:'Share Tech Mono',monospace;font-size:8.5px;padding:3px 8px;border-radius:1px;outline:none;transition:border-color .15s}
//         .kin:focus{border-color:rgba(77,217,160,0.3)}
//         .kin::placeholder{color:rgba(200,216,232,0.1)}
//         .ltbtn{background:transparent;border:none;border-bottom:2px solid transparent;padding:7px 12px;cursor:pointer;font-family:'Inter',system-ui,sans-serif;font-size:10px;font-weight:500;color:rgba(200,216,232,0.3);transition:all .15s}
//         .ltbtn:hover{color:rgba(200,216,232,0.65)}
//         .ltbtn.on{color:#c8d8e8;border-bottom-color:#4dd9a0}
//         .dtab{background:transparent;border:none;border-bottom:2px solid transparent;padding:7px 10px;cursor:pointer;font-size:10px;font-weight:500;color:rgba(200,216,232,0.35);transition:all .15s;font-family:'Inter',system-ui,sans-serif}
//         .dtab:hover{color:rgba(200,216,232,0.75)}
//         .dtab.on{color:#7ec8e8;border-bottom-color:#2a8fc0;font-weight:600}
//         .qin{background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);color:#c8d8e8;font-size:11px;padding:7px 10px;border-radius:3px;outline:none;flex:1;transition:border-color .15s;font-family:'Inter',system-ui,sans-serif}
//         .qin:focus{border-color:rgba(42,143,192,0.5);box-shadow:0 0 0 2px rgba(42,143,192,0.12)}
//         .qin::placeholder{color:rgba(200,216,232,0.2)}
//         .wpbtn{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:rgba(200,216,232,0.7);font-size:11px;font-weight:600;padding:5px 12px;border-radius:3px;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:5px;font-family:'Inter',system-ui,sans-serif}
//         .wpbtn:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.22);color:#c8d8e8}
//         .wpbtn.primary{background:#1a6090;border-color:#2a8fc0;color:#c8e8f8}
//         .wpbtn.primary:hover{background:#2a7fc1;box-shadow:0 2px 8px rgba(42,127,193,0.3)}
//         .wpbtn.danger{border-color:rgba(192,25,44,0.6);color:#e05565}
//         .wpbtn.danger:hover{background:rgba(192,25,44,0.15)}
//         .wpbtn:disabled{opacity:.3;cursor:not-allowed}
//         .zb{width:32px;height:32px;background:rgba(0,0,0,0.6);border:1px solid rgba(77,217,160,0.3);color:rgba(200,216,232,0.6);border-radius:2px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .15s;font-family:monospace;font-weight:bold}
//         .zb:hover{border-color:#4dd9a0;color:#fff;background:rgba(77,217,160,0.15);box-shadow:0 0 10px rgba(77,217,160,0.2)}
//         .sin{background:rgba(0,0,0,0.35);border:1.5px solid rgba(255,255,255,0.1);border-radius:3px;padding:6px 10px 6px 28px;font-size:11px;color:#c8d8e8;outline:none;width:100%;transition:border-color .15s;font-family:'Inter',system-ui,sans-serif}
//         .sin:focus{border-color:rgba(42,143,192,0.5);box-shadow:0 0 0 3px rgba(42,143,192,0.12)}
//         .sin::placeholder{color:rgba(200,216,232,0.22)}
//         /* Fix Cesium canvas */
//         #cesium-container{width:100%;height:100%}
//         #cesium-container canvas{width:100%!important;height:100%!important}
//         /* Hard reset any inherited browser outline/border artifacts */
//         html,body{margin:0;padding:0;border:none;outline:none;background:#0a0e14}
//         div,span,button,input,select{outline:none!important}
//       `}</style>

//       {/* ══ DARK TOPBAR ══════════════════════════════════════════════════════ */}
//       <div style={{height:40,flexShrink:0,background:"linear-gradient(180deg,#1e2a38 0%,#141e2c 100%)",borderBottom:"1px solid #0a1218",display:"flex",alignItems:"center",gap:0,padding:"0 12px"}}>
//         {/* Logo */}
//         <div style={{display:"flex",alignItems:"center",gap:9,paddingRight:14,borderRight:"1px solid rgba(255,255,255,0.07)",marginRight:12}}>
//           <div style={{width:24,height:24,border:"1px solid rgba(77,217,160,0.32)",borderRadius:1,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(77,217,160,0.05)",flexShrink:0}}>
//             <span style={{fontSize:11,color:"#4dd9a0"}}>◈</span>
//           </div>
//           <div>
//             <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:"#c8d8e8",letterSpacing:3.5,fontWeight:700,lineHeight:1}}>GOTHAM ORBITAL</div>
//             <div style={{fontSize:6.5,color:"rgba(200,216,232,0.2)",letterSpacing:3,marginTop:1}}>INTELLIGENCE PLATFORM</div>
//           </div>
//         </div>

//         {/* Breadcrumb */}
//         <div style={{display:"flex",alignItems:"center",gap:4,marginRight:12,paddingRight:12,borderRight:"1px solid rgba(255,255,255,0.07)"}}>
//           <span style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>ORBITAL SITUATIONS</span>
//           <span style={{fontSize:9,color:"rgba(255,255,255,0.15)"}}>›</span>
//           <span style={{fontSize:9,color:"rgba(255,255,255,0.65)",fontWeight:500}}>{sit?.title?.slice(0,30)||"—"}</span>
//         </div>

//         {/* Status dots */}
//         <div style={{display:"flex",alignItems:"center",gap:10,marginRight:12,paddingRight:12,borderRight:"1px solid rgba(255,255,255,0.07)"}}>
//           {[
//             {l:"SGP4",  ok:ready},
//             {l:"TLE",   ok:tleStatus==="live", warn:tleStatus==="fallback"},
//             {l:"CESIUM",ok:ready},
//             {l:"AGENTS",ok:running},
//           ].map(s=>(
//             <div key={s.l} style={{display:"flex",alignItems:"center",gap:3}}>
//               <div style={{width:4,height:4,borderRadius:"50%",background:s.ok?"#4dd9a0":s.warn?"#f0c040":"rgba(255,255,255,0.12)",boxShadow:s.ok?"0 0 5px #4dd9a055":s.warn?"0 0 5px #f0c04055":""}}/>
//               <span style={{fontSize:7.5,color:s.ok?"rgba(77,217,160,0.8)":s.warn?"rgba(240,192,64,0.7)":"rgba(255,255,255,0.2)",letterSpacing:0.5,fontFamily:"monospace"}}>{s.l}</span>
//             </div>
//           ))}
//         </div>

//         {/* Metal prices */}
//         <div style={{display:"flex",alignItems:"center",gap:14,marginRight:12,paddingRight:12,borderRight:"1px solid rgba(255,255,255,0.07)"}}>
//           {[{label:"Gold",val:metals.gold,d:metals.gd,c:"#f0c040",dp:2},{label:"Silver",val:metals.silver,d:metals.sd,c:"#aabccc",dp:3}].map(m=>(
//             <div key={m.label} style={{display:"flex",alignItems:"center",gap:5}}>
//               <div style={{width:4,height:4,borderRadius:"50%",background:m.c,boxShadow:`0 0 4px ${m.c}88`}}/>
//               <span style={{fontSize:8,color:"rgba(200,216,232,0.5)",letterSpacing:0.5,fontFamily:"system-ui",fontWeight:500}}>{m.label}</span>
//               <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:m.c}}>
//                 ${m.val.toLocaleString("en",{minimumFractionDigits:m.dp,maximumFractionDigits:m.dp})}
//               </span>
//               <span style={{fontSize:8,color:m.d>=0?"#4dd9a0":"#ff6666",fontFamily:"monospace"}}>{m.d>=0?"▲":"▼"}{Math.abs(m.d).toFixed(m.dp)}</span>
//             </div>
//           ))}
//         </div>

//         {/* Keys + controls */}
//         <div style={{display:"flex",alignItems:"center",gap:6}}>
//           <input className="kin" type="password" placeholder="Groq key" value={groq} onChange={e=>setGroq(e.target.value)} style={{width:120}}/>
//           <input className="kin" type="password" placeholder="Tavily key" value={tavily} onChange={e=>setTavily(e.target.value)} style={{width:110}}/>
//           {!running
//             ?<button className="tbtn active" onClick={startMonitor} disabled={!ready||!groq}>▶ INITIATE</button>
//             :<button className="tbtn danger" onClick={stopMonitor}>■ HALT</button>
//           }
//         </div>

//         <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
//           {/* Classification selector */}
//           {(()=>{
//             const cls=classification;
//             const isSecret=cls.includes("SECRET")&&!cls.includes("UNCLASSIFIED");
//             const isU=cls.includes("UNCLASSIFIED");
//             const dotColor=isSecret?"#ff3344":isU?"#44cc88":"#f0c040";
//             const textColor=isSecret?"#ff6677":isU?"#66ddaa":"#f0c040";
//             return(
//               <div style={{display:"flex",alignItems:"center",gap:6,paddingRight:8,borderRight:"1px solid rgba(255,255,255,0.07)"}}>
//                 <div style={{width:5,height:5,borderRadius:"50%",background:dotColor,boxShadow:`0 0 5px ${dotColor}88`,flexShrink:0}}/>
//                 <select value={classification} onChange={e=>setClassification(e.target.value)}
//                   style={{background:"transparent",border:"none",color:textColor,fontFamily:"'Share Tech Mono',monospace",fontSize:8.5,letterSpacing:1.5,fontWeight:700,cursor:"pointer",outline:"none",appearance:"none",WebkitAppearance:"none",padding:"0 2px"}}>
//                   <option value="SECRET//NOFORN"           style={{background:"#1a0a10",color:"#ff6677"}}>SECRET//NOFORN</option>
//                   <option value="SECRET"                   style={{background:"#1a0a10",color:"#ff6677"}}>SECRET</option>
//                   <option value="SECRET//REL TO USA, FVEY" style={{background:"#1a0a10",color:"#ff9966"}}>SECRET//REL TO USA, FVEY</option>
//                   <option value="CONFIDENTIAL"             style={{background:"#100a1a",color:"#cc88ff"}}>CONFIDENTIAL</option>
//                   <option value="UNCLASSIFIED//FOUO"       style={{background:"#0a1a10",color:"#66ddaa"}}>UNCLASSIFIED//FOUO</option>
//                   <option value="UNCLASSIFIED"             style={{background:"#0a1a10",color:"#66ddaa"}}>UNCLASSIFIED</option>
//                 </select>
//               </div>
//             );
//           })()}
//           {/* Panel toggles */}
//           <button onClick={()=>setLeftPanelOpen(o=>!o)} title={leftPanelOpen?"Hide left panel":"Show left panel"}
//             style={{width:20,height:20,background:"transparent",border:"1px solid rgba(200,216,232,0.12)",borderRadius:2,cursor:"pointer",color:"rgba(200,216,232,0.35)",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",fontFamily:"monospace"}}
//             onMouseEnter={e=>{e.currentTarget.style.borderColor="#4dd9a0";e.currentTarget.style.color="#4dd9a0";}}
//             onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(200,216,232,0.12)";e.currentTarget.style.color="rgba(200,216,232,0.35)";}}>
//             {leftPanelOpen?"◀":"▶"}
//           </button>
//           <button onClick={()=>setRightPanelOpen(o=>!o)} title={rightPanelOpen?"Hide right panel":"Show right panel"}
//             style={{width:20,height:20,background:"transparent",border:"1px solid rgba(200,216,232,0.12)",borderRadius:2,cursor:"pointer",color:"rgba(200,216,232,0.35)",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",fontFamily:"monospace"}}
//             onMouseEnter={e=>{e.currentTarget.style.borderColor="#4dd9a0";e.currentTarget.style.color="#4dd9a0";}}
//             onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(200,216,232,0.12)";e.currentTarget.style.color="rgba(200,216,232,0.35)";}}>
//             {rightPanelOpen?"▶":"◀"}
//           </button>
//           {/* Clock */}
//           <div style={{textAlign:"right",paddingLeft:8,borderLeft:"1px solid rgba(255,255,255,0.07)"}}>
//             <div style={{fontSize:7,color:"rgba(200,216,232,0.2)",letterSpacing:1,fontFamily:"monospace"}}>{clock}</div>
//             <div style={{fontSize:7,color:running?"#4dd9a0":"rgba(200,216,232,0.14)",letterSpacing:2,fontFamily:"monospace"}}>
//               CYCLE {String(cycle).padStart(4,"0")} {running?"● LIVE":"○ IDLE"}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ══ MAIN — left panel + cesium + right panel ═════════════════════════ */}
//       <div style={{flex:1,display:"flex",minHeight:0}}>

//         {/* Left panel */}
//         <div style={{width:leftPanelOpen?310:0,flexShrink:0,background:"#0b1520",borderRight:leftPanelOpen?"1px solid rgba(255,255,255,0.07)":"none",display:"flex",flexDirection:"column",minHeight:0,boxShadow:leftPanelOpen?"2px 0 12px rgba(0,0,0,0.4)":"none",overflow:"hidden",transition:"width .2s ease"}}>

//           {/* Situation selector header */}
//           {sit&&(
//             <div style={{flexShrink:0,borderBottom:"1px solid rgba(255,255,255,0.07)",background:"#0d1828"}}>
//               <div style={{padding:"8px 12px 0"}}>
//                 {/* Situation switcher pills */}
//                 <div style={{display:"flex",gap:4,marginBottom:8,flexWrap:"wrap"}}>
//                   {SITUATIONS.map(s=>{
//                     const tm=THREAT_META[SAT_CATALOG.find(c=>c.id===s.id)?.threat||0];
//                     const active=activeSit?.id===s.id;
//                     return(
//                       <button key={s.id} onClick={()=>{setActiveSit(s);setTab("summary");}} style={{flex:1,minWidth:0,background:active?"#1a2d42":"rgba(255,255,255,0.04)",border:`1px solid ${active?"#2a5070":"rgba(255,255,255,0.1)"}`,borderRadius:3,padding:"5px 8px",cursor:"pointer",transition:"all .15s",textAlign:"left"}}>
//                         <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
//                           <div style={{width:5,height:5,borderRadius:"50%",background:tm.color,flexShrink:0,boxShadow:active?`0 0 5px ${tm.color}88`:"none"}}/>
//                           <span style={{fontSize:8,fontWeight:700,color:active?"#c8d8e8":"rgba(200,216,232,0.4)",letterSpacing:0.5,fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.id}</span>
//                         </div>
//                         <div style={{fontSize:7,color:active?"rgba(200,216,232,0.4)":"rgba(200,216,232,0.2)",letterSpacing:0.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.classification}</div>
//                       </button>
//                     );
//                   })}
//                 </div>
//                 {/* Active situation title row */}
//                 <div style={{display:"flex",alignItems:"flex-start",gap:8,paddingBottom:8}}>
//                   <div style={{flex:1,minWidth:0}}>
//                     <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
//                       {(()=>{const tm=THREAT_META[SAT_CATALOG.find(c=>c.id===sit.id)?.threat||0];return(
//                         <span style={{fontSize:7,fontWeight:700,letterSpacing:1.5,padding:"2px 6px",background:tm.color+"22",color:tm.color,border:`1px solid ${tm.color}44`,borderRadius:2}}>{tm.label}</span>
//                       );})()}
//                       <span style={{fontSize:7,color:"rgba(200,216,232,0.3)",letterSpacing:1,fontFamily:"monospace"}}>{sit.classification}</span>
//                     </div>
//                     {(()=>{const m=SAT_CATALOG.find(c=>c.id===sit.id); return(<>
//                       <div style={{fontSize:12,fontWeight:700,color:"#c8d8e8",lineHeight:1.25,marginBottom:2}}>{m?.name||sit.id}</div>
//                       <div style={{fontSize:9,color:sit.affColor,fontWeight:600}}>{m?.owner||"—"} · {m?.type||"—"}</div>
//                     </>);})()}
//                   </div>
//                 </div>
//                 {/* Tabs */}
//                 <div style={{display:"flex",gap:0,borderTop:"1px solid rgba(255,255,255,0.07)",margin:"0 -12px"}}>
//                   {["summary","intel","agents","query","sigact"].map(t=>(
//                     <button key={t} className={`dtab ${tab===t?"on":""}`} onClick={()=>setTab(t)} style={{fontSize:9.5,padding:"6px 8px",textTransform:"capitalize",flex:1}}>
//                       {t==="sigact"?"SIGACTs":t.charAt(0).toUpperCase()+t.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Search */}
//           <div style={{padding:"7px 12px",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0,position:"relative"}}>
//             <span style={{position:"absolute",left:20,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"rgba(200,216,232,0.25)",pointerEvents:"none"}}>🔍</span>
//             <input className="sin" placeholder="Filter by satellite ID, owner..." value={search} onChange={e=>setSearch(e.target.value)}/>
//           </div>

//           {/* SUMMARY TAB */}
//           {tab==="summary"&&sit&&(
//             <div style={{flex:1,overflowY:"auto",minHeight:0,background:"#0b1520"}}>
//               {/* Orbital snapshot */}
//               <div style={{padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
//                 <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(200,216,232,0.4)",marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
//                   <span style={{width:3,height:10,background:"#2a8fc0",borderRadius:1,display:"inline-block"}}/>ORBITAL SNAPSHOT
//                 </div>
//                 {(()=>{
//                   const m=SAT_CATALOG.find(c=>c.id===sit.id);
//                   const p=posRef.current[sit.id];
//                   const satrec=m&&satrecsRef.current[m.id];
//                   const period=satrec?getPeriodMinutes(satrec):null;
//                   const nextPass=period?Math.round((period-(Date.now()/60000)%period+period)%period):null;
//                   return(
//                     <div>
//                       <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,marginBottom:8}}>
//                         {[
//                           {label:"ALT",value:p?`${p.alt.toFixed(0)} km`:"—",color:"#2a7fc1"},
//                           {label:"LAT",value:p?`${p.lat.toFixed(2)}°`:"—",color:"#2a7fc1"},
//                           {label:"LON",value:p?`${p.lon.toFixed(2)}°`:"—",color:"#2a7fc1"},
//                           {label:"PERIOD",value:period?`${period.toFixed(1)} min`:"—",color:"#8a3800"},
//                           {label:"TYPE",value:m?.type||"—",color:"#1a5c9a"},
//                           {label:"OWNER",value:m?.owner||"—",color:"#1a7a4a"},
//                         ].map(({label,value,color})=>(
//                           <div key={label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:2,padding:"5px 7px",minWidth:0}}>
//                             <div style={{fontSize:7,color:"rgba(200,216,232,0.3)",letterSpacing:1,marginBottom:1}}>{label}</div>
//                             <div style={{fontSize:10,fontWeight:700,color,fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value}</div>
//                           </div>
//                         ))}
//                       </div>
//                       {/* Next overpass bar */}
//                       <div style={{background:"#0a1828",borderRadius:3,padding:"7px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",border:"1px solid #1a3050"}}>
//                         <div>
//                           <div style={{fontSize:7,color:"rgba(200,216,232,0.3)",letterSpacing:1.5,marginBottom:2,fontFamily:"monospace"}}>NEXT OVERPASS</div>
//                           <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:13,fontWeight:700,color:"#4dd9a0"}}>
//                             {nextPass!=null?`T−${String(Math.floor(nextPass)).padStart(2,"0")}:${String(Math.round((nextPass%1)*60)).padStart(2,"0")}`:"—"}
//                           </div>
//                         </div>
//                         <div style={{textAlign:"right"}}>
//                           <div style={{fontSize:7,color:"rgba(200,216,232,0.3)",letterSpacing:1.5,marginBottom:2,fontFamily:"monospace"}}>AFFILIATION</div>
//                           <div style={{display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end"}}>
//                             <div style={{width:6,height:6,borderRadius:1,background:sit.affColor,flexShrink:0}}/>
//                             <span style={{fontSize:9,color:"rgba(200,216,232,0.7)",fontFamily:"monospace",fontWeight:600}}>{SAT_CATALOG.find(c=>c.id===sit.id)?.owner||"—"}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })()}
//               </div>
//               <div>
//                 <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(200,216,232,0.4)",padding:"8px 14px 5px",display:"flex",alignItems:"center",gap:5}}>
//                   <span style={{width:3,height:10,background:"#2a8fc0",borderRadius:1,display:"inline-block"}}/>TRACKED OBJECTS
//                 </div>
//                 {filteredSats.map(m=><PosRow key={m.id} m={m}/>)}
//               </div>
//             </div>
//           )}

//           {/* INTEL TAB */}
//           {tab==="intel"&&sit&&(
//             <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0,background:"#0b1520"}}>
//               <div style={{padding:"6px 12px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
//                 <span style={{fontSize:7.5,color:"rgba(200,216,232,0.3)",letterSpacing:2,fontFamily:"monospace"}}>INTEL REPORTS // {sit.id}</span>
//                 <div style={{display:"flex",alignItems:"center",gap:6}}>
//                   {tabLiveLoading.intel
//                     ? <span style={{fontSize:7,color:"#4dd9a0",fontFamily:"monospace",animation:"dp 1s infinite"}}>● FETCHING</span>
//                     : tabLiveSitId.intel===sit.id&&tabLiveText.intel
//                       ? <span style={{fontSize:7,color:"#4dd9a0",fontFamily:"monospace"}}>● LIVE</span>
//                       : <span style={{fontSize:7,color:"rgba(200,216,232,0.2)",fontFamily:"monospace"}}>○ AWAITING</span>
//                   }
//                   <button onClick={()=>fetchTabContent(sit,"intel")} disabled={tabLiveLoading.intel||!groq}
//                     style={{background:"transparent",border:"1px solid rgba(255,255,255,0.12)",borderRadius:2,color:"rgba(200,216,232,0.4)",cursor:"pointer",fontSize:8,padding:"2px 7px",fontFamily:"monospace"}}
//                     onMouseEnter={e=>{e.currentTarget.style.borderColor="#4dd9a0";e.currentTarget.style.color="#4dd9a0";}}
//                     onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";e.currentTarget.style.color="rgba(200,216,232,0.4)";}}>
//                     {tabLiveLoading.intel?"…":"↻ FETCH"}
//                   </button>
//                 </div>
//               </div>
//               <div style={{flex:1,overflowY:"auto",minHeight:0,padding:"10px 14px"}}>
//                 {tabLiveLoading.intel?(
//                   <div style={{display:"flex",flexDirection:"column",gap:8}}>
//                     {[100,80,95,70,88].map((w,i)=>(
//                       <div key={i} style={{height:8,width:`${w}%`,background:"rgba(255,255,255,0.06)",borderRadius:2,animation:"dp 1.4s ease-in-out infinite",animationDelay:`${i*0.12}s`}}/>
//                     ))}
//                   </div>
//                 ):tabLiveSitId.intel===sit.id&&tabLiveText.intel?(
//                   <div style={{fontSize:10,lineHeight:1.82,color:"rgba(200,216,232,0.65)",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
//                     <HighlightText text={tabLiveText.intel}/>
//                   </div>
//                 ):(
//                   <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:10,opacity:0.4}}>
//                     <div style={{fontSize:28}}>📡</div>
//                     <div style={{fontSize:9,color:"rgba(200,216,232,0.5)",fontFamily:"monospace",letterSpacing:1,textAlign:"center"}}>
//                       {groq?"PRESS ↻ FETCH TO LOAD LIVE INTEL":"SET GROQ KEY IN TOPBAR TO ENABLE"}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* AGENTS TAB */}
//           {tab==="agents"&&(
//             <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
//               <div style={{flex:1,overflowY:"auto",minHeight:0,background:"#0b0f17"}}>
//                 <div style={{padding:"6px 10px 4px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
//                   <span style={{fontSize:7.5,color:"rgba(200,216,232,0.3)",letterSpacing:2,fontFamily:"monospace"}}>AGENT NETWORK</span>
//                   {running&&<span style={{fontSize:7.5,color:"#4dd9a0",letterSpacing:1,animation:"dp 1.2s infinite",fontFamily:"monospace"}}>● LIVE</span>}
//                 </div>
//                 {agents.map(a=><AgentCard key={a.id} a={a}/>)}
//               </div>
//               <div style={{height:140,overflowY:"auto",flexShrink:0,background:"#0b0f17",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
//                 <div style={{padding:"5px 10px 4px",fontSize:7.5,color:"rgba(200,216,232,0.25)",letterSpacing:2,fontFamily:"monospace",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>ALERTS</div>
//                 {alerts.length===0?<div style={{padding:"8px 12px",fontSize:9,color:"rgba(200,216,232,0.12)",fontStyle:"italic"}}>no alerts</div>
//                 :alerts.slice(0,10).map((a,i)=>(
//                   <div key={i} style={{padding:"3px 10px",fontSize:8.5,borderLeft:`2px solid ${THREAT_META[a.lvl].color}`,background:THREAT_META[a.lvl].color+"14",margin:"0 8px 2px",borderRadius:"0 2px 2px 0",color:"rgba(200,216,232,0.65)"}}>
//                     <span style={{color:THREAT_META[a.lvl].color,fontSize:7,display:"block",fontFamily:"monospace"}}>{a.ts}</span>
//                     {a.msg}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* QUERY TAB */}
//           {tab==="query"&&(
//             <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0,background:"#0b1520"}}>
//               <div style={{padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0}}>
//                 <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(200,216,232,0.4)",marginBottom:8}}>⌕ INTEL QUERY</div>
//                 <div style={{display:"flex",gap:6,marginBottom:7}}>
//                   <input className="qin" placeholder="Query satellite intelligence..." value={nlQ} onChange={e=>setNlQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleNL()}/>
//                   <button className="wpbtn primary" style={{flexShrink:0,fontSize:10,padding:"5px 10px"}} onClick={handleNL} disabled={nlLoad||!nlQ.trim()}>
//                     {nlLoad?"…":"⌕"}
//                   </button>
//                 </div>
//                 <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
//                   {["Where is the ISS?","Military sats over ME?","COSMOS-2543 status?","Proximity threats?"].map(q=>(
//                     <button key={q} onClick={()=>setNlQ(q)} className="wpbtn" style={{fontSize:9,padding:"2px 7px"}}>{q}</button>
//                   ))}
//                 </div>
//               </div>
//               <div style={{flex:1,overflowY:"auto",padding:"10px 14px",minHeight:0}}>
//                 {nlLoad?<div style={{display:"flex",gap:8,alignItems:"center",color:"#4ab8f5",fontSize:10}}><div style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.1)",borderTop:"2px solid #2a8fc0",borderRadius:"50%",animation:"spin .8s linear infinite",flexShrink:0}}/>Querying...</div>
//                 :nlR?<div style={{fontSize:10,lineHeight:1.82,color:"rgba(200,216,232,0.7)",whiteSpace:"pre-wrap",wordBreak:"break-word"}}><HighlightText text={nlR}/></div>
//                 :<div style={{fontSize:9.5,color:"rgba(200,216,232,0.2)",fontStyle:"italic"}}>Enter a query to interrogate satellite intelligence...</div>}
//               </div>
//             </div>
//           )}

//           {/* SIGACT TAB */}
//           {tab==="sigact"&&sit&&(
//             <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
//               <div style={{padding:"6px 12px",background:"#0a1018",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
//                 <span style={{fontSize:7.5,color:"rgba(200,216,232,0.3)",letterSpacing:2,fontFamily:"monospace"}}>SIGNIFICANT ACTIVITIES // {sit.id}</span>
//                 <div style={{display:"flex",alignItems:"center",gap:6}}>
//                   {tabLiveLoading.sigact
//                     ? <span style={{fontSize:7,color:"#4dd9a0",fontFamily:"monospace",animation:"dp 1s infinite"}}>● FETCHING</span>
//                     : tabLiveSitId.sigact===sit.id&&tabLiveText.sigact
//                       ? <span style={{fontSize:7,color:"#4dd9a0",fontFamily:"monospace"}}>● LIVE</span>
//                       : <span style={{fontSize:7,color:"rgba(200,216,232,0.2)",fontFamily:"monospace"}}>○ AWAITING</span>
//                   }
//                   <button onClick={()=>fetchTabContent(sit,"sigact")} disabled={tabLiveLoading.sigact||!groq}
//                     style={{background:"transparent",border:"1px solid rgba(255,255,255,0.12)",borderRadius:2,color:"rgba(200,216,232,0.4)",cursor:"pointer",fontSize:8,padding:"2px 7px",fontFamily:"monospace"}}
//                     onMouseEnter={e=>{e.currentTarget.style.borderColor="#4dd9a0";e.currentTarget.style.color="#4dd9a0";}}
//                     onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";e.currentTarget.style.color="rgba(200,216,232,0.4)";}}>
//                     {tabLiveLoading.sigact?"…":"↻ FETCH"}
//                   </button>
//                 </div>
//               </div>
//               <div style={{flex:1,overflowY:"auto",minHeight:0,background:"#0b1520"}}>
//                 {tabLiveLoading.sigact?(
//                   <div style={{padding:"14px",display:"flex",flexDirection:"column",gap:10}}>
//                     {[100,85,90,75].map((w,i)=>(
//                       <div key={i} style={{height:52,width:`${w}%`,background:"rgba(255,255,255,0.04)",borderRadius:3,border:"1px solid rgba(255,255,255,0.06)",animation:"dp 1.4s ease-in-out infinite",animationDelay:`${i*0.15}s`}}/>
//                     ))}
//                   </div>
//                 ):tabLiveSitId.sigact===sit.id&&tabLiveText.sigact?(()=>{
//                   // Try to parse JSON events, else render as plain text
//                   let events=null;
//                   try{
//                     const raw=tabLiveText.sigact.replace(/```json|```/g,"").trim();
//                     events=JSON.parse(raw);
//                   }catch{}
//                   if(events&&Array.isArray(events)) return events.map((ev,i)=>(
//                     <div key={i} style={{padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:i===0?(ev.color||"#c0192c")+"08":"transparent"}}>
//                       <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
//                         <div style={{flex:1,minWidth:0}}>
//                           <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",marginBottom:3}}>
//                             <span style={{fontSize:8,fontWeight:700,color:ev.color||"#f0c040",letterSpacing:1,padding:"1px 5px",background:(ev.color||"#f0c040")+"18",border:`1px solid ${ev.color||"#f0c040"}44`,borderRadius:2}}>{ev.type||"EVENT"}</span>
//                             <span style={{fontSize:7.5,color:"rgba(200,216,232,0.35)",fontFamily:"monospace"}}>{ev.cls}</span>
//                             <span style={{fontSize:7.5,color:"rgba(200,216,232,0.35)",marginLeft:"auto",fontFamily:"monospace"}}>{ev.src}</span>
//                           </div>
//                           <div style={{fontSize:10,fontWeight:700,color:"#9ab8cc",marginBottom:1}}>{ev.title}</div>
//                           <div style={{fontSize:8,color:"rgba(200,216,232,0.3)",fontFamily:"monospace",marginBottom:4}}>{ev.ts}</div>
//                           <div style={{fontSize:9.5,lineHeight:1.68,color:"rgba(200,216,232,0.6)"}}>{ev.body}</div>
//                         </div>
//                       </div>
//                     </div>
//                   ));
//                   // Plain text fallback
//                   return(
//                     <div style={{padding:"12px 14px",fontSize:10,lineHeight:1.82,color:"rgba(200,216,232,0.65)",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
//                       <HighlightText text={tabLiveText.sigact}/>
//                     </div>
//                   );
//                 })():(
//                   <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:10,opacity:0.4}}>
//                     <div style={{fontSize:28}}>⚡</div>
//                     <div style={{fontSize:9,color:"rgba(200,216,232,0.5)",fontFamily:"monospace",letterSpacing:1,textAlign:"center"}}>
//                       {groq?"PRESS ↻ FETCH TO LOAD LIVE SIGACTs":"SET GROQ KEY IN TOPBAR TO ENABLE"}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── Cesium viewport + right panel ──────────────────────────── */}
//         <div style={{flex:1,display:"flex",minHeight:0}}>

//           {/* Cesium */}
//           <div style={{flex:1,position:"relative",overflow:"hidden",background:"#000810"}}>
//             <div id="cesium-container" ref={cesiumContainerRef} style={{width:"100%",height:"100%"}}/>

//             {/* Loading overlay */}
//             {!ready&&(
//               <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"rgba(5,10,18,0.97)",zIndex:10}}>
//                 {tleStatus==="loading"
//                   ?<div style={{width:44,height:44,border:"1px solid rgba(42,127,193,0.25)",borderTop:"1px solid #2a7fc1",borderRadius:"50%",animation:"spin 1s linear infinite",marginBottom:16}}/>
//                   :<div style={{fontSize:30,marginBottom:16,opacity:0.4}}>⚠</div>
//                 }
//                 <div style={{fontSize:11,color:"rgba(42,127,193,0.65)",letterSpacing:3,fontFamily:"'Share Tech Mono',monospace",marginBottom:8}}>
//                   {tleStatus==="loading"?"INITIALIZING CESIUM...":`TLE STATUS: ${tleStatus.toUpperCase()}`}
//                 </div>
//                 {(tleStatus==="fallback"||tleStatus==="error")&&(
//                   <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
//                     <div style={{fontSize:9,color:"rgba(200,216,232,0.35)",letterSpacing:1,fontFamily:"monospace"}}>{bUrl}/tles</div>
//                     <div style={{display:"flex",gap:8}}>
//                       <button onClick={retryTle} style={{background:"rgba(42,127,193,0.15)",border:"1px solid rgba(42,127,193,0.4)",color:"#7ec4f0",fontSize:10,padding:"5px 16px",cursor:"pointer",borderRadius:2,letterSpacing:1,fontFamily:"'Share Tech Mono',monospace"}}>↻ RETRY</button>
//                       <button onClick={()=>setReady(true)} style={{background:"rgba(77,217,160,0.1)",border:"1px solid rgba(77,217,160,0.3)",color:"#4dd9a0",fontSize:10,padding:"5px 16px",cursor:"pointer",borderRadius:2,letterSpacing:1,fontFamily:"'Share Tech Mono',monospace"}}>▶ CONTINUE</button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Camera controls */}
//             <div style={{position:"absolute",right:12,top:12,display:"flex",flexDirection:"column",gap:4,zIndex:5}}>
//               <button className="zb" onClick={flyHome} title="Home view">⌂</button>
//               {selUI&&selPos&&<button className="zb" onClick={()=>flyToSat(selUI.id)} title="Fly to satellite">🎯</button>}
//               <button className="zb" title="Zoom in" onClick={()=>{
//                 const v=viewerRef.current;if(!v||!window.Cesium)return;
//                 const cart=v.camera.position;const mag=window.Cesium.Cartesian3.magnitude(cart);
//                 v.camera.position=window.Cesium.Cartesian3.multiplyByScalar(cart,0.7,new window.Cesium.Cartesian3());
//               }}>+</button>
//               <button className="zb" title="Zoom out" onClick={()=>{
//                 const v=viewerRef.current;if(!v||!window.Cesium)return;
//                 const cart=v.camera.position;const mag=window.Cesium.Cartesian3.magnitude(cart);
//                 v.camera.position=window.Cesium.Cartesian3.multiplyByScalar(cart,1.4,new window.Cesium.Cartesian3());
//               }}>−</button>
//               <button className="zb" title="Tilt up" onClick={()=>{
//                 const v=viewerRef.current;if(!v)return;
//                 v.camera.rotateUp(0.3);
//               }}>▲</button>
//               <button className="zb" title="Tilt down" onClick={()=>{
//                 const v=viewerRef.current;if(!v)return;
//                 v.camera.rotateDown(0.3);
//               }}>▼</button>
//             </div>

//             {/* Selected sat HUD */}
//             {selUI&&selPos&&(
//               <div style={{position:"absolute",top:12,left:12,zIndex:5,background:"rgba(5,10,18,0.94)",border:`1px solid ${selUI.color}28`,borderLeft:`2px solid ${selUI.color}`,borderRadius:2,padding:"10px 14px",minWidth:200,boxShadow:`0 0 30px ${selUI.color}10`,animation:"fadein .2s ease"}}>
//                 <div style={{fontSize:7,color:selUI.color+"88",letterSpacing:2.5,marginBottom:3,fontFamily:"monospace"}}>◈ LIVE TRACK // CESIUM+SGP4</div>
//                 <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,color:selUI.color,letterSpacing:1,marginBottom:7}}>{selUI.name}</div>
//                 {[["LAT",`${selPos.lat.toFixed(4)}°`],["LON",`${selPos.lon.toFixed(4)}°`],["ALT",`${selPos.alt.toFixed(1)} km`],["TYPE",selUI.type],["OWNER",selUI.owner]].map(([k,v])=>(
//                   <div key={k} style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:2}}>
//                     <span style={{fontSize:8,color:"rgba(200,216,232,0.28)",letterSpacing:1,fontFamily:"monospace"}}>{k}</span>
//                     <span style={{fontSize:9,color:"#a8c8d8",fontFamily:"monospace"}}>{v}</span>
//                   </div>
//                 ))}
//                 <div style={{display:"flex",gap:5,marginTop:8}}>
//                   <button className="tbtn" style={{flex:1,fontSize:8,padding:"3px 5px"}} onClick={()=>flyToSat(selUI.id)}>🎯 ZOOM</button>
//                   <button className="tbtn" style={{flex:1,fontSize:8,padding:"3px 5px"}} onClick={()=>setSel(null)}>✕ CLEAR</button>
//                 </div>
//               </div>
//             )}

//             {/* Sat quick-select strip */}
//             <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(5,10,18,0.9)",borderTop:"1px solid rgba(255,255,255,0.06)",padding:"4px 10px",display:"flex",flexWrap:"wrap",gap:3,zIndex:5}}>
//               {SAT_CATALOG.map(m=>(
//                 <span key={m.id} onClick={()=>{
//                   const sel=selUI?.id===m.id;
//                   setSel(sel?null:m);
//                   if(!sel){
//                     const sit2=SITUATIONS.find(s=>s.id===m.id);
//                     if(sit2){setActiveSit(sit2);setTab("summary");}
//                     if(window.Cesium&&viewerRef.current) highlightSat(window.Cesium,m.id);
//                   }
//                 }} style={{display:"inline-flex",alignItems:"center",gap:3,padding:"1px 7px",borderRadius:2,fontSize:8,letterSpacing:1,cursor:"pointer",border:`1px solid ${selUI?.id===m.id?m.color+"77":m.color+"22"}`,color:selUI?.id===m.id?m.color:m.color+"66",background:selUI?.id===m.id?m.color+"10":"transparent",transition:"all .1s",fontFamily:"monospace"}}>
//                   <span style={{width:4,height:4,borderRadius:"50%",background:"currentColor",display:"inline-block",flexShrink:0}}/>
//                   {m.id}
//                 </span>
//               ))}
//               <span style={{marginLeft:"auto",fontSize:7,color:"rgba(200,216,232,0.15)",alignSelf:"center",letterSpacing:1}}>DRAG · SCROLL · CLICK SAT</span>
//             </div>
//           </div>

//           {/* Right panel */}
//           <div style={{width:rightPanelOpen?280:0,flexShrink:0,background:"#0d1828",borderLeft:rightPanelOpen?"1px solid rgba(255,255,255,0.07)":"none",display:"flex",flexDirection:"column",minHeight:0,boxShadow:rightPanelOpen?"-2px 0 12px rgba(0,0,0,0.4)":"none",overflow:"hidden",transition:"width .2s ease"}}>
//             {sit&&(<>
//               {/* Threat Timeline — live from alerts state */}
//               <div style={{padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0}}>
//                 <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(200,216,232,0.4)",marginBottom:8,display:"flex",alignItems:"center",gap:5}}>
//                   <span style={{width:3,height:10,background:"#c0192c",borderRadius:1,display:"inline-block"}}/>THREAT TIMELINE
//                   {running&&<span style={{fontSize:7,color:"#4dd9a0",fontFamily:"monospace",marginLeft:"auto",animation:"dp 1.2s infinite"}}>● LIVE</span>}
//                 </div>
//                 {alerts.length===0?(
//                   <div style={{fontSize:9,color:"rgba(200,216,232,0.2)",fontStyle:"italic",fontFamily:"monospace"}}>No events — start monitor to track activity</div>
//                 ):(
//                   <div style={{display:"flex",flexDirection:"column",gap:6}}>
//                     {alerts.slice(0,4).map((ev,i)=>(
//                       <div key={i} style={{display:"flex",gap:8,paddingLeft:8,borderLeft:`2px solid ${THREAT_META[ev.lvl].color}`}}>
//                         <div style={{fontSize:8,color:"rgba(200,216,232,0.3)",fontFamily:"monospace",flexShrink:0,whiteSpace:"nowrap"}}>{ev.ts}</div>
//                         <div style={{flex:1}}>
//                           <div style={{fontSize:8.5,fontWeight:600,color:THREAT_META[ev.lvl].color}}>{THREAT_META[ev.lvl].label}</div>
//                           <div style={{fontSize:9,color:"rgba(200,216,232,0.55)",lineHeight:1.4}}>{ev.msg}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Conjunction Risk — real distances from live SGP4 positions */}
//               <div style={{padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0}}>
//                 <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(200,216,232,0.4)",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
//                   <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:3,height:10,background:"#c0192c",borderRadius:1,display:"inline-block"}}/>CONJUNCTION RISK</span>
//                   <span style={{fontSize:7,color:"rgba(200,216,232,0.25)",letterSpacing:1,fontFamily:"monospace"}}>LIVE · SGP4</span>
//                 </div>
//                 {(()=>{
//                   const pairs=computeConjunctions();
//                   if(pairs.length===0) return(
//                     <div style={{fontSize:9,color:"rgba(200,216,232,0.2)",fontStyle:"italic",fontFamily:"monospace"}}>No close approaches detected</div>
//                   );
//                   return(
//                     <div style={{display:"flex",flexDirection:"column",gap:3}}>
//                       {pairs.map((c,i)=>{
//                         const rm=THREAT_META[c.risk];
//                         return(
//                           <div key={i} style={{background:rm.color+"12",border:`1px solid ${rm.color}30`,borderRadius:2,padding:"5px 7px"}}>
//                             <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
//                               <div style={{display:"flex",alignItems:"center",gap:4,minWidth:0}}>
//                                 <span style={{fontSize:7.5,fontWeight:700,color:rm.color,fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.obj1}</span>
//                                 <span style={{fontSize:8,color:"rgba(200,216,232,0.25)",flexShrink:0}}>↔</span>
//                                 <span style={{fontSize:7.5,fontWeight:700,color:"rgba(200,216,232,0.6)",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.obj2}</span>
//                               </div>
//                               <span style={{fontSize:7,fontWeight:700,color:rm.color,letterSpacing:0.5,padding:"1px 4px",background:rm.color+"22",borderRadius:2,flexShrink:0,marginLeft:4}}>{rm.label}</span>
//                             </div>
//                             <div style={{display:"flex",gap:10}}>
//                               <div><span style={{fontSize:7,color:"rgba(200,216,232,0.25)"}}>DIST </span><span style={{fontSize:8.5,fontWeight:700,color:"#9ab8cc",fontFamily:"monospace"}}>{c.dca} km</span></div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   );
//                 })()}
//               </div>

//               {/* Intel overview */}
//               <div style={{flex:1,overflowY:"auto",padding:"10px 14px",minHeight:0}}>
//                 <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(200,216,232,0.4)",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
//                   <span style={{display:"flex",alignItems:"center",gap:5}}>
//                     <span style={{width:3,height:10,background:"#8a3800",borderRadius:1,display:"inline-block"}}/>INTEL OVERVIEW
//                   </span>
//                   <span style={{display:"flex",alignItems:"center",gap:4}}>
//                     {intelLoading
//                       ? <span style={{fontSize:7,color:"#4dd9a0",letterSpacing:1,fontFamily:"monospace",animation:"dp 1s infinite"}}>● FETCHING</span>
//                       : intelSitId===sit.id&&intelText
//                         ? <span style={{fontSize:7,color:"#4dd9a0",letterSpacing:1,fontFamily:"monospace"}}>● LIVE</span>
//                         : <span style={{fontSize:7,color:"rgba(200,216,232,0.2)",letterSpacing:1,fontFamily:"monospace"}}>○ STATIC</span>
//                     }
//                     <button onClick={()=>fetchIntelOverview(sit)} title="Refresh intel" style={{background:"transparent",border:"none",color:"rgba(200,216,232,0.25)",cursor:"pointer",fontSize:10,padding:"0 2px",lineHeight:1}}
//                       onMouseEnter={e=>e.currentTarget.style.color="#4dd9a0"}
//                       onMouseLeave={e=>e.currentTarget.style.color="rgba(200,216,232,0.25)"}>↻</button>
//                   </span>
//                 </div>

//                 {intelLoading?(
//                   /* Loading shimmer */
//                   <div style={{display:"flex",flexDirection:"column",gap:6}}>
//                     {[100,85,92,70].map((w,i)=>(
//                       <div key={i} style={{height:9,width:`${w}%`,background:"rgba(255,255,255,0.06)",borderRadius:2,animation:"dp 1.4s ease-in-out infinite",animationDelay:`${i*0.15}s`}}/>
//                     ))}
//                   </div>
//                 ):(
//                   intelSitId===sit.id&&intelText ? (
//                     <div style={{fontSize:10,lineHeight:1.88,color:"rgba(200,216,232,0.6)"}}>
//                       <HighlightText text={intelText}/>
//                     </div>
//                   ) : (
//                     <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingTop:20,gap:8,opacity:0.4}}>
//                       <div style={{fontSize:22}}>📡</div>
//                       <div style={{fontSize:9,color:"rgba(200,216,232,0.5)",fontFamily:"monospace",letterSpacing:1,textAlign:"center"}}>
//                         {groq ? "FETCHING LIVE INTEL…" : "SET GROQ KEY TO ENABLE"}
//                       </div>
//                     </div>
//                   )
//                 )}

//                 <button className="wpbtn" style={{marginTop:10,width:"100%",justifyContent:"center",fontSize:10}} onClick={()=>setTab("intel")}>
//                   View full report →
//                 </button>

//                 {/* Alerts */}
//                 {alerts.length>0&&(
//                   <div style={{marginTop:12}}>
//                     <div style={{fontSize:9,fontWeight:700,letterSpacing:1.5,color:"rgba(200,216,232,0.4)",marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
//                       <span style={{width:3,height:10,background:"#c0192c",borderRadius:1,display:"inline-block"}}/>RECENT ALERTS
//                     </div>
//                     {alerts.slice(0,4).map((a,i)=>(
//                       <div key={i} style={{padding:"4px 8px",marginBottom:3,fontSize:9,borderLeft:`2px solid ${THREAT_META[a.lvl].color}`,background:THREAT_META[a.lvl].color+"14",borderRadius:"0 2px 2px 0",color:"rgba(200,216,232,0.6)"}}>
//                         <span style={{color:THREAT_META[a.lvl].color,fontSize:7.5,display:"block",fontFamily:"monospace"}}>{a.ts}</span>
//                         {a.msg}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </>)}
//           </div>
//         </div>
//       </div>

//       {/* ══ STATUS BAR ══════════════════════════════════════════════════════ */}
//       <div style={{height:24,flexShrink:0,background:"#0f1822",borderTop:"1px solid #0a1218",display:"flex",alignItems:"center",padding:"0 12px",fontSize:8,fontFamily:"'Share Tech Mono',monospace",color:"rgba(200,216,232,0.2)",letterSpacing:0.5,gap:0}}>
//         <span style={{marginRight:14,letterSpacing:2}}>GOTHAM ORBITAL v9 — CESIUM</span>
//         <span style={{marginRight:12}}>SGP4 REALTIME</span>
//         <span style={{marginRight:12,color:tleStatus==="live"?"rgba(77,217,160,0.4)":"rgba(240,192,64,0.4)"}}>TLE: {tleStatus.toUpperCase()}</span>
//         <span style={{marginRight:12}}>OBJECTS: {SAT_CATALOG.length}</span>
//         <span style={{flex:1}}/>
//         <span style={{color:running?"rgba(77,217,160,0.4)":"rgba(200,216,232,0.15)"}}>{running?`● CYCLE ${cycle} ACTIVE`:"○ STANDBY"}</span>
//         <span style={{marginLeft:14,color:"rgba(200,216,232,0.12)"}}>{clock}</span>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// GOTHAM ORBITAL v9 — CesiumJS Edition
// Photorealistic Earth · 3D orbital paths · Satellite markers · Palantir UI
// ─────────────────────────────────────────────────────────────────────────────

const SAT_CATALOG = [
  { id:"ISS",        name:"ISS (ZARYA)",      owner:"NASA/Roscosmos", color:"#00eeff", orbitColor:"#00eeff", threat:0, type:"CIVILIAN"    },
  { id:"TIANGONG",   name:"CSS Tiangong",     owner:"CNSA",           color:"#ffcc00", orbitColor:"#ffcc00", threat:1, type:"MILITARY"    },
  { id:"NOAA19",     name:"NOAA-19",          owner:"NOAA",           color:"#44ffaa", orbitColor:"#44ffaa", threat:0, type:"WEATHER"     },
  { id:"TERRA",      name:"Terra EOS AM-1",   owner:"NASA",           color:"#66ccff", orbitColor:"#66ccff", threat:0, type:"SCIENCE"     },
  { id:"AQUA",       name:"Aqua EOS PM-1",    owner:"NASA",           color:"#4488ff", orbitColor:"#4488ff", threat:0, type:"SCIENCE"     },
  { id:"SENTINEL2B", name:"Sentinel-2B",      owner:"ESA",            color:"#44ff88", orbitColor:"#44ff88", threat:0, type:"OBSERVATION" },
  { id:"STARLINK30", name:"Starlink-1007",    owner:"SpaceX",         color:"#88aacc", orbitColor:"#88aacc", threat:0, type:"COMMERCIAL"  },
  { id:"STARLINK31", name:"Starlink-2341",    owner:"SpaceX",         color:"#88aacc", orbitColor:"#88aacc", threat:0, type:"COMMERCIAL"  },
  { id:"IRIDIUM140", name:"IRIDIUM-140",      owner:"Iridium",        color:"#aabbcc", orbitColor:"#aabbcc", threat:0, type:"COMMERCIAL"  },
  { id:"GPS001",     name:"GPS IIF-2",        owner:"USAF",           color:"#bb88ff", orbitColor:"#bb88ff", threat:1, type:"NAVIGATION"  },
  { id:"GLONASS",    name:"GLONASS-M 730",    owner:"Russia",         color:"#ff4466", orbitColor:"#ff4466", threat:1, type:"NAVIGATION"  },
  { id:"COSMOS2543", name:"COSMOS-2543",      owner:"Russia",         color:"#ff1133", orbitColor:"#ff1133", threat:3, type:"MILITARY"    },
  { id:"YAOGAN30",   name:"YAOGAN-30F",       owner:"China/PLA",      color:"#ff8800", orbitColor:"#ff8800", threat:2, type:"MILITARY"    },
  { id:"LACROSSE5",  name:"USA-182",          owner:"NRO",            color:"#ff6600", orbitColor:"#ff6600", threat:2, type:"INTEL"       },
];

const THREAT_META = [
  { label:"NOMINAL",  color:"#1a7a4a", bg:"#e8f5ee", border:"#a8d8bc" },
  { label:"MONITOR",  color:"#7a6a00", bg:"#fdf7e0", border:"#d4c060" },
  { label:"ELEVATED", color:"#8a3800", bg:"#fdf0e8", border:"#d4906a" },
  { label:"CRITICAL", color:"#8a0015", bg:"#fde8ea", border:"#d46070" },
];

const SITUATIONS = [
  { id:"COSMOS2543", classification:"SECRET//NOFORN",              affColor:"#c0192c" },
  { id:"YAOGAN30",   classification:"SECRET",                      affColor:"#c14b2a" },
  { id:"ISS",        classification:"UNCLASSIFIED//FOR OFFICIAL USE ONLY", affColor:"#2a7fc1" },
];

// ── Fallback TLEs ─────────────────────────────────────────────────────────────
const FALLBACK_TLES = {
  ISS:        { line1:"1 25544U 98067A   25074.50000000  .00006000  00000-0  11000-3 0  9991", line2:"2 25544  51.6400 110.8400 0003400  85.0000 275.1000 15.49560000498765" },
  TIANGONG:   { line1:"1 48274U 21035A   25074.50000000  .00002800  00000-0  32000-4 0  9993", line2:"2 48274  41.4700 253.1200 0006100 181.0000 179.0000 15.61200000215432" },
  NOAA19:     { line1:"1 33591U 09005A   25074.50000000  .00000300  00000-0  20000-3 0  9990", line2:"2 33591  99.1200  46.2300 0013400 258.0000 101.9000 14.12400000823456" },
  TERRA:      { line1:"1 25994U 99068A   25074.50000000  .00000100  00000-0  30000-4 0  9992", line2:"2 25994  98.2100 100.5400 0001200  90.0000 270.1000 14.57300000312345" },
  AQUA:       { line1:"1 27424U 02022A   25074.50000000  .00000100  00000-0  32000-4 0  9991", line2:"2 27424  98.2000 100.1200 0001100  85.0000 275.2000 14.57300000421234" },
  SENTINEL2B: { line1:"1 42063U 17013A   25074.50000000  .00000100  00000-0  28000-4 0  9993", line2:"2 42063  98.5700 106.7800 0001100  90.0000 270.1000 14.30900000512345" },
  STARLINK30: { line1:"1 44932U 19074B   25074.50000000  .00002000  00000-0  14000-3 0  9997", line2:"2 44932  53.0500  23.4500 0001400 102.0000 258.1000 15.05600000289012" },
  STARLINK31: { line1:"1 46045U 20073C   25074.50000000  .00002100  00000-0  15000-3 0  9994", line2:"2 46045  53.0500  18.2300 0001200  98.0000 262.1000 15.05500000301234" },
  IRIDIUM140: { line1:"1 43571U 18061E   25074.50000000  .00000200  00000-0  50000-4 0  9995", line2:"2 43571  86.3900 312.4500 0002100  90.0000 270.1000 14.34200000198765" },
  GPS001:     { line1:"1 37753U 11036A   25074.50000000 -.00000100  00000-0  00000+0 0  9993", line2:"2 37753  55.4500 160.2300 0103400 245.0000 114.1000  2.00560000102345" },
  GLONASS:    { line1:"1 39155U 13015A   25074.50000000  .00000000  00000-0  00000+0 0  9991", line2:"2 39155  64.8500 212.3400 0013400 280.0000  79.9000  2.13100000187654" },
  COSMOS2543: { line1:"1 44547U 19075A   25074.50000000  .00000200  00000-0  00000+0 0  9998", line2:"2 44547  97.7700 101.2300 0012100  95.0000 265.2000 14.77200000298765" },
  YAOGAN30:   { line1:"1 43163U 18010A   25074.50000000  .00000500  00000-0  50000-4 0  9992", line2:"2 43163  35.0200  85.6700 0005600 201.0000 158.9000 15.21100000412345" },
  LACROSSE5:  { line1:"1 28646U 05016A   25074.50000000  .00000300  00000-0  00000+0 0  9990", line2:"2 28646  57.0000  92.3400 0012300 180.0000 179.9000 15.02300000301234" },
};

// ── Metal ticker ──────────────────────────────────────────────────────────────
function useMetals() {
  const [p, setP] = useState({ gold: 0, silver: 0, gd: 0, sd: 0 });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const API_KEY = import.meta.env.VITE_METALS_API_KEY;

        const [goldRes, silverRes] = await Promise.all([
          fetch("https://www.goldapi.io/api/XAU/USD", {
            headers: { "x-access-token": API_KEY, "Content-Type": "application/json" }
          }),
          fetch("https://www.goldapi.io/api/XAG/USD", {
            headers: { "x-access-token": API_KEY, "Content-Type": "application/json" }
          })
        ]);

        const goldData   = await goldRes.json();
        const silverData = await silverRes.json();

        const gold   = +goldData.price.toFixed(2);
        const silver = +silverData.price.toFixed(3);

        setP(prev => ({
          gold,
          silver,
          gd: +(goldData.ch).toFixed(2),
          sd: +(silverData.ch).toFixed(3),
        }));
      } catch (e) {
        console.warn("Metals fetch failed:", e.message);
      }
    };

    fetchPrices();
    const iv = setInterval(fetchPrices, 28800000);
    return () => clearInterval(iv);
  }, []);

  return p;
}


// ── Backend helpers ───────────────────────────────────────────────────────────
async function apiAgent(url, sec, groq, tav, role, msg, snap) {
  const r = await fetch(`${url}/agent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": sec,
      "x-groq-key": groq,
      "x-tavily-key": tav,
    },
    body: JSON.stringify({ role, user_message: msg, satellite_snapshot: snap }),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  // Pass through needs_input objects intact; otherwise return the text
  if (d.needs_input) return d;
  return d.response || d.output || d.result || d.message || JSON.stringify(d);
}

async function apiQuery(url, sec, groq, tav, query, snap) {
  const r = await fetch(`${url}/intel-query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": sec,
      "x-groq-key": groq,
      "x-tavily-key": tav,
    },
    body: JSON.stringify({ query, satellite_snapshot: snap }),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const d = await r.json();
  return { response: d.response || d.output || d.result || JSON.stringify(d), relevant_ids: d.relevant_ids || [] };
}

// ── callAgentWithAskUser — wraps apiAgent with ask_user / resume flow ─────────
async function callAgentWithAskUser({
  bUrl, bSec, groq, tavily,
  role, message, snap,
  setAskModal,
}) {
  const out = await apiAgent(bUrl, bSec, groq, tavily, role, message, snap);

  if (out && typeof out === "object" && out.needs_input) {
    return new Promise((resolve) => {
      setAskModal({
        question:  out.question,
        sessionId: out.session_id,
        agentId:   role,
        onAnswer: async (answer) => {
          setAskModal(null);
          try {
            const resumed = await fetch(`${bUrl}/agent/resume`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": bSec,
                "x-groq-key": groq,
                "x-tavily-key": tavily,
              },
              body: JSON.stringify({
                session_id: out.session_id,
                answer,
                satellite_snapshot: snap,
              }),
            });
            if (!resumed.ok) throw new Error(`HTTP ${resumed.status}`);
            const d = await resumed.json();
            resolve(d.response || "[no response]");
          } catch (e) {
            resolve(`[Resume error: ${e.message}]`);
          }
        },
      });
    });
  }

  return out; // normal string response
}

// ── SGP4 helpers ──────────────────────────────────────────────────────────────
function propagate(satrec, t) {
  try {
    const pv = window.satellite.propagate(satrec, t);
    if (!pv?.position) return null;
    const gmst = window.satellite.gstime(t);
    const geo = window.satellite.eciToGeodetic(pv.position, gmst);
    return { lat: window.satellite.degreesLat(geo.latitude), lon: window.satellite.degreesLong(geo.longitude), alt: geo.height };
  } catch { return null; }
}

// Convert lat/lon/alt to Cesium Cartesian3
function toCesium(Cesium, lat, lon, altKm) {
  return Cesium.Cartesian3.fromDegrees(lon, lat, altKm * 1000);
}

// ── Entity highlighting ───────────────────────────────────────────────────────
const ENTITIES_RE = ["COSMOS-2543","GPS IIF-2","YAOGAN-30F","South China Sea","PLA","PLAAF","VKS","ISS","Tiangong","NRO","SpaceX","Iridium","Guam","Okinawa"];
function HighlightText({ text }) {
  if (!text) return null;
  let parts = [{ t: text, k: "r0" }];
  ENTITIES_RE.forEach((ent, ei) => {
    parts = parts.flatMap((p, pi) => {
      if (typeof p.t !== "string") return [p];
      const segs = p.t.split(new RegExp(`(${ent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
      return segs.map((s, i) => ({
        t: i % 2 === 1 ? <mark key={`e${ei}p${pi}s${i}`} style={{ background: "rgba(42,143,192,0.25)", color: "#7ec8e8", borderRadius: 1, padding: "0 2px", fontWeight: 600 }}>{s}</mark> : s,
        k: `e${ei}p${pi}s${i}`,
      }));
    });
  });
  return <>{parts.map((p, i) => <span key={p.k + i}>{p.t}</span>)}</>;
}

// ── Classification banner ─────────────────────────────────────────────────────
function ClassBanner({ cls }) {
  const isSecret = cls?.includes("SECRET");
  const isU = cls?.includes("UNCLASSIFIED");
  const c = isSecret ? "#8a0015" : isU ? "#1a5c2a" : "#444";
  const bg = isSecret ? "#fde8ea" : isU ? "#e8f5ee" : "#f0f0f0";
  return (
    <div style={{ background: bg, padding: "2px 16px", fontSize: 9, letterSpacing: 2, color: c, fontWeight: 700, fontFamily: "monospace", textAlign: "center", borderBottom: `1px solid ${c}33` }}>
      {cls}
    </div>
  );
}

// ── MilSymbol unit ────────────────────────────────────────────────────────────
function MilUnit({ sym, label, role, count, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ width: 40, height: 40, border: `2px solid ${color}`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", position: "relative", boxShadow: `0 1px 4px ${color}22` }}>
        <span style={{ fontSize: 18, color }}>{sym}</span>
        {count > 1 && <div style={{ position: "absolute", top: -6, right: -6, width: 16, height: 16, borderRadius: "50%", background: "#2a7fc1", color: "white", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>{count}x</div>}
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#2a3540", letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: 7.5, color: "#6a7a88" }}>{role}</div>
      </div>
    </div>
  );
}

// ── Section head ──────────────────────────────────────────────────────────────
function PHead({ icon, title, sub, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 12px", background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {icon && <span style={{ fontSize: 9, color: "rgba(200,216,232,0.35)" }}>{icon}</span>}
        <span style={{ fontSize: 8, color: "#9ab8cc", letterSpacing: 1.8, fontFamily: "monospace", fontWeight: 700 }}>{title}</span>
        {sub && <span style={{ fontSize: 7.5, color: "rgba(200,216,232,0.25)", letterSpacing: 1 }}>/ {sub}</span>}
      </div>
      {right}
    </div>
  );
}

// ── Agent card ────────────────────────────────────────────────────────────────
function AgentCard({ a }) {
  const [open, setOpen] = useState(true);
  const sc = { idle: "#1e3040", running: "#4dd9a0", done: "#4ab8f5", error: "#ff4455" };
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 10px", cursor: "pointer", borderLeft: `2px solid ${sc[a.status]}`, background: a.status === "running" ? "rgba(77,217,160,0.03)" : "transparent" }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", flexShrink: 0, background: sc[a.status], boxShadow: a.status === "running" ? `0 0 7px ${sc[a.status]}` : "none", animation: a.status === "running" ? "dp 1s ease-in-out infinite" : "none" }} />
        <span style={{ flex: 1, fontSize: 8, color: "rgba(200,216,232,0.5)", letterSpacing: 1.5, fontFamily: "monospace" }}>{a.name}</span>
        {a.status === "running" && <span style={{ fontSize: 7.5, color: "#4dd9a0", animation: "blt .8s step-end infinite" }}>●</span>}
        <span style={{ fontSize: 8, color: sc[a.status], letterSpacing: 1, opacity: 0.7 }}>{a.status.toUpperCase()}</span>
        <span style={{ fontSize: 7.5, color: "rgba(200,216,232,0.15)" }}>{open ? "▾" : "▸"}</span>
      </div>
      {open && (
        <div style={{ margin: "0 10px 6px 18px", padding: "6px 10px", background: "rgba(0,0,0,0.22)", border: "1px solid rgba(255,255,255,0.05)", fontSize: 9.5, lineHeight: 1.72, fontFamily: "'Courier New',monospace", color: a.status === "error" ? "#ff8888" : a.output ? "#7aaabb" : "rgba(200,216,232,0.14)", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 150, overflowY: "auto" }}>
          {a.output || (a.status === "idle" ? "— awaiting activation —" : a.status === "running" ? "Querying backend..." : "no output")}
        </div>
      )}
    </div>
  );
}

// ── AskUserModal ──────────────────────────────────────────────────────────────
function AskUserModal({ question, onSubmit, onDismiss }) {
  const [answer, setAnswer] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const submit = () => {
    if (!answer.trim()) return;
    onSubmit(answer.trim());
    setAnswer("");
  };

  if (!question) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,8,16,0.82)",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadein .18s ease",
    }}>
      <div style={{
        background: "#0d1828",
        border: "1px solid rgba(42,143,192,0.35)",
        borderTop: "2px solid #2a8fc0",
        borderRadius: 4,
        padding: "24px 28px",
        maxWidth: 480,
        width: "90%",
        boxShadow: "0 0 60px rgba(42,143,192,0.15), 0 20px 40px rgba(0,0,0,0.6)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{
            width: 28, height: 28,
            border: "1px solid rgba(42,143,192,0.4)",
            borderRadius: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(42,143,192,0.08)",
          }}>
            <span style={{ fontSize: 13, color: "#4ab8f5" }}>?</span>
          </div>
          <div>
            <div style={{ fontSize: 8, color: "rgba(200,216,232,0.3)", letterSpacing: 2, fontFamily: "monospace" }}>
              AGENT REQUEST // INPUT REQUIRED
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#7ec8e8", letterSpacing: 0.5 }}>
              OPERATOR INPUT NEEDED
            </div>
          </div>
          <button
            onClick={onDismiss}
            style={{
              marginLeft: "auto", background: "transparent",
              border: "none", color: "rgba(200,216,232,0.25)",
              cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 2,
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#ff5566"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(200,216,232,0.25)"}
          >✕</button>
        </div>

        {/* Question */}
        <div style={{
          background: "rgba(42,143,192,0.06)",
          border: "1px solid rgba(42,143,192,0.15)",
          borderLeft: "3px solid #2a8fc0",
          borderRadius: "0 3px 3px 0",
          padding: "10px 14px",
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, lineHeight: 1.75, color: "rgba(200,216,232,0.8)", fontFamily: "'Share Tech Mono', monospace" }}>
            {question}
          </div>
        </div>

        {/* Input */}
        <textarea
          ref={inputRef}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Type your answer… (Enter to submit)"
          rows={3}
          style={{
            width: "100%", background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 3, color: "#c8d8e8",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11, padding: "8px 10px",
            resize: "vertical", outline: "none",
            transition: "border-color .15s",
            boxSizing: "border-box",
          }}
          onFocus={e => e.currentTarget.style.borderColor = "rgba(42,143,192,0.5)"}
          onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
        />

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
          <button
            onClick={onDismiss}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(200,216,232,0.4)", borderRadius: 2,
              padding: "6px 14px", cursor: "pointer",
              fontSize: 9, letterSpacing: 1, fontFamily: "monospace",
              transition: "all .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#ff5566"; e.currentTarget.style.color = "#ff5566"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(200,216,232,0.4)"; }}
          >
            DISMISS
          </button>
          <button
            onClick={submit}
            disabled={!answer.trim()}
            style={{
              background: answer.trim() ? "rgba(42,143,192,0.2)" : "rgba(42,143,192,0.05)",
              border: `1px solid ${answer.trim() ? "#2a8fc0" : "rgba(42,143,192,0.2)"}`,
              color: answer.trim() ? "#7ec8e8" : "rgba(200,216,232,0.2)",
              borderRadius: 2, padding: "6px 18px", cursor: answer.trim() ? "pointer" : "not-allowed",
              fontSize: 9, letterSpacing: 1.5, fontFamily: "monospace", fontWeight: 700,
              transition: "all .15s",
            }}
          >
            ▶ SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function GothamOrbital() {
  const cesiumContainerRef = useRef(null);
  const viewerRef          = useRef(null);
  const satEntitiesRef     = useRef({});
  const orbitEntitiesRef   = useRef({});
  const satrecsRef         = useRef({});
  const posRef             = useRef({});
  const selRef             = useRef(null);
  const hlRef              = useRef([]);
  const agentTimer         = useRef(null);
  const updateTimer        = useRef(null);

  const metals = useMetals();

  const [ready,     setReady]     = useState(false);
  const [tleStatus, setTleStatus] = useState("loading");
  const [bUrl, setBUrl] = useState(import.meta.env.VITE_BACKEND_URL || "/api");
  const [bSec,      setBSec]      = useState("");
  const [groq,      setGroq]      = useState("");
  const [tavily,    setTavily]    = useState("");
  const [selUI,     setSelUI]     = useState(null);
  const [selPos,    setSelPos]    = useState(null);
  const [running,   setRunning]   = useState(false);
  const [cycle,     setCycle]     = useState(0);
  const [nlQ,       setNlQ]       = useState("");
  const [nlR,       setNlR]       = useState(null);
  const [nlLoad,    setNlLoad]    = useState(false);
  const [alerts,    setAlerts]    = useState([]);
  const [tab,       setTab]       = useState("summary");
  const [activeSit, setActiveSit] = useState(SITUATIONS[0]);
  const [search,    setSearch]    = useState("");
  const [clock,     setClock]     = useState("");
  const [classification, setClassification] = useState("SECRET//NOFORN");
  const [leftPanelOpen,  setLeftPanelOpen]  = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [intelText,      setIntelText]      = useState("");
  const [intelLoading,   setIntelLoading]   = useState(false);
  const [intelSitId,     setIntelSitId]     = useState(null);
  const [tabLiveText,    setTabLiveText]    = useState({ intel: "", sigact: "" });
  const [tabLiveLoading, setTabLiveLoading] = useState({ intel: false, sigact: false });
  const [tabLiveSitId,   setTabLiveSitId]   = useState({ intel: null, sigact: null });
  const [agents, setAgents] = useState([
    { id: "orbital", name: "ORBITAL MONITOR",   status: "idle", output: "" },
    { id: "news",    name: "GEOPOLITICAL FEED",  status: "idle", output: "" },
    { id: "analyst", name: "SYNTHESIS ENGINE",   status: "idle", output: "" },
  ]);

  // ── AskUser modal state ────────────────────────────────────────────────────
  const [askModal, setAskModal] = useState(null);
  // askModal shape: { question: string, sessionId: string, agentId: string, onAnswer: fn }

  useEffect(() => { const iv = setInterval(() => setClock(new Date().toUTCString()), 1000); return () => clearInterval(iv); }, []);

  // ── Live Intel Overview fetch ──────────────────────────────────────────────
  const fetchIntelOverview = useCallback(async (sit) => {
    if (!sit) return;
    setIntelLoading(true);
    setIntelSitId(sit.id);
    try {
      const snap = SAT_CATALOG.map(m => {
        const s = satrecsRef.current[m.id]; if (!s) return null;
        const p = propagate(s, new Date()); if (!p) return null;
        return `${m.id}(${m.owner},T${m.threat}): lat=${p.lat.toFixed(2)} lon=${p.lon.toFixed(2)} alt=${p.alt.toFixed(0)}km`;
      }).filter(Boolean).join("\n");
      const q = `Provide a concise 3-sentence operational intelligence summary for satellite ${sit.id} (classification: ${sit.classification}). Focus on current threat posture, orbital behavior, and risk to US/allied assets based on the live satellite snapshot.`;
      const { response } = await apiQuery(bUrl, bSec, groq, tavily, q, snap);
      setIntelText(response);
    } catch {
      setIntelText("");
    }
    setIntelLoading(false);
  }, [bUrl, bSec, groq, tavily]);

  useEffect(() => { fetchIntelOverview(activeSit); }, [activeSit]); // eslint-disable-line
  useEffect(() => { if (running && cycle > 0) fetchIntelOverview(activeSit); }, [cycle]); // eslint-disable-line

  // ── Live tab content (Intel / SIGACTs) ────────────────────────────────────
  const fetchTabContent = useCallback(async (sit, tabName) => {
    if (!sit || !groq) return;
    setTabLiveLoading(p => ({ ...p, [tabName]: true }));
    setTabLiveSitId(p => ({ ...p, [tabName]: sit.id }));
    try {
      const snap = SAT_CATALOG.map(m => {
        const s = satrecsRef.current[m.id]; if (!s) return null;
        const p = propagate(s, new Date()); if (!p) return null;
        return `${m.id}(${m.owner},T${m.threat}): lat=${p.lat.toFixed(2)} lon=${p.lon.toFixed(2)} alt=${p.alt.toFixed(0)}km`;
      }).filter(Boolean).join("\n");
      const prompts = {
        intel: `You are a space intelligence analyst. For satellite object ${sit.id} (classification: ${sit.classification}), provide 3-4 structured intelligence reports covering recent orbital activity, threat assessment, and operational significance. Format each as: [TIMESTAMP] SOURCE: text. Be concise and technical.`,
        sigact: `You are a space domain awareness operator. For object ${sit.id}, generate 4-5 significant activity entries in chronological order (most recent first). Format each as JSON array: [{ts, type, cls, src, title, body, color}] where color is a hex code based on severity (red=#c0192c, amber=#ff8800, yellow=#f0c040). Types: MANEUVER, SEPARATION, TRACK INIT, CONJUNCTION, LAUNCH PHASE. Return only the JSON array, no markdown.`,
      };
      const out = await apiAgent(bUrl, bSec, groq, tavily, "analyst", prompts[tabName], snap);
      // out is a string here (no needs_input expected for tab fetches)
      setTabLiveText(p => ({ ...p, [tabName]: typeof out === "string" ? out : out.response || "" }));
    } catch (e) {
      setTabLiveText(p => ({ ...p, [tabName]: `[Backend unavailable: ${e.message}]` }));
    }
    setTabLiveLoading(p => ({ ...p, [tabName]: false }));
  }, [bUrl, bSec, groq, tavily]);

  // ── Real conjunction distances from live SGP4 positions ───────────────────
  function computeConjunctions() {
    const now = new Date();
    const positions = {};
    SAT_CATALOG.forEach(m => {
      const s = satrecsRef.current[m.id]; if (!s) return;
      const p = propagate(s, now); if (!p) return;
      const R = 6371 + p.alt;
      const lat = p.lat * Math.PI / 180, lon = p.lon * Math.PI / 180;
      positions[m.id] = { x: R * Math.cos(lat) * Math.cos(lon), y: R * Math.cos(lat) * Math.sin(lon), z: R * Math.sin(lat), meta: m };
    });
    const pairs = [];
    const ids = Object.keys(positions);
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const a = positions[ids[i]], b = positions[ids[j]];
      const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 1500) pairs.push({ obj1: ids[i], obj2: ids[j], dca: dist.toFixed(0), risk: dist < 200 ? 3 : dist < 500 ? 2 : dist < 1000 ? 1 : 0 });
    }
    return pairs.sort((a, b) => a.dca - b.dca).slice(0, 5);
  }

  const pushAlert  = useCallback((msg, lvl = 1) => setAlerts(p => [{ msg, lvl, ts: new Date().toISOString().slice(11, 19) }, ...p].slice(0, 30)), []);
  const patchAgent = useCallback((id, patch) => setAgents(p => p.map(a => a.id === id ? { ...a, ...patch } : a)), []);
  const setSel     = useCallback((sat) => { selRef.current = sat; setSelUI(sat); setSelPos(null); }, []);
  const setHl      = useCallback((ids) => { hlRef.current = ids; }, []);

  const snapshot = useCallback(() => SAT_CATALOG.map(m => {
    const s = satrecsRef.current[m.id]; if (!s) return null;
    const p = propagate(s, new Date()); if (!p) return null;
    return `${m.id}(${m.owner},T${m.threat}): lat=${p.lat.toFixed(2)} lon=${p.lon.toFixed(2)} alt=${p.alt.toFixed(0)}km`;
  }).filter(Boolean).join("\n"), []);

  // ── Boot ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let dead = false;
    const load = (src, global) => new Promise((res, rej) => {
      if (global && window[global]) { res(); return; }
      if (document.querySelector(`script[src="${src}"]`) && (!global || window[global])) { res(); return; }
      const s = document.createElement("script"); s.src = src;
      s.onload = () => res(); s.onerror = () => rej(new Error(`Failed: ${src}`));
      document.head.appendChild(s);
    });
    const loadCss = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href;
      document.head.appendChild(l);
    };

    (async () => {
      try {
        await load("https://cdnjs.cloudflare.com/ajax/libs/satellite.js/4.0.0/satellite.min.js", "satellite");
        loadCss("https://cesium.com/downloads/cesiumjs/releases/1.114/Build/Cesium/Widgets/widgets.css");
        await load("https://cesium.com/downloads/cesiumjs/releases/1.114/Build/Cesium/Cesium.js", "Cesium");
        if (dead) return;

        let tles = FALLBACK_TLES, source = "fallback";
        try {
          const ctrl = new AbortController();
          const timer = setTimeout(() => ctrl.abort(), 8000);
          const r = await fetch(`${bUrl}/tles`, { headers: { "x-api-key": bSec || "" }, signal: ctrl.signal, mode: "cors" });
          clearTimeout(timer);
          if (r.ok) { const d = await r.json(); tles = d.tles; source = "live"; }
          else pushAlert(`TLE endpoint returned ${r.status}`, 2);
        } catch (e) { pushAlert(`TLE fallback: ${e.message}`, 1); }

        let n = 0;
        SAT_CATALOG.forEach(({ id }) => {
          const t = tles[id]; if (!t) return;
          try { satrecsRef.current[id] = window.satellite.twoline2satrec(t.line1, t.line2); n++; }
          catch (e) { console.warn(id, e); }
        });

        setTleStatus(source);
        if (dead) return;

        initCesium();
        setReady(true);
        pushAlert(source === "live" ? `Live TLEs — ${n} sats` : `Fallback TLEs — ${n} sats`, source === "live" ? 0 : 1);
      } catch (e) { setTleStatus("error"); pushAlert(`Boot: ${e.message}`, 3); }
    })();

    return () => {
      dead = true;
      if (updateTimer.current) clearInterval(updateTimer.current);
      if (agentTimer.current) clearInterval(agentTimer.current);
      if (viewerRef.current) {
        if (viewerRef.current._rotateInterval) clearInterval(viewerRef.current._rotateInterval);
        if (!viewerRef.current.isDestroyed()) viewerRef.current.destroy();
      }
    };
  }, []); // eslint-disable-line

  console.log("Backend URL:", bUrl);

  // ── Cesium init ───────────────────────────────────────────────────────────
  function initCesium() {
    const Cesium = window.Cesium;
    if (!Cesium || !cesiumContainerRef.current) return;

    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN || "";

    const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
      baseLayerPicker:      false,
      geocoder:             false,
      homeButton:           false,
      sceneModePicker:      false,
      navigationHelpButton: false,
      animation:            false,
      timeline:             false,
      fullscreenButton:     false,
      infoBox:              false,
      selectionIndicator:   false,
      creditContainer:      document.createElement("div"),
    });
    viewerRef.current = viewer;

    viewer.resolutionScale = window.devicePixelRatio || 1;

    viewer.imageryLayers.removeAll();
    try {
      viewer.imageryLayers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: 3845 })
      );
    } catch (e) {
      viewer.imageryLayers.addImageryProvider(
        new Cesium.OpenStreetMapImageryProvider({ url: "https://tile.openstreetmap.org/" })
      );
    }

    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#000810");
    viewer.scene.globe.enableLighting = true;
    viewer.scene.skyAtmosphere.show = true;
    viewer.scene.fog.enabled = false;
    viewer.scene.skyAtmosphere.atmosphereLightIntensity = 10.0;

    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(15, 20, 22000000),
      orientation: { heading: 0, pitch: -Math.PI / 2, roll: 0 },
    });

    let isUserInteracting = false;
    let interactTimer = null;
    const setInteracting = (val) => {
      isUserInteracting = val;
      if (val) {
        clearTimeout(interactTimer);
        interactTimer = setTimeout(() => { isUserInteracting = false; }, 3000);
      }
    };
    viewer.scene.canvas.addEventListener("mousedown",  () => setInteracting(true));
    viewer.scene.canvas.addEventListener("touchstart", () => setInteracting(true), { passive: true });
    viewer.scene.canvas.addEventListener("wheel",      () => setInteracting(true), { passive: true });

    const rotateInterval = setInterval(() => {
      if (!isUserInteracting && viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -0.00012);
      }
    }, 33);

    viewer._rotateInterval = rotateInterval;

    SAT_CATALOG.forEach(meta => {
      const pos = propagate(satrecsRef.current[meta.id], new Date());
      if (!pos) return;

      const entity = viewer.entities.add({
        id: meta.id,
        position: toCesium(Cesium, pos.lat, pos.lon, pos.alt),
        point: {
          pixelSize: meta.threat >= 2 ? 10 : 7,
          color: Cesium.Color.fromCssColorString(meta.color),
          outlineColor: Cesium.Color.fromCssColorString(meta.color + "66"),
          outlineWidth: meta.threat >= 2 ? 3 : 1,
          heightReference: Cesium.HeightReference.NONE,
          scaleByDistance: new Cesium.NearFarScalar(1.5e6, 2.0, 5.0e8, 0.5),
          translucencyByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 5.0e8, 0.8),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: meta.id,
          font: "bold 11px 'Share Tech Mono', monospace",
          fillColor: Cesium.Color.fromCssColorString(meta.color),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(14, -4),
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          scaleByDistance: new Cesium.NearFarScalar(1.5e6, 1.2, 3.0e8, 0.4),
          translucencyByDistance: new Cesium.NearFarScalar(1.5e6, 1.0, 4.0e8, 0.0),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          show: meta.threat >= 1,
        },
      });
      satEntitiesRef.current[meta.id] = entity;
    });

    drawOrbitPaths(Cesium, viewer);

    viewer.screenSpaceEventHandler.setInputAction(movement => {
      const picked = viewer.scene.pick(movement.position);
      if (Cesium.defined(picked) && picked.id) {
        const id = picked.id.id || picked.id;
        const meta = SAT_CATALOG.find(m => m.id === id);
        if (meta) {
          setSel(meta.id === selRef.current?.id ? null : meta);
          const sit = SITUATIONS.find(s => s.id === meta.id);
          if (sit) { setActiveSit(sit); setTab("summary"); }
          highlightSat(Cesium, meta.id);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    updateTimer.current = setInterval(() => updatePositions(Cesium, viewer), 1000);
  }

  function drawOrbitPaths(Cesium, viewer) {
    SAT_CATALOG.forEach(meta => {
      const satrec = satrecsRef.current[meta.id];
      if (!satrec) return;

      const period = getPeriodMinutes(satrec);
      const steps  = 120;
      const nowMs  = Date.now();
      const positions = [];

      for (let i = 0; i <= steps; i++) {
        const t = new Date(nowMs + (i / steps) * period * 60 * 1000);
        const p = propagate(satrec, t);
        if (p) positions.push(toCesium(Cesium, p.lat, p.lon, p.alt));
      }

      if (positions.length < 2) return;

      const isHighThreat = meta.threat >= 2;
      orbitEntitiesRef.current[meta.id] = viewer.entities.add({
        id: `orbit_${meta.id}`,
        polyline: {
          positions,
          width: isHighThreat ? 1.5 : 0.8,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: isHighThreat ? 0.25 : 0.12,
            color: Cesium.Color.fromCssColorString(meta.orbitColor + (isHighThreat ? "cc" : "55")),
          }),
          arcType: Cesium.ArcType.NONE,
          clampToGround: false,
        },
      });
    });
  }

  function getPeriodMinutes(satrec) {
    const n = satrec.no * (1440 / (2 * Math.PI));
    return 1440 / n;
  }

  function updatePositions(Cesium, viewer) {
    const now = new Date();
    SAT_CATALOG.forEach(meta => {
      const satrec = satrecsRef.current[meta.id];
      if (!satrec) return;
      const p = propagate(satrec, now);
      if (!p) return;
      posRef.current[meta.id] = p;

      const entity = satEntitiesRef.current[meta.id];
      if (entity) {
        entity.position = new Cesium.ConstantPositionProperty(toCesium(Cesium, p.lat, p.lon, p.alt));
      }

      if (selRef.current?.id === meta.id) {
        setSelPos({ ...p });
      }
    });

    if (Math.floor(Date.now() / 1000) % 60 === 0) {
      Object.values(orbitEntitiesRef.current).forEach(e => {
        if (e && !e.isDestroyed) viewer.entities.remove(e);
      });
      orbitEntitiesRef.current = {};
      drawOrbitPaths(Cesium, viewer);
    }
  }

  function highlightSat(Cesium, satId) {
    SAT_CATALOG.forEach(meta => {
      const entity = satEntitiesRef.current[meta.id];
      if (!entity) return;
      const isSel  = meta.id === satId;
      const isHl   = hlRef.current.includes(meta.id);
      entity.point.pixelSize     = isSel ? 16 : isHl ? 12 : meta.threat >= 2 ? 10 : 7;
      entity.point.color         = isSel
        ? Cesium.Color.WHITE
        : Cesium.Color.fromCssColorString(meta.color);
      entity.label.show          = isSel || isHl || meta.threat >= 1;
      entity.label.scale         = isSel ? 1.4 : 1;
      const orb = orbitEntitiesRef.current[meta.id];
      if (orb && orb.polyline) orb.polyline.width = isSel ? 2.5 : isHl ? 1.5 : meta.threat >= 2 ? 1.5 : 0.8;
    });
  }

  function flyToSat(satId) {
    const Cesium = window.Cesium;
    const viewer = viewerRef.current;
    if (!Cesium || !viewer) return;
    const p = posRef.current[satId];
    if (!p) return;
    const satCart = Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.alt * 1000);
    const offset = new Cesium.HeadingPitchRange(
      0,
      Cesium.Math.toRadians(-25),
      3800000
    );
    viewer.camera.flyToBoundingSphere(
      new Cesium.BoundingSphere(satCart, 1),
      { offset, duration: 2.2, easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT }
    );
  }

  function flyHome() {
    const Cesium = window.Cesium;
    const viewer = viewerRef.current;
    if (!Cesium || !viewer) return;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(15, 20, 22000000),
      orientation: { heading: 0, pitch: -Math.PI / 2, roll: 0 },
      duration: 2,
    });
  }

  // ── Retry TLE ─────────────────────────────────────────────────────────────
  const retryTle = useCallback(async () => {
    setTleStatus("loading");
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const r = await fetch(`${bUrl}/tles`, { headers: { "x-api-key": bSec || "" }, signal: ctrl.signal, mode: "cors" });
      clearTimeout(timer);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const { tles } = await r.json();
      let n = 0;
      SAT_CATALOG.forEach(({ id }) => {
        const t = tles[id]; if (!t) return;
        try { satrecsRef.current[id] = window.satellite.twoline2satrec(t.line1, t.line2); n++; }
        catch (e) { console.warn(id, e); }
      });
      setTleStatus("live");
      pushAlert(`Live TLEs reloaded — ${n} sats`, 0);
    } catch (e) {
      setTleStatus("fallback");
      pushAlert(`Retry failed: ${e.message}`, 2);
    }
  }, [bUrl, bSec, pushAlert]);

  // ── Agent monitor ─────────────────────────────────────────────────────────
  const startMonitor = useCallback(async () => {
    if (running) return;
    setRunning(true); let c = cycle;
    const runCycle = async () => {
      c++; setCycle(c);
      const snap = snapshot();
      fetch(`${bUrl}/ingest`, { method: "POST", headers: { "Content-Type": "application/json", "x-api-key": bSec, "x-groq-key": groq }, body: JSON.stringify({ snapshot: snap, cycle: c }) }).catch(() => {});
      for (const role of ["orbital", "news", "analyst"]) {
        patchAgent(role, { status: "running", output: "" });
        try {
          const out = await callAgentWithAskUser({
            bUrl, bSec, groq, tavily,
            role, message: `Cycle ${c}`, snap,
            setAskModal,
          });
          patchAgent(role, { status: "done", output: out });
          const m = out.match(/RELEVANT[_ ]OBJECTS?:?\s*([A-Z0-9,\s_\-]+)/i);
          if (m) {
            const ids = m[1].split(/[,\s]+/).map(s => s.trim()).filter(s => s.length > 2);
            setHl(ids);
            if (window.Cesium && viewerRef.current) highlightSat(window.Cesium, selRef.current?.id || "");
          }
          pushAlert(`${role.toUpperCase()} cycle ${c} complete`, 0);
        } catch (e) {
          patchAgent(role, { status: "error", output: `Error: ${e.message}` });
          pushAlert(`${role} error: ${e.message}`, 2);
        }
      }
    };
    await runCycle();
    agentTimer.current = setInterval(runCycle, 90000);
  }, [running, cycle, bUrl, bSec, groq, tavily, snapshot, patchAgent, setHl, pushAlert]);

  const stopMonitor = useCallback(() => {
    setRunning(false);
    if (agentTimer.current) clearInterval(agentTimer.current);
    setHl([]);
    setAgents(p => p.map(a => ({ ...a, status: "idle" })));
  }, [setHl]);

  const handleNL = useCallback(async () => {
    if (!nlQ.trim() || nlLoad) return;
    setNlLoad(true); setNlR(null);
    try {
      const { response, relevant_ids } = await apiQuery(bUrl, bSec, groq, tavily, nlQ, snapshot());
      setNlR(response);
      if (relevant_ids?.length) {
        setHl(relevant_ids);
        if (window.Cesium && viewerRef.current) highlightSat(window.Cesium, "");
      }
    } catch (e) { setNlR(`Error: ${e.message}`); }
    setNlLoad(false);
  }, [nlQ, nlLoad, bUrl, bSec, groq, tavily, snapshot, setHl]);

  const filteredSats = SAT_CATALOG.filter(m =>
    search === "" || m.id.toLowerCase().includes(search.toLowerCase()) ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.owner.toLowerCase().includes(search.toLowerCase())
  );

  // ── Position row ──────────────────────────────────────────────────────────
  function PosRow({ m }) {
    const [, setT] = useState(0);
    useEffect(() => { const iv = setInterval(() => setT(n => n + 1), 1500); return () => clearInterval(iv); }, []);
    const p = posRef.current[m.id];
    const sel = selUI?.id === m.id;
    return (
      <div onClick={() => {
        setSel(sel ? null : m);
        if (!sel) {
          const sit = SITUATIONS.find(s => s.id === m.id);
          if (sit) { setActiveSit(sit); setTab("summary"); }
          if (window.Cesium && viewerRef.current) highlightSat(window.Cesium, m.id);
        }
      }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", cursor: "pointer", background: sel ? "rgba(42,143,192,0.1)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.05)", borderLeft: `3px solid ${sel ? m.color : "transparent"}`, transition: "background 0.1s" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: m.color, boxShadow: `0 0 3px ${m.color}88` }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: sel ? "#7ec8e8" : "#9ab8cc", letterSpacing: 0.3 }}>{m.id}</div>
          <div style={{ fontSize: 9.5, color: "rgba(200,216,232,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.owner}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {p && <div style={{ fontSize: 9, color: "rgba(200,216,232,0.5)", fontFamily: "monospace" }}>{p.alt.toFixed(0)}km</div>}
          <span style={{ fontSize: 7.5, letterSpacing: 0.5, padding: "1px 5px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(200,216,232,0.45)", borderRadius: 2, fontWeight: 600, display: "inline-block", marginTop: 1 }}>{m.type.slice(0, 4)}</span>
        </div>
      </div>
    );
  }

  const sit = activeSit;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0a0e14", color: "#c8d8e8", fontFamily: "'Inter',system-ui,sans-serif", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes dp{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes blt{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadein{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}
        *{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:rgba(77,180,220,.08) transparent;outline:none}
        *:not(hr):not([class*="cesium"]):not([class*="Cesium"]):focus{outline:none!important;box-shadow:none}
        *:focus-visible{outline:none!important}
        button,input,select,textarea{outline:none!important;-webkit-tap-highlight-color:transparent}
        button:focus,input:focus,select:focus{outline:none!important}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:rgba(77,180,220,.1);border-radius:1px}
        ::-webkit-scrollbar-track{background:transparent}
        .cesium-widget-credits{display:none!important}
        .cesium-credit-logoContainer{display:none!important}
        .cesium-viewer-bottom{display:none!important}
        .tbtn{background:transparent;border:1px solid rgba(77,217,160,0.4);color:rgba(200,216,232,0.7);font-family:'Share Tech Mono',monospace;font-size:8.5px;letter-spacing:1.5px;padding:4px 12px;border-radius:2px;cursor:pointer;transition:all .15s}
        .tbtn:hover{border-color:#4dd9a0;color:#fff;background:rgba(77,217,160,0.12)}
        .tbtn.active{border-color:#4dd9a0;color:#4dd9a0;background:rgba(77,217,160,0.15)}
        .tbtn.danger{border-color:rgba(255,68,85,0.45);color:#ff5566}
        .tbtn.danger:hover{background:rgba(255,68,85,0.1);border-color:#ff5566}
        .tbtn:disabled{opacity:.18;cursor:not-allowed}
        .kin{background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.08);color:#9ab8cc;font-family:'Share Tech Mono',monospace;font-size:8.5px;padding:3px 8px;border-radius:1px;outline:none;transition:border-color .15s}
        .kin:focus{border-color:rgba(77,217,160,0.3)}
        .kin::placeholder{color:rgba(200,216,232,0.1)}
        .ltbtn{background:transparent;border:none;border-bottom:2px solid transparent;padding:7px 12px;cursor:pointer;font-family:'Inter',system-ui,sans-serif;font-size:10px;font-weight:500;color:rgba(200,216,232,0.3);transition:all .15s}
        .ltbtn:hover{color:rgba(200,216,232,0.65)}
        .ltbtn.on{color:#c8d8e8;border-bottom-color:#4dd9a0}
        .dtab{background:transparent;border:none;border-bottom:2px solid transparent;padding:7px 10px;cursor:pointer;font-size:10px;font-weight:500;color:rgba(200,216,232,0.35);transition:all .15s;font-family:'Inter',system-ui,sans-serif}
        .dtab:hover{color:rgba(200,216,232,0.75)}
        .dtab.on{color:#7ec8e8;border-bottom-color:#2a8fc0;font-weight:600}
        .qin{background:rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.1);color:#c8d8e8;font-size:11px;padding:7px 10px;border-radius:3px;outline:none;flex:1;transition:border-color .15s;font-family:'Inter',system-ui,sans-serif}
        .qin:focus{border-color:rgba(42,143,192,0.5);box-shadow:0 0 0 2px rgba(42,143,192,0.12)}
        .qin::placeholder{color:rgba(200,216,232,0.2)}
        .wpbtn{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);color:rgba(200,216,232,0.7);font-size:11px;font-weight:600;padding:5px 12px;border-radius:3px;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:5px;font-family:'Inter',system-ui,sans-serif}
        .wpbtn:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.22);color:#c8d8e8}
        .wpbtn.primary{background:#1a6090;border-color:#2a8fc0;color:#c8e8f8}
        .wpbtn.primary:hover{background:#2a7fc1;box-shadow:0 2px 8px rgba(42,127,193,0.3)}
        .wpbtn.danger{border-color:rgba(192,25,44,0.6);color:#e05565}
        .wpbtn.danger:hover{background:rgba(192,25,44,0.15)}
        .wpbtn:disabled{opacity:.3;cursor:not-allowed}
        .zb{width:32px;height:32px;background:rgba(0,0,0,0.6);border:1px solid rgba(77,217,160,0.3);color:rgba(200,216,232,0.6);border-radius:2px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .15s;font-family:monospace;font-weight:bold}
        .zb:hover{border-color:#4dd9a0;color:#fff;background:rgba(77,217,160,0.15);box-shadow:0 0 10px rgba(77,217,160,0.2)}
        .sin{background:rgba(0,0,0,0.35);border:1.5px solid rgba(255,255,255,0.1);border-radius:3px;padding:6px 10px 6px 28px;font-size:11px;color:#c8d8e8;outline:none;width:100%;transition:border-color .15s;font-family:'Inter',system-ui,sans-serif}
        .sin:focus{border-color:rgba(42,143,192,0.5);box-shadow:0 0 0 3px rgba(42,143,192,0.12)}
        .sin::placeholder{color:rgba(200,216,232,0.22)}
        #cesium-container{width:100%;height:100%}
        #cesium-container canvas{width:100%!important;height:100%!important}
        html,body{margin:0;padding:0;border:none;outline:none;background:#0a0e14}
        div,span,button,input,select{outline:none!important}
      `}</style>

      {/* ══ DARK TOPBAR ══════════════════════════════════════════════════════ */}
      <div style={{ height: 40, flexShrink: 0, background: "linear-gradient(180deg,#1e2a38 0%,#141e2c 100%)", borderBottom: "1px solid #0a1218", display: "flex", alignItems: "center", gap: 0, padding: "0 12px" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, paddingRight: 14, borderRight: "1px solid rgba(255,255,255,0.07)", marginRight: 12 }}>
          <div style={{ width: 24, height: 24, border: "1px solid rgba(77,217,160,0.32)", borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(77,217,160,0.05)", flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "#4dd9a0" }}>◈</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, color: "#c8d8e8", letterSpacing: 3.5, fontWeight: 700, lineHeight: 1 }}>GOTHAM ORBITAL</div>
            <div style={{ fontSize: 6.5, color: "rgba(200,216,232,0.2)", letterSpacing: 3, marginTop: 1 }}>INTELLIGENCE PLATFORM</div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginRight: 12, paddingRight: 12, borderRight: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>ORBITAL SITUATIONS</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)" }}>›</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{sit?.title?.slice(0, 30) || "—"}</span>
        </div>

        {/* Status dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 12, paddingRight: 12, borderRight: "1px solid rgba(255,255,255,0.07)" }}>
          {[
            { l: "SGP4",   ok: ready },
            { l: "TLE",    ok: tleStatus === "live", warn: tleStatus === "fallback" },
            { l: "CESIUM", ok: ready },
            { l: "AGENTS", ok: running },
          ].map(s => (
            <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: s.ok ? "#4dd9a0" : s.warn ? "#f0c040" : "rgba(255,255,255,0.12)", boxShadow: s.ok ? "0 0 5px #4dd9a055" : s.warn ? "0 0 5px #f0c04055" : "" }} />
              <span style={{ fontSize: 7.5, color: s.ok ? "rgba(77,217,160,0.8)" : s.warn ? "rgba(240,192,64,0.7)" : "rgba(255,255,255,0.2)", letterSpacing: 0.5, fontFamily: "monospace" }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* Metal prices */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginRight: 12, paddingRight: 12, borderRight: "1px solid rgba(255,255,255,0.07)" }}>
          {[{ label: "Gold", val: metals.gold, d: metals.gd, c: "#f0c040", dp: 2 }, { label: "Silver", val: metals.silver, d: metals.sd, c: "#aabccc", dp: 3 }].map(m => (
            <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: m.c, boxShadow: `0 0 4px ${m.c}88` }} />
              <span style={{ fontSize: 8, color: "rgba(200,216,232,0.5)", letterSpacing: 0.5, fontFamily: "system-ui", fontWeight: 500 }}>{m.label}</span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, color: m.c }}>
                ${m.val.toLocaleString("en", { minimumFractionDigits: m.dp, maximumFractionDigits: m.dp })}
              </span>
              <span style={{ fontSize: 8, color: m.d >= 0 ? "#4dd9a0" : "#ff6666", fontFamily: "monospace" }}>{m.d >= 0 ? "▲" : "▼"}{Math.abs(m.d).toFixed(m.dp)}</span>
            </div>
          ))}
        </div>

        {/* Keys + controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input className="kin" type="password" placeholder="Groq key" value={groq} onChange={e => setGroq(e.target.value)} style={{ width: 120 }} />
          <input className="kin" type="password" placeholder="Tavily key" value={tavily} onChange={e => setTavily(e.target.value)} style={{ width: 110 }} />
          {!running
            ? <button className="tbtn active" onClick={startMonitor} disabled={!ready || !groq}>▶ INITIATE</button>
            : <button className="tbtn danger" onClick={stopMonitor}>■ HALT</button>
          }
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Classification selector */}
          {(() => {
            const cls = classification;
            const isSecret = cls.includes("SECRET") && !cls.includes("UNCLASSIFIED");
            const isU = cls.includes("UNCLASSIFIED");
            const dotColor = isSecret ? "#ff3344" : isU ? "#44cc88" : "#f0c040";
            const textColor = isSecret ? "#ff6677" : isU ? "#66ddaa" : "#f0c040";
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingRight: 8, borderRight: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: dotColor, boxShadow: `0 0 5px ${dotColor}88`, flexShrink: 0 }} />
                <select value={classification} onChange={e => setClassification(e.target.value)}
                  style={{ background: "transparent", border: "none", color: textColor, fontFamily: "'Share Tech Mono',monospace", fontSize: 8.5, letterSpacing: 1.5, fontWeight: 700, cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none", padding: "0 2px" }}>
                  <option value="SECRET//NOFORN"           style={{ background: "#1a0a10", color: "#ff6677" }}>SECRET//NOFORN</option>
                  <option value="SECRET"                   style={{ background: "#1a0a10", color: "#ff6677" }}>SECRET</option>
                  <option value="SECRET//REL TO USA, FVEY" style={{ background: "#1a0a10", color: "#ff9966" }}>SECRET//REL TO USA, FVEY</option>
                  <option value="CONFIDENTIAL"             style={{ background: "#100a1a", color: "#cc88ff" }}>CONFIDENTIAL</option>
                  <option value="UNCLASSIFIED//FOUO"       style={{ background: "#0a1a10", color: "#66ddaa" }}>UNCLASSIFIED//FOUO</option>
                  <option value="UNCLASSIFIED"             style={{ background: "#0a1a10", color: "#66ddaa" }}>UNCLASSIFIED</option>
                </select>
              </div>
            );
          })()}
          {/* Panel toggles */}
          <button onClick={() => setLeftPanelOpen(o => !o)} title={leftPanelOpen ? "Hide left panel" : "Show left panel"}
            style={{ width: 20, height: 20, background: "transparent", border: "1px solid rgba(200,216,232,0.12)", borderRadius: 2, cursor: "pointer", color: "rgba(200,216,232,0.35)", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", fontFamily: "monospace" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#4dd9a0"; e.currentTarget.style.color = "#4dd9a0"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,216,232,0.12)"; e.currentTarget.style.color = "rgba(200,216,232,0.35)"; }}>
            {leftPanelOpen ? "◀" : "▶"}
          </button>
          <button onClick={() => setRightPanelOpen(o => !o)} title={rightPanelOpen ? "Hide right panel" : "Show right panel"}
            style={{ width: 20, height: 20, background: "transparent", border: "1px solid rgba(200,216,232,0.12)", borderRadius: 2, cursor: "pointer", color: "rgba(200,216,232,0.35)", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", fontFamily: "monospace" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#4dd9a0"; e.currentTarget.style.color = "#4dd9a0"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(200,216,232,0.12)"; e.currentTarget.style.color = "rgba(200,216,232,0.35)"; }}>
            {rightPanelOpen ? "▶" : "◀"}
          </button>
          {/* Clock */}
          <div style={{ textAlign: "right", paddingLeft: 8, borderLeft: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 7, color: "rgba(200,216,232,0.2)", letterSpacing: 1, fontFamily: "monospace" }}>{clock}</div>
            <div style={{ fontSize: 7, color: running ? "#4dd9a0" : "rgba(200,216,232,0.14)", letterSpacing: 2, fontFamily: "monospace" }}>
              CYCLE {String(cycle).padStart(4, "0")} {running ? "● LIVE" : "○ IDLE"}
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN — left panel + cesium + right panel ═════════════════════════ */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* Left panel */}
        <div style={{ width: leftPanelOpen ? 310 : 0, flexShrink: 0, background: "#0b1520", borderRight: leftPanelOpen ? "1px solid rgba(255,255,255,0.07)" : "none", display: "flex", flexDirection: "column", minHeight: 0, boxShadow: leftPanelOpen ? "2px 0 12px rgba(0,0,0,0.4)" : "none", overflow: "hidden", transition: "width .2s ease" }}>

          {/* Situation selector header */}
          {sit && (
            <div style={{ flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0d1828" }}>
              <div style={{ padding: "8px 12px 0" }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
                  {SITUATIONS.map(s => {
                    const tm = THREAT_META[SAT_CATALOG.find(c => c.id === s.id)?.threat || 0];
                    const active = activeSit?.id === s.id;
                    return (
                      <button key={s.id} onClick={() => { setActiveSit(s); setTab("summary"); }} style={{ flex: 1, minWidth: 0, background: active ? "#1a2d42" : "rgba(255,255,255,0.04)", border: `1px solid ${active ? "#2a5070" : "rgba(255,255,255,0.1)"}`, borderRadius: 3, padding: "5px 8px", cursor: "pointer", transition: "all .15s", textAlign: "left" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: tm.color, flexShrink: 0, boxShadow: active ? `0 0 5px ${tm.color}88` : "none" }} />
                          <span style={{ fontSize: 8, fontWeight: 700, color: active ? "#c8d8e8" : "rgba(200,216,232,0.4)", letterSpacing: 0.5, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.id}</span>
                        </div>
                        <div style={{ fontSize: 7, color: active ? "rgba(200,216,232,0.4)" : "rgba(200,216,232,0.2)", letterSpacing: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.classification}</div>
                      </button>
                    );
                  })}
                </div>
                {/* Active situation title row */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, paddingBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      {(() => { const tm = THREAT_META[SAT_CATALOG.find(c => c.id === sit.id)?.threat || 0]; return (<span style={{ fontSize: 7, fontWeight: 700, letterSpacing: 1.5, padding: "2px 6px", background: tm.color + "22", color: tm.color, border: `1px solid ${tm.color}44`, borderRadius: 2 }}>{tm.label}</span>); })()}
                      <span style={{ fontSize: 7, color: "rgba(200,216,232,0.3)", letterSpacing: 1, fontFamily: "monospace" }}>{sit.classification}</span>
                    </div>
                    {(() => { const m = SAT_CATALOG.find(c => c.id === sit.id); return (<>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#c8d8e8", lineHeight: 1.25, marginBottom: 2 }}>{m?.name || sit.id}</div>
                      <div style={{ fontSize: 9, color: sit.affColor, fontWeight: 600 }}>{m?.owner || "—"} · {m?.type || "—"}</div>
                    </>); })()}
                  </div>
                </div>
                {/* Tabs */}
                <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.07)", margin: "0 -12px" }}>
                  {["summary", "intel", "agents", "query", "sigact"].map(t => (
                    <button key={t} className={`dtab ${tab === t ? "on" : ""}`} onClick={() => setTab(t)} style={{ fontSize: 9.5, padding: "6px 8px", textTransform: "capitalize", flex: 1 }}>
                      {t === "sigact" ? "SIGACTs" : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div style={{ padding: "7px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, position: "relative" }}>
            <span style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "rgba(200,216,232,0.25)", pointerEvents: "none" }}>🔍</span>
            <input className="sin" placeholder="Filter by satellite ID, owner..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* SUMMARY TAB */}
          {tab === "summary" && sit && (
            <div style={{ flex: 1, overflowY: "auto", minHeight: 0, background: "#0b1520" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "rgba(200,216,232,0.4)", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 3, height: 10, background: "#2a8fc0", borderRadius: 1, display: "inline-block" }} />ORBITAL SNAPSHOT
                </div>
                {(() => {
                  const m = SAT_CATALOG.find(c => c.id === sit.id);
                  const p = posRef.current[sit.id];
                  const satrec = m && satrecsRef.current[m.id];
                  const period = satrec ? getPeriodMinutes(satrec) : null;
                  const nextPass = period ? Math.round((period - (Date.now() / 60000) % period + period) % period) : null;
                  return (
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 4, marginBottom: 8 }}>
                        {[
                          { label: "ALT",    value: p ? `${p.alt.toFixed(0)} km` : "—", color: "#2a7fc1" },
                          { label: "LAT",    value: p ? `${p.lat.toFixed(2)}°` : "—",    color: "#2a7fc1" },
                          { label: "LON",    value: p ? `${p.lon.toFixed(2)}°` : "—",    color: "#2a7fc1" },
                          { label: "PERIOD", value: period ? `${period.toFixed(1)} min` : "—", color: "#8a3800" },
                          { label: "TYPE",   value: m?.type || "—",                       color: "#1a5c9a" },
                          { label: "OWNER",  value: m?.owner || "—",                      color: "#1a7a4a" },
                        ].map(({ label, value, color }) => (
                          <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, padding: "5px 7px", minWidth: 0 }}>
                            <div style={{ fontSize: 7, color: "rgba(200,216,232,0.3)", letterSpacing: 1, marginBottom: 1 }}>{label}</div>
                            <div style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: "#0a1828", borderRadius: 3, padding: "7px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #1a3050" }}>
                        <div>
                          <div style={{ fontSize: 7, color: "rgba(200,216,232,0.3)", letterSpacing: 1.5, marginBottom: 2, fontFamily: "monospace" }}>NEXT OVERPASS</div>
                          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 13, fontWeight: 700, color: "#4dd9a0" }}>
                            {nextPass != null ? `T−${String(Math.floor(nextPass)).padStart(2, "0")}:${String(Math.round((nextPass % 1) * 60)).padStart(2, "0")}` : "—"}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 7, color: "rgba(200,216,232,0.3)", letterSpacing: 1.5, marginBottom: 2, fontFamily: "monospace" }}>AFFILIATION</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                            <div style={{ width: 6, height: 6, borderRadius: 1, background: sit.affColor, flexShrink: 0 }} />
                            <span style={{ fontSize: 9, color: "rgba(200,216,232,0.7)", fontFamily: "monospace", fontWeight: 600 }}>{SAT_CATALOG.find(c => c.id === sit.id)?.owner || "—"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "rgba(200,216,232,0.4)", padding: "8px 14px 5px", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 3, height: 10, background: "#2a8fc0", borderRadius: 1, display: "inline-block" }} />TRACKED OBJECTS
                </div>
                {filteredSats.map(m => <PosRow key={m.id} m={m} />)}
              </div>
            </div>
          )}

          {/* INTEL TAB */}
          {tab === "intel" && sit && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#0b1520" }}>
              <div style={{ padding: "6px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <span style={{ fontSize: 7.5, color: "rgba(200,216,232,0.3)", letterSpacing: 2, fontFamily: "monospace" }}>INTEL REPORTS // {sit.id}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {tabLiveLoading.intel
                    ? <span style={{ fontSize: 7, color: "#4dd9a0", fontFamily: "monospace", animation: "dp 1s infinite" }}>● FETCHING</span>
                    : tabLiveSitId.intel === sit.id && tabLiveText.intel
                      ? <span style={{ fontSize: 7, color: "#4dd9a0", fontFamily: "monospace" }}>● LIVE</span>
                      : <span style={{ fontSize: 7, color: "rgba(200,216,232,0.2)", fontFamily: "monospace" }}>○ AWAITING</span>
                  }
                  <button onClick={() => fetchTabContent(sit, "intel")} disabled={tabLiveLoading.intel || !groq}
                    style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 2, color: "rgba(200,216,232,0.4)", cursor: "pointer", fontSize: 8, padding: "2px 7px", fontFamily: "monospace" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#4dd9a0"; e.currentTarget.style.color = "#4dd9a0"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(200,216,232,0.4)"; }}>
                    {tabLiveLoading.intel ? "…" : "↻ FETCH"}
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "10px 14px" }}>
                {tabLiveLoading.intel ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[100, 80, 95, 70, 88].map((w, i) => (
                      <div key={i} style={{ height: 8, width: `${w}%`, background: "rgba(255,255,255,0.06)", borderRadius: 2, animation: "dp 1.4s ease-in-out infinite", animationDelay: `${i * 0.12}s` }} />
                    ))}
                  </div>
                ) : tabLiveSitId.intel === sit.id && tabLiveText.intel ? (
                  <div style={{ fontSize: 10, lineHeight: 1.82, color: "rgba(200,216,232,0.65)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    <HighlightText text={tabLiveText.intel} />
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, opacity: 0.4 }}>
                    <div style={{ fontSize: 28 }}>📡</div>
                    <div style={{ fontSize: 9, color: "rgba(200,216,232,0.5)", fontFamily: "monospace", letterSpacing: 1, textAlign: "center" }}>
                      {groq ? "PRESS ↻ FETCH TO LOAD LIVE INTEL" : "SET GROQ KEY IN TOPBAR TO ENABLE"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AGENTS TAB */}
          {tab === "agents" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
              <div style={{ flex: 1, overflowY: "auto", minHeight: 0, background: "#0b0f17" }}>
                <div style={{ padding: "6px 10px 4px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 7.5, color: "rgba(200,216,232,0.3)", letterSpacing: 2, fontFamily: "monospace" }}>AGENT NETWORK</span>
                  {running && <span style={{ fontSize: 7.5, color: "#4dd9a0", letterSpacing: 1, animation: "dp 1.2s infinite", fontFamily: "monospace" }}>● LIVE</span>}
                </div>
                {agents.map(a => <AgentCard key={a.id} a={a} />)}
              </div>
              <div style={{ height: 140, overflowY: "auto", flexShrink: 0, background: "#0b0f17", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ padding: "5px 10px 4px", fontSize: 7.5, color: "rgba(200,216,232,0.25)", letterSpacing: 2, fontFamily: "monospace", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>ALERTS</div>
                {alerts.length === 0 ? <div style={{ padding: "8px 12px", fontSize: 9, color: "rgba(200,216,232,0.12)", fontStyle: "italic" }}>no alerts</div>
                  : alerts.slice(0, 10).map((a, i) => (
                    <div key={i} style={{ padding: "3px 10px", fontSize: 8.5, borderLeft: `2px solid ${THREAT_META[a.lvl].color}`, background: THREAT_META[a.lvl].color + "14", margin: "0 8px 2px", borderRadius: "0 2px 2px 0", color: "rgba(200,216,232,0.65)" }}>
                      <span style={{ color: THREAT_META[a.lvl].color, fontSize: 7, display: "block", fontFamily: "monospace" }}>{a.ts}</span>
                      {a.msg}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* QUERY TAB */}
          {tab === "query" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#0b1520" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "rgba(200,216,232,0.4)", marginBottom: 8 }}>⌕ INTEL QUERY</div>
                <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
                  <input className="qin" placeholder="Query satellite intelligence..." value={nlQ} onChange={e => setNlQ(e.target.value)} onKeyDown={e => e.key === "Enter" && handleNL()} />
                  <button className="wpbtn primary" style={{ flexShrink: 0, fontSize: 10, padding: "5px 10px" }} onClick={handleNL} disabled={nlLoad || !nlQ.trim()}>
                    {nlLoad ? "…" : "⌕"}
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {["Where is the ISS?", "Military sats over ME?", "COSMOS-2543 status?", "Proximity threats?"].map(q => (
                    <button key={q} onClick={() => setNlQ(q)} className="wpbtn" style={{ fontSize: 9, padding: "2px 7px" }}>{q}</button>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px", minHeight: 0 }}>
                {nlLoad ? <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#4ab8f5", fontSize: 10 }}><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.1)", borderTop: "2px solid #2a8fc0", borderRadius: "50%", animation: "spin .8s linear infinite", flexShrink: 0 }} />Querying...</div>
                  : nlR ? <div style={{ fontSize: 10, lineHeight: 1.82, color: "rgba(200,216,232,0.7)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}><HighlightText text={nlR} /></div>
                    : <div style={{ fontSize: 9.5, color: "rgba(200,216,232,0.2)", fontStyle: "italic" }}>Enter a query to interrogate satellite intelligence...</div>}
              </div>
            </div>
          )}

          {/* SIGACT TAB */}
          {tab === "sigact" && sit && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
              <div style={{ padding: "6px 12px", background: "#0a1018", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <span style={{ fontSize: 7.5, color: "rgba(200,216,232,0.3)", letterSpacing: 2, fontFamily: "monospace" }}>SIGNIFICANT ACTIVITIES // {sit.id}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {tabLiveLoading.sigact
                    ? <span style={{ fontSize: 7, color: "#4dd9a0", fontFamily: "monospace", animation: "dp 1s infinite" }}>● FETCHING</span>
                    : tabLiveSitId.sigact === sit.id && tabLiveText.sigact
                      ? <span style={{ fontSize: 7, color: "#4dd9a0", fontFamily: "monospace" }}>● LIVE</span>
                      : <span style={{ fontSize: 7, color: "rgba(200,216,232,0.2)", fontFamily: "monospace" }}>○ AWAITING</span>
                  }
                  <button onClick={() => fetchTabContent(sit, "sigact")} disabled={tabLiveLoading.sigact || !groq}
                    style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 2, color: "rgba(200,216,232,0.4)", cursor: "pointer", fontSize: 8, padding: "2px 7px", fontFamily: "monospace" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#4dd9a0"; e.currentTarget.style.color = "#4dd9a0"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(200,216,232,0.4)"; }}>
                    {tabLiveLoading.sigact ? "…" : "↻ FETCH"}
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", minHeight: 0, background: "#0b1520" }}>
                {tabLiveLoading.sigact ? (
                  <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {[100, 85, 90, 75].map((w, i) => (
                      <div key={i} style={{ height: 52, width: `${w}%`, background: "rgba(255,255,255,0.04)", borderRadius: 3, border: "1px solid rgba(255,255,255,0.06)", animation: "dp 1.4s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                ) : tabLiveSitId.sigact === sit.id && tabLiveText.sigact ? (() => {
                  let events = null;
                  try {
                    const raw = tabLiveText.sigact.replace(/```json|```/g, "").trim();
                    events = JSON.parse(raw);
                  } catch { }
                  if (events && Array.isArray(events)) return events.map((ev, i) => (
                    <div key={i} style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: i === 0 ? (ev.color || "#c0192c") + "08" : "transparent" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", marginBottom: 3 }}>
                            <span style={{ fontSize: 8, fontWeight: 700, color: ev.color || "#f0c040", letterSpacing: 1, padding: "1px 5px", background: (ev.color || "#f0c040") + "18", border: `1px solid ${ev.color || "#f0c040"}44`, borderRadius: 2 }}>{ev.type || "EVENT"}</span>
                            <span style={{ fontSize: 7.5, color: "rgba(200,216,232,0.35)", fontFamily: "monospace" }}>{ev.cls}</span>
                            <span style={{ fontSize: 7.5, color: "rgba(200,216,232,0.35)", marginLeft: "auto", fontFamily: "monospace" }}>{ev.src}</span>
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#9ab8cc", marginBottom: 1 }}>{ev.title}</div>
                          <div style={{ fontSize: 8, color: "rgba(200,216,232,0.3)", fontFamily: "monospace", marginBottom: 4 }}>{ev.ts}</div>
                          <div style={{ fontSize: 9.5, lineHeight: 1.68, color: "rgba(200,216,232,0.6)" }}>{ev.body}</div>
                        </div>
                      </div>
                    </div>
                  ));
                  return (
                    <div style={{ padding: "12px 14px", fontSize: 10, lineHeight: 1.82, color: "rgba(200,216,232,0.65)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      <HighlightText text={tabLiveText.sigact} />
                    </div>
                  );
                })() : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, opacity: 0.4 }}>
                    <div style={{ fontSize: 28 }}>⚡</div>
                    <div style={{ fontSize: 9, color: "rgba(200,216,232,0.5)", fontFamily: "monospace", letterSpacing: 1, textAlign: "center" }}>
                      {groq ? "PRESS ↻ FETCH TO LOAD LIVE SIGACTs" : "SET GROQ KEY IN TOPBAR TO ENABLE"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Cesium viewport + right panel ──────────────────────────── */}
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

          {/* Cesium */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#000810" }}>
            <div id="cesium-container" ref={cesiumContainerRef} style={{ width: "100%", height: "100%" }} />

            {/* Loading overlay */}
            {!ready && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(5,10,18,0.97)", zIndex: 10 }}>
                {tleStatus === "loading"
                  ? <div style={{ width: 44, height: 44, border: "1px solid rgba(42,127,193,0.25)", borderTop: "1px solid #2a7fc1", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 16 }} />
                  : <div style={{ fontSize: 30, marginBottom: 16, opacity: 0.4 }}>⚠</div>
                }
                <div style={{ fontSize: 11, color: "rgba(42,127,193,0.65)", letterSpacing: 3, fontFamily: "'Share Tech Mono',monospace", marginBottom: 8 }}>
                  {tleStatus === "loading" ? "INITIALIZING CESIUM..." : `TLE STATUS: ${tleStatus.toUpperCase()}`}
                </div>
                {(tleStatus === "fallback" || tleStatus === "error") && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 9, color: "rgba(200,216,232,0.35)", letterSpacing: 1, fontFamily: "monospace" }}>{bUrl}/tles</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={retryTle} style={{ background: "rgba(42,127,193,0.15)", border: "1px solid rgba(42,127,193,0.4)", color: "#7ec4f0", fontSize: 10, padding: "5px 16px", cursor: "pointer", borderRadius: 2, letterSpacing: 1, fontFamily: "'Share Tech Mono',monospace" }}>↻ RETRY</button>
                      <button onClick={() => setReady(true)} style={{ background: "rgba(77,217,160,0.1)", border: "1px solid rgba(77,217,160,0.3)", color: "#4dd9a0", fontSize: 10, padding: "5px 16px", cursor: "pointer", borderRadius: 2, letterSpacing: 1, fontFamily: "'Share Tech Mono',monospace" }}>▶ CONTINUE</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Camera controls */}
            <div style={{ position: "absolute", right: 12, top: 12, display: "flex", flexDirection: "column", gap: 4, zIndex: 5 }}>
              <button className="zb" onClick={flyHome} title="Home view">⌂</button>
              {selUI && selPos && <button className="zb" onClick={() => flyToSat(selUI.id)} title="Fly to satellite">🎯</button>}
              <button className="zb" title="Zoom in" onClick={() => {
                const v = viewerRef.current; if (!v || !window.Cesium) return;
                const cart = v.camera.position;
                v.camera.position = window.Cesium.Cartesian3.multiplyByScalar(cart, 0.7, new window.Cesium.Cartesian3());
              }}>+</button>
              <button className="zb" title="Zoom out" onClick={() => {
                const v = viewerRef.current; if (!v || !window.Cesium) return;
                const cart = v.camera.position;
                v.camera.position = window.Cesium.Cartesian3.multiplyByScalar(cart, 1.4, new window.Cesium.Cartesian3());
              }}>−</button>
              <button className="zb" title="Tilt up" onClick={() => { const v = viewerRef.current; if (!v) return; v.camera.rotateUp(0.3); }}>▲</button>
              <button className="zb" title="Tilt down" onClick={() => { const v = viewerRef.current; if (!v) return; v.camera.rotateDown(0.3); }}>▼</button>
            </div>

            {/* Selected sat HUD */}
            {selUI && selPos && (
              <div style={{ position: "absolute", top: 12, left: 12, zIndex: 5, background: "rgba(5,10,18,0.94)", border: `1px solid ${selUI.color}28`, borderLeft: `2px solid ${selUI.color}`, borderRadius: 2, padding: "10px 14px", minWidth: 200, boxShadow: `0 0 30px ${selUI.color}10`, animation: "fadein .2s ease" }}>
                <div style={{ fontSize: 7, color: selUI.color + "88", letterSpacing: 2.5, marginBottom: 3, fontFamily: "monospace" }}>◈ LIVE TRACK // CESIUM+SGP4</div>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 15, color: selUI.color, letterSpacing: 1, marginBottom: 7 }}>{selUI.name}</div>
                {[["LAT", `${selPos.lat.toFixed(4)}°`], ["LON", `${selPos.lon.toFixed(4)}°`], ["ALT", `${selPos.alt.toFixed(1)} km`], ["TYPE", selUI.type], ["OWNER", selUI.owner]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 2 }}>
                    <span style={{ fontSize: 8, color: "rgba(200,216,232,0.28)", letterSpacing: 1, fontFamily: "monospace" }}>{k}</span>
                    <span style={{ fontSize: 9, color: "#a8c8d8", fontFamily: "monospace" }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
                  <button className="tbtn" style={{ flex: 1, fontSize: 8, padding: "3px 5px" }} onClick={() => flyToSat(selUI.id)}>🎯 ZOOM</button>
                  <button className="tbtn" style={{ flex: 1, fontSize: 8, padding: "3px 5px" }} onClick={() => setSel(null)}>✕ CLEAR</button>
                </div>
              </div>
            )}

            {/* Sat quick-select strip */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(5,10,18,0.9)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "4px 10px", display: "flex", flexWrap: "wrap", gap: 3, zIndex: 5 }}>
              {SAT_CATALOG.map(m => (
                <span key={m.id} onClick={() => {
                  const sel = selUI?.id === m.id;
                  setSel(sel ? null : m);
                  if (!sel) {
                    const sit2 = SITUATIONS.find(s => s.id === m.id);
                    if (sit2) { setActiveSit(sit2); setTab("summary"); }
                    if (window.Cesium && viewerRef.current) highlightSat(window.Cesium, m.id);
                  }
                }} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", borderRadius: 2, fontSize: 8, letterSpacing: 1, cursor: "pointer", border: `1px solid ${selUI?.id === m.id ? m.color + "77" : m.color + "22"}`, color: selUI?.id === m.id ? m.color : m.color + "66", background: selUI?.id === m.id ? m.color + "10" : "transparent", transition: "all .1s", fontFamily: "monospace" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", display: "inline-block", flexShrink: 0 }} />
                  {m.id}
                </span>
              ))}
              <span style={{ marginLeft: "auto", fontSize: 7, color: "rgba(200,216,232,0.15)", alignSelf: "center", letterSpacing: 1 }}>DRAG · SCROLL · CLICK SAT</span>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ width: rightPanelOpen ? 280 : 0, flexShrink: 0, background: "#0d1828", borderLeft: rightPanelOpen ? "1px solid rgba(255,255,255,0.07)" : "none", display: "flex", flexDirection: "column", minHeight: 0, boxShadow: rightPanelOpen ? "-2px 0 12px rgba(0,0,0,0.4)" : "none", overflow: "hidden", transition: "width .2s ease" }}>
            {sit && (<>
              {/* Threat Timeline */}
              <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "rgba(200,216,232,0.4)", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 3, height: 10, background: "#c0192c", borderRadius: 1, display: "inline-block" }} />THREAT TIMELINE
                  {running && <span style={{ fontSize: 7, color: "#4dd9a0", fontFamily: "monospace", marginLeft: "auto", animation: "dp 1.2s infinite" }}>● LIVE</span>}
                </div>
                {alerts.length === 0 ? (
                  <div style={{ fontSize: 9, color: "rgba(200,216,232,0.2)", fontStyle: "italic", fontFamily: "monospace" }}>No events — start monitor to track activity</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {alerts.slice(0, 4).map((ev, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, paddingLeft: 8, borderLeft: `2px solid ${THREAT_META[ev.lvl].color}` }}>
                        <div style={{ fontSize: 8, color: "rgba(200,216,232,0.3)", fontFamily: "monospace", flexShrink: 0, whiteSpace: "nowrap" }}>{ev.ts}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 8.5, fontWeight: 600, color: THREAT_META[ev.lvl].color }}>{THREAT_META[ev.lvl].label}</div>
                          <div style={{ fontSize: 9, color: "rgba(200,216,232,0.55)", lineHeight: 1.4 }}>{ev.msg}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Conjunction Risk */}
              <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "rgba(200,216,232,0.4)", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 3, height: 10, background: "#c0192c", borderRadius: 1, display: "inline-block" }} />CONJUNCTION RISK</span>
                  <span style={{ fontSize: 7, color: "rgba(200,216,232,0.25)", letterSpacing: 1, fontFamily: "monospace" }}>LIVE · SGP4</span>
                </div>
                {(() => {
                  const pairs = computeConjunctions();
                  if (pairs.length === 0) return (
                    <div style={{ fontSize: 9, color: "rgba(200,216,232,0.2)", fontStyle: "italic", fontFamily: "monospace" }}>No close approaches detected</div>
                  );
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      {pairs.map((c, i) => {
                        const rm = THREAT_META[c.risk];
                        return (
                          <div key={i} style={{ background: rm.color + "12", border: `1px solid ${rm.color}30`, borderRadius: 2, padding: "5px 7px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}>
                                <span style={{ fontSize: 7.5, fontWeight: 700, color: rm.color, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.obj1}</span>
                                <span style={{ fontSize: 8, color: "rgba(200,216,232,0.25)", flexShrink: 0 }}>↔</span>
                                <span style={{ fontSize: 7.5, fontWeight: 700, color: "rgba(200,216,232,0.6)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.obj2}</span>
                              </div>
                              <span style={{ fontSize: 7, fontWeight: 700, color: rm.color, letterSpacing: 0.5, padding: "1px 4px", background: rm.color + "22", borderRadius: 2, flexShrink: 0, marginLeft: 4 }}>{rm.label}</span>
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                              <div><span style={{ fontSize: 7, color: "rgba(200,216,232,0.25)" }}>DIST </span><span style={{ fontSize: 8.5, fontWeight: 700, color: "#9ab8cc", fontFamily: "monospace" }}>{c.dca} km</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Intel overview */}
              <div style={{ flex: 1, overflowY: "auto", padding: "10px 14px", minHeight: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "rgba(200,216,232,0.4)", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 3, height: 10, background: "#8a3800", borderRadius: 1, display: "inline-block" }} />INTEL OVERVIEW
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {intelLoading
                      ? <span style={{ fontSize: 7, color: "#4dd9a0", letterSpacing: 1, fontFamily: "monospace", animation: "dp 1s infinite" }}>● FETCHING</span>
                      : intelSitId === sit.id && intelText
                        ? <span style={{ fontSize: 7, color: "#4dd9a0", letterSpacing: 1, fontFamily: "monospace" }}>● LIVE</span>
                        : <span style={{ fontSize: 7, color: "rgba(200,216,232,0.2)", letterSpacing: 1, fontFamily: "monospace" }}>○ STATIC</span>
                    }
                    <button onClick={() => fetchIntelOverview(sit)} title="Refresh intel" style={{ background: "transparent", border: "none", color: "rgba(200,216,232,0.25)", cursor: "pointer", fontSize: 10, padding: "0 2px", lineHeight: 1 }}
                      onMouseEnter={e => e.currentTarget.style.color = "#4dd9a0"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(200,216,232,0.25)"}>↻</button>
                  </span>
                </div>

                {intelLoading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[100, 85, 92, 70].map((w, i) => (
                      <div key={i} style={{ height: 9, width: `${w}%`, background: "rgba(255,255,255,0.06)", borderRadius: 2, animation: "dp 1.4s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                ) : (
                  intelSitId === sit.id && intelText ? (
                    <div style={{ fontSize: 10, lineHeight: 1.88, color: "rgba(200,216,232,0.6)" }}>
                      <HighlightText text={intelText} />
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 20, gap: 8, opacity: 0.4 }}>
                      <div style={{ fontSize: 22 }}>📡</div>
                      <div style={{ fontSize: 9, color: "rgba(200,216,232,0.5)", fontFamily: "monospace", letterSpacing: 1, textAlign: "center" }}>
                        {groq ? "FETCHING LIVE INTEL…" : "SET GROQ KEY TO ENABLE"}
                      </div>
                    </div>
                  )
                )}

                <button className="wpbtn" style={{ marginTop: 10, width: "100%", justifyContent: "center", fontSize: 10 }} onClick={() => setTab("intel")}>
                  View full report →
                </button>

                {alerts.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: "rgba(200,216,232,0.4)", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 3, height: 10, background: "#c0192c", borderRadius: 1, display: "inline-block" }} />RECENT ALERTS
                    </div>
                    {alerts.slice(0, 4).map((a, i) => (
                      <div key={i} style={{ padding: "4px 8px", marginBottom: 3, fontSize: 9, borderLeft: `2px solid ${THREAT_META[a.lvl].color}`, background: THREAT_META[a.lvl].color + "14", borderRadius: "0 2px 2px 0", color: "rgba(200,216,232,0.6)" }}>
                        <span style={{ color: THREAT_META[a.lvl].color, fontSize: 7.5, display: "block", fontFamily: "monospace" }}>{a.ts}</span>
                        {a.msg}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>)}
          </div>
        </div>
      </div>

      {/* ══ STATUS BAR ══════════════════════════════════════════════════════ */}
      <div style={{ height: 24, flexShrink: 0, background: "#0f1822", borderTop: "1px solid #0a1218", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 8, fontFamily: "'Share Tech Mono',monospace", color: "rgba(200,216,232,0.2)", letterSpacing: 0.5, gap: 0 }}>
        <span style={{ marginRight: 14, letterSpacing: 2 }}>GOTHAM ORBITAL v9 — CESIUM</span>
        <span style={{ marginRight: 12 }}>SGP4 REALTIME</span>
        <span style={{ marginRight: 12, color: tleStatus === "live" ? "rgba(77,217,160,0.4)" : "rgba(240,192,64,0.4)" }}>TLE: {tleStatus.toUpperCase()}</span>
        <span style={{ marginRight: 12 }}>OBJECTS: {SAT_CATALOG.length}</span>
        <span style={{ flex: 1 }} />
        <span style={{ color: running ? "rgba(77,217,160,0.4)" : "rgba(200,216,232,0.15)" }}>{running ? `● CYCLE ${cycle} ACTIVE` : "○ STANDBY"}</span>
        <span style={{ marginLeft: 14, color: "rgba(200,216,232,0.12)" }}>{clock}</span>
      </div>

      {/* ══ ASK USER MODAL ══════════════════════════════════════════════════ */}
      <AskUserModal
        question={askModal?.question || null}
        onSubmit={(answer) => askModal?.onAnswer(answer)}
        onDismiss={() => setAskModal(null)}
      />
    </div>
  );
}