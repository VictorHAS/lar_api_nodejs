import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  username: {
    type: String,
    unique: true,
    required: false,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    default: 'DEFAULT',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function updatePassword(next) {
  if (!this.isModified('password')) return next();
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  return next();
});

const User = mongoose.model('User', UserSchema);

export default User;
