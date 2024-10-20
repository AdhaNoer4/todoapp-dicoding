document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTodo();
  });
});

function addTodo() {
  const textTodo = document.getElementById("title").value;
  const timeStamp = document.getElementById("date").value;

  const generateID = generateid();
  const todoObject = generateTodoObject(generateID, textTodo, timeStamp, false);

  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateid() {
  return +new Date();
}

function generateTodoObject(id, task, timeStamp, isCompleted) {
  return {
    id,
    task,
    timeStamp,
    isCompleted,
  };
}

function makeTodo(todoObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimeStamp = document.createElement("p");
  textTimeStamp.innerText = todoObject.timeStamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimeStamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `todo-${todoObject.id}`);

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", () => {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", () => {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", () => {
      addTaskToCompleted(todoObject.id);
    });

    container.append(checkButton);
  }

  return container;
}

const addTaskToCompleted = (todoid) => {
  const todoTarget = findTodo(todoid);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const findTodo = (todoid) => {
  for (const todoItem of todos) {
    if (todoItem.id === todoid) {
      return todoItem;
    }
  }
  return null;
};

const removeTaskFromCompleted = (todoid) => {
  const todoTarget = findTodoIndex(todoid);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const undoTaskFromCompleted = (todoid) => {
  const todoTarget = findTodo(todoid);
  if (todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
};

const findTodoIndex = (todoid) => {
  for (const index in todos) {
    if (todos[index].id === todoid) {
      return index;
    }
  }
  return -1;
};

const todos = [];
const RENDER_EVENT = "render-todo";

document.addEventListener(RENDER_EVENT, () => {
  console.log(todos);

  const unCompletedTodoList = document.getElementById("todos");
  unCompletedTodoList.innerText = "";
  const CompletedTodoList = document.getElementById("completed-todos");
  CompletedTodoList.innerText = "";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) {
      unCompletedTodoList.append(todoElement);
    } else {
      CompletedTodoList.append(todoElement);
    }
  }
});
