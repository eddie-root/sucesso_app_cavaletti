import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateItemDiscount } from '../utils/discount';
import formatCurrency from '../utils/money.js';
import CartContext from '../context/CartContext.jsx';
import { assets } from '../assets/assets';

const Cart = () => {

  const {
    products,
    currency,
    cartItems,
    getCartCount,
    updateQuantity,
    removeFromCart,
    itemDiscounts,
    itemOptions,
    updateItemOptions,
    handleDiscountChange,
    getCartAmount,
    getDiscountedTotal
  } = useContext(CartContext);

  const navigate = useNavigate();

  const handleOptionChange = (itemId, assento, type, value) => {
    updateItemOptions(itemId, assento, { [type]: value });
  };

  const handleProceedToPreOrder = () => {
    navigate('/pre-order');
  };

  return (
    <>
      <div className='flex flex-col lg:flex-row py-8 sm:py-16 max-w-7xl w-full px-4'>
        <div className='flex-1 max-w-6xl'>
          <h1 className='text-2xl sm:text-3xl font-medium mb-6'>
            Bloco de Pedido <span className='ml-3 text-sm text-primary'>{getCartCount()} Itens</span>
          </h1>

          <div className='grid grid-cols-[1fr_2fr_1fr_1fr_0.5fr] sm:grid-cols-[1fr_3fr_1fr_1fr_0.5fr] text-gray-600 text-sm sm:text-base font-medium pb-3'>
            <p className='text-left'>Código</p>
            <p className='text-left ml-6'>Descrição</p>
            <p className='text-center sm:text-left ml-6'>Descontos</p>
            <p className='text-left ml-6'>Preço</p>
            <p className='text-left ml-2'>Remover</p>
          </div>

          {cartItems.map((item) => {
            if (!item.product) return null;
            const productData = products.find(p => p._id === item.product._id);
            if (!productData) return null;

            const itemKey = `${item.product._id}-${item.assento}`;
            const discounts = itemDiscounts[itemKey] || {};
            const options = itemOptions[itemKey] || {};

            const discountedPrice = calculateItemDiscount(
              item.price * item.quantity,
              discounts.discount1,
              discounts.discount2,
              discounts.discount3,
              discounts.discount4
            );

            return (
              <div key={itemKey} className='grid grid-cols-[1fr_2fr_1fr_1fr_0.5fr] sm:grid-cols-[1fr_3fr_1fr_1fr_0.5fr] text-gray-600 items-start text-xs sm:text-sm md:text-base font-medium pt-4 border-b pb-4'>
                {/* Coluna 1: Código e Quantidade */}
                <div className='flex flex-col gap-2'>
                  <p>{productData.codp}</p>
                  <input
                    onChange={(e) => updateQuantity(item.product._id, item.assento, Number(e.target.value))}
                    className='border border-gray-500 max-w-20 px-2 py-1 mt-2'
                    type="number"
                    min={1}
                    value={item.quantity}
                  />
                </div>

                {/* Coluna 2: Descrição e Opções */}
                <div className='ml-6'>
                  <p className='text-lg font-semibold'>{productData.name}</p>
                  <p className='text-md font-gray-400'>{productData.description.join(' - ')}</p>
                  <div className='flex flex-col gap-2 mt-2'>
                    <div>
                      <p className='text-sm font-medium'>Base:</p>
                      <p className='text-sm'>{item.priceGroupName}</p>
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Tela:</label>
                      <select 
                        value={options.tela || ''}
                        onChange={(e) => handleOptionChange(item.product._id, item.assento, 'tela', e.target.value)}
                        className='border border-gray-400 rounded p-1 text-sm w-full max-w-xs ml-16'
                      >
                        <option value="">Selecione</option>
                        <option value="flip-601">Flip-601</option>
                        <option value="flip-600">Flip-600</option>
                        <option value="air-preto">Air-Preto</option>
                        <option value="air-cinza">Air-Cinza</option>
                        <option value="mimic-650">Mimic-650</option>
                        <option value="air">Mimic-651</option>
                        <option value="air">Minic-652</option>
                      </select>
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Revestimento:</label>
                      <select 
                        value={options.revestimento || ''}
                        onChange={(e) => handleOptionChange(item.product._id, item.assento, 'revestimento', e.target.value)}
                        className='border border-gray-400 rounded p-1 text-sm w-full max-w-xs ml-1'
                      >
                        <option value="">Selecione</option>
                        <option value="vermelho">192-Vermelho Real</option>
                        <option value="vermelho">049-Vermelho</option>
                        <option value="bordo">043-Bordô</option>
                        <option value="berinjela">185-Berinjela</option>
                        <option value="grani">Grani-287</option>
                        <option value="grani">Greni-286</option>
                        <option value="grani">Grani-284</option>
                      </select>
                    </div>
                  </div>
                </div>

                  {/* Coluna 3: Descontos */}
                  <div className='flex flex-col gap-1 items-center'>
                    <input
                      onChange={(e) => handleDiscountChange(item.product._id, item.assento, 'discount1', e.target.value)}
                      value={discounts.discount1 || ''}
                      placeholder="Desc 1 %"
                      className="border border-gray-500 w-20 px-2 py-1 text-xs"
                      type="number"
                    />
                    <input
                      onChange={(e) => handleDiscountChange(item.product._id, item.assento, 'discount2', e.target.value)}
                      value={discounts.discount2 || ''}
                      placeholder="Desc 2 %"
                      className="border border-gray-500 w-20 px-2 py-1 text-xs"
                      type="number"
                    />
                    <input
                      onChange={(e) => handleDiscountChange(item.product._id, item.assento, 'discount3', e.target.value)}
                      value={discounts.discount3 || ''}
                      placeholder="Desc 3 %"
                      className="border border-gray-500 w-20 px-2 py-1 text-xs"
                      type="number"
                    />
                    <input
                      onChange={(e) => handleDiscountChange(item.product._id, item.assento, 'discount4', e.target.value)}
                      value={discounts.discount4 || ''}
                      placeholder="Desc 4 %"
                      className="border border-gray-500 w-20 px-2 py-1 text-xs"
                      type="number"
                    />
                  </div>

                  {/* Coluna 4: Preço */}
                  <div className="text-left ml-6 text-sm">
                    {getDiscountedTotal() < getCartAmount() ? (
                      <p className="text-gray-400 line-through">{currency} {formatCurrency(item.price * item.quantity)}</p>
                    ) : null}
                    <p className="text-primary text-base font-semibold">{currency} {formatCurrency(discountedPrice)}</p>
                  </div>

                  {/* Coluna 5: Remover */}
                  <button onClick={() => removeFromCart(item.product._id, item.assento)} className="cursor-pointer mx-auto">
                    <img src={assets.remove_icon} alt="remove" className='w-5 h-5'/>
                  </button>
                    </div>
                  );
                })}
            <button
              onClick={() => { navigate('/collection'); scrollTo(0, 0) }}
              className='group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium text-sm sm:text-base'
            >
            <img className='group-hover:-translate-x-1 transition' src={assets.arrow_right_icon_colored} alt="arrow" />
            Buscar mais
          </button>
        </div>
      </div>

      {/* Resumo do Pedido Simplificado */}
      <div className='flex justify-end my-20 px-4'>
        <div className='w-full lg:max-w-[450px] bg-gray-200/70 p-5 border border-gray-500/80'>
          <h2 className='text-xl font-medium'>Total do Pedido</h2>
          <hr className='border-gray-400 my-5'/>

          <div className='text-gray-600 mt-6 space-y-2'>
              <p className='flex justify-between text-sm'>
                  <span>Total s/ desconto:</span>
                  <span>{currency} {formatCurrency(getCartAmount())}</span>
              </p>
              <p className='flex justify-between text-xl font-medium mt-3'>
                  <span>Total c/ desconto:</span>
                  <span>{currency} {formatCurrency(getDiscountedTotal())}</span>
              </p>
          </div>

          <button
            onClick={handleProceedToPreOrder}
            disabled={cartItems.length === 0}
            className='w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition disabled:bg-gray-400'
          >
            Prosseguir para Pré-Pedido
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;