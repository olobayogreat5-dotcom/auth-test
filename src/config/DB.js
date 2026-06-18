const users = [
    {id: 1, email: 'great@gmail.com', password: 'great123'},
    {id: 2, email: 'grat@gmail.com', password: 'grAt123'},
    {id: 3, email: 'grt@gmail.com', password: 'grt123'}
]

function findUserByEmail(email){
    return users.find((user) => user.email === email);
}

module.exports = { findUserByEmail };