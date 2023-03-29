
"use strict";

// Прелоадер находиться в Parallax

// Форма

const menuBody = document.querySelector('.menu__body');

document.addEventListener('DOMContentLoaded', function () {

	const formWrapper = document.querySelector('.form');

	/*Скрыть форму при клике на formIcon*/
	let formIcon = document.querySelector('.form__icon');
	if (formIcon) {
		formIcon.addEventListener("click", function (e) {
			if (!menuBody.classList.contains("_active")) {
				document.body.classList.remove('_lock');
			}
			formWrapper.classList.remove('_active');
		})
	}
	/*--------------------*/

	/*Показать форму при клике на ссылку 'Заполнить форму'*/
	let menuSubLinkForm = document.querySelector('.menu__sub-link_form');
	if (menuSubLinkForm) {
		menuSubLinkForm.parentElement.addEventListener("click", function (e) {
			document.body.classList.add('_lock');
			formWrapper.classList.add('_active');
			e.preventDefault();
		})
	}
	/*--------------------*/

	/*ВЫБОР ВОЗРАСТА В ФОРМЕ*/

	// Клик по кнопкам. Открыть/Закрыть select
	const changeAgeBtns = document.querySelectorAll('.changeAge__button');
	changeAgeBtns.forEach(function (changeAgeBtn) {
		changeAgeBtn.addEventListener('click', function (e) {
			this.nextElementSibling.classList.toggle('changeAge__list--visible');
			this.classList.add('changeAge__button--active');
		});
	})

	const changeAgeListNumber = document.querySelector('.changeAge__list-number');
	const changeAgeListMonth = document.querySelector('.changeAge__list-month');
	const changeAgeListYear = document.querySelector('.changeAge__list-year');

	const changeAgeInput = document.querySelector('.changeAge__input-hidden');

	// Наполняем changeAge__list-number цифрами от 1 до 32
	for (var i = 1; i < 32; i++) {
		changeAgeListNumber.insertAdjacentHTML('beforeend', `<li class="changeAge__list-item" data-value="${i}">${i}</li>`);
	}

	// Наполняем changeAge__list-month месяцами от Январь до Декабрь
	const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
	months.forEach(function (month) {
		changeAgeListMonth.insertAdjacentHTML('beforeend', `<li class="changeAge__list-item" data-value="${month}">${month}</li>`);
	})

	// Наполняем changeAge__list-year цифрами от 1940 до 2007
	for (var i = 1940; i < 2007; i++) {
		changeAgeListYear.insertAdjacentHTML('beforeend', `<li class="changeAge__list-item" data-value="${i}">${i}</li>`);
	}

	// Выбор элемента списка. Запомнить выбранное значение. Закрыть дропдаун
	const changeAgeListItems = document.querySelectorAll('.changeAge__list-item');
	changeAgeListItems.forEach(function (listItem) {
		listItem.addEventListener('click', function (e) {
			e.stopPropagation();
			let listItemParentElement = listItem.parentElement;
			let btnActive = listItemParentElement.previousElementSibling;
			let btnActiveDataSet = btnActive.dataset.btntext;
			btnActive.innerText = btnActiveDataSet + this.innerText;
			btnActive.focus();
			listItemParentElement.value = this.dataset.value;
			listItemParentElement.classList.remove('changeAge__list--visible');
		});
	});

	// Клик снаружи changeAge__list. Закрыть changeAge__list
	document.addEventListener("click", function (e) {
		let changeAgeButtonActive = [...document.querySelectorAll(".changeAge__button--active")];

		changeAgeButtonActive.forEach((elem) => {
			if (e.target !== elem) {
				elem.classList.remove("changeAge__button--active");
				elem.nextElementSibling.classList.remove("changeAge__list--visible");
			}
		});
	});

	// Нажатие на Tab или Escape. Закрыть changeAge__list
	/*document.addEventListener('keydown', function (e) {
		if (e.key === 'Tab' || e.key === 'Escape') {
			changeAgeBtn.classList.remove('changeAge__button--active');
			changeAgeList.classList.remove('changeAge__list--visible');
		}
	});*/
	/*--------------------*/

	/*Отправка формы*/

	const form = document.getElementById('form');
	form.addEventListener('submit', formSend);

	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);

		let formData = new FormData(form);
		formData.append('image', formImage.files[0]);

		if (error === 0) {
			form.classList.add('_sending');
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				alert(result.message);
				formPreview.innerHTML = '';
				form.reset();
				form.classList.remove('_sending');
			} else {
				alert("Ошибка");
				form.classList.remove('_sending');
			}
		} else {
			alert('Заполните обязательные поля');
		}

	}


	function formValidate(form) {
		let error = 0;
		let formReq = document.querySelectorAll('._req');

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			} else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
				formAddError(input);
				error++;
			} else {
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}
		return error;
	}
	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
	}
	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	}
	//Функция теста email
	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}

	//Получаем инпут file в переменную
	const formImage = document.getElementById('formImage');
	//Получаем див для превью в переменную
	const formPreview = document.getElementById('formPreview');

	//Слушаем изменения в инпуте file
	formImage.addEventListener('change', () => {
		uploadFile(formImage.files[0]);
	});

	function uploadFile(file) {
		// провераяем тип файла
		if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
			alert('Разрешены только изображения.');
			formImage.value = '';
			return;
		}
		// проверим размер файла (<2 Мб)
		if (file.size > 2 * 1024 * 1024) {
			alert('Файл должен быть менее 2 МБ.');
			return;
		}

		var reader = new FileReader();
		reader.onload = function (e) {
			formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
		};
		reader.onerror = function (e) {
			alert('Ошибка');
		};
		reader.readAsDataURL(file);
	}
});

