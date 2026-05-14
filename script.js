// --- SISTEMA DE REGISTRO ---
function saveUser() {
    const name = document.getElementById('reg-name').value;
    const curso = document.getElementById('reg-curso').value;
    const paralelo = document.getElementById('reg-paralelo').value;

    if(name && curso && paralelo) {
        const userData = { name, curso, paralelo };
        localStorage.setItem('appUser', JSON.stringify(userData));
        initApp();
    } else {
        alert("Por favor llena todos los campos");
    }
}

function initApp() {
    const userData = JSON.parse(localStorage.getItem('appUser'));
    if(userData) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        document.getElementById('display-user-name').textContent = userData.name;
        document.getElementById('display-user-details').textContent = `${userData.curso} - ${userData.paralelo}`;
        renderDays();
        renderTasks();
    }
}

// --- FECHA Y RELOJ ---
function updateTime() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
    
    // Fecha automática en español
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('date-display').textContent = now.toLocaleDateString('es-ES', options);
}
setInterval(updateTime, 1000);

// --- GESTIÓN DE DÍAS Y TAREAS ---
const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

function renderDays() {
    const container = document.getElementById('days-wrapper');
    container.innerHTML = "";
    
    dias.forEach(dia => {
        container.innerHTML += `
            <div class="day-column" id="${dia}">
                <div class="day-header"><h3>${dia}</h3></div>
                <div class="tasks"></div>
            </div>
        `;
    });
}

let tasks = JSON.parse(localStorage.getItem('userTasks')) || [];

function addTask() {
    const name = document.getElementById('task-name').value;
    const time = document.getElementById('task-time').value;
    const day = document.getElementById('task-day').value;

    if(name && time) {
        tasks.push({ name, time, day });
        localStorage.setItem('userTasks', JSON.stringify(tasks)); // AQUÍ SE GUARDA
        renderTasks();
        hideModal();
        document.getElementById('task-name').value = "";
    }
}

function renderTasks() {
    document.querySelectorAll('.tasks').forEach(div => div.innerHTML = "");
    tasks.forEach((task, index) => {
        const dayDiv = document.getElementById(task.day)?.querySelector('.tasks');
        if(dayDiv) {
            dayDiv.innerHTML += `
                <div class="task-item">
                    <span><strong>${task.time}</strong> ${task.name}</span>
                    <button onclick="deleteTask(${index})" style="border:none; background:none; color:red;">x</button>
                </div>
            `;
        }
    });
}

function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('userTasks', JSON.stringify(tasks));
    renderTasks();
}

function showModal() { document.getElementById('modal').style.display = 'flex'; }
function hideModal() { document.getElementById('modal').style.display = 'none'; }
function logout() { localStorage.removeItem('appUser'); location.reload(); }

// Iniciar aplicación
updateTime();
initApp();
