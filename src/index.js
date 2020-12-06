const { response } = require('express')
const express = require('express')

const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port, () => {
    console.log('Server is up on porrt ' + port)
})

const bcrypt = require('bcryptjs')


const myFunction = async () => {
    const password = 'Red12345'
    const hashedPassword = await bcrypt.hash(password, 8)

    console.log(password, hashedPassword)
}

myFunction()