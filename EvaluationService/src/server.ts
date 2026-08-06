import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { startWorkers } from './workers/evaluation.worker';
import { pullAllImages } from './utils/containers/pullImage.utils';
import { forcePurgeDanglingContainers } from './utils/containers/cleanup.utils';
import {runCode} from './utils/containers/codeRunner.utils';
import { CPP_IMAGE,PYTHON_IMAGE } from './utils/constants';
const app = express();

app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router); 


/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);


app.listen(serverConfig.PORT,async() => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Press Ctrl+C to stop the server.`);
    await forcePurgeDanglingContainers();
    await startWorkers();
    logger.info(`Workers started successfully.`);
    await pullAllImages();
    logger.info(`All required Docker images pulled successfully.`);
    await testPyThonCode();
    await testCppCode();
});

// Capture system shutdown commands (like Ctrl+C) to run the cleanup script safely
process.on('SIGINT', async () => {
    logger.warn('Shutting down server. Initializing urgent container sweep...');
    await forcePurgeDanglingContainers();
    process.exit(0);
});

async function testPyThonCode() {
    logger.info("--- STARTING PYTHON CONTAINER TEST ---");
    const pythonCode = `
import time
print("Python script starting...")
time.sleep(1)
print("Hello from Python Docker Sandbox!")
    `;
    
    const result = await runCode({
        code: pythonCode,
        language: "python" as any,
        timeout: 3000,
        imageName: PYTHON_IMAGE,
        input: ""
    });

    logger.info("Python Execution Result:", result);
}

async function testCppCode() {
    logger.info("--- STARTING C++ CONTAINER TEST ---");
    const cppCode = `
#include<iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    cout << "Input received: " << n << endl;
    cout << "Double value is: " << (n * 2) << endl;
    return 0;
}
    `;

    const result = await runCode({
        code: cppCode,
        language: "cpp" as any,
        timeout: 3000,
        imageName: CPP_IMAGE,
        input: "21" // Should output 42
    });

    logger.info("C++ Execution Result:", result);
}