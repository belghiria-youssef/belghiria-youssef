let pyodide;

async function loadPyodideAndPackages() {
    pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy");
    pyodide.globals.set('print', (...args) => {
        const outputArea = document.getElementById('output');
        outputArea.textContent += args.join(' ') + '\n';
    });
}

loadPyodideAndPackages();

const runCodeButton = document.getElementById('runCode');
const codeInput = document.getElementById('codeInput');
const outputArea = document.getElementById('output');

runCodeButton.addEventListener('click', async () => {
    const code = codeInput.value;
    outputArea.textContent = '';
    await executePythonCode(code);
});

async function executePythonCode(code) {
    try {
        let result = await pyodide.runPythonAsync(code);
        outputArea.textContent += result !== undefined && result !== "" ? result.toString() + '\n' : '';
    } catch (err) {
        outputArea.textContent += `Error: ${err.message}\n`;
    }
}

codeInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        handleIndentation(event);
    }
});

codeInput.addEventListener('input', () => {
    outputArea.textContent = '';
});

function handleIndentation(event) {
    const start = codeInput.selectionStart;
    const end = codeInput.selectionEnd;
    const keywords = ["while", "for", "if", "def", "class"];
    const lineBeforeCursor = codeInput.value.substring(0, start).split("\n").pop();

    for (const keyword of keywords) {
        if (lineBeforeCursor.trim().startsWith(keyword) && lineBeforeCursor.trim().endsWith(":")) {
            event.preventDefault();

            const spaces = "    "; 
            const newValue =
                codeInput.value.substring(0, start) +
                "\n" +
                spaces +
                codeInput.value.substring(end);

            codeInput.value = newValue;

            codeInput.selectionStart = codeInput.selectionEnd = start + 1 + spaces.length;
            break;
        }
    }
}
