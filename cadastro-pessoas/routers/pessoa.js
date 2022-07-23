const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const moment = require('moment')
require('../models/Pessoa')
const Pessoa = mongoose.model('pessoas')

router.get('/registro', (req, res)=> {
    res.render('pessoas/registro')
})

router.post('/registro', (req, res)=> {
    var erros = []
    var cpf = req.body.cpf

    function TestaCPF(strCPF) {
        var Soma;
        var Resto;
        Soma = 0;
      if (strCPF == "00000000000") return erros.push({texto: 'CPF inválido'});
    
      for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;
    
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10)) ) return erros.push({texto: 'CPF inválido'});
    
      Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
    
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11) ) ) return erros.push({texto: 'CPF inválido'});
        return true;
    }

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: 'Nome inválido'})
    }

    if(typeof req.body.nasc == undefined){
        erros.push({texto: 'Data inválida'})
    }

    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erros.push({texto: 'CPF Inválido'})
    }

    TestaCPF(cpf);

    if(erros.length > 0) {
        res.render('pessoas/registro', {erros: erros})
    } else {
        Pessoa.findOne({cpf: req.body.cpf})
            .then((pessoa)=> {
                if(pessoa) {
                    req.flash('error_msg', 'Já existe uma pessoa cadastrada com esse CPF!')
                    res.redirect('/pessoas/registro')
                } else {
                    var data = req.body.nasc
                    console.log(data)
                    var dataFormatada = moment(data).format("DD/MM//YYYY")
                    console.log(dataFormatada)
                    const novaPessoa = new Pessoa({
                        nome: req.body.nome,
                        cpf: req.body.cpf,
                        nasc: dataFormatada,
                    })
                
                    novaPessoa.save()
                        .then(()=> {
                            req.flash('success_msg', 'Pessoa criada com sucesso!')
                            res.redirect('/')
                        })
                        .catch((err)=> {
                            req.flash('error_msg', 'Hou um erro ao criar pessoa!')
                            res.redirect('/pessoas/registro')
                        })
                }
            })
            .catch((err)=> {
                req.flash('error_msg', 'Houve um erro interno')
                res.redirect('/')
            })
    }
})

module.exports = router