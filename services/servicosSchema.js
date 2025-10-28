import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";


const garantiaSchema = new mongoose.Schema({
    dataInicio: {
        type: Date,
        default: Date.now, // data atual automaticamente
        required: true
    },
    tempoMeses: {
        type: Number,
        required: true,
        min: 1, // mínimo 1 mês
        max: 120 // máximo 10 anos
    },
    dataFim: {
        type: Date,
        // será calculada automaticamente antes de salvar
    },
    ativa: {
        type: Boolean,
        default: true
    },
    textoGarantia: {
        type:String,
        required: true
    }

});

garantiaSchema.pre('save', function (next) {
    if (this.dataInicio && this.tempoMeses) {
        const dataFim = new Date(this.dataInicio);
        dataFim.setMonth(dataFim.getMonth() + this.tempoMeses);
        this.dataFim = dataFim;
    }
    next();
});

const textoDeGarantia = new mongoose.Schema({
    id: {
        type: String,
        require: true,
        default: () => uuidv4()
    },
    titulo:{
        type: String,
        default: "Garantia do Serviço"
    },
    descricao: {
        type: String,
        default: ""
    }
})

const cadastroDeServicos = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        default: () => uuidv4()
    },
    nome: {
        type: String,
        required: true,
    },
    preco: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    descricao: {
        type: String,
        default: "Sem Descrição"
    },
    garantia: garantiaSchema
}, { timestamps: true })


export const TextoGarantia = mongoose.model('TextoGarantia', textoDeGarantia);
export const CadastroDeServico = mongoose.model('CadastroDeServico', cadastroDeServicos);

//MODELO PARA POST
// {
//   "nome": "Troca de Tela",
//   "preco": 150.00,
//   "descricao": "Troca de tela para smartphone",
//   "garantia": {
//     "tempoMeses": 6,
//     "textoGarantia": "uuid-do-texto-garantia"
//   }
// }