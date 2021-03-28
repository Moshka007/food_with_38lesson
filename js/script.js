window.addEventListener('DOMContentLoaded', () => {
    //--------------------------------------------------------------------------tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
        parentTabs = document.querySelector('.tabheader__items'),
        tabContent = document.querySelectorAll('.tabcontent');

    const hideTabContent = () => { // скрываем все контенты табов
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });

        tabContent.forEach(item => {
            item.style.display = 'none';
        });
    };

    const showTabContent = (i = 0) => { // показываем контент определенного таба
        tabs[i].classList.add('tabheader__item_active');
        tabContent[i].style.display = 'block';
    };

    hideTabContent();
    showTabContent(); // открывается дефолтный таб(1-ый)

    parentTabs.addEventListener('click', event => { // при нажатии таб показывается его контент(делегирование событий)
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //--------------------------------------------------------- Timer

    const deadLine = '2021-05-08';

    function getTime(deadLine) { // считает разницу во времени(дедлайн-сейчас)
        const t = Date.parse(deadLine) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            't': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function addZero(num) { // если число однозначное, то добавляет перед ним 0
        if (num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setTime(selector) { // устанавливает время на таймере на сайте
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            indInt = setInterval(updateTime, 1000);

        updateTime();

        function updateTime() { // обновляет время и устанавливает его
            const currentTime = getTime(deadLine);

            days.innerHTML = addZero(currentTime.days);
            hours.innerHTML = addZero(currentTime.hours);
            minutes.innerHTML = addZero(currentTime.minutes);
            seconds.innerHTML = addZero(currentTime.seconds);

            if (currentTime.t < 0) {
                clearInterval(indInt);
            }
        }
    }

    setTime('.timer');

    //----------------------------------------------------------------modal-window

    const btns = document.querySelectorAll('.call'),
        modal = document.querySelector('.modal'),
        modalClose = modal.querySelector('.modal__close');

    function openModalF() {
        modal.classList.remove('hide');
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // при появлении мадольного окна, осн страницу нельзя скролить
        //clearInterval(openModalTimeout);  // если пользователь открыл вручную, то окно не открывается(seTimeout)
    }
    btns.forEach(item => {
        item.addEventListener('click', openModalF);
    });

    function modalCloseF() {
        modal.classList.remove('show');
        modal.classList.add('hide');
        modal.style.display = 'none';
        document.body.style.overflow = ''; //  возвращение скрол
    }

    modalClose.addEventListener('click', () => {
        modalCloseF(modal);
    });

    modal.addEventListener('click', (event) => { // при нажатии вне формы, окно закрывается
        if (event.target === modal) {
            modalCloseF(modal);
        }
    });

    document.addEventListener('keydown', (e) => { // при нажатии на 'esc' закрывается мод окно
        if (e.code === "Escape" && modal.classList.contains('show')) {
            modalCloseF(modal);
        }
    });

    //const openModalTimeout = setTimeout(openModalF, 5000);   

    function openModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModalF();
            window.removeEventListener('scroll', openModalByScroll); //удаляет обработчик(окно при прокрутк откр один р)
        }
    }

    window.addEventListener('scroll', openModalByScroll);

    //---------------------------------------------ClassMenu

    class MenuItems {
        constructor(srcImg, altImg, title, description, price, parentSelector, ...classes) {
            this.srcImg = srcImg;
            this.altImg = altImg;
            this.title = title;
            this.description = description;
            this.price = price;
            this.classes = classes;
            this.dollarRate = 27;
            this.parentSelector = document.querySelector(parentSelector);
            this.USDtoUAH();
        }

        USDtoUAH() {
            this.price = this.price * this.dollarRate;
        }

        render() {
            const div = document.createElement('div');

            if (this.classes.length === 0) {    //если массив classes пустой, то задаем знач по умолчанию
                this.classes = 'menu__item';
                div.classList.add(this.classes);
            } else {
                this.classes.forEach(className => div.classList.add(className));
            }

            div.innerHTML = `
                <img src="${this.srcImg}" alt="${this.altImg}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>`;

            this.parentSelector.append(div);
        }
    }

    new MenuItems(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        15,
        '[data-menu]'
    ).render();

    new MenuItems(
        'img/tabs/elite.jpg',
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        20,
        '[data-menu]'
    ).render();

    new MenuItems(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        16,
        '[data-menu]'
    ).render();

    //--------------------------------------------Send to backEnd

    const forms = document.querySelectorAll('form');

    const massage = {
        loading: 'Загрузка',
        success: 'Спасибо! Скоро с вами свяжемся',
        failure: 'Что-то пошло не так'
    };

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const massDiv = document.createElement('div');
            massDiv.classList.add('status');
            massDiv.textContent = massage.loading;
            form.appendChild(massDiv);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-type', 'application/json;');

            const formData = new FormData(form);
            const obj = {};                         //-------из формдаты в JSON
            formData.forEach((value, key) => {
                obj[key] = value;
            });                                     //--------------------------

            const json = JSON.stringify(obj);
            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    massDiv.textContent = massage.success;
                    form.reset();
                    setTimeout(() => {
                        massDiv.remove();
                    }, 2000);
                } else {
                    massDiv.textContent = massage.failure;
                }
            });


        });
    }

    forms.forEach(item => {
        postData(item);
    });

    
});






























