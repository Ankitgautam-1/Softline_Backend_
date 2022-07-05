import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	email: {
		required: true,
		type: String,
	},
	password: String,
});

const UserModel = mongoose.model('user', UserSchema);
export default UserModel;
