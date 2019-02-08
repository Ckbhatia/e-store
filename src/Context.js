import React, { Component } from 'react';
import {storeProducts, detailProduct} from './data';

const ProductContext = React.createContext();
//Provider
export class ProductProvider extends Component {
    state = {
        products: [],
        detailProduct: detailProduct,
        cart: [],
        modalOpen: false,
        modalProduct: detailProduct,
        cartSubTotal: 0,
        cartTax: 0,
        cartTotoal: 0
    };
    componentDidMount() {
        this.setProducts();
    }
    setProducts = () => {
        let tempProducts = [];
        storeProducts.forEach(item => {
            const singleItem = {...item };
            tempProducts = [...tempProducts, singleItem]
        });
        this.setState(() => {
            return { products: tempProducts}
        });
    };
    getItem = id => {
        const product = this.state.products.find(item => item.id === id);
        return product;
    };
    
    handleDetail = id => {
        const product = this.getItem(id);
        this.setState(()=> {
            return {detailProduct: product};
        });
    };

    addToCart = id => {
        let tempProducts = [...this.state.products];
        const index = tempProducts.indexOf(this.getItem(id));
        const product = tempProducts[index];
        product.inCart = true;
        product.count = 1;
        const price = product.price;
        product.total = price;
        this.setState(()=> {
            return {products: tempProducts, cart: [...this.state.cart,
                product]};
        }, 
        () => {
            this.addTotals();
        }); 
    };
    openModal = id =>{
        const product = this.getItem(id);
        this.setState(()=> {
            return {modalProduct: product, modalOpen: true};
        })
    }
    closeModal = () => {
        this.setState(() => {
            return {modalOpen: false}
        })
    }

    incrementItem = id => {
        let tempCart = [...this.state.cart];
        //Find selected products
        const selectedProduct = tempCart.find(item => item.id === id);
        //Access index for product
        const index = tempCart.indexOf(selectedProduct);
        //Access product
        const product = tempCart[index];
        //Increment product quantity by one
        product.count = product.count + 1;
        //Update total of product based on increment
        product.total = product.count * product.price;

        this.setState(()=> {
            return {
                cart: [...tempCart]
            }},()=> {
                this.addTotals();
            })
    };
    
    decrementItem = id => {
        console.log('Item decreased');
    };

    removeItem = id => {
        //Assing products to tempProducts
        let tempProducts = [...this.state.products];
        let tempCart = [...this.state.cart];
        //Filter cart for products    
        tempCart = tempCart.filter(item => item.id !== id);
        //Access index of particular product
        const index = tempProducts.indexOf(this.getItem(id));
        //Access removed product
        let removedProduct = tempProducts[index];
        //Set values back to initial for removed product
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;

        this.setState(
            () => {
                return {
                    cart: [...tempCart],
                    products: [...tempProducts]
                };
            },
            () => {
                //Update totals
                this.addTotals();
            }
        );
    };

    clearCart = () => {
        this.setState(()=> {
            return { cart: []};
        },()=> {
            this.setProducts();
            this.addTotals();
        });
    };
    addTotals = () => {
        let subTotal = 0;
        this.state.cart.map(item =>(subTotal += item.total));
        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));
        const total = subTotal + tax;
        this.setState(()=> {
            return {
                cartSubTotal: subTotal,
                cartTax: tax,
                cartTotal: total
            };
        });
    };
    render() {
        return (
            <ProductContext.Provider value={{
                ...this.state,
                handleDetail: this.handleDetail,
                addToCart: this.addToCart,
                openModal: this.openModal,
                closeModal: this.closeModal,
                incrementItem: this.incrementItem,
                decrementItem: this.decrementItem,
                removeItem: this.removeItem,
                clearCart: this.clearCart
            }}>
                {this.props.children}
            </ProductContext.Provider>
        );
    }
};

//Consumer
export const ProductConsumer = ProductContext.Consumer;