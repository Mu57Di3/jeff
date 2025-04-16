/**
 * @file
 * Создан Bender 16.04.2025
 */

import {createApp, h, hFragment} from "../../packages/runtime/dist/jeff.js";

const state = {
    currentTodo: "",
    edit: {
        id: null,
        original: null,
        edited: null
    },
    todo: ["Первый", "Второй", "Третий"],
}

const reducers = {
    "update-current-todo": (state, currentTodo) => {
        const newState = structuredClone(state);
        newState.currentTodo = currentTodo;
        return newState;
    },
    "add-todo": (state) => {
        const newState = structuredClone(state);
        newState.currentTodo = "";
        newState.todo = [...newState.todo, state.currentTodo];
        return newState;
    },
    "start-editing-todo": (state, index) => {
        const newState = structuredClone(state);
        newState.edit = {
            id: index,
            original: state.todo[index],
            edited: state.todo[index],
        }
        return newState;
    },
    "edit-todo": (state, edited) => {
        const newState = structuredClone(state);
        newState.edit.edited = edited;
        return newState;
    },
    "save-edited-todo": (state) => {
        const newState = structuredClone(state);
        newState.todo[state.edit.id] = state.edit.edited;
        newState.edit = {
            id: null,
            original: null,
            edited: null
        }
        return newState;
    },
    "cancel-editing-todo": (state) => {
        const newState = structuredClone(state);
        newState.edit = {
            id: null,
            original: null,
            edited: null
        }
        return newState;
    },
    "remove-todo": (state, index) => {
        const newState = structuredClone(state);
        newState.todo = newState.todo.filter((_, i) => i !== index);
        return newState;
    }
}

function App(state, emit) {
    return h("div", {class: "container"}, [
        h("div", {class: "row justify-content-md-center mb-5"}, [
            h("div", {class: "col-auto"}, [
                h("h1", {}, ["My TODOs"])
            ])
        ]),
        CreateTodo(state, emit),
        TodoList(state, emit),
    ]);
}

function CreateTodo({currentTodo}, emit) {
    return h("div", {class: "row justify-content-md-center mb-3"}, [
        h("div", {class: "col-auto"}, [
            h("label", {class: "col-form-label", for: "todo-input"}, ["New TODO"])
        ]),
        h("div", {class: "col-auto"}, [
            h("input", {
                class: "form-control",
                id: "todo-input",
                value: currentTodo,
                tabindex: "-1",
                on: {
                    input: ({target}) => {
                        emit("update-current-todo", target.value)
                    },
                    keydown: ({key}) => {
                        if (key === "Enter" && currentTodo.length > 2) {
                            emit("add-todo")
                        }
                    }
                }
            })
        ]),
        h("div", {class: "col-auto"}, [
            h("button", {
                class: "btn btn-primary",
                disabled: currentTodo.length < 3,
                on: {
                    click: () => {
                        emit("add-todo")
                    }
                }
            }, ["Add"])
        ]),
    ])
}

function TodoList({todo, edit}, emit) {
    return h("div", {class: "row justify-content-md-center"}, [
        h("div", {class: "col-6"}, [
            h("ul", {class: "list-group"}, todo.map((todo, i) => TodoItem({todo, i, edit}, emit)))
        ])
    ])
}

function TodoItem({todo, i, edit}, emit) {
    const isEditing = edit.id === i;

    return isEditing ? TodoEditItem({todo, i, edit}, emit) : TodoReadItem({todo, i}, emit);
}

function TodoEditItem({todo, i, edit}, emit) {
    return h("li", {class: "list-group-item"}, [
        h("input", {
            class: "form-control mb-2 me-2",
            value: edit.edited,
            on: {
                input: ({target}) => emit("edit-todo", target.value)
            }
        }),
        h("button", {
            class: "btn btn-primary btn-sm me-2",
            disable: edit.edited.length < 3,
            on: {
                click: () => emit("save-edited-todo")
            }
        }, ["Save"]),
        h("button", {
            class: "btn btn-secondary btn-sm me-2",
            on: {
                click: () => emit("cancel-editing-todo")
            }
        }, ["Cancel"]),
    ])
}

function TodoReadItem({todo, i}, emit) {
    return h("li", {class: "list-group-item"}, [
        h("span", {
            class: "me-2",
            on: {
                dblclick: () => emit("start-editing-todo", i)
            }
        }, [todo]),
        h("button", {
            class: "btn btn-success btn-sm",
            on: {
                click: () => emit("remove-todo", i)
            }
        }, ["Done"])
    ])
}

const app = createApp({
    state: state,
    view: App,
    reducers
})

app.mount(document.body);
