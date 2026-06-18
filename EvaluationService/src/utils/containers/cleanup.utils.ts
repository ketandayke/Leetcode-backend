import Docker from 'dockerode';
import logger from '../../config/logger.config';

/**
 * Sweeps the local Docker daemon to kill and remove any lingering execution sandboxes
 */
export async function forcePurgeDanglingContainers() {
    const docker = new Docker();
    try {
        // Query only containers spun up by this specific Evaluation Service
        const containers = await docker.listContainers({ all: true });
        
        for (const containerInfo of containers) {
            // Check if the container matches your execution environments
            if (containerInfo.Image.includes('python') || containerInfo.Image.includes('gcc') || containerInfo.Image.includes('cpp')) {
                const container = docker.getContainer(containerInfo.Id);
                
                if (containerInfo.State === 'running') {
                    logger.warn(`Force killing zombie execution container: ${containerInfo.Id}`);
                    await container.kill();
                }
                
                logger.info(`Purging leftover container volumes: ${containerInfo.Id}`);
                await container.remove();
            }
        }
    } catch (error) {
        logger.error('Error executing automated infrastructure cleanup sweep', error);
    }
}