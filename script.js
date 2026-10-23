const display = document.getElementById('calcDisplay');
function addValue(v)
{
    display.value = display.value + v;
}
function clearCalc()
{
    display.value='';
}
function calculate()
{
    try{
        const result = Function('"use strict"; return(' + display.value + ')')();

        if(result === undefined || result === null)
        {
            display.value = "Error";
            return;
        }

        display.value = result;
    }catch{
        display.value='Error';
    }
    }

    function saveNotes()
    {
        localStorage.setItem('notes',document.getElementById('notes').value);
    }
    document.getElementById('notes').value = localStorage.getItem('notes') || '';
    function backspace()
    {
        display.value = display.value.slice(0, -1);
    }
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks()
    {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    function renderTasks()
    {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML ="";
        tasks.forEach((task, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
        <span class ="${task.completed ? 'completed' : ''}">
        ${task.text}
        </span>

        <div>
            <button onclick="toggleTask(${index})"> ✓ </button>

            <button onclick="deleteTask(${index})"> 🗑 </button>
        </div>

        `;
        taskList.appendChild(li);
        });

    }
    function addTask()
    {
        const input = document.getElementById("taskInput");
        if(input.value.trim() === "") return;
        task.push({
            text: input.value, completed: false
        });
        saveTasks();
        renderTasks();
        input.value = "";
    }
    function toggleTask(index)
    {
        tasks[index].completed = !tasks[index].completed;

        saveTasks();
        renderTasks();
    }

    function deleteTask(index)
    {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
    renderTasks();

    const notesElement = document.getElementById("notes");
    notesElement.value = localStorage.getItem("notes") || "";
    notesElement.addEventListener("input", () => {
        localStorage.setItem( "notes", notesElement.value);
    });

    let timerRunning = false;
    function: startTimer()
    {
        if(timerRunning) return;
        timerRunning = true;
        interval = setInterval(() => 
        {
            if(time <= 0)
            {
                clearInterval(interval);

                alert("Pomodoro Complete!");
                
                timerRunning = false;
                return;
            }
                time--;
                updateTimer();
        }, 1000);

    }

    function pauseTimer()
    {
        clearInterval(interval);
        timerRunning = false;
    }

    function: updateStats()
    {
        document.getElementById("taskCount").textContent = `Tasks: ${tasks.length}`;
        document.getElementById("goalCount").textContent = `Goals: ${document.querySelectorAll('#goalList li')}`;
        document.getElementById("habitCount").textContent = `Habits: ${document.querySelectorAll('#habitList li').length}`;
    }
    updateStats();