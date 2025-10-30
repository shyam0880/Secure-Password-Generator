import { useState } from 'react'
import './App.css'
import { usePassword } from './PasswordContext';
import Login from './Login';

function App() {
  const [pattern, setPattern] = useState("ULNSULNSULNS");
  const [site, setSite] = useState("");
  const [master, setMaster] = useState("");
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [navStatus, setNavStatus] = useState(0);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [mediaPassword, setMediaPassword] = useState("");
  const { passwordList, addPassword, removePassword } = usePassword();
  const [popup, setpopup] = useState(true);
  const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "="];


  function buf2hex(buffer) {
    return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
  }


  async function sha256Hex(msg) {
    const enc = new TextEncoder();
    const data = enc.encode(msg);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return buf2hex(hash);
  }


  async function generate() {
    if (!site || !master || !pattern) {
      setPassword("");
      return;
    }
    const input = `${site}::${master}`;
    const hashHex = await sha256Hex(input);

    let consumeIndex = 0;
    function nextHexByte() {
      const pair = hashHex.slice((consumeIndex % 32) * 2, (consumeIndex % 32) * 2 + 2);
      consumeIndex += 1;
      return parseInt(pair, 16);
    }

    let out = "";
    for (let i = 0; i < pattern.length; i++) {
      const p = pattern[i];
      if (p === "U") {
        const b = nextHexByte();
        out += String.fromCharCode(65 + (b % 26));
      } else if (p === "L") {
        const b = nextHexByte();
        out += String.fromCharCode(97 + (b % 26));
      } else if (p === "N") {
        const b = nextHexByte();
        out += String(b % 10);
      } else if (p === "S") {
        const b = nextHexByte();
        out += symbols[b % symbols.length];
      } else {
        out += p;
      }
    }

  setPassword(out);
  setCopied(false);
  }


  function samplePattern(p) {
    setPattern(p);
  }


  async function copyToClipboard() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

    const handleAdd = () => {
    if (!name || !mediaPassword) return;
    addPassword(name, mediaPassword);
    setName("");
    setMediaPassword("");
  };

  return (
    <div className="container">
      <nav className='nav_bar'>
        <h1>Pattern Password Generator</h1>
        <ul className='nav_list'>
          <li onClick={()=>{setNavStatus(0)}}>Home</li>
          <li onClick={()=>{setNavStatus(0)}}>Password Generate</li>
          <li onClick={()=>{setNavStatus(1)}}>Password</li>
          <li onClick={()=>{setpopup(!popup)}}>Login</li>
        </ul>
      </nav>
      {popup&&(<Login popup={popup} setpopup={setpopup} />)}
      {navStatus==0&&(
      <div className={`detail_box ${navStatus == 0 ? 'fade-in' : 'fade-out'}`}>
        <label className='title'>Password Pattern: <span>(U=Uppercase, L=Lowercase, N=Number, S=Symbol)</span></label>
        <input value={pattern} onChange={(e) => setPattern(e.target.value.trim())} placeholder="e.g. ULNSULNSULNS" />
        <div className="button-row">
          <button onClick={() => samplePattern("ULNSULNSULNS")}>12 (ULNS x3)</button>
          <button onClick={() => samplePattern("ULULNNSS")}>8 (ULULNNSS)</button>
          <button onClick={() => samplePattern("ULNULNULN")}>9 (alternate)</button>
        </div>
        <label className='title'>Site / Service Name</label>
        <input value={site} onChange={(e) => setSite(e.target.value)} placeholder="e.g. facebook.com or Gmail" />
        <label className='title'>Master Key (keep secret)</label>
        <input type="password" value={master} onChange={(e) => setMaster(e.target.value)} placeholder="your master key (do not share)" />
        <div className="button-row">
          <button onClick={generate} style={{background:'#3f89ffff', color:'white'}}>Generate</button>
          <button onClick={copyToClipboard} disabled={!password}>{copied ? "Copied" : "Copy"}</button>
          <button onClick={() => setPattern((s) => s.split("").reverse().join(""))}>Quick pattern-change</button>
        </div>
        <div className="output">
        <label className='title'>Generated Password</label>
        <div><code>{password || "(nothing yet)"}</code></div>
        </div>
        <span><b>Note:</b> There is no reverse of this password.</span>
      </div>
      )}
      {navStatus==1&&(
      <div className={`detail_box ${navStatus == 1 ? 'fade-in' : 'fade-out'}`}>
        <h1>Your Password</h1>
        <input value={search} onChange={(e)=>{setSearch(e.target.value)}} placeholder="e.g. facebook, whatapp...." />
        <ul>
          {passwordList.length>0?(passwordList.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong>: {item.password}
            <button onClick={() => removePassword(item.name)}>Delete</button>
          </li>
          ))):(
            <li>No data present yet</li>
          )}
        </ul>
        
      </div>
      )}
    </div>
  )
}

export default App
