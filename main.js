
const cartContainer  = document.querySelector(".cartContainer");
const btnContainer = document.querySelector(".buttons");
const products = document.querySelectorAll(".product");
const productContainer = document.querySelector(".productContainer");
const addCartBtn = document.querySelectorAll(".addToCartButton");
const input = document.querySelector(".input");
const totalPrice = document.querySelector(".totalPrice");
const clearCart = document.querySelector(".clear-cart");

let buttonsDom = [];
let productsDom = [];
let cart = [];

// class LocalStorage{
//     static getLocalStorage(){
//         return localStorage.getItem("savedItems")? JSON.parse(localStorage.getItem("savedItems")):[];
//     }
//     static addToLocalStorage(name,price,count){
//         let items  = this.getLocalStorage();
//         const cartItems = {name,price,count}
//         items.push(cartItems);
//         localStorage.setItem("savedItems", JSON.stringify(items));
//     }
//     static loadItems(){
//         let items = this.getLocalStorage();
//     if(items.length > 0){
//         items.forEach((item)=>{
//             cartItem(item.name, item.price, item.count);
//         })
//     }
//     }
// }
class Getproducts{
    async fetchProduct(){
        try{
            const dataProducts = await fetch("products.json");
            const parseProducts = await dataProducts.json();
            let products = parseProducts.items;
            products = products.map((product)=>{
                const {title,price} = product.fields;
                const {id} = product.sys;
                return {title, price, id};
            })
            return products;
        }
        catch(error){
            console.log(error);
        }
    }
}
class UI{
    displayItems(products){
        let result = "";
        products.forEach(({title, price, id})=>{
           result += `<div class="product" data-id=${id}>
           <h2 class="productName">${title}</h2>
           <button class="addToCartButton" data-id=${id}>add to cart</button>
           <span class="price">$${price}</span>
           </div>`; 
        })
        productContainer.innerHTML = result;
    }
    getButtons(){
        const addToCartButton = [...document.querySelectorAll(".addToCartButton")];
        buttonsDom = addToCartButton;
        console.log(buttonsDom);
        addToCartButton.forEach((button)=>{
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                button.disabled = true;
                button.innerText = "In cart";
            }
                button.addEventListener("click",(event)=>{
                    event.target.disabled = true;
                    event.target.innerText = "In cart";
                    //add products to the cart
                    let cartItems = {...Storageproducts.getProducts(id), amount: 1};
                    console.log(cartItems);
                    cart = [...cart, cartItems];
                    console.log(cart);
                    //save cart to local storage
                    Storageproducts.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart);
                    //display cart items
                    this.displayCart(cartItems);
                    //show the cart
                     
                })
        })
    };
    //set the cart values
    setCartValues(){
        let total = 0;
        cart.map(item => {
            total += item.price * item.amount;
        })
        totalPrice.innerText = "$" + total;
    }
    //display cart in DOM
    displayCart({title,price,id,amount}){
        const div = document.createElement("div");
        div.classList.add("cart-items");
        div.innerHTML = `<div class="product" data-id=${id}>
                 <h2 class="cartName">${title}</h2>
                <span class="price">${price}</span>
                  <button class = "plusBtn" data-id=${id}>+</button>
                 <span class = "amount">${amount}</span>
                 <button class = "minusBtn" data-id=${id}>-</button>
                <button class="deleteBtn" data-id=${id}>Delete Item</button>`
        cartContainer.appendChild(div);
    }
    //set up the application when the DOM is loaded it will still there
    setupAPP(){
       cart = Storageproducts.getCart();
       this.setCartValues(cart);
       this.populate(cart)
       cartContainer.addEventListener("click", (event)=>{
        if(event.target.classList.contains("deleteBtn")){
            let deleteBtn = event.target;
            let id = deleteBtn.dataset.id;
            buttonsDom.find(button => button.id === id);
            cartContainer.removeChild(deleteBtn.parentElement.parentElement);
            this.removeItems(id);
        }
        else if(event.target.classList.contains("plusBtn")){
            let addAmount = event.target;
            let id = addAmount.dataset.id;
            let tempItem = cart.find(item => item.id === id);
            tempItem.amount = tempItem.amount + 1;
            let amount = addAmount.nextElementSibling;
            amount.innerText = tempItem.amount;
            Storageproducts.saveCart(cart);
            this.setCartValues(cart);
        }else if(event.target.classList.contains("minusBtn")){
            let minusAmount = event.target;
            let id = minusAmount.dataset.id;
            let tempItem = cart.find(item => item.id === id);
            tempItem.amount = tempItem.amount - 1;
            let amount = minusAmount.previousElementSibling;
            amount.innerText = tempItem.amount;
            if(tempItem.amount > 0){
                Storageproducts.saveCart(cart);
                this.setCartValues(cart);
            }
            else{
                cartContainer.removeChild(minusAmount.parentElement.parentElement);
                this.removeItems(id);
            }
        }
       })
    }
    populate(cart){
        cart.forEach(item => this.displayCart(item));
    }
    clearCart(){
        clearCart.addEventListener("click",()=>{
            let cartItems = cart.map(item => item.id);
            console.log(cartItems);
            cartItems.forEach(id => this.removeItems(id));
            while(cartContainer.children.length > 0){
                cartContainer.removeChild(cartContainer.children[0])
            }
        })
    }
    removeItems(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storageproducts.saveCart(cart);
        let button = this.getButtonsId(id);
        button.disabled = false;
        button.innerText = "add to cart";
    }
    getButtonsId(id){
        return buttonsDom.find(button => button.dataset.id === id);
    }
   
}
//Product storage.... ...//arrays included
class Storageproducts{
    static setProducts(products){
        productsDom = products;
    }
    static getProducts(id){
        let findId = productsDom.find(product => product.id === id);
        return findId;
    }

