// Cargar datos al abrir
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    initApp();
});

function saveUser() {
    const name = document.getElementById('reg-name').value;
    const curso = document.getElementById('reg-curso').value;
    const paralelo = document.getElementById('reg-paralelo').value;

    if(name && curso && paralelo) {
        localStorage.setItem('appUser', JSON.stringify({name, curso, paralelo}));
        initApp();
    }
}

function initApp() {
    const user = JSON.parse(localStorage.getItem('appUser'));
    if(user) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        document.getElementById('display-user-name').textContent = user.name;
        document.getElementById('display-user-details').textContent = `${user.curso} | Paralelo ${user.paralelo}`;
        renderDays();
        renderTasks();
    }
}

function updateTime() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    document.getElementById('date-display').textContent = now.toLocaleDateString('es-ES', options);
}
setInterval(updateTime, 60000);

const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

function renderDays() {
    const wrapper = document.getElementById('days-wrapper');
    wrapper.innerHTML = dias.map(d => `
        <div class="day-column">
            <div class="day-header"><h3>${d}</h3></div>
            <div id="tasks-${d}" class="tasks-list"></div>
        </div>
    `).join('');
}

let tasks = JSON.parse(localStorage.getItem('userTasks')) || [];

function addTask() {
    const name = document.getElementById('task-name').value;
    const time = document.getElementById('task-time').value;
    const day = document.getElementById('task-day').value;

    if(name && time) {
        tasks.push({ name, time, day });
        localStorage.setItem('userTasks', JSON.stringify(tasks));
        renderTasks();
        hideModal();
    }
}

function renderTasks() {
    dias.forEach(d => {
        const div = document.getElementById(`tasks-${d}`);
        if(div) {
            div.innerHTML = tasks
                .filter(t => t.day === d)
                .map((t, i) => `
                    <div class="task-card">
                        <span><b>${t.time}</b> ${t.name}</span>
                        <button onclick="removeTask(${tasks.indexOf(t)})" style="color:red; border:none; background:none;">✕</button>
                    </div>
                `).join('');
        }
    });
}

function removeTask(i) {
    tasks.splice(i, 1);
    localStorage.setItem('userTasks', JSON.stringify(tasks));
    renderTasks();
}

function showModal() { document.getElementById('modal').style.display = 'flex'; }
function hideModal() { document.getElementById('modal').style.display = 'none'; }
