import jwt from 'jsonwebtoken';
const signAccessToken = (userId, userEmail) => {
	return new Promise((resolve, reject) => {
		const payload = {
			userID: userId,
			userEmail: userEmail,
		};
		const secrect_key = process.env.SECRECT_KEY_ACCESS;
		const options = {
			expiresIn: '1h',
			issuer: 'iconnect.com',
		};
		jwt.sign(payload, secrect_key, options, (err, token) => {
			if (err) {
				return reject(err);
			} else {
				return resolve(token);
			}
		});
	});
};
export default signAccessToken;