/*----------------*/


// HEADER

const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}
};

if (isMobile.any()) {
	document.body.classList.add('_touch');

	let menuArrows = document.querySelectorAll('.menu__arrow');

	document.addEventListener("click", function (event) {
		if (event.target.classList.contains("_active") || event.target.closest(".menu__arrow")) {
			return;
		}
		menuArrows.forEach((element) => {
			element.parentElement.classList.remove("_active");
		});
	});

	if (menuArrows.length > 0) {
		for (let index = 0; index < menuArrows.length; index++) {
			const menuArrow = menuArrows[index];
			menuArrow.parentElement.addEventListener("click", function (e) {
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}
} else {
	document.body.classList.add('_pc');
}


// Меню бургер
const pseudoBackground = document.querySelector('.pseudoBackground');
const iconMenu = document.querySelector('.menu__icon');

if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
		pseudoBackground.classList.toggle('_active');
	});
}

// Появление BackGround у Header при скролле и Lazy Loading для карты (#map)

const header = document.querySelector('.header');
const chooseDirection = document.querySelector('.chooseDirection');
let flagMap = 0;

window.addEventListener('scroll', function () {
	// Появление BackGround у Header
	if (chooseDirection.getBoundingClientRect().top <= 70) {
		header.classList.add('_activeBackground');
	} else {
		header.classList.remove('_activeBackground');
	}


	// Lazy Loading для карты

	let scrollY = window.scrollY;
	let mapOffset = document.querySelector("#map").offsetTop;

	if ((scrollY >= mapOffset - 500) && (flagMap == 0)) {
		ymaps.ready(function () {
			var myMap = new ymaps.Map('map', {
				center: [45.226950, 34.526190],
				zoom: 8,
				behaviors: ['default', 'scrollZoom']
			}, {
				// Будет производиться поиск по топонимам и организациям.
				searchControlProvider: 'yandex#search'
			}),

				clusterer = new ymaps.Clusterer({

					preset: 'islands#invertedBlackClusterIcons', // Стиль для кластеров
					// Ставим true, если хотим кластеризовать только точки с одинаковыми координатами
					groupByCoordinates: false,
					gridSize: 80,
					clusterDisableClickZoom: true,        // Флаг, запрещающий увеличение коэффициента масштабирования карты при клике на кластер.
					clusterHideIconOnBalloonOpen: false,  // Скрывать иконку при открытии балуна.
					geoObjectHideIconOnBalloonOpen: false
				}),

				getPointData = function (index) {
					return {
						balloonContentHeader: '<font size=3><b><a target="_blank" href="https://yandex.ru">Здесь может быть ваша ссылка</a></b></font>',
						balloonContentBody: '<p>Ваше имя: <input name="login"></p><p>Телефон в формате 2xxx-xxx:  <input></p><p><input type="submit" value="Отправить"></p>',
						balloonContentFooter: '<font size=1>Информация предоставлена: </font> балуном <strong>метки ' + index + '</strong>',
						clusterCaption: 'метка <strong>' + index + '</strong>'
					};
				},

				getPointOptions = function () {
					return {
						preset: 'islands#darkGreenIcon'  // Стиль для меток
					};
				},
				points = [
					[44.947650, 34.113792], [44.613938, 33.520264], [45.200937, 33.401037], [45.052646, 34.617760], [45.711450, 34.400498], [45.303109, 36.498118], [44.851222, 34.976211], [44.507751, 33.599407], [45.959582, 33.795236], [44.500654, 34.162130], [44.674838, 34.412466], [44.422374, 34.051479], [45.058490, 35.377599], [45.362867, 36.368114], [45.128824, 33.596920]
				],
				geoObjects = [];

			for (var i = 0, len = points.length; i < len; i++) {
				geoObjects[i] = new ymaps.Placemark(points[i], getPointData(i), getPointOptions());
			}

			// Можно менять опции кластеризатора после создания.

			// clusterer.options.set({
			// 	clusterDisableClickZoom: true
			// });

			clusterer.add(geoObjects);       // Добавляем геообъект или массив геообъектов в кластеризатор
			myMap.geoObjects.add(clusterer);

			myMap.setBounds(clusterer.getBounds(), {  // Спозиционируем карту так, чтобы на ней были видны все объекты.
				checkZoomRange: true
			});
		});

		flagMap = 1;
	}
});