// window.addEventListener('DOMContentLoaded', () => {

//     const tabs = document.querySelectorAll('.tabheader__item'),
//           tabsContent = document.querySelectorAll('.tabcontent'),
//           tabsParent = document.querySelector('.tabheader__items');

//     function hideTabContent() {
//         tabsContent.forEach(item => {
//             item.classList.add('hide');
//             item.classList.remove('show', 'fade');
//         });

//         tabs.forEach(item => {
//             item.classList.remove('tabheader__item_active');
//         });
//     }

//     function showTabContent(i = 0) {
//         tabsContent[i].classList.add('show', 'fade');
//         tabsContent[i].classList.remove('hide');
//         tabs[i].classList.add('tabheader__item_active');
//     }

//     hideTabContent();
//     showTabContent();

//     tabsParent.addEventListener('click', (event) => {
//         const target = event.target;

//         if (target && target.classList.contains('tabheader__item')) {
//             tabs.forEach((item, i) => {
//                 if (target == item) {
//                     hideTabContent();
//                     showTabContent(i);
//                 }
//             });
//         }
//     });
// });

//timer

// const deadline = '2021-03-20';

// function getTimeRemaining(endtime) {
//     const t = Date.parse(endtime) - Date.parse(new Date()),
//           days = Math.floor(t / (1000 * 60 * 60 * 24)),
//           hours = Math.floor((t / 1000 * 60 *60) % 24),
//           minutes = Math.floor((t / 1000 / 60) % 60),
//           seconds = Math.floor((t / 1000) % 60);

//         return {
//             'total': t,
//             'days': days,
//             'hours': hours,
//             'minutes': minutes,
//             'seconds': seconds
//         };
// }

// function getZero(num) {
//     if (num >= 0 && num < 10) {
//         return `0${num}`;
//     } else {
//         return num;
//     }
// }

// function setClock(selector, endtime) {
//     const timer = document.querySelector(selector),
//           days = timer.querySelector('#days'),
//           hours = timer.querySelector('#hours'),
//           minutes = timer.querySelector('#minutes'),
//           seconds = timer.querySelector('#seconds'),
//           timeInterval = setInterval(updateClock, 1000);

//     updateClock();

//     function updateClock() {
//         const t = getTimeRemaining(endtime);

//         days.innerHTML = getZero(t.days);
//         hours.innerHTML = getZero(t.hours);
//         minutes.innerHTML = getZero(t.minutes);
//         seconds.innerHTML = getZero(t.seconds);

//         if(t.total < 0) {
//             clearInterval(timeInterval);
//         }
//     }


// }

// setClock('.timer', deadline);
// 