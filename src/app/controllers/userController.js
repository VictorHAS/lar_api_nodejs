import jwt from 'jsonwebtoken';
import User from '../models/user';
import authConfig from '../../config/auth';

class UserController {
  async index(req, res) {
    try {
      const users = await User.find();
      return res.send({ users });
    } catch (err) {
      return res.status(400).send({ error: 'Error loading users' });
    }
  }

  async store(req, res) {
    const { email } = req.body;
    try {
      if (await User.findOne({ email })) {
        return res.status(400).send({ error: 'User already exists' });
      }
      const user = await User.create(req.body);
      user.password = undefined;
      return res.send({
        user,
        token: jwt.sign({ id: user.id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: 'Registration Failed' });
    }
  }
}

export default new UserController();
