const { User } = require('../model');

module.exports = {

    getUsers(req, res) {
        User.find({}, (err, results) => {
            if (results) {
                res.status(200).json(results);
            } else {
                res.status(500).json({ error: 'error' })
            }
        });
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.id })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'no user found' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'no user found' })
                    : User.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then(() => res.json({ message: 'user and thoughts deleted' }))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'no user found' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $addToSet: { friends: req.params.fId } },
            { new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'no user found' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },

    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { friends: req.params.fId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'no user found' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    }
};



