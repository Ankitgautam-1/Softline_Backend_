import express from 'express';
import createContract, { getContract } from '../../controller/contract.js';
const Router = express.Router();

const contractRoute = Router.post('/api/v1/createContract', createContract).get(
	'/api/v1/getContract',
	getContract
);

export default contractRoute;
