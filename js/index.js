"use strict";

// ждём загрузку контента
window.onload = function () {
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
			content.style.cssText = `transform: translate(0%,-${scrollTopProcent / 9}%);`;  // Цыфра это скрость движения
			mountains.parentElement.style.cssText = `transform: translate(0%,-${scrollTopProcent / 6}%);`;  // Цыфра это скрость движения

			let nextOpacityValue = (70 - scrollTopProcent) / 100;
			if (nextOpacityValue > currentOpacity) return;
			imagesParallaxItem.style.opacity = nextOpacityValue;
		}
	}
}


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
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
		pseudoBackground.classList.toggle('_active');
	});
}

// Появление BackGround у Header при скролле

const header = document.querySelector('.header');
const chooseDirection = document.querySelector('.chooseDirection');

window.addEventListener('scroll', headerBackgroundScroll);
function headerBackgroundScroll() {
	if (chooseDirection.getBoundingClientRect().top <= 70) {
		header.classList.add('_activeBackground');
	} else {
		header.classList.remove('_activeBackground');
	}
}





// Прокрутка при клике

const menuLinks = document.querySelectorAll('.menu__link[data-goto], .menu__sub-link[data-goto]');
const east = document.querySelector('.east');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.parentElement.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {

		let menuLink = e.target;
		if (!menuLink.hasAttribute('data-goto')) {
			menuLink = menuLink.firstChild;
		}
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			let gotoBlockValue;
			if (gotoBlock == east) {
				gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset + 50;
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

// Слайдер

const btnWrapper = document.querySelector('.btn_wrapper');
const eastSliderWrapper = document.querySelector('.east__slider-wrapper');
const sliderControlBack = document.querySelector('.slider__control-back');
if (eastSliderWrapper) {
	btnWrapper.addEventListener("click", function (e) {
		eastSliderWrapper.style.visibility = 'visible';
		eastSliderWrapper.classList.add('_active');
		document.body.classList.add('_lock');
	})
}
if (sliderControlBack) {
	sliderControlBack.addEventListener("click", function (e) {
		eastSliderWrapper.classList.remove('_active');
		document.body.classList.remove('_lock');
		setTimeout(() => eastSliderWrapper.style.visibility = "hidden", 1000);
	})
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

	function controlClickHandler() {
		if (slidingBlocked) return;
		slidingBlocked = true;

		var $control = this;
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


