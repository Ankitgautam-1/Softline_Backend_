import crypto from 'crypto';

const secrect_key = crypto.randomBytes(32).toString('hex');
console.log(secrect_key);
