const { Schema, model } = require('mongoose');
// thoughts and friends are arrays that contain the object Ids from their respective schema
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
            //email regex
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true
        }
    }
);

//in this scope, "this" keyword refers to the above schema
userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length;
    });

const User = model('User', userSchema);

module.exports = User;