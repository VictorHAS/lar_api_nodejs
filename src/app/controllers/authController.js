import * as Yup from 'yup';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

import authConfig from '../../config/auth';

class AuthController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

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