// Прокрутка при клике

const menuLinks = document.querySelectorAll('.menu__link[data-goto], .menu__sub-link[data-goto]');
const east = document.querySelector('.east');
const west = document.querySelector('.west');
const sliderSwiper = document.querySelector('.sliderSwiper');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.parentElement.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {

		let menuLink = e.target;
		if (!menuLink.hasAttribute('data-goto')) {
			menuLink = menuLink.firstChild;
		}
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) { // Здесь мы проверяем заполнен ли data-goto атрибут и проверяем существует ли обьект на который ссылается данный data-goto атрибут
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			let gotoBlockValue;
			if (gotoBlock == east || gotoBlock == west || gotoBlock == sliderSwiper) {
				gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;
			} else {
				gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - 50;
			}

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lock');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
				pseudoBackground.classList.remove('_active');
			}

			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}

// Parallax

// ждём загрузку контента
window.onload = function () {

	const parallaxLabel = document.querySelector('.parallax__label');
	const parallaxTitle = document.querySelector('.parallax__title');

	const preloader = document.getElementById('page-preloader');
	if (!preloader.classList.contains('done')) {
		preloader.classList.add('done');
		document.body.classList.remove('_lock');
		header.style.top = "0";
		parallaxLabel.style.opacity = "1";
		parallaxTitle.style.opacity = "1";
	}

	// -------------------------------------------------------------------


	const parallax = document.querySelector('.parallax');
	if (parallax) {
		const content = document.querySelector('.parallax__container');
		const mountains = document.querySelector('.images-parallax__mountains');

		// Коэффициенты
		const forMountains = 20;

		// Скорость анимации (МОЖНО МЕНЯТЬ)
		const speed = 0.05;

		// Объявление переменных
		let positionX = 0, positionY = 0;
		let coordXprocent = 0, coordYprocent = 0;

		// Отвечает за анимацию движений обьектов при изменении положения курсора мыши
		function setMouseParallaxStyle() {
			const distX = coordXprocent - positionX; // константа будет соотв-ть разницы положения
			const distY = coordYprocent - positionY; // positionX, positionY это текушее положение обьекта, потом отправятся в CSS

			positionX = positionX + (distX * speed);
			positionY = positionY + (distY * speed);

			// Передаём стили
			mountains.style.cssText = `transform: translate(${positionX / forMountains}%,${positionY / forMountains}%);`;

			requestAnimationFrame(setMouseParallaxStyle);
		}
		setMouseParallaxStyle();

		parallax.addEventListener("mousemove", function (e) {
			// Получаем ширины и высоты блока
			const parallaxWidth = parallax.offsetWidth;
			const parallaxHeight = parallax.offsetHeight;

			// Ноль по середине
			const coordX = e.pageX - parallaxWidth / 2;
			const coordY = e.pageY - parallaxHeight / 2;

			// Получаем проценты
			coordXprocent = coordX / parallaxWidth * 100;
			coordYprocent = coordY / parallaxHeight * 100;
		});

		// Параллакс при скролле

		let thresholdSets = [];
		for (let i = 0; i <= 1.0; i += 0.005) {
			thresholdSets.push(i);
		}
		const callback = function (entries, observer) {
			const scrollTopProcent = window.pageYOffset / parallax.offsetHeight * 100;
			setParallaxItemsStyle(scrollTopProcent);
		};
		const observer = new IntersectionObserver(callback, {
			threshold: thresholdSets
		});

		observer.observe(document.querySelector('.chooseDirection'));

		const imagesParallaxItem = document.querySelector('.images-parallax__item');

		let currentOpacity = Number(
			window.getComputedStyle(imagesParallaxItem).opacity
		);

		function setParallaxItemsStyle(scrollTopProcent) {
			content.style.cssText = `transform: translate(0%,-${scrollTopProcent / 5}%);`;  // Цыфра это скрость движения
			mountains.parentElement.style.cssText = `transform: translate(0%,-${scrollTopProcent / 6}%);`;  // Цыфра это скрость движения

			let nextOpacityValue = (70 - scrollTopProcent) / 100;
			if (nextOpacityValue > currentOpacity) return;
			imagesParallaxItem.style.opacity = nextOpacityValue;
		}
	}
}


