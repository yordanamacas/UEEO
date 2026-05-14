// --- SISTEMA DE REGISTRO ---
function iniciarSesion() {
    const nombre = document.getElementById('reg-nombre').value;
    const curso = document.getElementById('reg-curso').value;

    if(nombre && curso) {
        const datosUsuario = { nombre, curso };
        localStorage.setItem('perfil_usuario', JSON.stringify(datosUsuario));
        verificarSesion();
    }
}

function verificarSesion() {
    const perfil = JSON.parse(localStorage.getItem('perfil_usuario'));
    if(perfil) {
        document.getElementById('registro-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('display-user').innerText = `${perfil.nombre} | ${perfil.curso}`;
        renderizarHorario();
    }
}

// --- RELOJ Y FECHA AUTOMÁTICA ---
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
    
    // Genera la fecha automáticamente en español
    const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('date-display').textContent = now.toLocaleDateString('es-ES', opciones);
}
setInterval(updateClock, 1000);

// --- AUTO-GUARDADO DE NOTAS ---
const notesArea = document.getElementById('notes-area');
notesArea.value = localStorage.getItem('userNotes') || "";
notesArea.addEventListener('input', () => {
    localStorage.setItem('userNotes', notesArea.value);
});

// --- FUNCIONES DEL MODAL Y HORARIO ---
function showModal() { document.getElementById('modal').style.display = 'flex'; }
function hideModal() { document.getElementById('modal').style.display = 'none'; }

// Recuperar clases guardadas o crear lista vacía
let misClases = JSON.parse(localStorage.getItem('clases_guardadas')) || [];

function addTask() {
    const name = document.getElementById('task-name').value;
    const time = document.getElementById('task-time').value;
    const day = document.getElementById('task-day').value;

    if(name && time) {
        // Guardar en el array y luego en localStorage
        misClases.push({ name, time, day });
        localStorage.setItem('clases_guardadas', JSON.stringify(misClases));
        
        renderizarHorario();
        hideModal();
        
        // Limpiar inputs
        document.getElementById('task-name').value = "";
        document.getElementById('task-time').value = "";
    }
}

function renderizarHorario() {
    // Limpiar todas las columnas primero
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    dias.forEach(d => {
        document.getElementById(d).querySelector('.tasks').innerHTML = "";
    });

    // Dibujar cada clase en su columna correspondiente
    misClases.forEach((clase, index) => {
        const dayDiv = document.getElementById(clase.day).querySelector('.tasks');
        const taskHtml = `
            <div class="task-entry">
                <strong>${clase.time}</strong> - ${clase.name}
                <button onclick="eliminarClase(${index})" style="border:none; background:none; color:red; cursor:pointer; float:right;">×</button>
            </div>
        `;
        dayDiv.innerHTML += taskHtml;
    });
}

function eliminarClase(index) {
    misClases.splice(index, 1);
    localStorage.setItem('clases_guardadas', JSON.stringify(misClases));
    renderizarHorario();
}

function cerrarSesion() {
    if(confirm("¿Seguro que quieres cerrar sesión? Se borrarán tus datos de perfil.")) {
        localStorage.clear();
        location.reload();
    }
}

// Al cargar la página
window.onload = () => {
    updateClock();
    verificarSesion();
};
