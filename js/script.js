"use strict";

// const { off } = require("process");

/*Пробема которые есть на момент 19.08
    1.Не работает выход из формы через крестик
    2.Создать технические функции, для работы со слайдером
*/

//Глобальный обработчик событий
window.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tabheader__item"), //получение всех табов(их название)
        tabsContent = document.querySelectorAll(".tabcontent"), // получение контента каждого таба
        tabsParent = document.querySelector(".tabheader__items"); // получение родителя табов

    //Скрытие всего контента табов
    function hideTabContent() {
        tabsContent.forEach((item) => {
            item.classList.add("hide"); // добавляем класс hide {display: none;}
            item.classList.remove("show", "fade"); // удаляем класс show {display: block;}
        });

        tabs.forEach((item) => {
            item.classList.remove("tabheader__item_active"); // удаление класса активности с таба
        });
    }

    //Показать контект таба
    function showTabContent(i = 0) {
        tabsContent[i].classList.add("show", "fade"); // добавляем класс show(см.14стр) и fade(анимация)
        tabsContent[i].classList.remove("hide"); // удаляем класс hide(см.13стр)
        tabs[i].classList.add("tabheader__item_active"); // добавляем класс активности на таб
    }

    hideTabContent();
    showTabContent();

    //Создание обработчика события при помощи делегирования на все дочерние элементы
    //prettier-ignore
    tabsParent.addEventListener("click",(event) => {
            const target = event.target; // элемент, в который мы кликнули

            //Проверка, чтобы мы кликнули именно на табы, а не на родителя
            if (target && target.classList.contains("tabheader__item")) {
                //перебираем NodeList с табами
                tabs.forEach((item, index) => {
                    // item-название табов, index - число
                    if (target == item) {
                        hideTabContent(); // все остальные,скрываем
                        showTabContent(index); // номер элемента, который совпал с условием(куда мы кликнули)
                    }
                });
            }
        }
    );

    //Создание таймера

    const deadline = "2023-08-12";

    //Получение разницы между датами
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()); // разница между конечным временем и временем сейчас в миллисекундах
        let days, hours, minutes, seconds;

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)); // сколько миллисекунд в сутках, чтобы получить кол-во дней
            hours = Math.floor((t / (1000 * 60 * 60)) % 24); // получение хвостика, чтобы было не больше 24 часов
            minutes = Math.floor((t / (1000 * 60)) % 60); // получение хвостика минут
            seconds = Math.floor((t / 1000) % 60); // получение хвостика секунд
        }

        return {
            total: t,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        };
    }

    //Функция, которая будет добавлять 0, к значению времени < 10
    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`; // получаем строку
        } else {
            return num;
        }
    }

    //Установка таймера на страницу
    function setClock(selector, endtime) {
        //Получение селекторов с html
        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector("#hours"),
            minutes = timer.querySelector("#minutes"),
            seconds = timer.querySelector("#seconds"),
            timeInterval = setInterval(updateClock, 1000);

        updateClock(); // функция инициализации времени на странице сразу

        //Функция обновления наших часов на странице
        function updateClock() {
            //const t - она возвращает объект, который мы возвращаем при помощи этой функции
            const t = getTimeRemaining(endtime); // в параменты передаем тот дедлайн

            //Записываем через innerHTML
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            //Если время уже вышло, то почисть setInterval()
            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    //Запускаем наши функции:
    setClock(".timer", deadline);

    //Создание модального окна
    const modalWindow = document.querySelector(".modal");
    const modalTrigger = document.querySelectorAll('[data-modal="open"]'); //NodeList

    //Проходим через NodeList с триггерами и вешаем на них обработчик события на открытие модального окна
    modalTrigger.forEach((btn) => {
        btn.addEventListener("click", openModal);
    });

    //Функция на появление модального окна
    function openModal() {
        modalWindow.classList.add("show");
        modalWindow.classList.remove("hide");
        document.body.style.overflow = "hidden"; //запрет на прокрутку страницы
        clearTimeout(modalTimerId); //очищение таймаута, если user сам нажал на модальное окно
    }

    //Функция на закрытие модального окна
    function closeModalWindow() {
        modalWindow.classList.toggle("show");
        modalWindow.classList.add("hide");
        document.body.style.overflow = "";
    }

    //Проверка, если User нажал не на модальное окно, то мы из него выходим
    modalWindow.addEventListener("click", (e) => {
        if (
            e.target === modalWindow ||
            e.target.getAttribute("data-close") == ""
        ) {
            closeModalWindow(modalWindow);
        }
    });

    //Выход из модального окна при помощи esc(кнопки с клавиатуры)
    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape" && modalWindow.classList.contains("show")) {
            closeModalWindow(modalWindow);
        }
    });

    //Появление модального окна через определенное время
    const modalTimerId = setTimeout(openModal, 600000);

    function showModalByScroll() {
        if (
            window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight
        ) {
            openModal(modalWindow);
            //Удаление обработчика события, чтобы событие выполнилось 1 раз
            window.removeEventListener("scroll", showModalByScroll);
        }
    }

    //Появление модального окна при пролистывании какой-то части страницы
    window.addEventListener("scroll", showModalByScroll);

    //Создание карточек

    class MenuCard {
        constructor(src, alt, title, description, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 69; //курс валют
            this.changeToRub();
        }

        changeToRub() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement("div");
            element.innerHTML = `
                <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.description}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                    </div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    //Функция, на получение данных из БД
    /*
    const getResource = async (url) => {
        
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fatch ${url}, status ${res.status}`);
        }

        return await res.json();
    };
    */

    //Библиотека Axios
    axios.get("http://localhost:3000/menu").then((data) => {
        data.data.forEach(({ img, altimg, title, descr, price }) => {
            new MenuCard(
                img,
                altimg,
                title,
                descr,
                price,
                ".menu .container"
            ).render();
        });
    });

    //Form
    const forms = document.querySelectorAll("form");
    const message = {
        loading: "img/form/spinner.svg",
        success: "Спасибо! Скоро мы с вами свяжемся",
        failure: "Что-то пошло не так...",
    };

    forms.forEach((item) => {
        bindPostData(item);
    });

    //Добавление данных  с формы в DB
    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: data,
        });

        return await res.json();
    };

    //Bind нашу BD в форму на странице
    function bindPostData(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let statusMessage = document.createElement("img");
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement("afterend", statusMessage);

            //Работа с FormData(input === name -> в верстке!)
            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData("http://localhost:3000/requests", json)
                .then((data) => {
                    console.log(data); // ответ в консоле
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                });
        });
    }

    //Создание интерактива в нашу форму
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector(".modal__dialog");

        prevModalDialog.classList.add("hide");
        openModal();
        const thanksModal = document.createElement("div");

        thanksModal.classList.add("modal__dialog");
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>  
        `;

        document.querySelector(".modal").append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add("show");
            prevModalDialog.classList.remove("hide");
            closeModalWindow();
        }, 4000);
    }

    //Работа с json-server
    fetch("http://localhost:3000/menu")
        .then((data) => data.json())
        .then((res) => console.log(res));

    //Slayder
    //1.Получение всех элементов, с которыми будем работать
    //2.Индекс, который определяет наш текущий слайд
    //3.Фукнция показа наших слайдов и скрытие других, которые мы не видим

    const sliderCounter = document.querySelector(".offer__slider-counter");
    const slider = document.querySelector(".offer__slider");
    const arrowPrevSlider = document.querySelector(".offer__slider-prev");
    const arrowNextSlider = document.querySelector(".offer__slider-next");
    const slideImg = Array.from(document.querySelectorAll(".offer__slide"));
    const currentSlide = document.querySelector("#current");
    const totalSlide = document.querySelector("#total");
    const slidesWrapper = document.querySelector(".offer__slider-wrapper");
    const slidesField = document.querySelector(".offer__slyder-inner");
    const width = window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    function replaceStr(str) {
        return +str.replace(/\D/g, "");
    }

    function showCounter(index) {
        currentSlide.textContent = getZero(index);
        totalSlide.textContent = getZero(slideImg.length);
    }

    if (slideImg.length < 10) {
        showCounter(slideIndex);
    } else {
        totalSlide.textContent = slideImg.length;
        currentSlide.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slideImg.length + "%";
    slidesField.style.display = "flex";
    slidesField.style.transition = "0.5s all";

    slidesWrapper.style.overflow = "hidden";

    slideImg.forEach((slide) => {
        slide.style.width = width;
    });

    slider.style.position = "relative";

    const indicators = document.createElement("ol");
    const dots = [];

    indicators.classList.add("carousel-indicators");
    slider.append(indicators);

    for (let i = 0; i < slideImg.length; i++) {
        const dot = document.createElement("li");
        dot.setAttribute("data-slide-to", i + 1);
        dot.classList.add("dot");

        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    arrowNextSlider.addEventListener("click", () => {
        if (offset == replaceStr(width) * (slideImg.length - 1)) {
            offset = 0;
        } else {
            offset += replaceStr(width);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slideImg.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slideImg.length < 10) {
            currentSlide.textContent = `${getZero(slideIndex)}`;
        } else {
            currentSlide.textContent = `${slideIndex}`;
        }

        dots.forEach((dot) => (dot.style.opacity = ".5"));
        dots[slideIndex - 1].style.opacity = 1;
    });

    arrowPrevSlider.addEventListener("click", () => {
        if (offset == 0) {
            offset = replaceStr(width) * (slideImg.length - 1);
        } else {
            offset -= replaceStr(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slideImg.length;
        } else {
            slideIndex--;
        }

        if (slideImg.length < 10) {
            currentSlide.textContent = `${getZero(slideIndex)}`;
        } else {
            currentSlide.textContent = `${slideIndex}`;
        }
        dots.forEach((dot) => (dot.style.opacity = ".5"));
        dots[slideIndex - 1].style.opacity = 1;
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
            const slideTo = e.target.getAttribute("data-slide-to");

            slideIndex.slideTo;
            offset = replaceStr(width) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slideImg.length < 10) {
                currentSlide.textContent = `${getZero(slideIndex)}`;
            } else {
                currentSlide.textContent = `${slideIndex}`;
            }

            dots.forEach((dot) => (dot.style.opacity = ".5"));
            dots[slideIndex - 1].style.opacity = 1;
        });
    });

    //Calc
    const result = document.querySelector(".calculating__result span");
    //prettier-ignore
    let sex, height, weight, age, ratio;

    LS();

    function LS() {
        if (localStorage.getItem("sex") && localStorage.getItem("ratio")) {
            sex = localStorage.getItem("sex");
            ratio = localStorage.getItem("ratio");
        } else {
            sex = "female";
            ratio = 1.375;
            localStorage.setItem("sex", "female");
            localStorage.setItem("ratio", 1.375);
        }
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach((elem) => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute("id") === localStorage.getItem("sex")) {
                elem.classList.add(activeClass);
            }
            if (
                elem.getAttribute("data-ratio") ===
                localStorage.getItem("ratio")
            ) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings("#gender div", "calculating__choose-item_active");
    //prettier-ignore
    initLocalSettings(".calculating__choose_big div","calculating__choose-item_active")

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = "?";
            return;
        }

        if (sex === "female") {
            //prettier-ignore
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio)
        } else {
            //prettier-ignore
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStatickInfo(selector, activeClass) {
        const element = document.querySelectorAll(selector);
        //prettier-ignore
        element.forEach((elem) => {
            elem.addEventListener("click", (e) => {
                if (e.target.getAttribute("data-ratio")) {
                    ratio = +e.target.getAttribute("data-ratio");
                    localStorage.setItem("ratio", +e.target.getAttribute("data-ratio"));
                } else {
                    sex = e.target.getAttribute("id");
                    localStorage.setItem("sex", e.target.getAttribute("id"));
                }

                element.forEach((elem) => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }
    getStatickInfo("#gender div", "calculating__choose-item_active");
    //prettier-ignore
    getStatickInfo(".calculating__choose_big div","calculating__choose-item_active");

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener("input", () => {
            if (input.value.match(/\D/g)) {
                input.style.border = "1px solid red";
            } else {
                input.style.border = "none";
            }

            switch (input.getAttribute("id")) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }

    getDynamicInfo("#weight");
    getDynamicInfo("#height");
    getDynamicInfo("#age");
});