// Слайдер

const btnWrapper = document.querySelector('.btn_wrapper');
const eastSliderWrapper = document.querySelector('.east__slider-wrapper');
const sliderControlBack = document.querySelector('.slider__control-back');
const parallaxImages = document.querySelector('.parallax__images');


// let unlock = true;
const timeout = 700;

if (eastSliderWrapper) {
	btnWrapper.addEventListener("click", function (e) {
		eastSliderWrapper.classList.add('_active');
		eastSliderWrapper.style.visibility = "visible";
		eastSliderWrapper.style.opacity = "1";
		bodyLock();
	})
}
if (sliderControlBack) {
	sliderControlBack.addEventListener("click", function (e) {
		eastSliderWrapper.classList.remove('_active');
		bodyUnLock();
	})
}


function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
	const headerWidth = window.innerWidth - parseFloat(lockPaddingValue) + 'px';
	header.style.width = headerWidth;
	document.body.style.paddingRight = lockPaddingValue;
	parallaxImages.style.backgroundColor = "#333";
	document.body.classList.add('_lock');

	// unlock = false;
	// setTimeout(function () {
	// 	unlock = true;
	// }, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		document.body.classList.remove('_lock');
		parallaxImages.style.backgroundColor = "#000";
		document.body.style.paddingRight = "0px";
		eastSliderWrapper.style.visibility = "hidden";
		eastSliderWrapper.style.opacity = "0";
		header.style.width = "100%";
	}, timeout);

	// unlock = false;
	// setTimeout(function () {
	// 	unlock = true;
	// }, timeout);
}


// ДИНАМИЧЕСКИЙ АДАПТИВ

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");
	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();



// Фото - Слайдер

(function () {
	var $slides = document.querySelectorAll('.slide');
	var $controls = document.querySelectorAll('.slider__control');
	var numOfSlides = $slides.length;
	var slidingAT = 1300; // sync this with scss variable
	var slidingBlocked = false;

	[].slice.call($slides).forEach(function ($el, index) {
		var i = index + 1;
		$el.classList.add('slide-' + i);
		$el.dataset.slide = i;
	});

	[].slice.call($controls).forEach(function ($el) {
		$el.addEventListener('click', controlClickHandler);
	});

	function controlClickHandler(event) {
		if (slidingBlocked) return;
		slidingBlocked = true;
		var $control = this;
		//Подсвечивание кнопки на touchScreen
		if ($control.classList.contains('slider__control')) {
			$control.style.backgroundColor = '#2da6ff';
			setTimeout(() => $control.style.backgroundColor = '', 200);
		}
		/*---------------*/
		var isRight = $control.classList.contains('m--right');
		var $curActive = document.querySelector('.slide.s--active');
		var index = +$curActive.dataset.slide;
		(isRight) ? index++ : index--;
		if (index < 1) index = numOfSlides;
		if (index > numOfSlides) index = 1;
		var $newActive = document.querySelector('.slide-' + index);

		$control.classList.add('a--rotation');
		$curActive.classList.remove('s--active', 's--active-prev');
		document.querySelector('.slide.s--prev').classList.remove('s--prev');

		$newActive.classList.add('s--active');
		if (!isRight) $newActive.classList.add('s--active-prev');


		var prevIndex = index - 1;
		if (prevIndex < 1) prevIndex = numOfSlides;

		document.querySelector('.slide-' + prevIndex).classList.add('s--prev');

		setTimeout(function () {
			$control.classList.remove('a--rotation');
			slidingBlocked = false;
		}, slidingAT * 0.75);
	};
}());


// Спойлер-аккордеон

