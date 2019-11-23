import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user';

import authConfig from '../../config/auth';

class AuthController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).send({ error: 'User not found' });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send({ error: 'Invalid password' });

    user.password = undefined;
    return res.send({
      user,
      token: jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new AuthController();
