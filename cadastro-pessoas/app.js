const express = require('express')
const app = express()
const port = 8085
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const pessoas = require('./routers/pessoa')
require('./models/Pessoa')
const Pessoa = mongoose.model('pessoas')

//Configurações
        //Sessão
        app.use(session({
            secret: 'cadastro-pessoas',
            resave: true,
            saveUninitialized: true
        }))
        
        app.use(flash())

    //Mongoose
        mongoose.connect('mongodb://localhost/cadastro-pessoas')
            .then(()=> {
                console.log('Concetado ao Mongo')
            })
            .catch((err)=> {
                console.log('Erro ao conectar ao Mongo ' + err)
            })
    
    //Middleware
        app.use((req, res, next)=> {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            next()
        })

    //Body Parser
            app.use(bodyParser.urlencoded({extended: true}))
            app.use(bodyParser.json())

    //HandleBars
            app.engine('handlebars', handlebars.engine({
                defaultLayout: 'main',
                runtimeOptions: {
                    allowProtoPropertiesByDefault: true,
                    allowProtoMethodsByDefault: true,
                },
            }))

            app.set('view engine', 'handlebars')
    //Public
            app.use(express.static(path.join(__dirname, 'public')))

//Rotas
    app.get('/', (req, res)=> {
        Pessoa.find()
        .then((pessoas)=> {
            res.render('index', {pessoas: pessoas})
        })
        .catch((err)=> {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    })

    app.use('/pessoas', pessoas)

//Outros
app.listen(port, ()=> {
    console.log('Servidor rodando na porta '+ port)
})