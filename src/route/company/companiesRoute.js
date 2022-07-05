import express from 'express';
import getCompanies, {
	getAgents,
	getServicePackage,
	getServicItem,
} from '../../controller/companies.js';

const Router = express.Router();

const companiesRoute = Router.get('/api/v1/getCompanies', getCompanies)
	.get('/api/v1/getServicePackage', getServicePackage)
	.get('/api/v1/getServiceItem', getServicItem)
	.get('/api/v1/getAgents', getAgents);

export default companiesRoute;
