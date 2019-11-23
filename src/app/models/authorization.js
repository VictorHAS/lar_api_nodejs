import mongoose from 'mongoose';

const AuthorizationSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  enabled: {
    type: Boolean,
    require: true,
    default: false,
  },
  startDate: {
    type: Date,
    require: false,
  },
  endDate: {
    type: Date,
    require: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Authorization = mongoose.model('Authorization', AuthorizationSchema);

export default Authorization;
