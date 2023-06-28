const { User, Thought } = require('../model');

module.exports = {

    //unless otherwise commented, see userController.js for functionality
    getThoughts(req, res) {
        Thought.find({}, (err, results) => {
            if (results) {
                res.status(200).json(results);
            } else {
                res.status(500).json({ error: 'error' })
            }
        });
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.id })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(400).json({ message: 'no thought found' })
                    : res.json(thought)

            )
            .catch((err) => res.status(500).json(err))
    },

    //create will return the thought if successful, take its id, and use that to update the user array, along with the user id in the request parameters
    //the other way to do this is with callbacks, see deleteThought
    createThought(req, res) {
        Thought.create(req.body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: req.params.id },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then((thought) =>
                !thought
                    ? res.status(400).json({ message: 'no thought found' })
                    : res.json(thought)

            )
            .catch((err) => res.status(500).json(err))
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(400).json({ message: 'no thought found' })
                    : res.json(thought)

            )
            .catch((err) => res.status(500).json(err))
    },

    //async await, promises, .then, etc were created as a solution to cb,
    //cb is not affected by promises, it will always run after the findOneAndDelete method
    //tries to delete something
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id }, (_, thought) => {
            if (!thought) {
                res.status(404).json({ message: 'no thought found' })
            }
            else {
                return User.findOneAndUpdate(
                    { username: thought.username },
                    { $pull: { thoughts: thought._id } },
                    { new: true }
                )
                    .then((user) => res.json(user))
                    .catch((err) => res.status(500).json(err));
            }
        })
    },

    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { reactions: req.body } },
            { new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no thought found' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { reactions: { _id: req.body.rId } } },
            { new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no thought found' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    }

}