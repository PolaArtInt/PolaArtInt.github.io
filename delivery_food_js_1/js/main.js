'use strict';

const cartButton = document.querySelector('#cart-button'),
	modal = document.querySelector('.modal'),
	closer = document.querySelector('.close'),
	buttonAuth = document.querySelector('.button-auth'),
	modalAuth = document.querySelector('.modal-auth'),
	closeAuth = document.querySelector('.close-auth'),
	logInForm = document.querySelector('#logInForm'),
	loginInput = document.querySelector('#login'),
	userName = document.querySelector('.user-name'),
	buttonOut = document.querySelector('.button-out'),
	cardsRestaurants = document.querySelector('.cards-restaurants'),
	containerPromo = document.querySelector('.container-promo'),
	restaurants = document.querySelector('.restaurants'),
	menu = document.querySelector('.menu'),
	logo = document.querySelector('.logo'),
	cardsMenu = document.querySelector('.cards-menu'),
	cartList = document.querySelector('.modal-body'),
	modalPrice = document.querySelector('.modal-pricetag'),
	buttonClearCart = document.querySelector('.clear-cart'),
	inputSearch = document.querySelector('.input-search'),
	restaurantTitle = document.querySelector('.restaurant-title'),
	rating = document.querySelector('.rating'),
	minPrice = document.querySelector('.price'),
	category = document.querySelector('.category');

let login = localStorage.getItem('delivery');

const cart = [];


const loadCart = () => {
	if(localStorage.getItem(login)){
		JSON.parse(localStorage.getItem(login)).forEach(function(item){
			cart.push(item);
		});
	}
};

const saveCart = () => {
	localStorage.setItem(login, JSON.stringify(cart));
};

const getData = async url => {
  const response = await fetch(url);
  if(!response.ok){
    throw new Error(`Ошибка по адресу ${url} 
    статус ошибки ${response.status}`);
  }
  return await response.json();
};

const valid = (str) => {
  const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return nameReg.test(str);
};

const toggleModal = () => {
  modal.classList.toggle('is-open');
};
const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  loginInput.placeholder = '';
};

const returnToMainPage = () => {
	containerPromo.classList.remove('hide');
	restaurants.classList.remove('hide');
	menu.classList.add('hide');
};

const authorized = () => {
    const logOut = () => {
        login = null;
        cart.length = 0;
        localStorage.removeItem('delivery');
        buttonAuth.style.display = '';
        userName.style.display = '';
        buttonOut.style.display = '';
    	cartButton.style.display = '';
        buttonOut.removeEventListener('click', logOut);
        checkAuth();
    	returnToMainPage();
    };
    console.log('Авторизован');
    userName.textContent = login;
    buttonAuth.style.display = 'none';
    userName.style.display = 'inline';
    buttonOut.style.display = 'flex';
    cartButton.style.display = 'flex';
    buttonOut.addEventListener('click', logOut);
    loadCart();
};

const notAuthorized = () => {
    console.log('Не авторизован');
    const logIn = (event) => {
        event.preventDefault();
        if(valid(loginInput.value.trim())){
            login = loginInput.value;
            localStorage.setItem('delivery', login);
    
            toggleModalAuth();
            buttonAuth.removeEventListener('click', toggleModalAuth);
            closeAuth.removeEventListener('click', toggleModalAuth);
            logInForm.removeEventListener('submit', logIn);
            logInForm.reset();
            checkAuth();
        }else{
            loginInput.style.borderColor = 'red';
            loginInput.placeholder = 'Введите логин';
            loginInput.value = '';
        }
    };
    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    logInForm.addEventListener('submit', logIn);
};

function checkAuth(){
    if(login){
        authorized();
    }else{
        notAuthorized();
    }
}

const createCardRestaurant = ({
    image,
    kitchen,
    name,
    price,
    stars,
    products,
    time_of_delivery: timeOfDelivery,
}) => {
    const card = `
        <a class="card card-restaurant" data-products="${products}">
            <img src="${image}" alt="image" class="card-image"/>
            <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title">${name}</h3>
                <span class="card-tag tag">${timeOfDelivery} мин.</span>
            </div>
            <div class="card-info">
                <div class="rating">
                  ${stars}
                </div>
                <div class="price">От ${price} ₽</div>
                <div class="category">${kitchen}</div>
              </div>
            </div>
        </a>
    `;
    cardsRestaurants.insertAdjacentHTML('beforeend', card);
};

