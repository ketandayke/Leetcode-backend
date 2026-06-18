// Replace /bin/bash with the standard shell shortcut token
const shConfig = ['/bin/sh', '-c']; 

export const commands = {
    python: function(code: string, input: string) {
        const runCommand = `echo '${code}' > code.py && echo '${input}' > input.txt && python3 code.py < input.txt`;
        return [...shConfig, runCommand]; // Updated parameter array spread
    },
    cpp: function(code: string, input: string) {
        const runCommand = `mkdir -p app && cd app && echo '${code}' > code.cpp && echo '${input}' > input.txt && g++ code.cpp -o run && ./run < input.txt`;
        return [...shConfig, runCommand]; // Updated parameter array spread
    }
}