const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	//Получение обычных спойлеров
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});
	//Инициализация обычных спойлеров
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}
	//Получение спойлеров с медиа запросами
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(",")[0];
	});

	//Инициализация спойлеров с медиа запросами
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		//Получаем уникальные брейкпоинты
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		//Работаем с каждым брейкпоинтом
		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			//Объекты с нужными условиями
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});
			//Событие
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	//Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	//Работаем с контентом
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}


//SlideToggle
let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

// --------------------



// SWIPER

const sliderSwiperRow = document.querySelector(".sliderSwiper__row");
let autoplayIsDisabled = false;
let isInit = false;

const sliderSwiperColumnImage = document.querySelector(".sliderSwiper__column-image");
const sliderSwiperColumnText = document.querySelector(".sliderSwiper__column-text");

// Инициализируем Swiper-Image
let myImageSlider = new Swiper('.sliderSwiper__column-body', {
	// Стрелки
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev'
	},
	// Навигация 
	// Буллеты, текущее положение, прогрессбар
	pagination: {
		el: '.swiper-pagination',

		// Буллеты
		type: 'bullets',
		clickable: false,
		// Динамические буллеты
		dynamicBullets: true,
		// Кастомные буллеты
		renderBullet: function (index, className) {
			return '<span class="' + className + '">' + (index + 1) + '</span>';
		}
	},

	// Включение/отключение
	// перетаскивания на ПК
	simulateTouch: false,
	// Чувствительность свайпа
	touchRatio: 1,
	// Угол срабатывания свайпа/перетаскивания
	touchAngle: 45,
	// Курсор перетаскивания будет выглядеть как рука
	grabCursor: false,

	// Переключение при клике на слайд
	slideToClickedSlide: false,

	// Навигация по хешу
	hashNavigation: {
		// Отслеживать состояние
		watchState: true,
	},

	// Управление клавиатурой
	keyboard: {
		// Включить\выключить
		enabled: true,
		// Включить\выключить
		// только когда слайдер
		// в пределах вьюпорта
		onlyInViewport: true,
		// Включить\выключить
		// управление клавишами
		// pageUp, pageDown
		pageUpDown: true,
	},

	// Управление колесом мыши
	mousewheel: {
		// Чувствительность колеса мыши
		sensitivity: 1,
		// Класс объекта на котором
		// будет срабатывать прокрутка мышью.
		//eventsTarget: ".image-slider"
	},

	// Автовысота. Высота всего слайдера будет подстраиватся под высоту картинок(это если картинки не в родителе, по этому пусть всегда будет false)
	autoHeight: false,

	// Количество слайдов для показа
	slidesPerView: 1,

	// Отключение функционала
	// если слайдов меньше чем нужно
	watchOverflow: false,

	// Отступ между слайдами
	spaceBetween: 0,

	// Количество пролистываемых слайдов
	slidesPerGroup: 1,

	// Активный слайд по центру
	centeredSlides: false,

	// Стартовый слайд. Слайд который будет отображатся первым
	initialSlide: 0,

	// Мультирядность
	slidesPerColumn: 1,

	// Бесконечный слайдер. Не будет работать с Мультирядностью и со скроллом
	loop: true,

	// Кол-во дублирующих слайдов
	loopedSlides: 0,

	// Свободный режим. Свайпаем слайд как ленту
	freeMode: false,

	// Автопрокрутка

	autoplay: {
		// Пауза между прокруткой
		delay: 5000,
		// Закончить на последнем слайде
		stopOnLastSlide: false,
		// Отключить после ручного переключения
		disableOnInteraction: true
	},

	on: {
		afterInit() {
			isInit = true;

		},
		activeIndexChange(ctx) {
			// когда запускается swiper autoplay.running === true, т.е. показывает что autoplay запущен. дальше когда при ховере выполняем autoplay.stop() значение флага autoplay.running переходит в положение false. Что указывает на то, что autoplay отключен. Т.е. при переключении слайда если autoplay.running === false мы понимаем что переключение произошло не в следствии autoplay а в ручную.
			if (!ctx.autoplay.running && isInit) {
				autoplayIsDisabled = true;
			}
		}
	},

	// Скорость
	speed: 800,

	// Вертикальный слайдер
	direction: 'horizontal',

	// Эффекты переключения слайдов.
	// Листание
	// effect: 'slide',

	// Эффекты переключения слайдов.
	// Куб
	effect: 'cube',

	// Дополнение к cube
	cubeEffect: {
		// Настройки тени
		slideShadows: true,
		shadow: true,
		shadowOffset: 40,
		shadowScale: 1
	},

	/*
	// Брейк поинты (адаптив)
	// Соотношение сторон
	breakpoints: {
		'@0.75': {
			slidesPerView: 1,
		},
		'@1.00': {
			slidesPerView: 2,
		},
		'@1.50': {
			slidesPerView: 3,
		}
	},
	*/
	// lazy: true,
	// Отключить предзагрузка картинок
	// preloadImages: false,
	// Lazy Loading
	// (подгрузка картинок)
	// lazy: {
	// Подгружать на старте
	// переключения слайда
	// loadOnTransitionStart: true,
	// Подгрузить предыдущую
	// и следующую картинки
	// loadPrevNext: false,
	// },
	// включать эти настроики стоит когда slidesPerView равно auto или больше 1
	// Слежка за видимыми слайдами
	watchSlidesProgress: true,
	// Добавление класса видимым слайдам
	watchSlidesVisibility: true,

	// Передача управления
	// controller: {
	// 	control: myTextSlider
	// },

	// Обновить свайпер
	// при изменении элементов слайдера
	observer: false,

	// Обновить свайпер
	// при изменении родительских
	// элементов слайдера
	observeParents: true,

	// Обновить свайпер
	// при изменении дочерних
	// элементов слайда
	observeSlideChildren: true
});

