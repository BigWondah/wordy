const bcrypt = require('bcrypt');

const generatePasswordHash = (password) => {
    return bcrypt.hashSync(password, 12);
}

const authenticate = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

module.exports = {
    generatePasswordHash,
    authenticate
}