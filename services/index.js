import express from 'express';

const app = express()
const port = 3000

app.get("/", (req,res)=>{
    res.send("servidor no frontend")
})


app.listen(port, ()=>{
    console.log(`Servidor inicializado na porta ${port}`)
})