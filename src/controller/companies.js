import axiosConfig from '../utils/axiosConfig.js';

const getCompanies = async (req, res) => {
	try {
		const companies = await axiosConfig('/api/v2/departments', {
			auth: {
				username: process.env.API_KEY,
			},
		});
		if (companies.status === 200) {
			res.status(200).send({ ok: true, companies: companies.data });
		} else {
			res.status(400).send({ ok: false, error: companies.error });
		}
	} catch (error) {
		res.status(400).send({ ok: false, error: error });
	}
};
const getServicePackage = async (req, res) => {
	try {
		const service = await axiosConfig(
			'/api/v2/service_catalog/categories',
			{
				auth: {
					username: process.env.API_KEY,
				},
			}
		);

		if (service.status === 200) {
			res.status(200).send({ ok: true, servicePackage: service.data });
		} else {
			res.status(400).send({ ok: false, error: service.statusText });
		}
	} catch (error) {
		res.status(400).send({ ok: false, error: error });
	}
};
const getServicItem = async (req, res) => {
	try {
		const serviceItem = await axiosConfig('/api/v2/service_catalog/items', {
			auth: {
				username: process.env.API_KEY,
			},
		});

		if (serviceItem.status === 200) {
			res.status(200).send({
				ok: true,
				servicePackage: serviceItem.data,
			});
		} else {
			res.status(400).send({ ok: false, error: serviceItem.statusText });
		}
	} catch (error) {
		res.status(400).send({ ok: false, error: error });
	}
};
const getAgents = async (req, res) => {
	try {
		const agents = await axiosConfig('/api/v2/agents', {
			auth: {
				username: process.env.API_KEY,
			},
		});

		if (agents.status === 200) {
			res.status(200).send({
				ok: true,
				data: agents.data,
			});
		} else {
			res.status(400).send({ ok: false, error: agents.statusText });
		}
	} catch (error) {
		res.status(400).send({ ok: false, error: error });
	}
};

export default getCompanies;
export { getServicePackage, getServicItem, getAgents };
