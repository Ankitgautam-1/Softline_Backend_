import express from "express";
import createContract, {
  getContract,
  paginated,
  editContract,
} from "../../controller/contract.js";
import multer from "multer";
import uploadFile, { checkContractExist } from "../uploadingFiles/index.js";
const Router = express.Router();
const upload = multer({ dest: "./uploads/" });
const contractRoute = Router.post("/api/v1/createContract", createContract)
  .get("/api/v1/getContract", getContract)
  .get("/api/v1/paginated", paginated)
  .post("/api/v1/editContract", editContract)
  .post("/api/v1/uploadFile", checkContractExist, upload.any(), uploadFile);

export default contractRoute;
