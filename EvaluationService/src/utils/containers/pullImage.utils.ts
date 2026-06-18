import Docker from "dockerode";
import logger from "../../config/logger.config";
import { PYTHON_IMAGE,CPP_IMAGE } from "../constants";

export const pullImage=async(image:string)=>{
       const docker = new Docker();
       
       return new Promise((res,rej)=>{
           docker.pull(image,(err:Error,stream:NodeJS.ReadableStream)=>{
              if(err){
                  rej(err);
                  return;
              }
              docker.modem.followProgress(
                stream,
                function onFinished(finalErr,output){
                    if(finalErr){
                        rej(finalErr);
                        return;
                    }
                    res(output);
                },
                function onProgress(event){
                    logger.info(`Pulling image ${image}: ${event.status} ${event.progress || ""}`)
                }
            );
           });
        });
 }

 export async function pullAllImages(){
      const images=[PYTHON_IMAGE,CPP_IMAGE];

        const promises= images.map(async(image)=>pullImage(image));
        try {
            await Promise.all(promises);
            logger.info("All images pulled successfully");
            
        } catch (error) {
            logger.error(`Error pulling images: ${error}`);
        }
 }
