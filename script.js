let clasesGuardadas = JSON.parse(localStorage.getItem('agenda_universitaria_clases')) || [];

// --- INICIO DE SESIÓN ---
function entrar() {
    const nombre = document.getElementById('nombre-usuario').value;
    const curso = document.getElementById('curso-usuario').value;
    
    if(nombre && curso) {
        localStorage.setItem('perfil_usuario', JSON.stringify({nombre, curso}));
        mostrarApp();
    } else {
        alert("Llena tus datos primero");
    }
}

function mostrarApp() {
    const perfil = JSON.parse(localStorage.getItem('perfil_usuario'));
    if(perfil) {
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('pantalla-horario').style.display = 'block';
        document.getElementById('tag-user').innerText = perfil.nombre.toUpperCase();
        document.body.style.alignItems = 'flex-start';
        document.body.style.paddingTop = '20px';
        renderizarHorario();
    }
}

// --- RELOJ Y ALARMA AUTOMÁTICA ---
function actualizarRelojYAlarma() {
    const ahora = new Date();
    const timeStr = ahora.toLocaleTimeString('es-ES', { hour12: false });
    document.getElementById('clock').innerText = timeStr;

    const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('date-display').innerText = ahora.toLocaleDateString('es-ES', opciones);

    // Lógica de Alarma 🔔
    const HHMM = timeStr.substring(0, 5);
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const hoy = dias[ahora.getDay()];

    clasesGuardadas.forEach(clase => {
        if(clase.dia === hoy && clase.hora === HHMM && ahora.getSeconds() === 0) {
            alert("🔔 ¡ATENCIÓN! Empieza la clase de: " + clase.materia);
        }
    });
}
setInterval(actualizarRelojYAlarma, 1000);

// --- GESTIÓN DE MATERIAS ---
function abrirModal() { document.getElementById('modal-tarea').style.display = 'flex'; }
function cerrarModal() { document.getElementById('modal-tarea').style.display = 'none'; }

function guardarClase() {
    const materia = document.getElementById('input-materia').value;
    const hora = document.getElementById('input-hora').value;
    const dia = document.getElementById('input-dia').value;

    if(materia && hora) {
        clasesGuardadas.push({ materia, hora, dia });
        localStorage.setItem('agenda_universitaria_clases', JSON.stringify(clasesGuardadas));
        renderizarHorario();
        cerrarModal();
        // Limpiar inputs
        document.getElementById('input-materia').value = "";
        document.getElementById('input-hora').value = "";
    }
}

function renderizarHorario() {
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    dias.forEach(d => {
        const lista = document.getElementById(d).querySelector('.task-list');
        lista.innerHTML = "";
        clasesGuardadas.filter(c => c.dia === d)
            .sort((a,b) => a.hora.localeCompare(b.hora))
            .forEach(c => {
                lista.innerHTML += `<div class="task-item"><b>${c.hora}</b> - ${c.materia}</div>`;
            });
    });
}

// --- NOTAS AUTO-GUARDADO ---
const areaNotas = document.getElementById('notes-area');
areaNotas.value = localStorage.getItem('agenda_notas') || "";
areaNotas.addEventListener('input', () => {
    localStorage.setItem('agenda_notas', areaNotas.value);
});

function cerrarSesion() {
    if(confirm("¿Cerrar sesión?")) {
        localStorage.clear();
        location.reload();
    }
}

window.onload = () => {
    actualizarRelojYAlarma();
    mostrarApp();
};
