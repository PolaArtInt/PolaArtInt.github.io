'use strict';

const cartButton = document.querySelector('#cart-button'),
	modal = document.querySelector('.modal'),
	close = document.querySelector('.close'),
	buttonAuth = document.querySelector('.button-auth'),
	modalAuth = document.querySelector('.modal-auth'),
	closeAuth = document.querySelector('.close-auth'),
	logInForm = document.querySelector('#logInForm'),
	logInInput = document.querySelector('#login'),
	logInPassword = document.querySelector('#password'),
	userName = document.querySelector('.user-name '),
	buttonOut = document.querySelector('.button-out'),
	cardsRestaurants = document.querySelector('.cards-restaurants'),
	containerPromo = document.querySelector('.container-promo'),
	restaurants = document.querySelector('.restaurants'),
	menu = document.querySelector('.menu'),
	logo = document.querySelector('.logo'),
	cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('currLogin');


const getData = async function(url){
	const response = await fetch(url);

	if(!response.ok){
		throw new Error(`Ошибка по адресу ${url},
		статус ошибки ${response.status}!`);
	}
	return await response.json();

	console.log(response.json());
};
// console.log(getData('/db/partners.json'));

const valid = function(str){
	//2-20 символов, которыми могут быть буквы и цифры, первый символ обязательно буква
	const nameReg = /^[a-zA-Z0-9-_\.]{1,20}$/;
	return nameReg.test(str);
};

function toggleModal() {
  modal.classList.toggle("is-open");
};
function toggleModalAuth(){
	logInInput.style.borderColor = '';
	logInPassword.style.borderColor = '';
	modalAuth.classList.toggle('is-open');
};

function returnToMainPage(){
	containerPromo.classList.remove('hide');
	restaurants.classList.remove('hide');
	menu.classList.add('hide');
};

function autorized(){
	console.log('Авторизован');

	function logOut(){
		login = null;

		localStorage.removeItem('currLogin');

		buttonAuth.style.display = '';
		userName.style.display = '';
		buttonOut.style.display = '';
		buttonOut.removeEventListener('click', logOut);
		checkAuth();
		returnToMainPage();
	};

	userName.textContent = login;

	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'block';

	buttonOut.addEventListener('click', logOut);
};

// function maskInput(string){
// 	return !!string.trim();
// };

function notAutorized(){
	console.log('Не авторизован');

	function logIn(event){
		event.preventDefault();
		if(valid(logInInput.value.trim()) && valid(logInPassword.value.trim())){
			login = logInInput.value;
			localStorage.setItem('currLogin', login);
			toggleModalAuth();
			buttonAuth.removeEventListener('click', toggleModalAuth);
			closeAuth.removeEventListener('click', toggleModalAuth);
			logInForm.removeEventListener('submit', logIn);
			logInForm.reset();
			checkAuth();
		}else{
			logInInput.style.borderColor = 'tomato';
			logInPassword.style.borderColor = 'tomato';
			logInInput.value = '';
			alert('Введите имя и пароль');
		}
	};
	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	logInForm.addEventListener('submit', logIn);
};

function checkAuth(){
	if(login){
		autorized();
	}else{
		notAutorized();
	}
};

function createCardRestaurants(restaurants){
	const { 
		image, 
		kitchen, 
		name, 
		price, 
		stars, 
		products, 
		time_of_delivery: timeOfDelivery 
		} = restaurant;

	const card = `
		<a class="card card-restaurant" data-products="${products}">
			<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">${name}</h3>
					<span class="card-tag tag">${timeOfDelivery}</span>
				</div>
				<div class="card-info">
					<div class="rating">
						${stars}
					</div>
					<div class="price">${price} ₽</div>
					<div class="category">${kitchen}</div>
				</div>
			</div>
		</a>
	`;
	cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGoods(goods){

	const { 
		description, 
		image, 
		name, 
		price 
	} = goods;

	const card = document.createElement('div');
	card.className = 'card';
	card.insertAdjacentHTML('beforeend', 
	`
		<img src="${image}" alt="image" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">${description}</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold">${price} ₽</strong>
			</div>
		</div>
	`);
	cardsMenu.insertAdjacentElement('beforeend', card);
};

function openGoods(event){
	const target = event.target;
	if(login){
		const restaurant = target.closest('.card-restaurant');
		if(restaurant){
			cardsMenu.textContent = '';
			containerPromo.classList.add('hide');
			restaurants.classList.add('hide');
			menu.classList.remove('hide');
			
			getData(`./db/${restaurant.dataset.products}`).then(function(data){
				data.forEach(createCardGoods);
			});
		}
	}else{
		toggleModalAuth();
	}
	
};

function init(){
	getData('./db/partners.json').then(function(data){
		data.forEach(createCardRestaurants);
	});

	cartButton.addEventListener('click', toggleModal);
	close.addEventListener('click', toggleModal);
	cardsRestaurants.addEventListener('click', openGoods);
	logo.addEventListener('click', function(){
		containerPromo.classList.remove('hide');
		restaurants.classList.remove('hide');
		menu.classList.add('hide');
	});

	checkAuth();
	// createCardRestaurants();
	// createCardRestaurants();
	// createCardRestaurants();

	new Swiper('.swiper-container', {
		loop: true,
		autoplay: {
			delay: 5000
		},
		slidesPerView: 1
	});
};
init();