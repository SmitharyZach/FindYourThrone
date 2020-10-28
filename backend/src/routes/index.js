import express from "express";
import {
  indexPage,
  bathroomsPage,
  addBathroom,
  findBathroom,
  findReviews,
  addReview,
  findOrCreateBathroom,
  findAverage,
} from "../controllers";
const indexRouter = express.Router();

indexRouter.get("/", indexPage);
indexRouter.get("/bathrooms", bathroomsPage);
indexRouter.post("/bathrooms", addBathroom);
indexRouter.post("/reviews", addReview);
indexRouter.get("/bathrooms/:id", findOrCreateBathroom);
indexRouter.get("/reviews/:id", findReviews);
indexRouter.get("/bathrooms/average/:id", findAverage);

export default indexRouter;
