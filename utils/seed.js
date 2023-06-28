const connection = require('../config/connection');
const { User, Thought } = require('../model');

connection.on('error', (err) => err);

const names = [
    'username 0',
    'username 1',
    'username 2',
    'username 3',
    'username 4',
    'username 5',
    'username 6',
    'username 7',
    'username 8',
    'username 9',
]

const emails = [
    'x0@gmail.com',
    'x1@gmail.com',
    'x2@gmail.com',
    'x3@gmail.com',
    'x4@gmail.com',
    'x5@gmail.com',
    'x6@gmail.com',
    'x7@gmail.com',
    'x8@gmail.com',
    'x9@gmail.com',
]


const thoughtTxt = [
    'thought test 0',
    'thought test 1',
    'thought test 2',
    'thought test 3',
    'thought test 4',
    'thought test 5',
    'thought test 6',
    'thought test 7',
    'thought test 8',
    'thought test 9',
]

const reactTxt = [
    'react test 0',
    'react test 1',
    'react test 2',
    'react test 3',
    'react test 4',
    'react test 5',
    'react test 6',
    'react test 7',
    'react test 8',
    'react test 9',
    'react test 10',
    'react test 11',
    'react test 12',
    'react test 13',
    'react test 14',
    'react test 15',
    'react test 16',
    'react test 17',
    'react test 18',
    'react test 19',
]

connection.once('open', async () => {
    console.log('connected');

    await User.deleteMany({});
    await Thought.deleteMany({});

    const theUsers = [];

    for (let i = 0; i < 10; i++) {

        theUsers.push({
            username: names[i],
            email: emails[i],
        });
    }

    let currentUsers = await User.create(theUsers);

    //everyone is friends with everyone else :)

    for (let i = 0; i < 10; i++) {

        let theUser = currentUsers[i]

        let fList = currentUsers.filter((user) => !user._id.equals(theUser._id))
            .map(({ _id }) => _id);

            console.log(fList);
        await User.findOneAndUpdate({ _id: theUser._id }, { friends: fList })
    }

    console.table(theUsers);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});
