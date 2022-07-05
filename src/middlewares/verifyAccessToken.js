import Jwt from 'jsonwebtoken';

const verifyAccessToken = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;

		const access_token_scerect = process.env.SECRECT_KEY_ACCESS;
		Jwt.verify(accessToken, access_token_scerect, function (err, decoded) {
			if (decoded) {
				next();
			} else {
				res.status(403).send({
					ok: false,
					message: 'User Authentication faild',
				});
			}
		});
	} catch (error) {
		res.status(403).send({
			ok: false,
			message: 'Invalid header faild',
		});
	}
};
export default verifyAccessToken;
