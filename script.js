let goals = [];
let audioContext;
let noiseNode;
let isNoisePlaying = false;

const display = document.getElementById("calcDisplay");
function addGoal()
{
    const input = document.getElementById("goalInput");
    if(input.value.trim() === "")
    {
        return;
    }
    goals.push(input.value);
    renderGoals();
    input.value = "";
}
function renderGoals()
{
    const list = document.getElementById("goalList");
    list.innerHTML = "";
    goals.forEach(goal => {
        let li = document.createElement("li");
        li.textContent = goal;
        list.appendChild(li);
    });
}
display.addEventListener("keydown", function(event)
{
    if(event.key === "Enter")
    {
        calculate();
    }
})

function calculate()
{
    try
    {
        let expression = display.value;
        expression = expression.replace(/x/gi, "*");
        const result = Function(`"use strict"; return (${expression})`)();
        display.value = result;
    }
    catch
    {
        display.value = "Error";
    }
}

function addValue(v)
{
    display.value = display.value + v;
}
    display.addEventListener("keypress", function(event)
    {
        if(event.key === "Enter")
        {
            calculate();
        }
    });

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
        if(input.value.trim() === "")
        {
            return;
        }
        tasks.push({text: input.value, completed:false});
        saveTasks();
        renderTasks();
        input.value="";
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
    let time = 1500;
    let interval = null;
    let timerRunning = false;
    function startTimer()
    {
        if(interval) return;
        interval = setInterval(() => {
            time--;
            updateTimer();
            if(time <= 0)
            {
                clearInterval(interval);
                interval = null;
                alert("Pomodoro Complete!!");
            }
        }, 1000);
    }


    function updateTimer()
    {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        document.getElementById("timer").textContent = `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
    }
    updateTimer();

    function pauseTimer()
    {
        clearInterval(interval);
        interval = null;
    }

    function resetTimer()
    {
        clearInterval(interval);
        interval = null;
        time = 1500;
        updateTimer();
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
            gain.gain.value = 0.15;

            noiseNode.connect(gain);
            gain.connect(audioContext.destination);
            noiseNode.start();
            document.getElementById("noiseBtn").textContent = "Stop White Noise";

            isNoisePlaying = true;
        }
        else
        {
            noiseNode.stop();
            document.getElementById("noiseBtn").textContent = "Start White Noise";

            isNoisePlaying = false;
        }
    }
    document.getElementById("noiseBtn").addEventListener("click", toggleWhiteNoise);

    const quotes =
    [
        "Small progress is still progress.",
        "Focus on being productive, not busy.",
        "Success is the sum of small efforts.",
        "One task at a time.",
        "Discipline beats motivation"
    ];
    function newQuote()
    {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        document.getElementById("quote").textContent = quotes[randomIndex];
    }
    function addHabit()
    {
        const input = document.getElementById("habitInput");
        if(input.value.trim()==="")
        {
            return;
        }
        const li = document.createElement("li");
        li.innerHTML = `<span>${input.value}</span>
        <button onclick="completeHabit(this)">✔</button>
        <button onclick="deleteHabit(this)">🗑</button>`;
        document.getElementById("habitList").appendChild(li);
        input.value="";
    }
    function deleteHabit(button)
    {
        button.parentElement.remove();
    }
    function celebrate()
    {
        confetti({particleCount: 150, spread: 120, origin: {y: 0.6}});
        const audio = new Audio("https://assets.mixkit.co/active_storage/s/fx/2018/2018-preview.mp3");
        audio.play();
    }
    function toggleTask(index)
    {
        tasks[index].completed = !tasks[index].completed;
        if(tasks[index].completed)
        {
            celebrate();
        }
        saveTasks();
        renderTasks();
    }
    function completeHabit(button)
    {
        celebrate();
        button.parentElement.style.opacity = "0.5";
        button.parentElement.style.textDecoration = "line-through";
    }
    let xp = Number(localStorage.getItem("xp")) || 0;
    function updateXP()
    {
        localStorage.setItem("xp", xp);
        document.getElementById("xpDisplay").textContent = `XP: ${xp}`;
        document.getElementById("levelDisplay").textContent = `Level: ${Math.floor(xp / 100)+ 1}`;
    }