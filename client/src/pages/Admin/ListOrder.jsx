import React, { useEffect, useState } from 'react';
import boxIcon from '../../assets/order_icon.svg';
import formatCurrency from '../../utils/money';

// Test fetch-only ListOrder: não usa axios/context, logs bem detalhados.
// Substitua temporariamente na hospedagem para isolar problema.
export default function ListOrderFetchDebug() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Constrói URL: priorize VITE env, senão usa path relativo.
  const backendEnv = import.meta?.env?.VITE_API_URL;
  // se você quiser forçar uma URL aqui para testar, substitua abaixo:
  const backendUrl = backendEnv || window.__BACKEND_URL__ || ''; // ex: 'https://seu-backend.onrender.com'
  const requestPath = '/api/order/all';
  // URL final (se backendUrl vazio usa rota relativa)
  const finalUrl = backendUrl ? (backendUrl.replace(/\/$/, '') + requestPath) : requestPath;

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);

      console.log('[ListOrderFetchDebug] finalUrl ->', finalUrl);
      console.log('[ListOrderFetchDebug] page origin ->', window.location.origin);
      console.log('[ListOrderFetchDebug] location.href ->', window.location.href);
      try {
        const resp = await fetch(finalUrl, {
          method: 'GET',
          // credentials: 'include', // descomente se backend usa cookies/sessão
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          // mode: 'cors' // padrão é 'cors' em cross-origin requests
        });

        console.log('[ListOrderFetchDebug] fetch response object:', resp);

        // Mostra headers importantes (útil para CORS)
        try {
          const ctype = resp.headers.get('content-type');
          const acao = resp.headers.get('access-control-allow-origin');
          const acc = resp.headers.get('access-control-allow-credentials');
          console.log('[ListOrderFetchDebug] response headers: content-type=', ctype, 'ACAO=', acao, 'AC-credentials=', acc);
        } catch (hErr) {
          console.warn('[ListOrderFetchDebug] could not read response headers', hErr);
        }

        // Se não recebeu resposta (status 0 não é comum aqui)
        if (!resp) throw new Error('No response object from fetch');

        // HTTP status check
        if (!resp.ok) {
          const text = await resp.text().catch(() => '<no-body>');
          throw new Error(`HTTP ${resp.status}: ${text}`);
        }

        // tenta converter pra json
        let data;
        try {
          data = await resp.json();
          console.log('[ListOrderFetchDebug] response json:', data);
        } catch (parseErr) {
          const txt = await resp.text().catch(() => '<no-body>');
          throw new Error('Failed to parse JSON. Body: ' + String(txt).slice(0, 1000));
        }

        // adapta para formatos diferentes
        const ordersList = data?.orders ?? data?.data ?? data ?? [];
        if (mounted) setOrders(Array.isArray(ordersList) ? ordersList : []);
      } catch (err) {
        console.error('[ListOrderFetchDebug] fetch error:', err);
        // CORS/network errors geralmente chegam aqui como TypeError: Failed to fetch
        if (err.message && err.message.includes('Failed to fetch')) {
          setError('Network/CORS error: Failed to fetch. Verifique console network (CORS, mixed content ou URL).');
        } else {
          setError(String(err.message || err));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [finalUrl]);

  if (loading) return <div className="md:p-10 p-4">Loading (fetch debug)...</div>;
  if (error) return <div className="md:p-10 p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List (fetch debug)</h2>
      {orders.length > 0 ? orders.map((order) => (
        <div key={order._id || order.id || Math.random()} className="flex flex-col md:grid md:grid-cols-[1fr_2fr_1fr_1fr] md:items-center gap-5 p-5 max-w-5xl rounded-md border border-gray-300 text-gray-800">
          <div className="flex items-center gap-5">
            <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="box" />
            <div>
              <p className="font-bold text-indigo-600">#{order.orderNumber || order.id || '—'}</p>
              <p className="text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</p>
            </div>
          </div>
          <div className="text-sm ml-2">
            <p className='font-medium mb-1'>{order.client?.nFantasia || order.clientName || 'Client not available'}</p>
            <p>{order.client?.city || ''}</p>
          </div>
          <p className="font-medium text-base ml-3 my-auto text-black/70">R$ {formatCurrency(order.totalAmount || order.total || 0)}</p>
          <div className="flex gap-2 justify-self-end">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 rounded-md">Detalhes</button>
            <button className="px-4 py-2 text-sm font-medium text-red-600 rounded-md">Deletar</button>
          </div>
        </div>
      )) : <p>No orders found (empty array).</p>}
    </div>
  );
}



// import React, { useState, useEffect, useContext } from 'react';
// import boxIcon from '../../assets/order_icon.svg'; // Placeholder icon
// import formatCurrency from '../../utils/money';
// import GlobalContext from '../../context/GlobalContext';

// const ListOrder = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { axios, navigate } = useContext(GlobalContext)

//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 const response = await axios.get(`/api/order/all`);
//                 if (response.data.success) {
//                     setOrders(response.data.orders);
//                 } else {
//                     setError('Failed to fetch orders.');
//                 }
//             } catch (err) {
//                 setError('An error occurred while fetching orders.');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
        
//         fetchOrders();
//     }, []);

//     const handleDelete = async (orderId) => {
//         if (window.confirm('Tem certeza que deseja deletar este pedido?')) {
//             try {
//                 const response = await axios.delete(`/api/order/${orderId}`);
//                 if (response.data.success) {
//                     setOrders(orders.filter(order => order._id !== orderId));
//                 } else {
//                     alert('Failed to delete order.');
//                 }
//             } catch (err) {
//                 alert('An error occurred while deleting the order.');
//                 console.error(err);
//             }
//         }
//     };

//     if (loading) {
//         return <div className="md:p-10 p-4">Loading...</div>;
//     }

//     if (error) {
//         return <div className="md:p-10 p-4 text-red-500">{error}</div>;
//     }

//     return (
//         <div className="md:p-10 p-4 space-y-4">
//             <h2 className="text-lg font-medium">Orders List</h2>
//             {orders.length > 0 ? (
//                 orders.map((order) => (
//                     <div key={order._id} className="flex flex-col md:grid md:grid-cols-[1fr_2fr_1fr_1fr] md:items-center gap-5 p-5 max-w-5xl rounded-md border border-gray-300 text-gray-800">
//                         <div className="flex items-center gap-5">
//                             <img className="w-12 h-12 object-cover opacity-60" src={boxIcon} alt="boxIcon" />
//                             <div>
//                                 <p className="font-bold text-indigo-600">#{order.orderNumber}</p>
//                                 <p className="text-sm text-gray-500">
//                                     {new Date(order.createdAt).toLocaleDateString()}
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="text-sm ml-2">
//                             <p className='font-medium mb-1'>{order.client?.nFantasia || 'Client not available'}</p>
//                             <p>{order.client?.city || ''}</p>
//                         </div>
//                         <p className="font-medium text-base ml-3 my-auto text-black/70">
//                             R$ {formatCurrency(order.totalAmount)}
//                         </p>
//                         <div className="flex gap-2 justify-self-end">
//                             <button onClick={() => navigate(`/admin/order/${order._id}`)} className="px-4 py-2 text-sm font-medium text-blue-600 rounded-md hover:text-white-700 cursor-pointer">
//                                 Detalhes
//                             </button>
//                             <button onClick={() => handleDelete(order._id)} className="px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:text-white-700 cursor-pointer">
//                                 Deletar
//                             </button>
//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <p>No orders found.</p>
//             )}
//         </div>
//     );
// };

// export default ListOrder;