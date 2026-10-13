import { Router, type IRouter } from "express";
import healthRouter from "./health";
import schemesRouter from "./schemes";
import checklistsRouter from "./checklists";
import documentGuidesRouter from "./documentGuides";
import adminDocumentGuidesRouter from "./adminDocumentGuides";

const router: IRouter = Router();

router.use(healthRouter);
router.use(schemesRouter);
router.use(checklistsRouter);
router.use(documentGuidesRouter);
router.use(adminDocumentGuidesRouter);

export default router;
