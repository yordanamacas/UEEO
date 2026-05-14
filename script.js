// 1. CARGA INICIAL: Recuperar datos guardados con validación
let clasesGuardadas = JSON.parse(localStorage.getItem('agenda_universitaria_clases')) || [];

// --- FUNCIÓN DE ENTRADA (REGISTRO) ---
function entrar() {
    const nombre = document.getElementById('nombre-usuario').value;
    const curso = document.getElementById('curso-usuario').value;
    
    if(nombre && curso) {
        // Guardar perfil en localStorage
        localStorage.setItem('perfil_usuario', JSON.stringify({nombre, curso}));
        
        // Solicitar permiso para notificaciones nativas
        solicitarPermisoNotificaciones();
        
        mostrarApp();
    } else {
        alert("Por favor, ingresa tu nombre y curso.");
    }
}

function mostrarApp() {
    const perfil = JSON.parse(localStorage.getItem('perfil_usuario'));
    if(perfil) {
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('pantalla-horario').style.display = 'block';
        document.getElementById('tag-user').innerText = perfil.nombre.toUpperCase();
        
        // CRÍTICO: Cargar las materias que ya estaban guardadas
        renderizarHorario();
    }
}

// --- SISTEMA DE NOTIFICACIONES ---
function solicitarPermisoNotificaciones() {
    if ("Notification" in window) {
        Notification.requestPermission().then(perm => {
            if (perm === "granted") {
                console.log("Permiso de notificaciones concedido.");
            }
        });
    }
}

function enviarNotificacion(mensaje) {
    // Si el usuario dio permiso, enviamos notificación de sistema
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("⏰ Alarma de Clase", { 
            body: mensaje,
            icon: "https://cdn-icons-png.flaticon.com/512/2997/2997300.png" 
        });
    } else {
        // Si no hay permiso, usamos el alert clásico
        alert("📢 " + mensaje);
    }
}

// --- RELOJ Y ALARMA ---
function actualizarRelojYAlarma() {
    const ahora = new Date();
    const timeStr = ahora.toLocaleTimeString('es-ES', { hour12: false });
    document.getElementById('clock').innerText = timeStr;

    const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('date-display').innerText = ahora.toLocaleDateString('es-ES', opciones);

    // LÓGICA DE ALARMA AUTOMÁTICA
    const HHMM = timeStr.substring(0, 5); 
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const hoy = dias[ahora.getDay()];

    clasesGuardadas.forEach(clase => {
        // Verifica día, hora exacta y que sea el segundo 0 para no repetir el alert
        if(clase.dia === hoy && clase.hora === HHMM && ahora.getSeconds() === 0) {
            enviarNotificacion("Es momento de iniciar: " + clase.materia);
        }
    });
}
setInterval(actualizarRelojYAlarma, 1000);

// --- GESTIÓN DEL HORARIO (SOLUCIÓN AL GUARDADO) ---
function abrirModal() { document.getElementById('modal-tarea').style.display = 'flex'; }
function cerrarModal() { document.getElementById('modal-tarea').style.display = 'none'; }

function guardarClase() {
    const materia = document.getElementById('input-materia').value;
    const hora = document.getElementById('input-hora').value;
    const dia = document.getElementById('input-dia').value;

    if(materia && hora) {
        // 1. Añadir al array en memoria
        clasesGuardadas.push({ materia, hora, dia });
        
        // 2. Guardar el array completo actualizado en localStorage
        localStorage.setItem('agenda_universitaria_clases', JSON.stringify(clasesGuardadas));
        
        // 3. Refrescar la vista del horario
        renderizarHorario();
        cerrarModal();
        
        // Limpiar campos
        document.getElementById('input-materia').value = "";
        document.getElementById('input-hora').value = "";
    }
}

function renderizarHorario() {
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    
    dias.forEach(d => {
        const columna = document.getElementById(d);
        if (columna) {
            const lista = columna.querySelector('.task-list');
            lista.innerHTML = "";
            
            // Filtramos las clases de este día y las ordenamos por hora
            clasesGuardadas
                .filter(c => c.dia === d)
                .sort((a,b) => a.hora.localeCompare(b.hora))
                .forEach(c => {
                    lista.innerHTML += `
                        <div class="task-item">
                            <b>${c.hora}</b> - ${c.materia}
                        </div>`;
                });
        }
    });
}

// --- NOTAS (AUTO-GUARDADO) ---
const areaNotas = document.getElementById('notes-area');
areaNotas.value = localStorage.getItem('agenda_notas') || "";
areaNotas.addEventListener('input', () => {
    localStorage.setItem('agenda_notas', areaNotas.value);
});

// FUNCIÓN PARA REINICIAR (OPCIONAL)
function cerrarSesion() {
    if(confirm("¿Deseas borrar tus datos y salir?")) {
        localStorage.clear();
        location.reload();
    }
}

// Inicializar al cargar la página
window.onload = () => {
    actualizarRelojYAlarma();
    mostrarApp();
};
