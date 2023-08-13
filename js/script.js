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

    //Реализация отправки данных на сервер(не работает!!). Нужен локальный сервер!!!
    const forms = document.querySelectorAll(".form");

    //Объект, в котором есть статусы обработки запроса к серверу
    const message = {
        loading: "img/form/spinner.svg",
        success: "Спасибо, скоро мы с вами свяжемся",
        failure: "Что-то пошло не так...",
    };

    //Подвязываем нашу функцию на каждую форму
    forms.forEach((form) => {
        postData(form);
    });

    function postData(form) {
        form.addEventListener("submit", (e) => {
            //Убираем стандартное поведение
            e.preventDefault();

            //Создание интерактивного элемента
            const statusMessage = document.createElement("img");

            //Добавляем в src нашу иконку загрузки
            statusMessage.src = message.loading;

            //Записываем в начале в наш div статут loading
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;

            //Помещаем ее ниже нашей формы
            form.insertAdjacentElement("afterend", statusMessage);

            //Создание запроса
            const request = new XMLHttpRequest();

            //Настраиваем запрос
            request.open("POST", "server.php");

            /*Заголовок в FormDate - устанавливать не нужно!!
            request.setRequestHeader("Content-type", "multipart/form-data");
            */

            //Разбор в формате JSON
            request.setRequestHeader("Content-type", "application/json");

            //Работа с FormData(input === name -> в верстке!)
            const formData = new FormData(form);

            //Создаем пустой объект, в который будут записываться наши введенные данные
            const obj = {};

            //Проходим через наш formData и записываем value и key в объект obj
            formData.forEach((value, key) => {
                obj[key] = value;
            });

            //Переделываем наш объект в формат JSON
            const json = JSON.stringify(obj);

            //Отправляем данные на сервер(он уже имеент body, т.к. POST-запрос)
            request.send(json);

            //Обработчик события на наш запрос
            request.addEventListener("load", () => {
                //Если статус нашего запроса будет 200 - успешно
                if (request.status === 200) {
                    console.log(request.response); // ответ в консоле

                    //Ответ о том, что все получилось
                    showThanksModal(message.success);

                    //Сброс формы
                    form.reset();

                    //Удаление блока через опр. кол-во времени
                    statusMessage.remove();
                } else {
                    //Ответ о том, что у нас что-то не получилось
                    showThanksModal(message.failure);
                }
            });
        });
    }

    //Создание интерактива в нашу форму
    function showThanksModal(message) {
        //Получение модального окна, его содержимого
        const prevModalDialog = document.querySelector(".modal__dialog");

        //Добавляем ему класс hide
        prevModalDialog.classList.add("hide");

        //Открытие модального окна
        openModal();

        //Создание div-элемента, который будет показываться после отправки данных на сервер
        const thanksModal = document.createElement("div");

        //Добавляем ему класс "modal__dialog"
        thanksModal.classList.add("modal__dialog");

        //Добавляем разметку на наш новый div с ответом
        thanksModal.innerHTML = `
        <div class = "modal__content">
            <div class = "modal__close" data-close>×</div>
            <div class = "modal__title">${message}</div>
        </div>  
        `;

        //Получаем наше модальное окно и помещаем наш новый элемент ниже модального окна
        document.querySelector(".modal").append(thanksModal);

        //Прописываем асинхронную операцию для обновления данных в нашей форме
        setTimeout(() => {
            //Удаление нашего элемента
            thanksModal.remove();

            //Добавление на наше модальное окно класс show
            prevModalDialog.classList.add("show");

            //Удаление с нашего модального окна класс hide
            prevModalDialog.classList.remove("hide");

            //Запуск функции closeModalWindow()
            closeModalWindow();
        }, 4000);
    }

    //Работа с Fetch API
    fetch("https://jsonplaceholder.typicode.com/todos/1")
        .then((response) => response.json())
        .then((json) => console.log(json));

});
