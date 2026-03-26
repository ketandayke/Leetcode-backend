import {marked} from "marked";
import sanitizeHtml from "sanitize-html";
import TurndownService from "turndown";
import logger from "../config/logger.config";
/**
 * @param markdown 
 * @returns Promise<string>
 */
export  const sanitizeMarkdown=async(markdown:string):Promise<string>=>{
      if(!markdown||typeof markdown!=="string"){
        return "";
      }
      try {
        // Convert markdown to HTML
        const convertedHtml=await marked.parse(markdown);

        // Sanitize the HTML to prevent XSS attacks
        const sanitizedHtml=sanitizeHtml(convertedHtml,{
              allowedTags:sanitizeHtml.defaults.allowedTags.concat(['img','pre','code']),
              allowedAttributes:{
                ...sanitizeHtml.defaults.allowedAttributes,
                img:['src','alt','title'],
                code:['class'],
                pre:['class'],
                a:['href','title','target']
              },
              allowedSchemes:['http','https'],
              allowedSchemesByTag:{
                img:['http','https']
              }
            });
          // Convert sanitized HTML back to markdown
            const turndownService=new TurndownService();
            return turndownService.turndown(sanitizedHtml);

      } catch (error) {
            logger.error("Error sanitizing markdown:",error);
            return "";
      }
}