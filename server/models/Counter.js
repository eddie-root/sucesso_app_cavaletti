import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Initialize the counter if it doesn't exist.
Counter.findById('orderNumber').then(counter => {
    if (!counter) {
        new Counter({ _id: 'orderNumber', seq: 813 }).save();
    }
}).catch(err => {
    console.error("Failed to initialize order number counter:", err);
});

export default Counter;