const createCardGood = ({ description, image, name, price, id }) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
    		<div class="card-heading">
    			<h3 class="card-title card-title-reg">${name}</h3>
    		</div>
    		<div class="card-info">
    			<div class="ingredients">
    				${description}
    			</div>
    		</div>
    		<div class="card-buttons">
    			<button class="button button-primary button-add-cart" id="${id}">
    				<span class="button-card-text">В корзину</span>
    				<span class="button-cart-svg"></span>
    			</button>
    			<strong class="card-price card-price-bold">${price} ₽</strong>
    		</div>
    	</div>
  	`);
    cardsMenu.insertAdjacentElement('beforeend', card);
};

const openGoods = (event) => {
    const target = event.target;
    if(login){
        const restaurant = target.closest('.card-restaurant');
        if(restaurant){
            getData('/db/partners.json').then((data) => {
                let matched = data.find(
                (rest) => rest.products === restaurant.dataset.products
            );
            const headerSection = menu.querySelector('.section-heading');
            headerSection.innerHTML = 
                `
                    <h2 class="section-title restaurant-title">${matched.name}</h2>
                    <div class="card-info">
                    <div class="rating">
                        ${matched.stars}
                    </div>
                    <div class="price">От ${matched.price} ₽</div>
                    <div class="category">${matched.kitchen}</div>
                `;
            });
            cardsMenu.textContent = '';
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');
            getData(`../db/${restaurant.dataset.products}`).then((data) => {
            data.forEach(createCardGood);
            });
        }
    }else{
    toggleModalAuth();
    }
};

const addToCard = (event) => {
	const target = event.target;
	const buttonAddToCart = target.closest('.button-add-cart');
	if(buttonAddToCart){
		const card = target.closest('.card');
		const title = card.querySelector('.card-title').textContent;
		const cost = card.querySelector('.card-price').textContent;
		const id = buttonAddToCart.id;
		const food = cart.find(function(item){
			return item.id === id;
		});
		if(food){
			food.count += 1;
		}else{
			cart.push({
				id,
				title,
				cost,
				count: 1
			});
		}
	}
	saveCart();
};

const renderCart = () => {
	cartList.textContent = '';
	cart.forEach(function({ id, title, cost, count }){
		const itemCart = `
			<div class="food-row">
				<span class="food-name">${title}</span>
				<strong class="food-price">${cost}₽</strong>
				<div class="food-counter">
					<button class="counter-button counter-minus" data-id=${id}>-</button>
					<span class="counter">${count}</span>
					<button class="counter-button counter-plus" data-id=${id}>+</button>
				</div>
			</div>
		`;
		cartList.insertAdjacentHTML('afterbegin', itemCart);
	});
	const totalPrice = cart.reduce(function(result, item){
		return result + (parseFloat(item.cost) * item.count);
	}, 0);
	modalPrice.textContent = totalPrice + ' ₽';
};

const changeCount = (event) => {
	const target = event.target;
	if(target.classList.contains('counter-button')){
		const food = cart.find(function(item){
			return item.id === target.dataset.id;
		});
		if(target.classList.contains('counter-minus')){
			food.count--;
			if(food.count === 0){
				cart.splice(cart.indexOf(food), 1);
			}
		}
		if(target.classList.contains('counter-plus')) food.count++;
		renderCart();
	}
	saveCart();
};

function init(){
    getData('../db/partners.json').then(function(data){
		data.forEach(createCardRestaurant);
	});
    cartButton.addEventListener('click', renderCart);
    cartButton.addEventListener('click', toggleModal);
    buttonClearCart.addEventListener('click', function(){
    	cart.length = 0;
    	renderCart();
    });
    cartList.addEventListener('click', changeCount);
    cardsMenu.addEventListener('click', addToCard);
    closer.addEventListener('click', toggleModal);
    cardsRestaurants.addEventListener('click', openGoods);
    
    logo.addEventListener('click', function(){
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
    });
	inputSearch.addEventListener('keydown', function(event){
		if(event.keyCode === 13){
			const target = event.target;
			const value = target.value.toLowerCase().trim();

			target.value = '';
			if(!value){
				target.style.borderColor = 'tomato';
				setTimeout(function(){
					target.style.borderColor = '';
				}, 2000);
				return;
		}
		const goods = [];
		getData('../db/partners.json')
			.then(function(data){
				const products = data.map(function(item){
					return item.products;
			});
			products.forEach(function(product){
				getData('../db/${product}')
					.then(function(data){
						goods.push(...data);
						const searchGoods = goods.filter(function(item){
							return item.name.toLowerCase().includes(value);
    					})
    					cardsMenu.textContent = '';
    
    					containerPromo.classList.add('.hide');
    					restaurants.classList.add('.hide');
    					menu.classList.remove('.hide');
    
    					restaurantTitle.textContent = 'Результат поиска';
    					rating.textContent = '';
    					minPrice.textContent = '';
    					category.textContent = '';
    
    					return searchGoods;
    				})
				    .then(function(data){
					goods.forEach(createCardGood);
                    });
                });
            });
        } 
    });
    checkAuth();
    new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
          delay: 4000,
        },
    		slidesPerView: 1,
      	slidesPerColumn: 1
    });
}
init();
