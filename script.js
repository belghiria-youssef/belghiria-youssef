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

codeInput.addEventListener('input', () => {
    outputArea.textContent = '';
});
