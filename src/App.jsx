import { useState } from "react";
import "./App.css";
import { usePassword } from "./PasswordContext";
import Login from "./Login";

function App() {
  const [pattern, setPattern] = useState("ULNSULNSULNS");
  const [site, setSite] = useState("");
  const [master, setMaster] = useState("");
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [navStatus, setNavStatus] = useState(0);
  const [search, setSearch] = useState("");
  const [popup, setpopup] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "="];

  const {
    activeUser,
    passwords,
    addPasswordEntry,
    removePasswordEntry,
  } = usePassword();

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
      if (p === "U") out += String.fromCharCode(65 + (nextHexByte() % 26));
      else if (p === "L") out += String.fromCharCode(97 + (nextHexByte() % 26));
      else if (p === "N") out += String(nextHexByte() % 10);
      else if (p === "S") out += symbols[nextHexByte() % symbols.length];
      else out += p;
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

  const handleAddPassword = () => {
    if (!activeUser) {
      alert("Please log in to save a password.");
      return;
    }
    if (!site || !password) {
      alert("Please generate a password first.");
      return;
    }
    addPasswordEntry(site, password);
    alert(`Password for "${site}" saved successfully!`);
    setSite("");
    setPassword("");
  };

  const userPasswords = activeUser ? passwords[activeUser] || [] : [];
  const filtered = userPasswords.filter((item) =>
    item.site.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <nav className="nav_bar">
        <h1>Pattern Password Generator</h1>
        <ul className="nav_list">
          <li onClick={() => setNavStatus(0)}>Home</li>
          <li onClick={() => setNavStatus(1)}>Password Generate</li>
          <li onClick={() => setNavStatus(2)}>Your Passwords</li>
          <li onClick={() => setpopup(!popup)}>
            {activeUser ? `Logout (${activeUser})` : "Login"}
          </li>
        </ul>
      </nav>

      {popup && <Login popup={popup} setpopup={setpopup} />}

      {navStatus === 0 && (
        <div className="home_box">
          <div className="home_screen">
            <h1>Pattern Password Generator</h1>
            <p>
            <strong>Welcome!</strong><br/>
               This is a simple and secure password manager that lets you
              generate and store strong passwords using your own custom pattern and master key.
            </p>
          </div>
          <div className="middle_screen">
            <div className="screen_left">
              <h2>✨ Features</h2>
              <ul>
                <li> Generate custom pattern-based passwords.</li>
                <li> Create your own account and store site passwords securely.</li>
                <li>Everything stays offline, your data never leaves your browser.</li>
                <li> Delete your account and all passwords anytime you want.</li>
              </ul>
            </div>
            <div className="screen_right">
              <h2>💡 How It Works</h2>
              <ul>
                <li>
                  You choose a <strong>pattern</strong> (e.g., <code>ULNSULNS</code>) — where each
                  letter means:
                  <ul>
                    <li><code>U</code> = Uppercase letter (A–Z)</li>
                    <li><code>L</code> = Lowercase letter (a–z)</li>
                    <li><code>N</code> = Number (0–9)</li>
                    <li><code>S</code> = Symbol (!@#$%^&*...)</li>
                  </ul>
                </li>
                <li>
                  Enter your <strong>site name</strong> (like “facebook.com”) and your{" "}
                  <strong>master key</strong>.
                </li>
                <li>
                  The app uses a one-way <strong>SHA-256 hash</strong> to generate your password — 
                  meaning it can never be reversed or recovered from the output.
                </li>
              </ul>
            </div>
          </div>
          <div className="warning_screen">
            <h2>⚠️ Important Warnings & Risks ⚠️</h2>
            <div className="warning-box">
              <ul>
                <li>
                  <strong>If you forget your master key, you will permanently lose access</strong>{" "}
                  to all your generated passwords. There is no way to recover them.
                </li>
                <li>
                  Passwords are stored locally in your browser’s{" "}
                  <strong>localStorage</strong>. They are <em>not</em> uploaded anywhere.
                </li>
                <li>
                  Do <strong>NOT clear your browser cache, localStorage, or history</strong> unless
                  you’ve backed up your passwords — doing so will erase all saved data.
                </li>
                <li>
                  This app does <strong>not have any online account recovery system</strong>.
                </li>
                <li>
                  Always use strong master keys that are hard to guess — your master key is your
                  only security layer.
                </li>
              </ul>
            </div>
          </div>
          <div className="bottom_screen">
            <h2>💬 Notes</h2>
            <p>
              This project is made for educational and personal use. Always use it responsibly, and
              remember — <strong>your security is in your hands.</strong>
            </p>

            <p style={{ fontSize: "0.9em", color: "#777", marginTop: "20px" }}>
              © {new Date().getFullYear()} Pattern Password Generator by <a href="https://github.com/shyam0880" target="_blank">Buddy</a>.
            </p>
          </div>
      </div>
      )}

      {navStatus === 1 && (
        <div className="detail_box fade-in">
          <label className="title">
            Password Pattern:{" "}
            <span>(U=Uppercase, L=Lowercase, N=Number, S=Symbol)</span>
          </label>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value.trim())}
            placeholder="e.g. ULNSULNSULNS"
          />
          <div className="button-row">
            <button onClick={() => samplePattern("ULNSULNSULNS")}>12 (ULNS x3)</button>
            <button onClick={() => samplePattern("ULULNNSS")}>8 (ULULNNSS)</button>
            <button onClick={() => samplePattern("ULNULNULN")}>9 (alternate)</button>
          </div>

          <label className="title">Site / Service Name</label>
          <input
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="e.g. Facebook, Gmail"
          />

          <label className="title">Master Key (keep secret)</label>
          <input
            type="password"
            value={master}
            onChange={(e) => setMaster(e.target.value)}
            placeholder="Your master key"
          />

          <div className="button-row">
            <button onClick={generate} style={{ background: "#3f89ff", color: "white" }}>
              Generate
            </button>
            <button onClick={copyToClipboard} disabled={!password}>
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={handleAddPassword}>Save</button>
          </div>

          <div className="output">
            <label className="title">Generated Password</label>
            <div>
              <code>{password || "(nothing yet)"}</code>
            </div>
          </div>
          <span>
            <b>Note:</b> There is no reverse of this password.
          </span>
        </div>
      )}

      {navStatus === 2 && (
      <div className="password_box">
        <div className="title">
          <h2>{activeUser ? `${activeUser}'s Passwords` : "Your Passwords"}</h2>
          <span>Manage and search your saved passwords</span>
        </div>

        {!activeUser ? (
          <p className="no-login">Please log in to view your saved passwords.</p>
        ) : (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by site (e.g., Facebook, WhatsApp...)"
            />

            <ul className="password-list">
              {filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <li className="password-item" key={index}>
                    <div className="info">
                      <div className="label">
                        <span className="site-label">Site:</span>
                        <strong className="site">{item.site}</strong>
                      </div>
                      <div className="label">
                        <span className="pwd-label">Password:</span>
                        <span className="pwd">
                          {visiblePasswords[item.site] ? item.password : "••••••••"}
                        </span>
                      </div>
                    </div>

                    <div className="password-actions">
                      <button
                        className="toggle-btn"
                        onClick={() =>
                          setVisiblePasswords((prev) => ({
                            ...prev,
                            [item.site]: !prev[item.site],
                          }))
                        }
                      >
                        {visiblePasswords[item.site] ? "Hide" : "Show"}
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => removePasswordEntry(item.site)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>

                ))
              ) : (
                <li className="empty">No passwords found.</li>
              )}
            </ul>
          </>
        )}
      </div>
      )}

    </div>
  );
}

export default App;