    //save cart to local storage
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    static getCart(){
        return localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")):[];
    }
    }

const domContentFunctions = ()=>{
    // LocalStorage.loadItems();
    const productItem =  new Getproducts();
    const displayUi = new UI();
    displayUi.setupAPP();
    displayUi.clearCart();
    //returns promise
    productItem.fetchProduct().then((products)=>{
        displayUi.displayItems(products);
        Storageproducts.setProducts(products);
        
    }).then(()=>{
        displayUi.getButtons();
    });

}
document.addEventListener("DOMContentLoaded", domContentFunctions);
// const searchItem = ()=>{
    //     let value = input.value;
//     value = value.toUpperCase();
//     const searchStrings = value.split(/\W/);
//     console.log(searchStrings);
//     let productContainer = products;
//     let productName = document.getElementsByClassName("productName");
//     console.log(productName);
//     for(let j = 0; j < productContainer.length; j++){
//         let num = 0;
//         console.log(num);
//         for(let i = 0; i < searchStrings.length; i++){
//             let currentSearch = searchStrings[i].toUpperCase();
//             console.log(currentSearch);
//             if(value !== ""){
//                 if(productName[j].textContent.toUpperCase().indexOf(currentSearch)!== -1){
//                     num++;
//                 }
//                 if(num == searchStrings.length){
//                     productContainer[j].style.display = "block";
//                 }
//             }
//             if(value === ""){
//                 productContainer[j].style.display = "none";
//             }
//         }
//     }
// }

// const updateTotal = (row)=>{
//     let total = 0;
//     const cartRow = row;
//     for(let i = 0; i < cartRow.length; i++){
//         const rowInd = cartRow[i];
//         const priceElement = rowInd.getElementsByClassName("price")[0].innerText;
//         const countElement = rowInd.getElementsByClassName("countOfProduct")[0].innerText;
//         const quantity = parseFloat(countElement);
//         const price = parseFloat(priceElement);
//         total += (quantity * price);
//     }
//     document.querySelector(".totalPrice").innerText = total;
// }

// const clickDelete = (e)=>{
//     const cartRow = cartContainer.getElementsByClassName("cartRow");
//     console.log(cartRow);
//     const element = e.target.parentElement.parentElement;
//     cartContainer.removeChild(element);
//     updateTotal(cartRow);

// }
// const quantityUpdate = (e)=>{
//     const cartRow = cartContainer.getElementsByClassName("cartRow");
//     console.log(cartRow);
//     const input = e.target;
//     if(isNaN(input.value) || input.value <= 0){
//         input.value = 1;
//     }
//     updateTotal(cartRow);
// }

