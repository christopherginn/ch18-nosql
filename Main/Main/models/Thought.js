const { Schema, model, trusted } = require('mongoose');
const reactionSchema = require('./Reaction');
const { format_date } = require('../utils/helpers');

const thoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: true,
        maxLength: 280,
        minLength: 1,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (x) => format_date(x),
      },
      username: {
        type: String,
        required: true,
      },
      reactions: [reactionSchema],
    },
    {
    timestamps: true,
      toJSON: {
        getters: true,
        virtuals: true,
      },
    }
  );
  thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
  });
  
  const Thought = model('thought', thoughtSchema);
  
  module.exports = Thought;