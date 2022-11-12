const buttonId = [
{
    product: "soap"
},
{
    product: "detergent"
},
{
    product: "teethCare"
}, 
{
    product: "skinCare"
}]

const btnContainer = document.querySelector(".buttons");
const products = document.querySelectorAll(".product");
const productContainer = document.querySelector(".productContainer");
const productChildren = productContainer.children[0];
const productName = products.querySelectorAll(".productName");
console.log(productChildren);
const addCartBtn = document.querySelectorAll(".addToCartButton");
const cartContainer = document.querySelector(".cartContainer");


const cart = (e)=>{
    for(let i = 0; i < products.length; i++){
        const indProducts = products[i];
        let indProductsId = indProducts.dataset.id;
        const productInnerHtml = indProducts.innerHTML;
        const cartBtn = e.currentTarget;
        const cartId = cartBtn.dataset.id;
        console.log(cartId);
        if(cartId === indProductsId){
            if
            cartContainer.innerHTML = productInnerHtml;
        }
    }
    setTimeout(()=>{
        alert("Added to cart")
    },0.500)
    
}


const filterProducts = (btnsId)=>{
for(let i = 0; i < products.length; i++){
    let indProducts = products[i];
    let indProductsId = indProducts.dataset.id;
    if(btnsId === indProductsId){
        indProducts.style.display = "block";
    }else{
        indProducts.style.display = "none";
    }
}
    if(btnsId === "all"){
        products.forEach((item)=>{
            item.style.display = "block";
        })
    }
}
const buttonFilters = ()=>{
    const productCategories = buttonId.reduce((all,ids)=>{
        if(!all.includes(ids.product)){
            all.push(ids.product);
        }
        return all;
    },["all"]);

    let categoriesId = productCategories.map((ids)=>{
        return ` <button class="button" data-id=${ids}>${ids}</button>`;
    });
        categoriesId = categoriesId.join("");
        btnContainer.innerHTML = categoriesId;
    const btns = btnContainer.querySelectorAll(".button");
    btns.forEach((btn)=>{
        btn.addEventListener("click",(e)=>{
           const buttonCurrent = e.currentTarget;
           const btnId = buttonCurrent.dataset.id;
           filterProducts(btnId)
        })
    })
}
window.addEventListener("DOMContentLoaded", buttonFilters);
addCartBtn.forEach((cartBtn)=>{
    cartBtn.addEventListener("click",cart);
});