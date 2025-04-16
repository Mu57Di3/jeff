/**
 * @file
 * Создан Bender 15.04.2025
 */

const TODO = ["Нулевой", "Первый", "Второй", "1234"];
const doneTodo = ["Нулевой", "1234"];

const addTodoInput = document.querySelector("#todo-input");
const addTodoBtn = document.querySelector("#add-todo-btn");
const todoList = document.querySelector("#todo-list");

TODO.forEach((item) => {
    todoList.append(renderTodoInReadMode(item));
});

document.addEventListener("click", ({target})=>{
    const action = target.dataset.action;
    const index = target.dataset.id;
    switch (action) {
        case "add-todo":
            addTodo();
            break;
        case "save":
            updateTodo(index, document.querySelector(`input[data-content='edit_todo'][data-id='${index}']`).value);
            break;
        case "done":
            removeTodo(index);
            break;
        case "cancel":
            todoList.replaceChild(renderTodoInReadMode(TODO[index]), todoList.childNodes[index]);
            break;
    }
});

document.addEventListener("input", ({target})=>{
    const content = target.dataset.content;

    switch (content) {
        case "newTodo":
            addTodoBtn.disabled = target.value.length < 3;
            break;
        case "edit_todo":
            const index = target.dataset.id;
            const btn = document.querySelector(`button[data-action='save'][data-id='${index}']`)
            btn.disabled = target.value.length < 3;
            break;
    }
});

document.addEventListener("keydown", ({key, target})=>{
    const content = target.dataset.content;

    switch (content) {
        case "newTodo":
            if (key === "Enter" && target.value.length >= 3) {
                addTodo();
            }
            break;
        case "edit_todo":
            if (key === "Enter" && target.value.length >= 3) {
                const index = target.dataset.id;
                updateTodo(index, document.querySelector(`input[data-content='edit_todo'][data-id='${index}']`).value);
            }
            break;
    }
});

document.addEventListener("dblclick", ({target})=>{
    const content = target.dataset.content;

    if (content === "todo-read") {
        const id = target.dataset.id;
        todoList.replaceChild(renderTodoInEditMode(TODO[id]), todoList.childNodes[id]);
    }
})

function addTodo() {
    const desc = addTodoInput.value;

    if (TODO.indexOf(desc) > -1) {
        alert("Такая задача уже есть в списке.");
        return;
    }

    TODO.push(desc);
    todoList.append(renderTodoInReadMode(desc));

    addTodoInput.value = "";
    addTodoBtn.disabled = true;
    speak(desc.trim());
}

function renderTodoInReadMode(todo) {
    const isDone = doneTodo.indexOf(todo) > -1;
    const index = TODO.indexOf(todo);
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const span = document.createElement("span");
    span.textContent = todo;
    span.classList.add("me-2");
    if (isDone) {
        span.classList.add("text-decoration-line-through");
    } else {
        span.dataset.content = "todo-read";
        span.dataset.id = String(index);
    }
    li.append(span);

    if (!isDone) {
        const btn = document.createElement("button");
        btn.textContent = "Done";
        btn.classList.add("btn")
        btn.classList.add("btn-success");
        btn.classList.add("btn-sm");
        btn.dataset.action = "done";
        btn.dataset.id = String(index);
        li.append(btn);
    }

    return li;
}

function renderTodoInEditMode(todo) {
    const index = TODO.indexOf(todo);
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("form-control");
    input.classList.add("mb-1");
    input.value = todo;
    input.classList.add("me-2");
    input.dataset.content = "edit_todo";
    input.dataset.id = String(index);

    const saveBtn = document.createElement("button")
    saveBtn.textContent = "Save";
    saveBtn.classList.add("btn");
    saveBtn.classList.add("btn-primary");
    saveBtn.classList.add("btn-sm");
    saveBtn.classList.add("me-2");
    saveBtn.dataset.action = "save";
    saveBtn.dataset.id = String(index);

    input.addEventListener("input", ()=>{
        saveBtn.disabled = input.value.length < 3;
    })

    li.append(input);
    li.append(saveBtn);

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.classList.add("btn");
    cancelBtn.classList.add("btn-secondary");
    cancelBtn.classList.add("btn-sm");
    cancelBtn.classList.add("me-2");
    cancelBtn.dataset.action = "cancel";
    cancelBtn.dataset.id = String(index);
    li.append(cancelBtn);

    return li;
}

function removeTodo(index) {
    const desc = TODO[index];
    doneTodo.push(desc);
    todoList.replaceChild(renderTodoInReadMode(desc), todoList.childNodes[index]);
}

function updateTodo(index, description) {
    TODO[index] = description;
    todoList.replaceChild(renderTodoInReadMode(description), todoList.childNodes[index]);
}

function speak(todo) {
    const voice = speechSynthesis.getVoices().find((item)=>{
        return item.lang === "ru-RU";
    })
    const mouth = new SpeechSynthesisUtterance(todo);
    mouth.voice = voice;
    mouth.lang = "ru-RU";
    speechSynthesis.speak(mouth);
}
