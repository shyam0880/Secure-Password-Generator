import React, { createContext, useContext, useState, useEffect } from 'react';

const PasswordContext = createContext(null);

export function PasswordProvider({ children }) {
  const [passwordList, setPasswordList] = useState(() => {
    const stored = localStorage.getItem('savedPasswords');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedPasswords', JSON.stringify(passwordList));
  }, [passwordList]);

  // Add new password entry
  const addPassword = (name, password) => {
    const exists = passwordList.some(item => item.name === name);
    if (exists) {
      // optional: update instead of adding duplicate
      const updated = passwordList.map(item =>
        item.name === name ? { name, password } : item
      );
      setPasswordList(updated);
    } else {
      setPasswordList([...passwordList, { name, password }]);
    }
  };

  // Remove password entry by name
  const removePassword = (name) => {
    const updated = passwordList.filter(item => item.name !== name);
    setPasswordList(updated);
  };

  const value = {
    passwordList,
    addPassword,
    removePassword,
  };

  return (
    <PasswordContext.Provider value={value}>
      {children}
    </PasswordContext.Provider>
  );
}

export function usePassword() {
  const context = useContext(PasswordContext);
  if (context === null) {
    throw new Error('usePassword must be used within a PasswordProvider');
  }
  return context;
}
