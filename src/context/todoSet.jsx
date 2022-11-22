import React, { createContext, useState } from "react";
// Контекст, будет хранится состояние передаваться через провайдер в index.jsx
export const TodoContext = createContext([{}, () => {}]);

export const TodoProvider = ({ children }) => {
  const [state, setState] = useState([]);
  return (
    <TodoContext.Provider value={[state, setState]}>
      {children}
    </TodoContext.Provider>
  );
};
