const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Pessoa = new Schema({
    nome: {
        type: String,
        require: true
    },
    nasc: {
        type: Date,
        require: true
    },
    cpf: {
        type: String,
        require: true
    }
})

mongoose.model('pessoas', Pessoa)