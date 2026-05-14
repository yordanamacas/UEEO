// Reloj digital
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('clock').textContent = timeString;
}
setInterval(updateClock, 1000);

// Auto-guardado de notas
const notesArea = document.getElementById('notes-area');
notesArea.value = localStorage.getItem('userNotes') || "";

notesArea.addEventListener('input', () => {
    localStorage.setItem('userNotes', notesArea.value);
});

// Funciones para el Modal
function showModal() { document.getElementById('modal').style.display = 'flex'; }
function hideModal() { document.getElementById('modal').style.display = 'none'; }

function addTask() {
    const name = document.getElementById('task-name').value;
    const time = document.getElementById('task-time').value;
    const day = document.getElementById('task-day').value;

    if(name && time) {
        const dayDiv = document.getElementById(day).querySelector('.tasks');
        const taskHtml = `
            <div style="padding:10px; border-bottom:1px solid #eee;">
                <strong>${time}</strong> - ${name}
            </div>
        `;
        dayDiv.innerHTML += taskHtml;
        hideModal();
    }
}