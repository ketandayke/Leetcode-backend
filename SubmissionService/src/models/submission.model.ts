import {Document,model,Schema} from "mongoose";

export enum SubmissionStatus{
    PENDING="pending",
    COMPILING="compiling",
    RUNNING="running",
    ACCEPTED="accepted",
    WRONG_ANSWER="wrong_answer",
}
export enum SubmissionLanguage{
    CPP="cpp",
    JAVA="java",
    PYTHON="python"
}

export interface ISubmissionData{
    testcaseId:string,
    status:string
}

export interface ISubmission extends Document{
      problemId:string,
      code:string,
      language:SubmissionLanguage,
      status:SubmissionStatus,
      submissionData:ISubmissionData, // we can store the submission data in a separate field if needed
      createdAt:Date,
      updatedAt:Date,
}

const submissionSchema= new Schema<ISubmission>({
    problemId:{
        type:String,
        required:[true,"ProblemId is required"]
    },
    code:{
        type:String,
        required:[true,"Code is required"]
    },
    language:{
        type:String,
        required:[true,"Programming language is required"],
        enum:Object.values(SubmissionLanguage)
    },
    status:{
        type:String,
        required:true,
        default:SubmissionStatus.PENDING,
        enum:Object.values(SubmissionStatus)
    },
    submissionData:{
        type:Object,
        required:true,
        default:{}
    }

},
{  
    timestamps:true,
    toJSON:{
        transform:function(_:any,record:any){
               record.id=record._id.toString();
               delete record._id;
               delete record.__v;
               return record;
        }
     }
});

submissionSchema.index({status:1,createdAt:-1});

export const Submission=model<ISubmission>("Submission",submissionSchema)