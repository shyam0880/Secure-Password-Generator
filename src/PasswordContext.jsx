import React, { createContext, useContext, useState, useEffect } from "react";

const PasswordContext = createContext(null);

export function PasswordProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  });
  const [passwords, setPasswords] = useState(() => {
    const stored = localStorage.getItem("passwords");
    return stored ? JSON.parse(stored) : {};
  });
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("passwords", JSON.stringify(passwords));
  }, [passwords]);

  function signUp(username, password) {
    const exists = users.some(u => u.username === username);
    if (exists) {
      alert("Username already exists.");
      return;
    }
    const newUsers = [...users, { username, password }];
    setUsers(newUsers);
    setPasswords({ ...passwords, [username]: [] });
    alert("Account created successfully.");
  }

  function login(username, password) {
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setActiveUser(found.username);
      alert(`Welcome ${found.username}`);
    } else {
      alert("Invalid credentials.");
    }
  }

  function logout() {
    setActiveUser(null);
  }

  function deleteAccount(username) {
    if (username !== activeUser) {
      alert("You can delete only your own account.");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;
    setUsers(users.filter(u => u.username !== username));
    const updatedPasswords = { ...passwords };
    delete updatedPasswords[username];
    setPasswords(updatedPasswords);
    setActiveUser(null);
    alert("Account deleted.");
  }

  function addPasswordEntry(site, pw) {
    if (!activeUser) {
      alert("Login required.");
      return;
    }
    const userPwList = passwords[activeUser] || [];
    const updated = [...userPwList, { site, password: pw }];
    setPasswords({ ...passwords, [activeUser]: updated });
  }

  function removePasswordEntry(site) {
    if (!activeUser) return;
    const updated = passwords[activeUser].filter(p => p.site !== site);
    setPasswords({ ...passwords, [activeUser]: updated });
  }

  return (
    <PasswordContext.Provider
      value={{
        users,
        passwords,
        activeUser,
        signUp,
        login,
        logout,
        deleteAccount,
        addPasswordEntry,
        removePasswordEntry,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
}

export function usePassword() {
  const ctx = useContext(PasswordContext);
  if (!ctx) throw new Error("usePassword must be used within a PasswordProvider");
  return ctx;
}
