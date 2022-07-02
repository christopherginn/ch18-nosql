const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
      username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
      },
      thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'thought',
        }
      ],
      friends: [
        {
            type: Schema.Types.ObjectId,
            ref:'user',
        }
      ]
    },
    {
      toJSON: {
        getters: true,
      },
    }
  );
  
  const User = model('friend', userSchema);
  
  module.exports = User;