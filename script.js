// 1. CARGA INICIAL: Buscamos si ya hay materias guardadas en la memoria del navegador
let clasesGuardadas = JSON.parse(localStorage.getItem('agenda_universitaria_clases')) || [];

// --- FUNCIÓN DE ENTRADA (Muestra la app si ya te registraste) ---
function mostrarApp() {
    const perfil = JSON.parse(localStorage.getItem('perfil_usuario'));
    if(perfil) {
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('pantalla-horario').style.display = 'block';
        document.getElementById('tag-user').innerText = perfil.nombre.toUpperCase();
        
        // ESTA LÍNEA ES LA QUE FALTABA: Dibuja las materias apenas entras
        renderizarHorario();
    }
}

// --- GUARDAR ASIGNATURAS (Para que se queden grabadas) ---
function guardarClase() {
    const materia = document.getElementById('input-materia').value;
    const hora = document.getElementById('input-hora').value;
    const dia = document.getElementById('input-dia').value;

    if(materia && hora) {
        // Agregamos la nueva materia al array
        clasesGuardadas.push({ materia, hora, dia });
        
        // LO GRABAMOS EN EL DISCO DURO DEL NAVEGADOR
        localStorage.setItem('agenda_universitaria_clases', JSON.stringify(clasesGuardadas));
        
        renderizarHorario(); // Actualizamos la vista
        cerrarModal();
        
        // Limpiamos los cuadritos
        document.getElementById('input-materia').value = "";
        document.getElementById('input-hora').value = "";
    }
}

// --- DIBUJAR EL HORARIO EN PANTALLA ---
function renderizarHorario() {
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    
    dias.forEach(d => {
        const columna = document.getElementById(d);
        if (columna) {
            const lista = columna.querySelector('.task-list');
            lista.innerHTML = ""; // Borramos lo viejo para no duplicar
            
            // Filtramos las materias de este día y las ponemos en orden
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

// --- NOTIFICACIONES (Cuadros de alerta) ---
function actualizarRelojYAlarma() {
    const ahora = new Date();
    const timeStr = ahora.toLocaleTimeString('es-ES', { hour12: false });
    document.getElementById('clock').innerText = timeStr;

    const HHMM = timeStr.substring(0, 5); 
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const hoy = diasSemana[ahora.getDay()];

    clasesGuardadas.forEach(clase => {
        // Si el día y la hora coinciden con el reloj... ¡ALERTA!
        if(clase.dia === hoy && clase.hora === HHMM && ahora.getSeconds() === 0) {
            alert("⏰ ¡ATENCIÓN! Tienes clase de: " + clase.materia);
        }
    });
}
setInterval(actualizarRelojYAlarma, 1000);

// REGLA DE ORO: Ejecutar todo al cargar la página
window.onload = () => {
    actualizarRelojYAlarma();
    mostrarApp();
};
