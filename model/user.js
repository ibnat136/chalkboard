const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chalkSchema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // usertype: {
    //     type: String,
    //     required: true,
    // }
},
    { collection: 'users' },
    {timestamps: true}
)

const User = mongoose.model('User', chalkSchema);

module.exports = User;