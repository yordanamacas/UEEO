function registrar() {
    const nombre = document.getElementById('name').value;
    const curso = document.getElementById('curso').value;
    const paralelo = document.getElementById('paralelo').value;

    if(nombre) {
        localStorage.setItem('usuario', JSON.stringify({nombre, curso, paralelo}));
        mostrarApp();
    }
}

function mostrarApp() {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    if(datos) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        document.getElementById('user-display').innerText = "👤 " + datos.nombre;
        document.getElementById('details-display').innerText = datos.curso + " " + datos.paralelo;
        actualizarReloj();
        renderizarTareas();
    }
}

function actualizarReloj() {
    const ahora = new Date();
    document.getElementById('reloj').innerText = ahora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById('fecha').innerText = ahora.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}
setInterval(actualizarReloj, 1000);

// GUARDAR TAREAS
let misTareas = JSON.parse(localStorage.getItem('tareas')) || [];

function guardarTarea() {
    const mat = document.getElementById('materia').value;
    const hor = document.getElementById('hora').value;
    const dia = document.getElementById('dia-semana').value;

    if(mat && hor) {
        misTareas.push({mat, hor, dia});
        localStorage.setItem('tareas', JSON.stringify(misTareas));
        cerrarModal();
        renderizarTareas();
    }
}

function renderizarTareas() {
    const contenedor = document.getElementById('lista-agenda');
    const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];
    contenedor.innerHTML = "";

    dias.forEach(d => {
        const tareasDelDia = misTareas.filter(t => t.dia === d);
        let htmlDay = `<div class="day-card"><div class="day-title">${d}</div>`;
        
        tareasDelDia.forEach(t => {
            htmlDay += `<div class="task-item"><span>${t.hor}</span> <b>${t.mat}</b></div>`;
        });
        
        htmlDay += `</div>`;
        contenedor.innerHTML += htmlDay;
    });
}

function abrirModal() { document.getElementById('modal-tarea').style.display = 'block'; }
function cerrarModal() { document.getElementById('modal-tarea').style.display = 'none'; }

// Iniciar si ya está registrado
if(localStorage.getItem('usuario')) mostrarApp();
