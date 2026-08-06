export enum SubmissionLanguage{
    CPP="cpp",
    JAVA="java",
    PYTHON="python"
}

const shConfig = ['/bin/sh', '-c'];

type CommandRunner = (code: string, input: string) => string[];

export const commands: Record<SubmissionLanguage, CommandRunner> = {
    [SubmissionLanguage.PYTHON]: function(code: string, input: string) {
        const runCommand = `echo '${code}' > code.py && echo '${input}' > input.txt && python3 code.py < input.txt`;
        return [...shConfig, runCommand];
    },
    [SubmissionLanguage.CPP]: function(code: string, input: string) {
        const runCommand = `mkdir -p app && cd app && echo '${code}' > code.cpp && echo '${input}' > input.txt && g++ code.cpp -o run && ./run < input.txt`;
        return [...shConfig, runCommand];
    },
    [SubmissionLanguage.JAVA]: function(code: string, input: string) {
        // Java requires compiling Main.java and running Main
        const runCommand = `mkdir -p app && cd app && echo '${code}' > Main.java && echo '${input}' > input.txt && javac Main.java && java Main < input.txt`;
        return [...shConfig, runCommand];
    }
};