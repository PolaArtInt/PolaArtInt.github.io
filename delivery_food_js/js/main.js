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

//day 1
function toggleModal() {
  modal.classList.toggle("is-open");
};
function toggleModalAuth(){
	logInInput.style.borderColor = '';
	logInPassword.style.borderColor = '';
	modalAuth.classList.toggle('is-open');
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
	};

	userName.textContent = login;

	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'block';

	buttonOut.addEventListener('click', logOut);
};

function maskInput(string){
	return !!string.trim();
};

function notAutorized(){
	console.log('Не авторизован');

	function logIn(event){
		event.preventDefault();
		
		if(maskInput(logInInput.value) && maskInput(logInPassword.value)){
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

function createCardRestaurants(){
	const card = `
		<a class="card card-restaurant">
			<img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">Пицца плюс</h3>
					<span class="card-tag tag">50 мин</span>
				</div>
				<div class="card-info">
					<div class="rating">
						4.5
					</div>
					<div class="price">От 900 ₽</div>
					<div class="category">Пицца</div>
				</div>
			</div>
			<!-- /.card-text -->
		</a>
	`;
	cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGoods(){
	const card = document.createElement('div');
	card.className = 'card';
	card.insertAdjacentHTML('beforeend', 
	`
		<img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">Пицца Классика</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
					грибы.
				</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold">510 ₽</strong>
			</div>
		</div>
	`);
	cardsMenu.insertAdjacentElement('beforeend', card);
};

function openGoods(event){
	const target = event.target;
	const restaurant = target.closest('.card-restaurant');
	if(login){
		cardsMenu.textContent = '';
		containerPromo.classList.add('hide');
		restaurants.classList.add('hide');
		menu.classList.remove('hide');
		createCardGoods();
		createCardGoods();
		createCardGoods();
	}else{
		toggleModalAuth();
	}
};

cartButton.addEventListener('click', toggleModal);
close.addEventListener('click', toggleModal);
cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function(){
	containerPromo.classList.remove('hide');
	restaurants.classList.remove('hide');
	menu.classList.add('hide');
});

checkAuth();
createCardRestaurants();
createCardRestaurants();
createCardRestaurants();
