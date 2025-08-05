
console.log("Este script está conectado.");

document.addEventListener("DOMContentLoaded", () => {
    const inputTarea = document.getElementById("input-tarea");
    const agregarTareaBtn = document.getElementById("agregar-tarea-btn");
    const listaTarea = document.getElementById("lista-tarea");

    function agregar(event) {
        const inputText = inputTarea.value.trim();
        if (!inputText) {
            return;
        }

        const li = document.createElement("li");
        li.textContent = inputText;
        listaTarea.appendChild(li);
        inputTarea.textContent = "";
    }

    agregarTareaBtn.addEventListener("click", agregar);
    inputTarea.addEventListener("keypress", (e) => {
        if(e.key === "Enter") {
            agregar(e);
        }
    });

});