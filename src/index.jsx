import "./index.less";
import React from "react";
import { render } from "react-dom";

import { TodoProvider } from "./context/todoSet";
import { App } from "./App.jsx";


render(
  //Передаем контекст с данными TODO через провайдер
  <TodoProvider>
    <App />
  </TodoProvider>,
  document.getElementById("root")
);
