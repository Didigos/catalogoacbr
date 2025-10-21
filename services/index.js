import express from 'express';
import mongoose from 'mongoose'
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
const app = express()
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

//conexão com o banco de dados
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://didigos:KZDOugsZHoDWk4Fy@development.hinzp0h.mongodb.net/acbrcatalogo?retryWrites=true&w=majority&appName=Development"
mongoose.connect(MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((error) => console.error("Erro ao conectar ao MongoDB:", error));

//schemas 

const clientes = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  nome: {
    type: String,
    required: true,
  },
  celular: {
    type: String,
    required: true,
  },
  orders: { // numero de identificação das ordens feitas, ex: [123, 456, 789]
    type: Array,
    default: [],
  }
});
const Clientes = mongoose.model('Clientes', clientes);

// const ordensDeServico = new mongoose.Schema({
//   id: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   clienteId: {
//     type: String,
//     required: true,
//   },
//   funcionario: {,
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['aberto', 'em andamento', 'concluído', 'entregue'],
//   },
//   loja: {
//     type: String,
//     enum: ['Amanda', 'Rodrigo', 'Carmem', 'Esrom', 'Bradesco'], // exemplo de lojas
//     required: true, 
//   },
//   dataEntrada: {
//     type: Date,
//     default: Date.now,
//   },
//   dataSaida: {
//     type: Date,
//   },
//   equipamento: [
//     informacoes = [{
//       marca: { type: String, required: true },
//       modelo: { type: String, required: true },
//       imei: { type: String, default: 'N/A' },
//     }],
//     checklistSaida = [
//       {
//         telaDisplay: { type: Boolean, default: false },
//         touch: { type: Boolean, default: false },
//         bateria: { type: Boolean, default: false },
//         cameraTraseira: { type: Boolean, default: false },
//         cameraFrontal: { type: Boolean, default: false },
//         conectorCarga: { type: Boolean, default: false },
//         altoFalante: { type: Boolean, default: false },
//         microfone: { type: Boolean, default: false },
//         botoesVolume: { type: Boolean, default: false },
//         botaoPower: { type: Boolean, default: false },
//         leitorDigital: { type: Boolean, default: false },
//         faceId: { type: Boolean, default: false },
//         wifi: { type: Boolean, default: false },
//         bluetooth: { type: Boolean, default: false },
//         conectorFone: { type: Boolean, default: false },
//       }
//     ],
//     checklistEntrada = [{
//       ligaNaoLiga: { type: Boolean, default: false },
//       telaDisplay: { type: Boolean, default: false },
//       touch: { type: Boolean, default: false },
//       bateria: { type: Boolean, default: false },
//       conectorCarga: { type: Boolean, default: false },
//     }]
//   ]
// }, { timestamps: true });

const adaptacaoItemSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => uuidv4() }, // UUID único por item
    nome: { type: String, required: true, trim: true }, // ajuste o nome do campo conforme sua necessidade
  },
  { _id: false } // evita criar um _id ObjectId automático para cada item
);

const adaptacaoPeliculasSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(), // gerar a cada documento
    unique: true,
  },
  modelo: {
    type: String,
    required: true,
    trim: true,
  },
  adaptacoes: {
    type: [adaptacaoItemSchema],
    default: [],
  },
});