// const cartItem = (name, price)=>{
//     let count = 1;
//     const titleName = name
//     const newDiv = document.createElement("div");
//     newDiv.classList.add("cartRow");
//     const cartName = cartContainer.getElementsByClassName("cartName");
//     for(let i = 0; i < cartName.length; i++ ){
//         if(cartName[i].innerText == titleName){
//             return;
//         }
//     }
//     const divContents = `<div class="product" data-id="skinCare">
//     <h2 class="cartName">${titleName}</h2>
//     <span class="price">${price}</span>
//     <button class = "plusBtn">+</button>
//     <span class = "countOfProduct">${count}</span>
//     <button class = "minusBtn">-</button>
//     <button class="deleteBtn">Delete Item</button>
// </div>`;
//     newDiv.innerHTML = divContents;
//     cartContainer.appendChild(newDiv);
//     const cartRow = cartContainer.getElementsByClassName("cartRow");
//     const deleteBtn = cartContainer.getElementsByClassName("deleteBtn");
//     for(let i = 0; i < deleteBtn.length; i++){
//         let button = deleteBtn[i]
//         button.addEventListener("click", clickDelete);
//     }
//     for(let i = 0; i < cartRow.length; i++){
//         const parentElement = cartRow[i];
//         parentElement.addEventListener("click", (e)=>{
//             let countOfProduct = parentElement.getElementsByClassName("countOfProduct")[0];
//             console.log(countOfProduct);
//             const isPlusBtn = e.target.classList.contains("plusBtn");
//             const isMinusBtn = e.target.classList.contains("minusBtn");
//                 if(isPlusBtn){
//                     count+= 1;
//                    countOfProduct.innerText = count; 
//                 }
//                 else if(isMinusBtn){
//                     count-=1;
//                     countOfProduct.innerText = count;
//                 }
//                 console.log(count);
//             updateTotal(cartRow)
//         })
//     }
//     // const input = cartContainer.getElementsByClassName("quantity-input");
//     // for(let i = 0; i < input.length; i++){
//     //     let indInput = input[i];
//     //     indInput.addEventListener("change", quantityUpdate);
//     // }
//     LocalStorage.addToLocalStorage(titleName, price);
//     updateTotal(cartRow)

// }

// const cart = (e)=>{
//     let button = e.target;
//     button.innerText = "In cart";
//     button.disabled = true;
//     const product = button.parentElement;
//     const productName = product.querySelector(".productName").innerText;
//     const priceElement = product.querySelector(".price").innerText;
//     cartItem(productName, priceElement);
//     // cartItem(productName)
//     // updateTotal();
  
// }
// const filterProducts = (btnsId)=>{
// for(let i = 0; i < products.length; i++){
//     let indProducts = products[i];
//     let indProductsId = indProducts.dataset.id;
//     if(btnsId === indProductsId){
//         indProducts.style.display = "block";
//     }else{
//         indProducts.style.display = "none";
//     }
// }
//     if(btnsId === "all"){
//         products.forEach((item)=>{
//             item.style.display = "block";
//         })
//     }
// }
// const buttonFilters = ()=>{
//     const productCategories = buttonId.reduce((all,ids)=>{
//         if(!all.includes(ids.product)){
//             all.push(ids.product);
//         }
//         return all;
//     },["all"]);

//     let categoriesId = productCategories.map((ids)=>{
//         return ` <button class="button" data-id=${ids}>${ids}</button>`;
//     });
//         categoriesId = categoriesId.join("");
//         console.log(categoriesId);
//         btnContainer.innerHTML = categoriesId;
//     const btns = btnContainer.querySelectorAll(".button");
//     btns.forEach((btn)=>{
//         btn.addEventListener("click",(e)=>{
//            const buttonCurrent = e.currentTarget;
//            const btnId = buttonCurrent.dataset.id;
//            filterProducts(btnId)
//         })
//     })
// }
// addCartBtn.forEach((cartBtn)=>{
//     cartBtn.addEventListener("click",cart);
// });
// input.addEventListener("keyup", searchItem);



