import Order from '../models/Order.js';

// Criar um novo pré-pedido
export const createPreOrder = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Authentication error: User not found." });
    }

    try {
        const { client, products, totalAmount, prazo, transportadora, observation } = req.body;
        const createdBy = req.user.id;

        const newOrder = new Order({
            client, // ID do cliente (empresa)
            products,
            totalAmount,
            prazo,
            transportadora,
            observation, // Campo de observação adicionado
            createdBy, // ID do usuário que criou o pedido
        });

        const savedOrder = await newOrder.save();

        // Populate the client and product details before sending the response
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('client', 'name rSocial cnpj phone city')
            .populate({ path: 'products.productId', model: 'Product' });

        res.status(201).json({ success: true, message: "Pré-pedido criado com sucesso!", order: populatedOrder });

    } catch (error) {
        console.error("Error creating pre-order:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor ao criar o pré-pedido." });
    }
};

// Buscar todos os pedidos criados pelo usuário logado
export const getMyOrders = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Authentication error: User not found." });
    }

    try {
        const orders = await Order.find({ createdBy: req.user.id })
            .populate('client', 'name rSocial cnpj phone city')
            .populate({ path: 'products.productId', model: 'Product' })
            .sort({ createdAt: -1 });
        res.json({ success: true, orders: orders });

    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Internal server error while fetching orders." });
    }
};

// Get all orders (for admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('client', 'nFantasia city') // Re-added populate for client with correct fields
            .sort({ createdAt: -1 });
        res.json({ success: true, orders: orders });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ success: false, message: "Internal server error while fetching all orders." });
    }
};

// Get order by ID (for admin)
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('client') // Popula todos os campos do cliente
            .populate({
                path: 'products.productId',
                model: 'Product'
            })
            .populate('createdBy', 'name');
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        res.json({ success: true, order: order });
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        res.status(500).json({ success: false, message: "Internal server error while fetching order by ID." });
    }
};

// Delete order by ID (for admin)
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        res.json({ success: true, message: "Order deleted successfully." });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ success: false, message: "Internal server error while deleting order." });
    }
};