const AdaptacaoPeliculas = mongoose.model('AdaptacaoPeliculas', adaptacaoPeliculasSchema);

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
  preco: {
    avista: { type: Number, required: true, default: 0 },
    debito: { type: Number, required: true, default: 0 },
    credito: {
      "parcela1": { type: Number, default: 0 },
      "parcela2": { type: Number, default: 0 },
      "parcela3": { type: Number, default: 0 },
      "parcela4": { type: Number, default: 0 },
      "parcela5": { type: Number, default: 0 },
      "parcela6": { type: Number, default: 0 },
      "parcela7": { type: Number, default: 0 },
      "parcela8": { type: Number, default: 0 },
      "parcela9": { type: Number, default: 0 },
      "parcela10": { type: Number, default: 0 },
      "parcela11": { type: Number, default: 0 },
      "parcela12": { type: Number, default: 0 },
    }
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
    debito: {
      type: Number, // Exemplo: 2.5 (%)
      required: true,
      default: 0,
    },
    pix: {
      type: Number, // Exemplo: 1.8 (%)
      required: true,
      default: 0,
    },
    credito: {
      // objeto com taxas de 1x a 12x
      "parcela1": { type: Number, default: 0 },
      "parcela2": { type: Number, default: 0 },
      "parcela3": { type: Number, default: 0 },
      "parcela4": { type: Number, default: 0 },
      "parcela5": { type: Number, default: 0 },
      "parcela6": { type: Number, default: 0 },
      "parcela7": { type: Number, default: 0 },
      "parcela8": { type: Number, default: 0 },
      "parcela9": { type: Number, default: 0 },
      "parcela10": { type: Number, default: 0 },
      "parcela11": { type: Number, default: 0 },
      "parcela12": { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // createdAt e updatedAt automáticos
  }
);

const Taxa = mongoose.model("Taxa", TaxaSchema);

// ROTAS PARA USERS

// modulo de peliculas

app.post("/adaptacoes", async (req, res) => {
  try {
    // aceita tanto "nome" quanto "modelo" do frontend
    const modelo = (req.body?.modelo ?? req.body?.nome ?? "").trim();
    if (!modelo) {
      return res.status(400).json({ erro: "Campo 'nome' é obrigatório." });
    }

    // opcional: evitar modelos duplicados
    const jaExiste = await AdaptacaoPeliculas.findOne({ modelo });
    if (jaExiste) {
      return res.status(409).json({ erro: "Modelo já existe" });
    }

    // id e adaptacoes são definidos pelo schema (default uuid e [])
    const novoModelo = await AdaptacaoPeliculas.create({ modelo });

    return res.status(201).json(novoModelo);
  } catch (error) {
    return res.status(500).send("Erro ao criar modelo de película: " + error.message);
  }
});

app.get("/adaptacoes", (req, res) => {
  AdaptacaoPeliculas.find()
    .then((adaptacoes) => res.status(200).json(adaptacoes))
    .catch((error) => res.status(500).send("Erro ao buscar adaptações: " + error.message))
})

app.get("/adaptacoes/:modelo", (req, res) => {
  const modelo = req.params.modelo;

  AdaptacaoPeliculas.find({ modelo })
    .then((adaptacoes) => res.status(200).json(adaptacoes))
    .catch((error) => res.status(500).send("Erro ao buscar adaptações: " + error.message))
});

app.delete("/adaptacoes/:id", async (req, res) => {
  try {
    const { id } = req.params; // UUID do documento (campo 'id')
    const apagado = await AdaptacaoPeliculas.findOneAndDelete({ id });
    if (!apagado) {
      return res.status(404).send("Modelo não encontrado");
    }
    return res.status(204).send(); // sem conteúdo
  } catch (error) {
    return res.status(500).send("Erro ao deletar adaptação: " + error.message);
  }
});

// CRUD PARA AS ADAPTAÇÕES DE PELICULAS
 
app.delete("/adaptacoes/:ModeloMae/itens/:itemId", async (req, res) => {
    
  try {
    const { ModeloMae, itemId } = req.params;
    console.log('1: ', ModeloMae);
    console.log('2: ', itemId);
    const result = await AdaptacaoPeliculas.updateOne(
      { id: ModeloMae },
      { $pull: { adaptacoes: { id: itemId } } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send("Item não encontrado");
    }
    return res.status(204).send();
  } catch (error) {
    res.status(500).send("Erro ao deletar item: " + error.message);
  }
});

app.post("/adaptacoes/:ModeloMae", async (req, res) => {
  try {
    const { ModeloMae } = req.params; // id (UUID) do documento pai
    const { nome } = req.body;

    if (typeof nome !== "string" || !nome.trim()) {
      return res.status(400).json({ erro: "Campo 'nome' é obrigatório." });
    }

    const novoItem = { id: uuidv4(), nome: nome.trim() };

    const doc = await AdaptacaoPeliculas.findOneAndUpdate(
      { id: ModeloMae },
      { $push: { adaptacoes: novoItem } },
      { new: true, runValidators: true }
    );

    if (!doc) {
      return res.status(404).json({ erro: "Modelo não encontrado" });
    }

    // retorna somente o item, para bater com seu frontend (adaptacaoCriada)
    return res.status(201).json(novoItem);
  } catch (error) {
    return res.status(500).send("Erro ao adicionar adaptação: " + error.message);
  }
});


// FIM DO CRUD DAS ADAPTAÇÕES DE PELICULAS

// listar usuarios

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
  Produto.findOneAndDelete({ id: produtoId })
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