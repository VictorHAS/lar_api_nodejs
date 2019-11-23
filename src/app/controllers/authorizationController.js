import * as Yup from 'yup';
import Authorization from '../models/authorization';

class AuthorizationController {
  async index(req, res) {
    try {
      const authorizations = await Authorization.find();
      return res.send({ authorizations });
    } catch (err) {
      return res.status(400).send({ error: 'Error loading authorizations' });
    }
  }

  async show(req, res) {
    try {
      const results = await Authorization.find({ user: req.userId }).populate(
        'device'
      );
      const authorizations = [];
      // selecionado os atributos da resposta
      for (let i = 0; i < results.length; i++) {
        authorizations[i] = {
          device_id: results[i].device._id,
          name: results[i].device.name,
        };
      }
      console.log(authorizations);
      return res.send({ results });
    } catch (err) {
      return res.status(400).send({ error: 'Error loading authorizations' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      device: Yup.string().required(),
      user: Yup.string().required(),
      enabled: Yup.boolean().required(),
      startDate: Yup.date(),
      endDate: Yup.date(),
      createdAt: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }
    try {
      const authorization = await Authorization.create(req.body);
      return res.send({ authorization });
    } catch (err) {
      return res
        .status(400)
        .send({ error: 'Error creating new authorization' });
    }
  }

  async delete(req, res) {
    try {
      await Authorization.findByIdAndRemove(req.params.authorizationId);
      return res.status(204).send();
    } catch (err) {
      return res.status(400).send({ error: 'Error deleting device' });
    }
  }
}

export default new AuthorizationController();

// router.get('/full', async (req, res) => {
//   try {
//     const results = await Authorization.find()
//       .populate('device')
//       .populate('user');

//     const authorizations = [];
//     // selecionado os atributos da resposta
//     for (let i = 0; i < results.length; i++) {
//       authorizations[i] = {
//         id: results[i]._id,
//         enabled: results[i].enabled,
//         device_id: results[i].device._id,
//         device_name: results[i].device.name,
//         user_id: results[i].user._id,
//         user_name: results[i].user.userName,
//       };
//     }

//     return res.send({ authorizations });
//   } catch (err) {
//     return res.status(400).send({ error: 'Error loading authorizations' });
//   }
// });
