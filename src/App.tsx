import React, { useState } from 'react';
import './App.css';

import { API, graphqlOperation } from 'aws-amplify';
import { createTodo, deleteTodo } from './graphql/mutations';

import { listTodos } from './graphql/queries';

interface IToDo {
  readonly id: any;
  readonly name: string;
  readonly description: string;
}

function App() {
  const [todoName, setTodoName] = useState('');
  const [todoItems, setTodoItems] = useState<IToDo[]>([]);

  const handleChange = (evt: any) => {
    setTodoName(evt.target.value);
  };

  const addTodo = async () => {
    await API.graphql(
      graphqlOperation(createTodo, { input: { name: todoName } })
    );
    setTodoName('');

    updateTodos(); // here it is
  };

  const handleRemove = async (ev: any) => {
    await API.graphql(
      graphqlOperation(deleteTodo, { input: { id: ev.target.id } })
    );

    updateTodos();
  };

  const updateTodos = async () => {
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    setTodoItems(allTodos.data.listTodos.items);
  };

  updateTodos();

  return (
    <div>
      <div className="App">
        <input type="text" value={todoName} onChange={handleChange} />
        <button onClick={addTodo}>Add ToDo</button>
      </div>

      <ul>
        {todoItems.map((item: IToDo) => {
          return (
            <li key={item.id}>
              {item.name}{' '}
              <span id={item.id} onClick={handleRemove}>
                x
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
