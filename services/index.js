import express from 'express';
import mongoose from 'mongoose'
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
const app = express()
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(cors());

//conexão com o banco de dados
const MONGO_URI = "mongodb+srv://didigos:KZDOugsZHoDWk4Fy@development.hinzp0h.mongodb.net/acbrcatalogo?retryWrites=true&w=majority&appName=Development"
mongoose.connect(MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((error) => console.error("Erro ao conectar ao MongoDB:", error));

//schemas 
const ProdutoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  marca: {
    type: String,
    required: true,
    trim: true,
  },
  precobase: {
    type: Number,
    min: 0,
  },
  precopix: {
    type: Number,
    min: 0,
  },
  pagamento: {
    avista: {
      type: Boolean,
      default: false,
    },
    credito: {
      type: Boolean,
      default: false,
    },
    debito: {
      type: Boolean,
      default: false,
    },
  },
  detalhes: {
    processador: { type: String, default: 'N/A' },
    camera: { type: String, default: 'N/A' },
    bateria: { type: String, default: 'N/A' },
    armazenamento: { type: String, default: 'N/A' },
    memoria: { type: String, default: 'N/A' },
  },
  imagens: [
    {
      type: String, // normalmente URL da imagem
      required: true,
    },
  ],
}, { timestamps: true });
const Produto = mongoose.model('Produto', ProdutoSchema);

const AdminSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // cria automaticamente createdAt e updatedAt
  }
);
const Users = mongoose.model('User', AdminSchema);


const TaxaSchema = new mongoose.Schema(
  {
    avista: {
      type: Number, // Exemplo: 2.5 (%)
      required: true,
      default: 0,
    },
    debito: {
      type: Number, // Exemplo: 1.8 (%)
      required: true,
      default: 0,
    },
    credito: {
      // objeto com taxas de 1x a 12x
      "1x": { type: Number, default: 0 },
      "2x": { type: Number, default: 0 },
      "3x": { type: Number, default: 0 },
      "4x": { type: Number, default: 0 },
      "5x": { type: Number, default: 0 },
      "6x": { type: Number, default: 0 },
      "7x": { type: Number, default: 0 },
      "8x": { type: Number, default: 0 },
      "9x": { type: Number, default: 0 },
      "10x": { type: Number, default: 0 },
      "11x": { type: Number, default: 0 },
      "12x": { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // createdAt e updatedAt automáticos
  }
);

const Taxa = mongoose.model("Taxa", TaxaSchema);

// ROTAS PARA USERS

app.get("/users", (req, res) => {
  Users.find()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(500).send("Erro ao buscar usuários: " + error.message))
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Users.findOne({ email });

  if (!usuario) {
    return res.status(401).json({ erro: 'Usuário não encontrado' });
  }

  // Se usar bcrypt:
  // const senhaValida = await bcrypt.compare(senha, usuario.senha);
  // if (!senhaValida) { ... }

  // Se for senha em texto (não recomendado):
  if (usuario.password !== password) {
    return res.status(401).json({ erro: 'Senha incorreta' });
  }

  res.json({
    mensagem: 'Login realizado com sucesso',
    dados: { id: usuario.id, nome: usuario.nome, email: usuario.email }
  });
});

app.post("/users", (req, res) => {
  const novoUser = new Users({
    ...req.body,
    id: uuidv4()
  })
  novoUser.save()
    .then(() => res.status(201).send("Usuário registrado com sucesso"))
    .catch((error) => res.status(400).send("Erro ao registrar usuário: " + error.message))
})

app.get('/usuario/:id', async (req, res) => {
  const usuario = await Users.findById(req.params.id);
  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }
  res.json({ email: usuario.email, nome: usuario.nome });
});

// registrar novo produto
app.post("/smartphones", (req, res) => {
  const novoProduto = new Produto({
    ...req.body,
    id: uuidv4()
  })
  novoProduto.save()
    .then(() => res.status(201).send("Produto registrado com sucesso"))
    .catch((error) => res.status(400).send("Erro ao registrar produto: " + error.message))
})

// listar produtos
app.get("/smartphones", (req, res) => {
  Produto.find()
    .then((produtos) => res.status(200).json(produtos))
    .catch((error) => res.status(500).send("Erro ao buscar produtos: " + error.message))
})

// buscar produto por id
app.get("/smartphones/:id", (req, res) => {
  const produtoId = req.params.id
  Produto.findOne({ id: produtoId })
    .then((produto) => {
      if (!produto) {
        return res.status(404).send("Produto não encontrado")
      }
      res.status(200).json(produto)
    })
    .catch((error) => res.status(500).send("Erro ao buscar produto: " + error.message))
})

// atualizar produto por id
app.put("/smartphones/:id", (req, res) => {
  const produtoId = req.params.id
  Produto.findOneAndUpdate(
    { id: produtoId }, // busca pelo id do uuid
    req.body,
    { new: true, runValidators: true }
  )
    .then((produtoAtualizado) => {
      if (!produtoAtualizado) {
        return res.status(404).send("Produto não encontrado")
      }
      res.status(200).json(produtoAtualizado)
    })
    .catch((error) => res.status(500).send("Erro ao atualizar produto: " + error.message))
})
//deletar produto por id
app.delete("/smartphones/:id", (req, res) => {
  const produtoId = req.params.id
  Produto.findByIdAndDelete(produtoId)
    .then((produtoDeletado) => {
      if (!produtoDeletado) {
        return res.status(404).send("Produto não encontrado")
      }
      res.status(200).send("Produto deletado com sucesso")
    })
    .catch((error) => res.status(500).send("Erro ao deletar produto: " + error.message))
})

//ROTAS PARA FORMAS DE PAGAMENTO

app.post("/taxas", (req, res) => {
  const novaTaxa = new Taxa(req.body)
  novaTaxa.save()
    .then(() => res.status(201).send("Taxas registradas com sucesso"))
    .catch((error) => res.status(400).send("Erro ao registrar taxas: " + error.message))
})

app.get("/taxas", (req, res) => {
  Taxa.find()
    .then((taxas) => res.status(200).json(taxas))
    .catch((error) => res.status(500).send("Erro ao buscar taxas: " + error.message))
})

app.put("/taxas/:id", (req, res) => {
  const taxaId = req.params.id
  Taxa.findByIdAndUpdate(taxaId, req.body, { new: true, runValidators: true })
    .then((taxaAtualizada) => {
      if (!taxaAtualizada) {
        return res.status(404).send("Taxa não encontrada")
      }
      res.status(200).json(taxaAtualizada)
    })
    .catch((error) => res.status(500).send("Erro ao atualizar taxa: " + error.message))
})

// rota raiz
app.get("/", (req, res) => {
  res.send("servidor no frontend")
})


app.listen(port, () => {
  console.log(`Servidor inicializado na porta ${port}`)
})