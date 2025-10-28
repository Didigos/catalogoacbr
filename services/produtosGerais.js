import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const produtosGerais = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuidv4(),
        unique: true
    },
    nome: {
        type: String,
        default: "NA",
        require: true
    },
    preco: {
        type: Number,
        require: true,
        min: 0,
        default: 0
    },
    descricao: {
        type: String,
        default: ''
    },
    imagens: [
        {
            type: String,
            default: 'Sem Imagem'
        }
    ],

})

export default mongoose.model("ProdutosGerais", produtosGerais);

// EXEMPLO COMPLETO
// {
//   "nome": "iPhone 13 Pro Max",
//   "preco": 4599.99,
//   "descricao": "Smartphone Apple iPhone 13 Pro Max 128GB, Tela 6.7, Câmera Tripla 12MP",
//   "imagens": [
//     "https://exemplo.com/iphone13-frente.jpg",
//     "https://exemplo.com/iphone13-traseira.jpg",
//     "https://exemplo.com/iphone13-lateral.jpg"
//   ]
// }

// EXEMPLO SÓ DE CAMPOS OBRIGATÓRIOS
// {
//   "nome": "Samsung Galaxy S23",
//   "preco": 3299.99
// }