import Joi from '@hapi/joi';

const contractSchema = Joi.object({
	id: Joi.string().required(),
	contractName: Joi.string().required(),
	company: Joi.string().required(),
	servicePackage: Joi.string().required(),
	serviceItem: Joi.array().min(1).required(),
	assets: Joi.array().min(1).required(),
	startDate: Joi.date().required(),
	endDate: Joi.date().required(),
	typeOfHours: Joi.string().required(),
	totalEntitlement: Joi.number().required(),
	projectManager: Joi.string().required(),
	remarks: Joi.string().required(),
	ownerId: Joi.string().required(),
});

export default contractSchema;
