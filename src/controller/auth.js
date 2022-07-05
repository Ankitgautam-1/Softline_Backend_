import UserModel from '../model/userModel.js';
import bcrypt from 'bcrypt';
import signAccessToken from '../helpers/jwtHelpers.js';
import authSchema from '../schema/authSchema.js';
const loginUser = async (req, res) => {
	const { email, password } = req.body;
	let msg;
	try {
		const result = await authSchema.validateAsync(req.body);
		const user = await UserModel.findOne({
			email: result.email,
		});
		if (!user) {
			res.status(400).send({ ok: false, mesage: 'No user is found' });
		} else {
			const deCrpytPassword = await bcrypt.compare(
				password.toString(),
				user.password.toString()
			);

			if (deCrpytPassword) {
				const accessToken = await signAccessToken(user.id, user.email);
				res.cookie('accessToken', accessToken, {
					maxAge: 3600000,
					httpOnly: true,
				});
				res.status(201).send({
					ok: true,
					userID: user.id,
					accessToken: `Bearer ${accessToken}`,
					userEmail: user.email,
				});
			} else {
				res.status(400).send({
					ok: false,
					mesage: 'password is incorrect',
				});
			}
		}
	} catch (error) {
		if (error.isJoi === true) {
			res.status(400).send({
				ok: false,
				error: error.details[0].message,
			});
		} else {
			res.status(400).send({ ok: false, error: error });
		}
	}
};
const registerUser = async (req, res) => {
	const { email, password } = req.body;
	const userExist = await UserModel.findOne({
		email: email,
	});
	if (userExist) {
		res.status(403).send({ ok: false, message: 'User already exit' });
	} else {
		const passwordCrpyt = await bcrypt.hash(password, 10);
		const newUser = await UserModel({
			email: email,
			password: passwordCrpyt,
		});
		newUser.save();
		res.status(200).send({ ok: true, message: newUser });
	}
};

export default loginUser;

export { registerUser };
