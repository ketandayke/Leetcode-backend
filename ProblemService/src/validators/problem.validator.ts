import {z} from "zod";

export const createProblemSchema=z.object({
    title:z.string().min(1).max(100),
    description:z.string().min(1),
    difficulty:z.enum(["easy","medium","hard"]),
    editorial:z.string().optional(),
    testcases:z.array(z.object({
        input:z.string().min(1),
        output:z.string().min(1)
    }))
})


export const updateProblemSchema=z.object({
    title:z.string().min(1).max(100).optional(),
    description:z.string().min(1).optional(),
    difficulty:z.enum(["easy","medium","hard"]).optional(),
    editorial:z.string().optional(),
    testcases:z.array(z.object({
        input:z.string().min(1),
        output:z.string().min(1)
    })).optional()
})

export const findByDifficultySchema=z.object({
    difficulty:z.enum(["easy","medium","hard"])
})
export const searchProblemSchema=z.object({
    query:z.string().min(1)
})

export type CreateProblemDTO=z.infer<typeof createProblemSchema>;
export type UpdateProblemDTO=z.infer<typeof updateProblemSchema>;


