import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    rSocial: {type: String, required: true},
    nFantasia: {type: String, required: true},
    cnpj: {type: String, required: true, unique: true},
    inscEstadual: {type: String, required: true},
    suframa: {type: String, default: ''},
    dataDeFundaçao: {type: String, default: ''},
    address: {type: String, required: true},
    bairro: {type: String, required: true},
    city: {type: String, required: true},
    county: {type: String, required: true},
    cep: {type: String, required: true},
    contact: {type: String, default: ''},
    cellPhone: {type: String, default: ''},
    phone: {type: String, default: ''},
    email: {type: String, default: ''},
    emailNfe: {type: String, default: ''},
    contactFinan: {type: String, default: ''},
    phoneFinan: {type: String, default: ''},
    emailFinan: {type: String, default: ''}
}, {timestamps: true});

const Client = mongoose.model('Client', clientSchema);

export default Client;