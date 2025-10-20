import React, { useContext, useState } from 'react';
import formatCurrency from '../utils/money';
import OrderContext from '../context/OrderContext';
import GlobalContext from '../context/GlobalContext';

const MyOrders = () => {
    const { currency } = useContext(GlobalContext);
    const { orders, removeOrder, loading, error } = useContext(OrderContext);
    
    const [showConfirmDelete, setShowConfirmDelete] = useState(null);
    // const [selectedOrder, setSelectedOrder] = useState(null);

    const handleRemove = (orderId) => {
        setShowConfirmDelete(orderId);
    };

    const confirmRemove = async (orderId) => {
        await removeOrder(orderId);
        setShowConfirmDelete(null);
    };


    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-medium mb-6">Meus Pedidos</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {loading && <div className="text-gray-500 mb-4">Carregando...</div>}

            {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Nenhum pedido encontrado
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Pedido #{order.id}</p>
                                    <p className="text-sm text-gray-500">Data: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-500">Status: {order.status}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">Total: {currency} {formatCurrency(order.totalAmount)}</p>
                                    <p className="text-sm text-gray-500">Prazo: {order.prazo}</p>
                                    <p className="text-sm text-gray-500">Transportadora: {order.transportadora}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm font-medium mb-2">Cliente</h3>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="font-medium">{order.client.rSocial}</p>
                                    <p className="text-sm text-gray-500">CNPJ: {order.client.cnpj}</p>
                                    <p className="text-sm text-gray-500">Telefone: {order.client.phone}</p>
                                    <p className="text-sm text-gray-500">Cidade: {order.client.city}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium mb-2">Itens do Pedido</h3>
                                <div className="space-y-3">
                                    {order.products.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 border border-gray-200 rounded flex items-center justify-center">
                                                    {item.productId && item.productId.image && <img src={item.productId.image[0]} alt={item.productId.name} className="max-w-full h-auto" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                                                    {item.description && <p className="text-sm text-gray-500">Descrição: {item.description.join(' - ')}</p>}
                                                    {item.base && <p className="text-sm text-gray-500">Base: {item.base}</p>}
                                                    {item.tela && <p className="text-sm text-gray-500">Tela: {item.tela}</p>}
                                                    {item.revestimento && <p className="text-sm text-gray-500">Revestimento: {item.revestimento}</p>}
                                                    {item.discounts && (
                                                        <div className="text-sm text-gray-500">
                                                            <span>Descontos: </span>
                                                            {Object.entries(item.discounts).map(([key, value]) => (
                                                                <span key={key}>{`${value}% `}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-primary">
                                                    {currency} {formatCurrency(item.totalPriceAfterDiscount)}
                                                </p>
                                                <p className="text-sm text-gray-500 line-through">
                                                    {currency} {formatCurrency(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">

                                {showConfirmDelete === order.id ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => confirmRemove(order.id)}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={() => setShowConfirmDelete(null)}
                                            className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleRemove(order.id)}
                                        className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded hover:bg-red-50 transition-colors"
                                    >
                                        Remover Pedido
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            
        </div>
    );
};

export default MyOrders;
