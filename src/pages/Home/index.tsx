import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import {AxiosResponse} from 'axios';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] = product.amount

    return sumAmount
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      let result: AxiosResponse<any> | null;

      try {
        result = await api.get('/products');
      }
      catch(e) {
        console.log('Ocorreu um erro ao recuperar os produtos.', e);
        return
      }

      if (result === null) {
          console.log('Sem produtos.');
          return
      }

      const formattedItens = result.data.map((product: Product) => {
            return {
                ...product,
                priceFormatted: formatPrice(product.price)
            }
        });

      setProducts(formattedItens)
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  function renderProducts(product: ProductFormatted): JSX.Element {
    return (
        <li key={product.id}>
            <img
                src={product.image}
                alt={product.title}
            />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
            <button
                type="button"
                data-testid="add-product-button"
                onClick={() => handleAddProduct(product.id)}
            >
            <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[product.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
            </button>
        </li>
    )
  }

  return (
    <ProductList>
        {products.length > 0 &&
            products.map(renderProducts)
        }
    </ProductList>
  );
};

export default Home;
