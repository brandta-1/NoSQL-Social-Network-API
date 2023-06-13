const { User, Thought } = require('../model');

module.exports = {

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

    createThought(req, res) {
        Thought.create(req.body)
            .then(({ _id }) => {
                User.findOneAndUpdate(
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

    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.id })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no thought found' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
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
        console.log(req.body.rId);
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