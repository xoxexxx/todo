import React, { useState, useContext, useEffect } from "react";
import { TodoContext } from "../context/todoSet";
import { createClient } from "@supabase/supabase-js";

//IconVkontakte  https://vkcom.github.io/icons/
import {
  Icon28Menu,
  Icon28CancelAltOutline,
  Icon28Write,
  Icon28WriteOutline,
  Icon28NotebookCheckOutline,
  Icon28NotebookAddBadgeOutline,
  Icon28DocumentOutline,
} from "@vkontakte/icons";

export const Todo = ({ todos, del, state, setState }) => {
  //supabase
  const supabase = createClient(
    "https://nrlqbgyndjdhhmnmgutu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybHFiZ3luZGpkaGhtbm1ndXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5ODgxNzgsImV4cCI6MTk4NDU2NDE3OH0.gJ6ILUDqvmB-Xc-PEipet_o9AtqufW_rWyIhDSivXZw"
  );

  const [todo, setTodo] = useContext(TodoContext);
  const [show, setShow] = useState(false); //скрыть
  const [disabled, setDisabled] = useState(true); //блокировка

  const [edit, setEdit] = useState(todos);
  const [url, setUrl] = useState("");
  let d = todos?.date.replace("T", "-").replace(":", "-").split("-");
  let date = new Date();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (
        +d[0] <= date.getFullYear() &&
        +d[1] <= date.getMonth() + 1 &&
        +d[2] <= date.getDate() &&
        +d[3] <= date.getHours() &&
        +d[4] <= date.getMinutes()
      ) {
        return performedHandler();
      }
    }, 20000);
    if (todos.performed) {
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [todos]);

  useEffect(() => {
    +(async function get() {
      const { data, error } = await supabase.storage
        .from("bucket")
        .createSignedUrl(`folder/subfolder/${todos.path}`, 6000, {
          download: true,
        });
      setUrl(data?.signedUrl);
    })();
  }, [state]);

  const updateHandler = () => {
    setDisabled((x) => !x);
  };

  async function setUpdateHandler() {
    setDisabled((x) => !x);
    const { error } = await supabase
      .from("todo_list")
      .update({
        todos: {
          ...todos,
          title: edit.title,
          date: edit.date,
          description: edit.description,
        },
      })
      .eq("key", todos.id);
    setState((state) => state + 1);
  }

  const showHandler = () => {
    setShow((x) => !x);
  };
  
  async function performedHandler() {
    const { error } = await supabase
      .from("todo_list")
      .update({
        todos: {
          ...todos,
          performed: true,
        },
      })
      .eq("key", todos.id);
    setState((state) => state + 1);
  }

  async function donePerformedHandler() {
    const { error } = await supabase
      .from("todo_list")
      .update({
        todos: {
          ...todos,
          performed: false,
        },
      })
      .eq("key", todos.id);
    setState((state) => state + 1);
  }

  return (
    <>
      <article className={`todo ${todos.performed && "performed"}`}>
        <div className="title">
          <Icon28Menu onClick={showHandler} />
          <input
            disabled={disabled}
            placeholder="TITLE TODO"
            onChange={(e) => setEdit({ ...edit, title: e.target.value })}
            value={edit.title}
          />
          <input
            type="datetime-local"
            disabled={disabled}
            value={edit.date}
            onChange={(e) => setEdit({ ...edit, date: e.target.value })}
          />
          {disabled && <Icon28WriteOutline onClick={updateHandler} />}
          {!disabled && <Icon28Write onClick={setUpdateHandler} />}
          {todos.performed && (
            <Icon28NotebookCheckOutline onClick={donePerformedHandler} />
          )}
          {!todos.performed && (
            <Icon28NotebookAddBadgeOutline onClick={performedHandler} />
          )}
          <Icon28CancelAltOutline onClick={() => del(todos)} />
        </div>
        {show && (
          <>
            <textarea
              value={edit.description}
              onChange={(e) =>
                setEdit({ ...edit, description: e.target.value })
              }
              disabled={disabled}
              rows="5"
              cols="30"
              placeholder="DESCRIPTION"
            />
            <a className="file" href={`${url}`} target="_blank">
              <Icon28DocumentOutline />
            </a>
          </>
        )}
      </article>
    </>
  );
};
