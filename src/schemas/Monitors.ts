import * as mongoose from 'mongoose';

export const MonitorSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  name: String,
  is_public: Boolean,
  address: String,
  frequency: Number,
  feedbacks: [{
    date: Date,
    is_up: Boolean,
    agent_id: mongoose.Schema.Types.ObjectId,
  }],
});
