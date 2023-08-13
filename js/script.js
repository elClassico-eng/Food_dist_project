"use strict";
/*Пробема которые есть на момент 13.08
    1.Не работает выход из формы через крестик
    2.Не отслеживается отправка на back-end данные
    3.Не отслеживается верстка ответа от back-end пользователю
    4.Не отслеживается spinner в момент обработки и отправки данных на сервер
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
    // const modalTimerId = setTimeout(openModal, 6000);

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

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
        14,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        "Меню “Премиум”",
        "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!",
        21,
        ".menu .container"
    ).render();

    const forms = document.querySelectorAll("form");
    const message = {
        loading: "img/form/spinner.svg",
        success: "Спасибо! Скоро мы с вами свяжемся",
        failure: "Что-то пошло не так...",
    };

    forms.forEach((item) => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            let statusMessage = document.createElement("img");
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement("afterend", statusMessage);

            const request = new XMLHttpRequest();
            request.open("POST", "server.php");
            request.setRequestHeader(
                "Content-type",
                "application/json; charset=utf-8"
            );
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function (value, key) {
                object[key] = value;
            });
            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener("load", () => {
                if (request.status === 200) {
                    console.log(request.response);
                    showThanksModal(message.success);
                    statusMessage.remove();
                    form.reset();
                } else {
                    showThanksModal(message.failure);
                }
            });
        });
    }

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
            closeModal();
        }, 4000);
    }
});
