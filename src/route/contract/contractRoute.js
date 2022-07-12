import express from "express";
import createContract, {
  getContract,
  paginated,
} from "../../controller/contract.js";
const Router = express.Router();

const contractRoute = Router.post("/api/v1/createContract", createContract)
  .get("/api/v1/getContract", getContract)
  .get("/api/v1/paginated", paginated);

export default contractRoute;
