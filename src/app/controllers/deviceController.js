import MQTT from 'async-mqtt';
import * as Yup from 'yup';
import Device from '../models/device';
import mqttConfig from '../../config/mqtt';

class DeviceController {
  async index(req, res) {
    try {
      const devices = await Device.find();
      return res.send({ devices });
    } catch (err) {
      return res.status(400).send({ error: 'Error loading devices' });
    }
  }

  async show(req, res) {
    try {
      const device = await Device.findById(req.params.deviceId);
      if (!device) return res.status(400).send({ error: 'Device not found' });
      return res.send({ device });
    } catch (err) {
      return res.status(400).send({ error: 'Error loading device' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      topicToWrite: Yup.string().required(),
      topicToRead: Yup.string().required(),
      description: Yup.string(),
      status: Yup.string(),
      createdAt: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }
    try {
      const device = await Device.create(req.body);
      return res.send({ device });
    } catch (err) {
      return res.status(400).send({ error: 'Error creating new device' });
    }
  }

  async publish(req, res) {
    let topicPublish;
    let result = 'ok';
    const { value } = req.body;
    try {
      const device = await Device.findById(req.params.deviceId);
      if (!device) return res.status(400).send({ error: 'Device not found' });

      topicPublish = device.topicToWrite;
    } catch (err) {
      return res.status(400).send({ error: 'Error loading device' });
    }

    console.log(
      `Valor ${topicPublish} ${value} ${mqttConfig.mqtt_login} ${mqttConfig.mqtt_password}`
    );
    try {
      const client = MQTT.connect(mqttConfig.mqtt_server, {
        clientId: req.body.user,
        username: mqttConfig.mqtt_login,
        password: mqttConfig.mqtt_password,
      });
      const doStuff = async () => {
        try {
          await client.publish(topicPublish, value);
          await client.end();
        } catch (e) {
          // Do something about it!
          result = 'Error on connecting and publishing';
          console.log(e.stack);
          process.exit();
        }
      };

      client.on('connect', doStuff);
      return res.send({ result });
    } catch (err) {
      return res.status(400).send({ error: 'Error on publishing' });
    }
  }

  async update(req, res) {
    try {
      const { deviceId } = req.params;

      let device = await Device.findById(deviceId);
      if (!device) return res.status(400).send({ error: 'Device not found' });

      // name, description, topicPublish, topicToWrite = req.body;
      device = await Device.findByIdAndUpdate(deviceId, req.body, {
        new: true,
      });
      return res.status(200).json(device);
    } catch (err) {
      return res.status(400).send({ error: 'Error updating device' });
    }
  }

  async delete(req, res) {
    try {
      const device = await Device.findByIdAndRemove(req.params.deviceId);
      if (!device) return res.status(400).send({ error: 'Device not found' });

      return res.status(204).send();
    } catch (err) {
      return res.status(400).send({ error: 'Error deleting device' });
    }
  }
}

export default new DeviceController();
