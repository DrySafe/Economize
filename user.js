const mongoose = require('mongoose');

// Definir o esquema do usuário
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Criar um modelo para o usuário
const User = mongoose.model('User', userSchema);

async function addUser(username, password) {
    // Cria um novo usuário
    const user = new User({ username, password });
    // Salva o usuário no banco de dados
    await user.save();
    return user;
}

async function getUser(username) {
    // Procura o usuário pelo nome de usuário
    return await User.findOne({ username });
}

async function addPermanentUser(username, password) {
    // Verifica se o usuário já existe
    const existingUser = await getUser(username);
    if (existingUser) {
        throw new Error('Usuário já existe');
    }

    // Adiciona o usuário permanentemente
    const newUser = await addUser(username, password);
    return newUser;
}

module.exports = { addUser, getUser, addPermanentUser };
