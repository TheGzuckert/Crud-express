const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/dbconfig')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.render('home')
})

app.post('/eschool/student', function (req, res) {
    const nome = req.body.nome
    const cpf = req.body.cpf
    const rg = req.body.rg
    const num1 = parseInt(req.body.num1)
    const num2 = parseInt(req.body.num2)
    const num3 = parseInt(req.body.num3)

    var media = (num1 + num2 + num3) / 3
    media = media.toFixed(3)

    const sql = `INSERT INTO english (nome,cpf,rg,num1,num2,num3,media) VALUES ('${nome}','${cpf}','${rg}',${num1},${num2},${num3},${media});`

    pool.query(sql, function (err) {
        if (err) {
            console.log(err)
        }
        res.redirect('/')
    })
})

app.get('/students', function(req, res){
    const sql = "SELECT * FROM english;"
    pool.query(sql, function(err, data){
        if(err){
            console.log(err)
        }
        res.render('students', {english:data})
    })
})

//Rota pra listar todos os alunos
app.get('/students', function(req,res){
    const sql = "SELECT * FROM english;"
    pool.query(sql, function(err,data){
        if (err){
            console.log(err)
        }

        res.render('students', {english:data})
    })
})

//Para mostrar especifico
app.get('/students/:id',function(req,res){
    const id = req.params.id
    const sql = `SELECT * FROM english WHERE id = ${id}`
    pool.query(sql, function (err,data){
        if (err){
            console.log(err)
        }
        const english = data[0]
        res.render('student', {english: english})
    })
})

//Editar nota
app.get('/students/edit/:id',function(req,res){
    const id = req.params.id
    const sql = `SELECT * FROM english WHERE id = ${id}`
        pool.query(sql,function(err,data){
            if (err){
                console.log(err)
            }
            const english = data[0]
            res.render('edit', {english: english})
        })
    })

//Receber e atualizar nota
app.post('/students/updatestudent', function(req,res){
    const id = req.body.id
    const num1 = parseInt(req.body.num1)
    const num2 = parseInt(req.body.num2)
    const num3 = parseInt(req.body.num3)

    var media = (num1 + num2 + num3) / 3
    media = media.toFixed(3)

    const sql = `UPDATE english SET num1=${num1}, num2=${num2}, num3=${num3}, media=${media} WHERE id = ${id}`
    pool.query(sql,function(err){
        if (err){
            console.log(err)
        }
        res.redirect(`/students/${id}`)
    })
})

//Para excluir
app.post('/students/remove/:id', function(req,res){
    const id = req.params.id
    const sql = `DELETE FROM english WHERE id = ${id}`
    pool.query(sql,function(err){
        if (err){
            console.log(err)
        }
        res.redirect(`/students`)
    })
})
app.listen(3000)