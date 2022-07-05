import mongoose from 'mongoose';
import ContractModel from '../model/contractModel.js';
import contractSchema from '../schema/contractSchema.js';

const createContract = async (req, res) => {
	try {
		const validation = await contractSchema.validateAsync(req.body);

		console.log(validation);
		try {
			const contractExist = await ContractModel.findOne({
				id: validation.id,
			});
			console.log('contractExist', contractExist);
			if (contractExist === null) {
				const newContract = await ContractModel({
					id: validation.id,
					contractName: validation.contractName,
					company: validation.company,
					servicePackage: validation.servicePackage,
					serviceItem: validation.serviceItem,
					assets: validation.assets,
					startDate: validation.startDate,
					endDate: validation.endDate,
					typeOfHours: validation.typeOfHours,
					totalEntitlement: validation.totalEntitlement,
					projectManager: validation.projectManager,
					remarks: validation.remarks,
					ownerId: validation.ownerId,
				});
				console.log(newContract);
				const result = await newContract.save();
				res.status(201).send({ ok: true, message: result });
			} else {
				return res
					.status(400)
					.send({ ok: false, message: 'Contract ID already exist' });
			}
		} catch (error) {
			res.status(402).send(error);
		}
	} catch (error) {
		if (error.isJoi) {
			res.status(401).send({
				ok: false,
				error: error.details[0].message,
			});
		} else {
			res.status(401).send({ ok: false, error: error });
		}
	}
};

const getContract = async (req, res) => {
	const result = await ContractModel.find();
	res.send({ ok: true, contracts: result });
};

export default createContract;
export { getContract };
