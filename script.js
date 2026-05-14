// 1. CARGA INICIAL: Recuperar datos con validación inmediata
let clasesGuardadas = JSON.parse(localStorage.getItem('agenda_universitaria_clases')) || [];

// --- FUNCIÓN DE ENTRADA ---
function entrar() {
    const nombre = document.getElementById('nombre-usuario').value;
    const curso = document.getElementById('curso-usuario').value;
    
    if(nombre && curso) {
        localStorage.setItem('perfil_usuario', JSON.stringify({nombre, curso}));
        
        // REQUERIDO: Los navegadores modernos solo permiten notificaciones tras un clic del usuario
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
        
        // Forzamos el dibujado de las materias guardadas
        renderizarHorario();
    }
}

// --- SISTEMA DE NOTIFICACIONES MEJORADO ---
function solicitarPermisoNotificaciones() {
    if (!("Notification" in window)) {
        console.log("Este navegador no soporta notificaciones.");
        return;
    }

    Notification.requestPermission().then(perm => {
        if (perm === "granted") {
            // Prueba inmediata para confirmar que funcionan
            new Notification("¡Sistema Activo!", {
                body: "Te avisaré cuando empiecen tus clases.",
                icon: "https://cdn-icons-png.flaticon.com/512/2997/2997300.png"
            });
        }
    });
}

function enviarNotificacion(mensaje) {
    if (Notification.permission === "granted") {
        new Notification("⏰ Alarma de Clase", { 
            body: mensaje,
            requireInteraction: true // La notificación no se quita sola hasta que la cierres
        });
    } else {
        // Si fallan las notificaciones de sistema, usamos el cuadro de alerta
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

    const HHMM = timeStr.substring(0, 5); 
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const hoy = dias[ahora.getDay()];

    clasesGuardadas.forEach(clase => {
        // Verificamos segundo 0 para que la alarma solo suene una vez por minuto
        if(clase.dia === hoy && clase.hora === HHMM && ahora.getSeconds() === 0) {
            enviarNotificacion("Empieza la clase de: " + clase.materia);
        }
    });
}
setInterval(actualizarRelojYAlarma, 1000);

// --- GESTIÓN DEL HORARIO ---
function abrirModal() { document.getElementById('modal-tarea').style.display = 'flex'; }
function cerrarModal() { document.getElementById('modal-tarea').style.display = 'none'; }

function guardarClase() {
    const materia = document.getElementById('input-materia').value;
    const hora = document.getElementById('input-hora').value;
    const dia = document.getElementById('input-dia').value;

    if(materia && hora) {
        // Añadir al array
        clasesGuardadas.push({ materia, hora, dia });
        
        // GUARDADO CRÍTICO: Sobreescribimos el localStorage con el nuevo array
        localStorage.setItem('agenda_universitaria_clases', JSON.stringify(clasesGuardadas));
        
        console.log("Clase guardada correctamente:", materia); // Para debug en consola
        
        renderizarHorario();
        cerrarModal();
        
        document.getElementById('input-materia').value = "";
        document.getElementById('input-hora').value = "";
    }
}

function renderizarHorario() {
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    
    diasSemana.forEach(d => {
        const columna = document.getElementById(d);
        if (columna) {
            const lista = columna.querySelector('.task-list');
            lista.innerHTML = ""; // Limpiamos antes de redibujar
            
            // Filtramos las materias del día específico y las ordenamos
            const materiasDelDia = clasesGuardadas
                .filter(c => c.dia === d)
                .sort((a,b) => a.hora.localeCompare(b.hora));

            materiasDelDia.forEach(c => {
                const item = document.createElement('div');
                item.className = 'task-item';
                item.innerHTML = `<b>${c.hora}</b> - ${c.materia}`;
                lista.appendChild(item);
            });
        }
    });
}

// --- BLOC DE NOTAS ---
const areaNotas = document.getElementById('notes-area');
if(areaNotas) {
    areaNotas.value = localStorage.getItem('agenda_notas') || "";
    areaNotas.addEventListener('input', () => {
        localStorage.setItem('agenda_notas', areaNotas.value);
    });
}

function cerrarSesion() {
    if(confirm("¿Seguro que quieres borrar todo?")) {
        localStorage.clear();
        location.reload();
    }
}

// INICIO AUTOMÁTICO
window.onload = () => {
    actualizarRelojYAlarma();
    mostrarApp(); // Esto verifica si ya habías entrado antes
};
