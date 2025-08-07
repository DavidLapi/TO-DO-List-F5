console.log("Este es el script 2");

//Definir variables
const API_URL = 'http://localhost:3000/tareas';
const STORAGE_KEY = "tareas";
const newTareaInput = document.getElementById("input-tarea");
const submitButton = document.getElementById("agregar-tarea-btn");
const resetButton = document.getElementById("reset-task-btn");

//Contador
const totalTareas = document.querySelector(".total-tareas");
const completaTareas = document.querySelector(".completa-tareas");
const pendienteTareas = document.querySelector(".pendiente-tareas");
//Números de tareas
let numTotal = 0; 
let numCompleta = 0;
let numPendiente = 0;

//Grupo de botones de todo-list
const btnDelete = document.querySelector(".btn-delete");
const btnEdit = document.querySelectorAll(".btn-edit");
const checkbox = document.querySelector(".checkbox");
//Parte de edicion
let isEditingTarea = false;
let editButtonTodoID = "";
let isComplete = false;

let isOnline = true;

// Funciones localStorage 
function saveTodosToLocalStorage(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
    const todos = localStorage.getItem(STORAGE_KEY);
    return todos ? JSON.parse(todos) : [];
}

//Funciones CRUD
// Create --> POST
async function createTarea(data) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                ...data,
                completed: false,
                createAt: new Date().toISOString()
            })
        });
        if(!response.ok) throw new Error("Error al crear la tarea");
        const todo = await response.json();
        isOnline = true;
        // Actualizar localStorage también
        const todos = getTodosFromLocalStorage();
        todos.push(todo);
        saveTodosToLocalStorage(todos);
        
        return todo;

    } catch(error) {
        console.error("Error: ", error);
        console.log("Guardando en localStorage...");
        isOnline = false;
        
        // Fallback a localStorage
        const todos = getTodosFromLocalStorage();
        todos.push(newTodo);
        saveTodosToLocalStorage(todos);
        return newTodo;
    }

}
// Read --> GET
async function getTareas() {
    try {
        const response = await fetch(API_URL);
        if(!response.ok) throw new Error("Error en la lectura de las tareas");
        const result = await response.json();
        // Sincronizar con localStorage
        saveTodosToLocalStorage(result);
        return result;
    } catch(error) {
        console.error("Error: ", error);
        console.log("Cargando desde localStorage...");
        isOnline = false;
        return getTodosFromLocalStorage();
    }
}

// Update --> PATCH / PUT
async function updateTarea(id, data) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                ...data,
                updateAt: new Date().toISOString()
            })
        });
        if(!response.ok) throw new Error("Error al actualizar la tarea");
        const updatedTodo = await response.json();
        isOnline = true;

        // Actualizar localStorage también
        const todos = getTodosFromLocalStorage();
        const index = todos.findIndex(t => t.id == id);
        if (index !== -1) {
            todos[index] = updatedTodo;
            saveTodosToLocalStorage(todos);
        }
        
        return updatedTodo;
        
    } catch(error) {
        console.error("Error: ",error);
        console.log("Actualizando en localStorage...");
        isOnline = false;
        
        // Fallback a localStorage
        const todos = getTodosFromLocalStorage();
        const index = todos.findIndex(t => t.id == id);
        if (index !== -1) {
            todos[index] = { ...todos[index], ...data, updatedAt: new Date().toISOString() };
            saveTodosToLocalStorage(todos);
            return todos[index];
        }
        return null;
    }
}

// Delete --> DELETE
async function deleteTarea(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if(!response.ok) throw new Error("Error al eliminar la tarea");
        isOnline = true;
        
        // Eliminar de localStorage también
        const todos = getTodosFromLocalStorage();
        const filteredTodos = todos.filter(t => t.id != id);
        saveTodosToLocalStorage(filteredTodos);

        return true;

    } catch(error) {
        console.error("Error: ",error);
        console.log("Eliminando de localStorage...");
        isOnline = false;
        
        // Fallback a localStorage
        const todos = getTodosFromLocalStorage();
        const filteredTodos = todos.filter(t => t.id != id);
        saveTodosToLocalStorage(filteredTodos);
        return true;
    }
}

//Funcion añadirTarea
async function agregarTarea() {
    const title = newTareaInput.value.trim();
    if (!title) return alert("Añade una tarea, por favor!");

    try {
        const result = await createTarea({title});
        if(result) {
            
            await displayTareas()
            newTareaInput.value = "";
        } else {
            console.error("No se pudo crear la tarea.");
        }

    } catch(error) {
        console.error("Error al añadir tarea: ", error);
    }
}

async function editTarea() {
    const title = newTareaInput.value.trim();
    if(!title) return;

    await updateTarea(editButtonTodoID, {title, completed: isComplete});
    displayTareas();

    newTareaInput.value = "";
    isEditingTarea = false;
    submitButton.innerHTML = "Añadir";
    resetButton.style.opacity = "0.5";
    resetButton.style.pointerEvents = "none";
}

async function displayTareas() {
    const todos = await getTareas();
    const listaTarea = document.getElementById("lista-tarea");
    listaTarea.innerHTML = "";
    console.log(todos);

    numTotal = todos.length; 
    totalTareas.textContent = numTotal;

    todos.forEach(todo => {
        console.log(todo);
        listaTarea.innerHTML += `
            <li>
                <input type="checkbox" class="checkbox" ${todo.completed ? "checked" : ""}>
                <span id="todoname"
                    style="text-decoration: ${todo.completed ? "line-through" : "none"}"
                    data-iscomplete="${todo.completed}"
                    data-id="${todo.id}">
                    ${todo.title}
                </span> 
                <div class="tareas-btns">
                    <button data-id="${todo.id}" class="btn-edit"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button data-id="${todo.id}" class="btn-delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </li>
        `

    });

    setupEventListener();
}

displayTareas();

function setupEventListener() {
    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.onclick = () => {
            const todoSpan = btn.parentNode.parentNode.querySelector("#todoname");
            newTareaInput.value = todoSpan.innerText;
            submitButton.innerHTML = "Editar";
            isEditingTarea = true;
            editButtonTodoID = btn.getAttribute("data-id");
            isComplete = JSON.parse(todoSpan.getAttribute("data-iscomplete"));
        }
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.onclick = async()=> {
            const id = btn.getAttribute("data-id");
            await deleteTarea(id);
            displayTareas();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    submitButton.addEventListener("click", () => {
        if(isEditingTarea) {
            editTarea();
        } else {
            agregarTarea();
        }
    })
});
