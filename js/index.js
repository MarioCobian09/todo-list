

const formulario = document.getElementById('formulario')
const listaTareas = document.getElementById('lista-tareas')
const templateTarea = document.getElementById('templateTarea').content
const fragment = document.createDocumentFragment()

let tareas = {}

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('tareas')){
        tareas = JSON.parse(localStorage.getItem('tareas')) // Parse convierte JSON a variable manipulable normal
    }
    pintarTareas()
})

formulario.addEventListener('submit', (e) => { // 'e' detecta el elemento que realizo el evento
    e.preventDefault()
    setTarea(e)
})

listaTareas.addEventListener('click', (e) => {
    btnAcciones(e)
    console.log(e);
})

const btnAcciones = e => {
    if(e.target.classList.contains('fa-circle-check')){
        tareas[e.target.dataset.id].estado = true
        pintarTareas()
    }

    if(e.target.classList.contains('fa-circle-minus')) {
        delete tareas[e.target.dataset.id]
        pintarTareas()
    }

    if(e.target.classList.contains('fa-undo-alt')) {
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
    }

    e.stopPropagation()
}

const setTarea = e => {
    const text = e.target.querySelector('input').value // Busca el value del input del formulario
    
    if(text.trim() === ''){ // trim borra los espacios vacios de un texto 
        return;
    }

    const tarea = {
        id: Date.now(), // Nos da un id en formato 
        text, // Si la variable y el id se llaman igual, solo se coloca de esta manera
        estado: false
    }

    tareas[tarea.id] = tarea
    pintarTareas()
    formulario.reset()
    e.target.querySelector('input').focus() // focus pone el cursor en ese elemento
}

const pintarTareas = () => {
    localStorage.setItem('tareas', JSON.stringify(tareas)); //Convertir de variable normal a JSON

    if(Object.values(tareas).length == 0){
        listaTareas.innerHTML = `
        <div class="alert alert-dark text-center">
            Sin Tareas Pendientes 🥸
        </div>
        `
        return;
    }

    listaTareas.innerHTML = ''

    Object.values(tareas).forEach((tarea) => {
        const clone = templateTarea.cloneNode(true) // Crea una copia de nuestro template
        clone.querySelector('p').textContent = tarea.text

        if(tarea.estado) { // Si el estado es true...
            clone.querySelectorAll('.fa-solid')[0].classList.replace('fa-circle-check', 'fa-undo-alt') // Remplaza una clase por otra, en este caso, remplaza el circulo check (tarea incompleta) o uno de basura
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }

        clone.querySelectorAll('.fa-solid')[0].dataset.id = tarea.id // Se le asigna un id en el html
        clone.querySelectorAll('.fa-solid')[1].dataset.id = tarea.id

        fragment.appendChild(clone)
    })
    listaTareas.appendChild(fragment)
}