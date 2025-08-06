
console.log("Este script está conectado.");

document.addEventListener("DOMContentLoaded", () => {
    const inputTarea = document.getElementById("input-tarea");
    const agregarTareaBtn = document.getElementById("agregar-tarea-btn");
    const listaTarea = document.getElementById("lista-tarea");
    const vacioTareas = document.querySelector(".empty");
    const todosContainer = document.getElementById("todos-container");
    
    const totalTareas = document.querySelector(".total-tareas");
    const completaTareas = document.querySelector(".completa-tareas");
    const pendienteTareas = document.querySelector(".pendiente-tareas");

    let numTotal = 0;
    let numcompleta = 0;
    let numPendiente = 0; 

    //Funcion para ocultar el contenido "no hay tareas aún"
    function ocultarVacioTareas() {
        /* Display --> No hay tareas aun */
        if (listaTarea.children.length === 0) {
            vacioTareas.style.display = "block"; 
        } else {
            vacioTareas.style.display = "none";
        }

    }

    function agregar(event, completed = false) {
        event.preventDefault();
        const inputText = inputTarea.value.trim();
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

            numcompleta++;
            completaTareas.textContent = numcompleta;
        }

        checkbox.addEventListener("change", () => {
            const isChecked = checkbox.checked;
            li.classList.toggle("completed", isChecked);
            btnEdit.disabled = isChecked;
            btnEdit.style.opacity = isChecked ? "0.5" : "1";
            btnEdit.style.pointerEvents = isChecked ? "none" : "auto";
        });

        btnDelete.addEventListener("click", () => {
            li.remove();
            ocultarVacioTareas();

            numTotal--;
            numPendiente--;
            totalTareas.textContent = numTotal;
            pendienteTareas.textContent = numPendiente;
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
            }
        })

        listaTarea.appendChild(li);
        inputTarea.textContent = " ";
        inputText.textContent = " ";
        ocultarVacioTareas();

        numTotal++;
        numPendiente++;
        totalTareas.textContent = numTotal;
        pendienteTareas.textContent = numPendiente;

    }

    agregarTareaBtn.addEventListener("click", agregar);
    inputTarea.addEventListener("keypress", (e) => {
        if(e.key === "Enter") {
            agregar(e);
        }
    });

});