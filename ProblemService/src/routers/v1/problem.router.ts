import Router from "express";
import { validateRequestBody,validateRequestParams,validateQueryParams } from "../../validators/index.validator";
import { createProblemSchema,findByDifficultySchema,searchProblemSchema,updateProblemSchema } from "../../validators/problem.validator";
import { ProblemController } from "../../controllers/problem.controller";


const problemRouter=Router();

problemRouter.post(
    "/",
    validateRequestBody(createProblemSchema),
    ProblemController.createProblem
);

problemRouter.get(
    "/search",
    validateQueryParams(searchProblemSchema),
    ProblemController.searchProblem
);

problemRouter.get(
    "/:id",
    ProblemController.getProblemById
);

problemRouter.get(
    "/",
    ProblemController.getAllProblems,
);

problemRouter.put(
    "/:id",
    validateRequestBody(updateProblemSchema),
    ProblemController.updateProblem
);
problemRouter.delete(
    "/:id",
    ProblemController.deleteProblem
);

problemRouter.get(
    "/difficulty/:difficulty",
    validateRequestParams(findByDifficultySchema),
    ProblemController.findByDifficulty
);


export default problemRouter;