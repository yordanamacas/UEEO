// --- CARGA E INICIALIZACIÓN ---
let clasesGuardadas = JSON.parse(localStorage.getItem('agenda_universitaria_clases')) || [];

// --- FUNCIÓN PARA ENTRAR (Faltaba en tu JS) ---
function entrar() {
    const nombre = document.getElementById('nombre-usuario').value;
    const curso = document.getElementById('curso-usuario').value;

    if (nombre.trim() !== "" && curso.trim() !== "") {
        const perfil = { nombre: nombre, curso: curso };
        localStorage.setItem('perfil_usuario', JSON.stringify(perfil));
        
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('pantalla-horario').style.display = 'block';
        document.getElementById('tag-user').innerText = nombre.toUpperCase();
        
        renderizarHorario();
    } else {
        alert("Por favor, ingresa tu nombre y curso.");
    }
}

// --- FUNCIONES DEL MODAL (CON FIX PARA MÓVIL) ---
function abrirModal() {
    const modal = document.getElementById('modal-tarea');
    if (modal) {
        modal.style.display = 'flex';
        // El secreto para el Redmi 10C: un pequeño retraso antes del focus
        setTimeout(() => {
            const inputMateria = document.getElementById('input-materia');
            inputMateria.focus();
            inputMateria.click(); // Doble seguridad para activar el teclado
        }, 300);
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
        
        clasesGuardadas.push(nuevaClase);
        localStorage.setItem('agenda_universitaria_clases', JSON.stringify(clasesGuardadas));
        
        renderizarHorario();
        cerrarModal();
        
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

    if (ahora.getSeconds() === 0) {
        const HHMM = `${h}:${m}`;
        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const hoy = diasSemana[ahora.getDay()];

        clasesGuardadas.forEach(c => {
            if(c.dia === hoy && c.hora === HHMM) {
                alert("📢 Clase ahora: " + c.materia);
            }
        });
    }
}

// --- SALIR / CERRAR SESIÓN (Faltaba en tu JS) ---
function cerrarSesion() {
    if(confirm("¿Quieres cerrar sesión?")) {
        localStorage.clear();
        location.reload();
    }
}

setInterval(actualizarApp, 1000);

window.onload = () => {
    const perfil = JSON.parse(localStorage.getItem('perfil_usuario'));
    if(perfil) {
        document.getElementById('pantalla-registro').style.display = 'none';
        document.getElementById('pantalla-horario').style.display = 'block';
        document.getElementById('tag-user').innerText = perfil.nombre.toUpperCase();
    }
    
    // Auto-cargar notas si existen
    const notasGuardadas = localStorage.getItem('notas_agenda');
    const areaNotas = document.getElementById('notes-area');
    if (notasGuardadas && areaNotas) {
        areaNotas.value = notasGuardadas;
    }
    
    // Guardado automático de notas
    if (areaNotas) {
        areaNotas.addEventListener('input', (e) => {
            localStorage.setItem('notas_agenda', e.target.value);
        });
    }

    renderizarHorario();
    actualizarApp();
};
