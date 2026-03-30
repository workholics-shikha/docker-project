const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('category', categorySchema);
