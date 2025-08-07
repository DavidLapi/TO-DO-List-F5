//Comrpobamos que se conecta el script
console.log("Este script está conectado.");

//variables para conectar la API con json-server
const API_URL = "http://localhost:3000/tareas";
const storageKey = "tasks";
//variables de html 
const inputTarea = document.getElementById("input-tarea"); //input texto
const agregarTareaBtn = document.getElementById("agregar-tarea-btn"); //boton submit
const listaTarea = document.getElementById("lista-tarea");
const vacioTareas = document.querySelector(".empty"); 

//Contador
const totalTareas = document.querySelector(".total-tareas");
const completaTareas = document.querySelector(".completa-tareas");
const pendienteTareas = document.querySelector(".pendiente-tareas");

let numTotal = 0; 
let numCompleta = 0;
let numPendiente = 0; 

//Funciones localStorage
//Función para guardar tareas en localStorage
function guardarTareaEnLocalStorage() {
    const tareas = Array.from(listaTarea.querySelectorAll("li")).map(li => ({
        text: li.querySelector('span').textContent,
        completed: li.querySelector(".checkbox").checked
    }));
    localStorage.setItem(storageKey, JSON.stringify(tareas));
};

//Función para cargar tareas en localStorage
function cargarTareaEnLocalStorage() {
    const tareasGuardadas = JSON.parse(localStorage.getItem(storageKey)) || [];
    tareasGuardadas.forEach(({text, completed}) => agregar(text, completed));
    ocultarVacioTareas();
};

//Operaciones CRUD
async function getTareas() {
    try {

    } catch(error) {
        console.error("Error:", error);
        console.log("Cargando desde localStorage...");
        isOnline = false;
        return getTodosFromLocalStorage();
    }
}

async function crearTarea(data) {
    
}

document.addEventListener("DOMContentLoaded", () => {

    //Funcion para ocultar el contenido "no hay tareas aún"
    function ocultarVacioTareas() {
        /* Display --> No hay tareas aun */
        if (listaTarea.children.length === 0) {
            vacioTareas.style.display = "block"; 
        } else {
            vacioTareas.style.display = "none";
        }

    }

    

    function agregar(text, completed = false) {
        event.preventDefault();
        const inputText = text || inputTarea.value.trim();
        if (!inputText) {
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = ` 
            <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}>
            <span>${inputText}</span> 
            <div class="tareas-btns">
                <button class="btn-delete"><i class="fa-solid fa-trash"></i></button>
                <button class="btn-edit"><i class="fa-solid fa-pen-to-square"></i></button>
            </div>
        `; 

        const btnDelete = li.querySelector(".btn-delete");
        const btnEdit = li.querySelector(".btn-edit");
        const checkbox = li.querySelector(".checkbox");

        if (completed) {
            li.classList.add("completed");
            btnEdit.disabled = true;
            btnEdit.style.opacity = "0.5";
            btnEdit.style.pointerEvents = "none";

        }

        checkbox.addEventListener("change", () => {
            const isChecked = checkbox.checked;
            li.classList.toggle("completed", isChecked);
            btnEdit.disabled = isChecked;
            btnEdit.style.opacity = isChecked ? "0.5" : "1";
            btnEdit.style.pointerEvents = isChecked ? "none" : "auto";

            if(isChecked) {
                numCompleta++;
                completaTareas.textContent = numCompleta;
            } else {
                numCompleta--;
                completaTareas.textContent = numCompleta;
            }

            guardarTareaEnLocalStorage();
        });

        btnDelete.addEventListener("click", () => {
            li.remove();
            ocultarVacioTareas();

            numTotal--;
            numPendiente--;
            totalTareas.textContent = numTotal;
            pendienteTareas.textContent = numPendiente;
            if (checkbox.checked) {
                numCompleta--;
                completaTareas.textContent = numCompleta;
            }

            guardarTareaEnLocalStorage();
        });

        btnEdit.addEventListener("click", () => {
            if(!checkbox.checked) {
                inputTarea.value = li.querySelector('span').textContent;
                li.remove();
                ocultarVacioTareas();

                numTotal--;
                numPendiente--;
                totalTareas.textContent = numTotal;
                pendienteTareas.textContent = numPendiente;

                guardarTareaEnLocalStorage();
            }
        });

        listaTarea.appendChild(li);
        inputTarea.value = "";
        ocultarVacioTareas();

        numTotal++;
        numPendiente++;
        totalTareas.textContent = numTotal;
        pendienteTareas.textContent = numPendiente;
        //Guardar en localStorage al agregar tarea
        guardarTareaEnLocalStorage();

    }

    agregarTareaBtn.addEventListener("click",  () => agregar());
    inputTarea.addEventListener("keypress", (e) => {
        if(e.key === 'Enter') {
            e.preventDefault(); 
            agregar();
        }
    });

    cargarTareaEnLocalStorage();

});