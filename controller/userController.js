const { User, Thought } = require('../model');

module.exports = {
    //simply return all users
    getUsers(req, res) {
        User.find({}, (err, results) => {
            if (results) {
                res.status(200).json(results);
            } else {
                res.status(500).json({ error: 'error' })
            }
        });
    },

    //find a single user by the id in the request parameters
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

    //create a user from the data in the request body
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    
    //find a user, then delete them
    //that operation returns the user, use that to delete all of the thoughts whose id's were in that user's array of thoughts
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'no user found' })
                    : Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then(() => res.json({ message: 'user and thoughts deleted' }))
            .catch((err) => res.status(500).json(err));
    },

    //find the user, and set their properties to whatever is in the request body
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

    //similar structure to update user, we are just updating their friends array
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

    //similar to the above query, just remove the friend given their id
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



