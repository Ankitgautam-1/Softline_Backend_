import mongoose from 'mongoose';
import ContractModel from '../model/contractModel.js';
import contractSchema from '../schema/contractSchema.js';

const createContract = async (req, res) => {
	try {
		console.log('create Contract');
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
					remarks: validation.remarks ?? ' ',
					ownerId: validation.ownerId,
					state: validation.state,
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
		console.log('error', error);
		if (error.isJoi) {
			res.status(400).send({
				ok: false,
				error: error.details[0].message,
			});
		} else {
			res.status(400).send({ ok: false, error: error });
		}
	}
};
const editContract = async (req, res) => {
	try {
		const result = await contractSchema.validateAsync(req.body);
		const contract = await ContractModel.findOne({ id: result.id });
		if (contract) {
			res.status(400).json({ ok: true, message: contract });
		} else {
			res.status(400).json({ ok: false, error: 'Contract not found' });
		}
	} catch (error) {
		if (error.isJoi) {
			res.status(400).send({
				ok: false,
				error: error.details[0].message,
			});
		} else {
			res.status(400).send({ ok: false, error: error });
		}
	}
};
const getContract = async (req, res) => {
	const result = await ContractModel.find();
	res.send({ ok: true, contracts: result });
};

const paginated = async (req, res) => {
	const {
		page = 1,
		limit = 10,
		filterMode = '009',
		filterColumn = '',
	} = req.query;
	const number = '009';
	try {
		console.log('filterMode', typeof filterMode, filterMode);
		// execute query with page and limit values
		if (filterColumn === 'id') {
			console.log('filter for id');

			const contract = await ContractModel.find({
				[filterColumn]: { $gte: filterMode },
			})
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();
			const count = await ContractModel.find({
				[filterColumn]: { $gte: filterMode },
			}).count();

			// return response with posts, total pages, and current page
			res.json({
				ok: true,
				contract: contract,
				totalPages: Math.ceil(count / limit),
				currentPage: page,
				totalRow: count,
			});
		} else if (
			filterColumn === 'contractName' ||
			filterColumn === 'company' ||
			filterColumn === 'servicePackage' ||
			filterColumn === 'typeOfHours' ||
			filterColumn === 'projectManager' ||
			filterColumn === 'remarks'
		) {
			console.log('filter for string');

			const newRegex = new RegExp(`${filterMode}`);
			const contract = await ContractModel.find({
				[filterColumn]: { $regex: newRegex },
			})
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();
			const count = await ContractModel.find({
				[filterColumn]: { $regex: newRegex },
			}).count();

			// return response with posts, total pages, and current page
			res.json({
				ok: true,
				contract: contract,
				totalPages: Math.ceil(count / limit),
				currentPage: page,
				totalRow: count,
			});
		} else if (filterColumn === 'assets') {
			console.log('filterColumn', filterColumn.toLowerCase());
			const arrayofData = filterMode.split(',');
			console.log('arrayofData', arrayofData);

			const contract = await ContractModel.find({
				[filterColumn.toLowerCase()]: { $in: arrayofData },
			})
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();
			const count = await ContractModel.find({
				[filterColumn]: { $in: arrayofData },
			}).count();

			// return response with posts, total pages, and current page
			res.json({
				ok: true,
				contract: contract,
				totalPages: Math.ceil(count / limit),
				currentPage: page,
				totalRow: count,
			});
		} else {
			console.log('All data');
			const contract = await ContractModel.find({})
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.exec();
			console.log('contract', contract);
			const count = await ContractModel.countDocuments();

			res.json({
				ok: true,
				contract: contract,
				totalPages: Math.ceil(count / limit),
				currentPage: page,
				totalRow: count,
			});
		}

		// get total documents in the Posts collection
	} catch (err) {
		console.log('Error', err);
		res.status(400).send({ ok: false, error: err });
	}
};
export default createContract;
export { getContract, editContract, paginated };
