const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');

// // Aggregate function to get the number of students overall
// const headCount = async () =>
//   Student.aggregate()
//     .count('studentCount')
//     .then((numberOfStudents) => numberOfStudents);

// // Aggregate function for getting the overall grade using $avg
// const grade = async (studentId) =>
//   Student.aggregate([
//     // only include the given student by using $match
//     { $match: { _id: ObjectId(studentId) } },
//     {
//       $unwind: '$assignments',
//     },
//     {
//       $group: {
//         _id: ObjectId(studentId),
//         overallGrade: { $avg: '$assignments.score' },
//       },
//     },
//   ]);

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
        //   headCount: await headCount(),
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single student
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
              user,
            //   grade: await grade(req.params.studentId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new student
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a student and remove them from the course
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
    //   .then((user) =>
    //     !user
    //       ? res.status(404).json({ message: 'No such user exists' })
    //       : Course.findOneAndUpdate(
    //           { students: req.params.studentId },
    //           { $pull: { students: req.params.studentId } },
    //           { new: true }
    //         )
    //   )
    //   .then((course) =>
    //     !course
    //       ? res.status(404).json({
    //           message: 'Student deleted, but no courses found',
    //         })
    //       : res.json({ message: 'Student successfully deleted' })
    //   )
        .then(res.json({message:'User deleted'}))
        .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
    
  },

  updateUser(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { username: req.body.username },
        { new: true},
        (err, result) => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(500).json({message: "Username or email is not correct."})
            }
        }
    )
  },

//   app.put('/find-one-update/:genre', (req, res) => {
//     // TODO: Write a route that will find the first instance of a document that contains a name with the value equal to 'Kids'
//     // Update that name with the value given from the URL param
//     // Return the updated document
//     Genre.findOneAndUpdate(
//       { name: "Kids" }, // filters to findOne
//       { name: req.params.genre}, // the key and value to update in the find document
//       { new: true }, // returns the updated document
//       (err, result) => {
//         if (result) {
//           res.status(200).json(result);
//           console.log(`${req.params.genre} has been updated.`);
//         } else {
//           console.log('Uh oh');
//           res.status(500).json({message: "Uhoh"});
//         }
//       }
//     )
//   });

  // Add an assignment to a student
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove assignment from a student
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
