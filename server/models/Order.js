import mongoose from 'mongoose';
import Counter from './Counter.js';

const orderSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    orderNumber: {
        type: String,
        unique: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: Array,
        },
        base: {
            type: String,
        },
        new_price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        totalPriceAfterDiscount: {
            type: Number,
            required: true
        },
        discounts: {
            type: Object
        },
        tela: {
            type: String
        },
        revestimento: {
            type: String
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    prazo: {
        type: String,
        required: true
    },
    transportadora: {
        type: String,
        required: true
    },
    observation: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Rascunho', 'Pendente', 'Confirmado', 'Enviado', 'Cancelado'],
        default: 'Rascunho'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});

orderSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                'orderNumber',
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.id = counter.seq.toString();
            this.orderNumber = counter.seq.toString();
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;