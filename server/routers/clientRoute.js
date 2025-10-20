import express from 'express';
import { addClient, getAllClients, deleteClient, getClient, updateClient } from '../controllers/clientController.js';


const clientRouter = express.Router();

clientRouter.post('/create', addClient);
clientRouter.get('/getAll', getAllClients);
clientRouter.get('/getClient/:id', getClient);
clientRouter.delete('/deleteClient/:id', deleteClient);
clientRouter.put('/updateClient/:id', updateClient);

export default clientRouter;