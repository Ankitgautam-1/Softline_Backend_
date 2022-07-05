import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema({
	id: {
		required: true,
		type: String,
	},
	contractName: {
		required: true,
		type: String,
	},
	company: {
		required: true,
		type: String,
	},
	servicePackage: {
		required: true,
		type: String,
	},
	serviceItem: {
		required: true,
		type: Array,
	},
	assets: {
		required: true,
		type: Array,
	},
	startDate: {
		required: true,
		type: Date,
	},
	endDate: {
		required: true,
		type: Date,
	},
	typeOfHours: {
		required: true,
		type: String,
	},
	totalEntitlement: {
		required: true,
		type: Number,
	},
	projectManager: {
		required: true,
		type: String,
	},
	remarks: {
		required: false,
		type: String,
	},
	ownerId: {
		required: true,
		type: String,
	},
});

const ContractModel = mongoose.model('contracts', ContractSchema);
export default ContractModel;
