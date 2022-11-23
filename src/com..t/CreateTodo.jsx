import React, { useState, useContext, useEffect, createRef } from "react";

import { TodoContext } from "../context/todoSet";
import { Icon28SendOutline } from "@vkontakte/icons";

import { createClient } from "@supabase/supabase-js";

export const CreateTodo = ({ state, setState }) => {
  //Стейт todo-листа
  const [todo, setTodo] = useContext(TodoContext);
  //значения  change инпутов
  const [value, setValue] = useState({ title: "", description: "", date: "" });

  // подключаюсь к БД, 1 параметром URL 2 - API KEY
  const supabase = createClient(
    "https://nrlqbgyndjdhhmnmgutu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybHFiZ3luZGpkaGhtbm1ndXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5ODgxNzgsImV4cCI6MTk4NDU2NDE3OH0.gJ6ILUDqvmB-Xc-PEipet_o9AtqufW_rWyIhDSivXZw"
  );
  const [file, setFile] = useState({ name: "", path: "" });

  //создаем ссылку на объект
  const ref = createRef();
  

  // функция события клик (создать todo) подгрузить в БД
  const addHandler = async () => {
    if (value.title == "") return;
    //запрос БД
    async function data() {
      let { data, error } = await supabase.from("todo_list").insert({
        todos: {
          id: new Date(),
          title: value.title,
          description: value.description,
          date: value.date,
          performed: false,
          filename: file.name,
          path: file.path,
        },
        key: new Date(),
      });
    }
    // обновить стейт
    setState((state) => state + 1);
    setTodo([...todo, await data()]);
    setValue({ ...value, title: "", description: "" });
  };
  //добавить файл
  const filez = (e) => {
    e.preventDefault();
    const name = ref.current.files[0];
    setFile({ ...file, name: name, path: name.size });
  };
  //файл в корзину.
  useEffect(() => {
    if (!file.name) {
      return;
    }
    try {
      +(async function () {
        const { data, error } = await supabase.storage
          .from("bucket")
          .upload(`folder/subfolder/${file.path}`, file.name, {
            cacheControl: "3600",
            upsert: true,
          });
      })();
    } catch (e) {
      console.log(e.message);
    }
    setState((state) => state + 1);
  }, [file]);

  return (
    <div className="todo todo-create">
      <div>
        <input
          placeholder="TITLE"
          value={value.title}
          onChange={(e) => setValue({ ...value, title: e.target.value })}
        />{" "}
        <input
          placeholder="FORMAT: 00:00 01.01.1970"
          value={value.date}
          onChange={(e) =>
            setValue({
              ...value,
              date: /[0-9]/.test(e.target.value) ? e.target.value : "",
            })
          }
        />
        <Icon28SendOutline onClick={addHandler} />
      </div>
      <textarea
        value={value.description}
        onChange={(e) => setValue({ ...value, description: e.target.value })}
        cols="93"
        rows="5"
        placeholder="DESCRIPTION"
      ></textarea>
      <input name="upload" type="file" ref={ref} onChange={filez} />
    </div>
  );
};
