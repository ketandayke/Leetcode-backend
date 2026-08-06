import { InternalServerError } from "../errors/app.error";
import { commands } from "./commands.utils";
import { createNewDockerContainer } from "./createContainer.utils";
import logger from "../../config/logger.config";
const allowListedLanguage = ["python", "cpp","java"];
export enum SubmissionLanguage{
    CPP="cpp",
    JAVA="java",
    PYTHON="python"
}
export interface RunCodeOptions {
    code: string,
    language: SubmissionLanguage,
    timeout: number,
    imageName: string,
    input: string,
}

export async function runCode(options: RunCodeOptions) {

    const { code, language, timeout, imageName, input } = options;

    if(!allowListedLanguage.includes(language)) {
        throw new InternalServerError(`Invalid language: ${language}`);
    }
    // Type-safe lookup using Enum
    const commandGenerator = commands[language];
    if (!commandGenerator) {
        throw new InternalServerError(`Unsupported language provided: ${language}`);
    }

    const container = await createNewDockerContainer({
        imageName: imageName,
        cmdExecutable: commands[language](code, input),
        memoryLimit: 1024 * 1024 * 1024, // 1GB
    });

    let isTimeLimitExceeded = false;

    const timeLimitExceededTimeout = setTimeout(async () => {
        logger.warn("Time limit exceeded, attempting to terminate container...");
        isTimeLimitExceeded = true;
        try {
            // Safe kill: catch 409 errors if the container stopped right before the timeout fired
            await container?.kill();
        } catch (err: any) {
            // Ignore 409 conflict errors (container already stopped)
            if (err.statusCode !== 409) {
                logger.error("Error killing container on TLE", err);
            }
        }
    }, timeout);

    await container?.start();

    // Block until container exits
    const status = await container?.wait();

// ALWAYS clear the timer as soon as container.wait() finishes!
clearTimeout(timeLimitExceededTimeout);
    if(isTimeLimitExceeded) {
        await container?.remove();
        return {
            status: "time_limit_exceeded",
            output: "Time limit exceeded"
        }
    }

    const logs = await container?.logs({
        stdout: true,
        stderr: true
    });


    const containerLogs = processLogs(logs);

    await container?.remove();

    clearTimeout(timeLimitExceededTimeout);

    if(status.StatusCode == 0) {
        // success
        return {
            status: "success",
            output: containerLogs
        }
    } else {
        return {
            status: "failed",
            output: containerLogs
        }
    }
}

function processLogs(logs: any): string {
    if (!logs) return "";

    // Safely check if it's a real Buffer before passing encoding strings
    let logString = "";
    if (Buffer.isBuffer(logs)) {
        logString = logs.toString("utf8");
    } else if (typeof logs === "string") {
        logString = logs;
    } else {
        logString = String(logs); // Fallback string conversion for numbers/objects
    }

    return logString
        .replace(/\x00/g, "") // Remove null bytes
        .replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, "") // Remove control characters
        .trim();
}