// Отключаем автопрокрутку при наведении

function onMouseLeave() {
	if (autoplayIsDisabled) {
		sliderSwiperRow.removeEventListener("mouseenter", onMouseEnter);
		sliderSwiperRow.removeEventListener("mouseleave", onMouseLeave);

		return;
	}

	myImageSlider.autoplay.start();
}

function onMouseEnter() {
	myImageSlider.autoplay.stop();
}

sliderSwiperRow.addEventListener("mouseenter", onMouseEnter);
sliderSwiperRow.addEventListener("mouseleave", onMouseLeave);


// Инициализируем Swiper-Text
let myTextSlider = new Swiper('.sliderSwiper__column-body-text', {

	// lazy: true,
	// Включение/отключение
	// перетаскивания на ПК
	simulateTouch: false,
	// Чувствительность свайпа
	touchRatio: 1,
	// Угол срабатывания свайпа/перетаскивания
	touchAngle: 45,
	// Курсор перетаскивания будет выглядеть как рука
	grabCursor: false,

	// Переключение при клике на слайд
	slideToClickedSlide: false,

	// Автовысота. Высота всего слайдера будет подстраиватся под высоту картинок(это если картинки не в родителе, по этому пусть всегда будет false)
	autoHeight: false,

	// Количество слайдов для показа
	slidesPerView: 1,

	// Отключение функционала
	// если слайдов меньше чем нужно
	watchOverflow: true,

	// Отступ между слайдами
	spaceBetween: 0,

	// Количество пролистываемых слайдов
	slidesPerGroup: 1,

	// Активный слайд по центру
	centeredSlides: false,

	// Стартовый слайд. Слайд который будет отображатся первым
	initialSlide: 0,

	// Мультирядность
	slidesPerColumn: 1,

	// Бесконечный слайдер. Не будет работать с Мультирядностью и со скроллом
	loop: true,

	// Кол-во дублирующих слайдов
	loopedSlides: 0,

	// Свободный режим. Свайпаем слайд как ленту
	freeMode: false,

	// Скорость
	speed: 800,

	// Вертикальный слайдер
	direction: 'vertical',

	// Эффекты переключения слайдов.
	// Листание
	effect: 'slide',

	/*
	// Брейк поинты (адаптив)
	// Соотношение сторон
	breakpoints: {
		'@0.75': {
			slidesPerView: 1,
		},
		'@1.00': {
			slidesPerView: 2,
		},
		'@1.50': {
			slidesPerView: 3,
		}
	},

	*/

	controller: {
		control: myImageSlider
	},

	// Обновить свайпер
	// при изменении элементов слайдера
	observer: true,

	// Обновить свайпер
	// при изменении родительских
	// элементов слайдера
	observeParents: true,

	// Обновить свайпер
	// при изменении дочерних
	// элементов слайда
	observeSlideChildren: true,

	// На разрешении менее 700px отключает возмозможность свайпать(перелистывать слайдер с помощью свайпа), но сохраняет возможность скролить пальцем в блоке где много текста.
	allowTouchMove: false,
	breakpoints: {
		700: {
			allowTouchMove: true,
		},
	},
});


myImageSlider.controller.control = myTextSlider;
myTextSlider.controller.control = myImageSlider;



alert(333);