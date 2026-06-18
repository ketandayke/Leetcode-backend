import Docker from "dockerode";
import logger from "../../config/logger.config";

interface containerOptions{
    imageName:string,
    cmdExecutable:string[],
    memoryLimit:number
}

export const createNewDockerContainer=async(options:containerOptions)=>{
    try{
     const docker=await new Docker();
      const container=await docker.createContainer({
        Image:options.imageName,// image name
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,// teletype teminal
        Cmd: options.cmdExecutable,
        OpenStdin: false,
        HostConfig:{
            Memory:options.memoryLimit,// memory limit of container
            PidsLimit:100,//process to run in contianer
            CpuQuota:50000,// cpu limit of container
            CpuPeriod:100000,// cpu period of container
            SecurityOpt:["no-new-privileges"],// security option of container
            NetworkMode:"none"// network mode of container
        }
      });

      return container;

    } catch (error) {
        logger.error(`Error creating container from image ${options.imageName}: ${error}`);
    }
}