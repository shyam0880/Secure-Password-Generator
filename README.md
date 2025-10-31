# 🔐 Pattern Password Manager

A lightweight, **client-side password manager** and **pattern-based password generator** built using **React**.  
This project helps users securely generate, save, and manage passwords — all stored locally in the browser with **no backend dependency**.

🌐 Live Site: https://pattern-password-generator.netlify.app/

---

## 🚀 Features

### 👤 User System
- Sign up with a unique **username and password**  
- Each user’s data is isolated — passwords are only visible to the owner  
- Ability to delete your own account safely  
- LocalStorage-based persistence (no external servers)

### 🔑 Password Management
- Each user can:
  - Add, view, and delete passwords
  - Store credentials for multiple sites/services
  - Automatically filter/search saved passwords

### 🧩 Pattern-Based Password Generator
- Generate strong passwords using customizable patterns:
  - `U` → Uppercase letter  
  - `L` → Lowercase letter  
  - `N` → Number  
  - `S` → Symbol  
- Example: `ULNSULNS` → `Aq4$Lp7@`
- Option to copy generated passwords easily

### 🧠 Smart UI
- Simple login/signup popup
- Blue-black theme with elegant typography
- Fully local experience — works even offline

---

## ⚠️ Important Warnings & Risks

> 💀 **Read Carefully**

- This app **does not use cloud backup or encryption** beyond browser storage.  
- If you **clear your browser data, cache, or localStorage**, you will **lose all saved users and passwords permanently**.  
- If you **forget your login password**, there is **no recovery method** — your stored passwords will remain inaccessible.  
- Only the **logged-in user** can view or delete their own account.

**👉 Use at your own risk and make sure to export or record important passwords externally.**

---

## 🖥️ Tech Stack

- ⚛️ **React.js** (Hooks + Context API)
- 💾 **LocalStorage** (for persistent storage)
- 🎨 **CSS3 / Custom UI theme**
- 🔐 **Crypto Subtle API** (for SHA-256 hashing in password generation)

---

## 🧰 Installation & Setup

```bash
# 1. Clone this repository
git clone https://github.com/your-username/pattern-password-manager.git

# 2. Enter project directory
cd pattern-password-manager

# 3. Install dependencies
npm install

# 4. Start development server
npm start
```
Then open `http://localhost:5173` (or as shown in terminal).

---

## 🧱 Project Structure
```
src/
 ├── App.jsx                 # Main UI and routing
 ├── PasswordContext.jsx     # Global user & password state management
 ├── Login.jsx               # Login / Signup / Delete account UI
 ├── components/
 │    └── Home.jsx           # Home info & project warning section
 ├── assets/
 │    └── BackgroundImage.jpg
 ├── styles/
 │    └── App.css
 └── ...
```

---

## 🌈 UI Highlights

- 🎨 **Clean dark-blue background theme**
- 💬 **Smooth transitions and animations**
- 🔒 **Wavy underlined warning headers**
- 🚫 **Invisible scrollbars for a modern, minimal feel**

---

## 🧩 Example Pattern

| Pattern | Description | Example Output |
|----------|--------------|----------------|
| `ULNSULNS` | Mixed 8-character password | `Gk8#Dm2@` |
| `ULULNNSS` | Custom sequence | `AkBt45@#` |
| `ULNULNULN` | Alternate style | `Ae2Br4Ct5` |

---

## 🧾 License

This project is open-source and available under the **MIT License**.  
Feel free to **use**, **modify**, and **improve** — but please include **attribution**.

---

## 💬 Author

**Developed by [Buddy](https://github.com/shyam0880) 👨‍💻**  
> Passionate about privacy, usability, and clever local-first apps.

✨ *“Your password is only as safe as your browser’s memory.”* ✨
