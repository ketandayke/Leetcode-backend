import mongoose, { Document } from "mongoose";

// Testcases Interface
export interface ITestcase{
    input:string,
    output:string
}

// Problem interface
export interface IProblem extends Document{
    title:string,
    description:string,
    difficulty:"easy"|"medium"|"hard",
    createdAt:string,
    updatedAt:string,
    editorial?:string,
    testcases:ITestcase[]
}

const testSchema=new mongoose.Schema<ITestcase>({
    input:{
        type:String,
        required:[true,"Testcase input is required"],
        trim:true
    },
    output:{
        type:String,
        required:[true,"Testcase output is required"],
        trim:true
    }
},
{
    // _id:false // This will prevent mongoose from creating an _id field for each testcase
}
)

const problemSchema=new mongoose.Schema<IProblem>({
     title:{
        type:String,
        required:[true,"Problem title is required"],
        maxLength:[100,"Problem title must be less than 100 characters"],
        trim:true
     },
     description:{
        type:String,
        required:[true,"Problem description is required"],
        trim:true
     },
     difficulty:{
        type:String,
        enum:{
            values:["easy","medium","hard"],
            message:"Difficulty must be either easy, medium or hard"
        },
        default:"easy",
        required:[true,"Difficulty level is required for problem"]
     },
     editorial:{
        type:String,
        trim:true
     },
     testcases:{
        type:[testSchema]
     }
     
},
{
    timestamps:true,
    toJSON:{
        // This will transform the _id field to id and remove __v field when the document is converted to JSON
        transform:(_:any,record:Record<string,any>)=>{
            record.id=record._id.toString();
            delete record._id;
            delete record.__v;
            return record;
        }
    }
})

// indexing the title field for faster search and ensuring uniqueness
problemSchema.index({title:1,unique:1});
problemSchema.index({difficulty:1});
export const Problem= mongoose.model<IProblem>("Problem",problemSchema);

