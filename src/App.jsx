import React, { useContext, useEffect, useState } from "react";

import { CreateTodo } from "./com..t/CreateTodo";
import { Todo } from "./com..t/Todo";
import { TodoContext } from "./context/todoSet";

import { createClient } from "@supabase/supabase-js";

export const App = () => {
  // подключаюсь к БД, 1 параметром URL 2 - API KEY
  const supabase = createClient(
    "https://nrlqbgyndjdhhmnmgutu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybHFiZ3luZGpkaGhtbm1ndXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5ODgxNzgsImV4cCI6MTk4NDU2NDE3OH0.gJ6ILUDqvmB-Xc-PEipet_o9AtqufW_rWyIhDSivXZw"
  );
  // контекст состояния todo
  const [todo, setTodo] = useContext(TodoContext);
  //стейт зависимости useEffect-а
  const [state, setState] = useState(1);
  // удалить итем из БД
  async function del(todos) {
    const { error } = await supabase
      .from("todo_list")
      .delete()
      .eq("key", todos.id);
    setState((state) => state + 1);
  }
  //Подгружаем базу данных и сетим в стейт контекста приложения
  useEffect(() => {
    try {
      +(async function updateTodo() {
        let { data, error } = await supabase.from("todo_list").select();
        setTodo(data);
      })();
      
    } catch(e) {
      console.log(e.message);
    }
  }, [state]);
  console.log('state', todo)
  return (
    <>
      <CreateTodo state={state} setState={setState} />
      {/* мап всего списка, пропсы текущего листа для отрисовки и функция удалить */}
      {/* фильтруем ошибку unefined при асинхронном запросе */}
      {todo !== null &&
        todo
          .filter((x) => x.todos)
          .map((x) => (
            <Todo
              state={state}
              setState={setState}
              key={x.key}
              todos={x.todos}
              del={del}
            />
          ))}
    </>
  );
};
