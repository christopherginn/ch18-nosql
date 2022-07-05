const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {
        const thoughtObj = {
          thoughts,
        };
        return res.json(thoughtObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json({thought})
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new thought
  createThought(req, res) {
    Thought.create({thoughtText: req.body.thoughtText, username: req.body.username})
        // connects the new thought to a user
        .then((thought) => User.findOneAndUpdate(
            { _id: req.body.userId},
            { $addToSet: { thoughts: thought._id } },
            { new: true }))
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).send(err));   
  },

  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) => User.findOneAndUpdate(
            { username: thought.username }, 
            { $pull: { thoughts: req.params.thoughtId }},
            { new: true }))
        .then(res.json({message:'Thought deleted'}))
        .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
      
  },

  // update thoughtText of a thought by id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { thoughtText: req.body.thoughtText },
        { new: true},
        (err, result) => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(500).json({message: "..."})
            }
        }
    )
   
  },

  // Add a reaction to specific thought's reaction array
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: {reactionBody: req.body.reactionBody, username: req.body.username } } },
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(reaction)
      )
      .catch((err) => res.status(500).json(err));
  },

  // remove a reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.body.reactionId }} },
      { new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};