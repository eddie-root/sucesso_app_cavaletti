import Client from '../models/Client.js'

// Create Client : /api/client/create

export const addClient = async (req, res) => {
    console.log(req.body)
    try {
        const {
            rSocial,
            nFantasia,
            cnpj,
            inscEstadual,
            suframa,
            dataDeFundaçao,
            address,
            bairro,
            city,
            county,
            cep,
            contact,
            cellPhone,
            phone,
            email,
            emailNfe,
            contactFinan,
            phoneFinan,
            emailFinan
        } = req.body;

        // Validate required fields
        if (!rSocial || !nFantasia || !cnpj || !inscEstadual || !address || !bairro || !city || !county || !cep) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Check if client with same CNPJ already exists
        const existingClient = await Client.findOne({ cnpj });
        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: "Client with this CNPJ already exists"
            });
        }

        const client = await Client.create({
            rSocial,
            nFantasia,
            cnpj,
            inscEstadual,
            suframa,
            dataDeFundaçao,
            address,
            bairro,
            city,
            county,
            cep,
            contact,
            cellPhone,
            phone,
            email,
            emailNfe,
            contactFinan,
            phoneFinan,
            emailFinan
        });

        res.status(201).json({
            success: true,
            message: "Client added successfully",
            client
        });

    } catch (error) {
        console.error("Error adding client:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error adding client"
        });
    }
};

// Get All Clients : /api/client/getAll

export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            clients
        });
    } catch (error) {
        console.error("Error getting clients:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error getting clients"
        });
    }
};

// Get Client by ID : /api/client/getClient/:id
export const getClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }
        res.json({
            success: true,
            client
        });
    } catch (error) {
        console.error("Error getting client:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error getting client"
        });
    }
};


// Delete Client : /api/client/deleteClient/:id

export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }
        res.json({
            success: true,
            message: "Client deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting client:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error deleting client"
        });
    }
};

// Update Client : /api/client/updateClient/:id

export const updateClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }
        res.json({
            success: true,
            message: "Client updated successfully",
            client
        });
    } catch (error) {
        console.error("Error updating client:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Error updating client"
        });
    }
};

