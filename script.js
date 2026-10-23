display.addEventListener("keydown", function(event)
{
    if(event.key === "Enter")
    {
        calculate();
    }
})

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
    try
    {
        let expression = display.value;
        expression = expression.replace(/x/gi, "*");
        const result = Function(`"use strict"; return (${expression})`)();

        if(result === undefined || result === null)
        {
            display.value = "Error";
            return;
        }
        display.value = result;
    }
    catch
    {
        display.value = "Error";
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
        taskList.innerHTML = "";
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
    function startTimer()
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
        }, 1000);
    }

    function updateTimer()
    {
        let m = Math.floor(time/60);
        let s = time % 60;
        document.getElementById("timer").textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    updateTimer();

    function pauseTimer()
    {
        clearInterval(interval);
        timerRunning = false;
    }

    function updateStats()
    {
        document.getElementById("taskCount").textContent = `Tasks: ${tasks.length}`;
        document.getElementById("goalCount").textContent = `Goals: ${document.querySelectorAll('#goalList li').length}`;
        document.getElementById("habitCount").textContent = `Habits: ${document.querySelectorAll('#habitList li').length}`;
    }
    updateStats();

    function setTheme(theme)
    {
        document.body.classList.remove("light-theme", "dark-theme", "ocean-theme");
        document.body.classList.add(`${theme}-theme`);

        localStorage.setItem("theme", theme);
    }
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    function toggleWhiteNoise()
    {
        if(!isNoisePlaying)
        {
            audioContext = new(window.AudioContext || window.webkitAudioContext)();
            const bufferSize = 2 * audioContext.sampleRate;
            const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);

            for(let i = 0; i < bufferSize; i++)
            {
                output[i] = Math.random() * 2 - 1;
            }

            noiseNode = audioContext.createBufferSource();
            noiseNode.buffer = noiseBuffer;
            noiseNode.loop = true;

            const gain = audioContext.createGain();
            gain.gain.value = 0.05;

            noiseNode.connect(gain);
            gain.connect(audioContext.destination);
            noiseNode.start();
            document.getElementById("noiseBtn").textContent = "Stop White Noise";

            isNoisePlaying = true;
        }
        else
        {
            noiseNode.stop();
            document.getElementById("noseBtn").textContent = "Start White Noise";

            isNoisePlaying = false;
        }
    }
    document.getElementById("noiseBtn").addEventListener("click", toggleWhiteNoise);