import express from 'express';
import createContract, {
<<<<<<< HEAD
	getContract,
	paginated,
	editContract,
=======
	editContract,
	getContract,
	paginated,
>>>>>>> 0ee66c0503768190662e340a9ed4dc2b04fcd670
} from '../../controller/contract.js';
const Router = express.Router();

const contractRoute = Router.post('/api/v1/createContract', createContract)
	.get('/api/v1/getContract', getContract)
	.get('/api/v1/paginated', paginated)
<<<<<<< HEAD
	.post('/api/v1/editContract', editContract);
=======
	.put('/api/v1/editContract', editContract);
>>>>>>> 0ee66c0503768190662e340a9ed4dc2b04fcd670

export default contractRoute;
