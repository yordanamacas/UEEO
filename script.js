// --- CARGA E INICIALIZACIÓN ---
let clasesGuardadas = JSON.parse(localStorage.getItem('agenda_universitaria_clases')) || [];

// --- FUNCIONES DEL MODAL (PARA QUE PUEDAS ESCRIBIR) ---
function abrirModal() {
    const modal = document.getElementById('modal-tarea');
    if (modal) {
        modal.style.display = 'flex';
        // Esto pone el cursor automáticamente en el cuadro de texto
        document.getElementById('input-materia').focus();
    }
}

function cerrarModal() {
    const modal = document.getElementById('modal-tarea');
    if (modal) modal.style.display = 'none';
}

// --- GUARDAR ASIGNATURA ---
function guardarClase() {
    const materiaInput = document.getElementById('input-materia');
    const horaInput = document.getElementById('input-hora');
    const diaInput = document.getElementById('input-dia');

    if(materiaInput.value && horaInput.value) {
        const nuevaClase = { 
            materia: materiaInput.value, 
            hora: horaInput.value, 
            dia: diaInput.value 
        };
        
        // Guardar en la lista y en el navegador
        clasesGuardadas.push(nuevaClase);
        localStorage.setItem('agenda_universitaria_clases', JSON.stringify(clasesGuardadas));
        
        // Actualizar la vista
        renderizarHorario();
        cerrarModal();
        
        // Limpiar para la próxima vez
        materiaInput.value = "";
        horaInput.value = "";
    } else {
        alert("¡Escribe el nombre de la materia y la hora!");
    }
}

// --- DIBUJAR EN EL HORARIO ---
function renderizarHorario() {
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    
    dias.forEach(d => {
        const columna = document.getElementById(d);
        if (columna) {
            const lista = columna.querySelector('.task-list');
            if (lista) {
                lista.innerHTML = ""; 
                clasesGuardadas.filter(c => c.dia === d)
                    .sort((a,b) => a.hora.localeCompare(b.hora))
                    .forEach(c => {
                        const item = document.createElement('div');
                        item.className = 'task-item';
                        item.innerHTML = `<b>${c.hora}</b> - ${c.materia}`;
                        lista.appendChild(item);
                    });
            }
        }
    });
}

// --- RELOJ Y ALARMAS ---
function actualizarApp() {
    const ahora = new Date();
    const h = String(ahora.getHours()).padStart(2, '0');
    const m = String(ahora.getMinutes()).padStart(2, '0');
    const s = String(ahora.getSeconds()).padStart(2, '0');
    
    const reloj = document.getElementById('clock');
    if (reloj) reloj.innerText = `${h}:${m}:${s}`;

    // Alerta de clase
    const HHMM = `${h}:${m}`;
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const hoy = diasSemana[ahora.getDay()];

    if (ahora.getSeconds() === 0) {
        clasesGuardadas.forEach(c => {
            if(c.dia === hoy && c.hora === HHMM) {
                alert("📢 Clase ahora: " + c.materia);
            }
        });
    }
}

setInterval(actualizarApp, 1000);

// --- AL CARGAR LA PÁGINA ---
window.onload = () => {
    const perfil = JSON.parse(localStorage.getItem('perfil_usuario'));
    if(perfil) {
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('pantalla-horario').style.display = 'block';
        document.getElementById('tag-user').innerText = perfil.nombre.toUpperCase();
    }
    renderizarHorario();
    actualizarApp();
};
