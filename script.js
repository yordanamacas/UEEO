// --- CARGA INICIAL ---
// Usamos una función para obtener datos de forma segura
function obtenerClases() {
    const datos = localStorage.getItem('agenda_universitaria_clases');
    return datos ? JSON.parse(datos) : [];
}

let clasesGuardadas = obtenerClases();

// --- FUNCIÓN DE GUARDADO (Forzando persistencia) ---
function guardarClase() {
    const materia = document.getElementById('input-materia').value;
    const hora = document.getElementById('input-hora').value;
    const dia = document.getElementById('input-dia').value;

    if(materia && hora) {
        // 1. Crear el objeto
        const nuevaClase = { materia, hora, dia };
        
        // 2. Obtener lo que ya hay, agregar lo nuevo y volver a guardar
        let listaActual = obtenerClases();
        listaActual.push(nuevaClase);
        
        // 3. GUARDADO DIRECTO
        localStorage.setItem('agenda_universitaria_clases', JSON.stringify(listaActual));
        
        // 4. Actualizar variable global y pantalla
        clasesGuardadas = listaActual;
        renderizarHorario();
        cerrarModal();
        
        console.log("Dato guardado exitosamente:", nuevaClase);
    } else {
        alert("Por favor llena todos los campos");
    }
}

// --- DIBUJAR EN PANTALLA ---
function renderizarHorario() {
    // Limpiamos todo el horario primero
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    
    dias.forEach(d => {
        const columna = document.getElementById(d);
        if (columna) {
            const lista = columna.querySelector('.task-list');
            lista.innerHTML = ""; 
            
            // Recorremos la lista actualizada
            clasesGuardadas.filter(c => c.dia === d)
                .sort((a,b) => a.hora.localeCompare(b.hora))
                .forEach(c => {
                    const item = document.createElement('div');
                    item.className = 'task-item';
                    item.innerHTML = `<b>${c.hora}</b> - ${c.materia}`;
                    lista.appendChild(item);
                });
        }
    });
}

// --- NOTIFICACIONES ---
function verificarAlarmas() {
    const ahora = new Date();
    const HHMM = ahora.toLocaleTimeString('es-ES', { hour12: false }).substring(0, 5);
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const hoy = dias[ahora.getDay()];

    clasesGuardadas.forEach(clase => {
        if(clase.dia === hoy && clase.hora === HHMM && ahora.getSeconds() === 0) {
            alert("⏰ Es hora de: " + clase.materia);
        }
    });
}
setInterval(verificarAlarmas, 1000);

// --- CARGA AL ABRIR LA PÁGINA ---
window.onload = () => {
    // Recuperar perfil
    const perfil = JSON.parse(localStorage.getItem('perfil_usuario'));
    if(perfil) {
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('pantalla-horario').style.display = 'block';
        document.getElementById('tag-user').innerText = perfil.nombre.toUpperCase();
    }
    
    // Recargar datos guardados
    clasesGuardadas = obtenerClases();
    renderizarHorario();
    
    // Notificaciones
    if ("Notification" in window) Notification.requestPermission();
};
