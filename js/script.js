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
        modal = document.querySelector('.modal');

    function openModalF() {
        modal.classList.remove('hide');
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // при появлении мадольного окна, осн страницу нельзя скролить
        clearInterval(openModalTimeout);  // если пользователь открыл вручную, то окно не открывается(seTimeout)
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

    modal.addEventListener('click', (event) => { // при нажатии вне формы, окно закрывается
        if (event.target === modal || event.target.getAttribute('data-close') == "") {
            modalCloseF(modal);
        }
    });

    document.addEventListener('keydown', (e) => { // при нажатии на 'esc' закрывается мод окно
        if (e.code === "Escape" && modal.classList.contains('show')) {
            modalCloseF(modal);
        }
    });

    const openModalTimeout = setTimeout(openModalF, 500000);   

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

    // const getResource = async (url) => { 
    //     const res = await fetch(url);               // GET method

    //     if (!res.ok) {
    //         throw new Error(`Не удалось получить данные от сервера ${url}! Ошибка:${res.status}.`);
    //     }                                    // создание ошибки вручную(если есть ошибка клиента, сервера или др)
        
    //     return await res.json();                    //возвращает промисы
    // };

    //getResource('http://localhost:3000/menu') //используется axios вместо этой функции

    axios.get('http://localhost:3000/menu')
    .then(data => {
        data.data.forEach(({img, altimg, title, descr, price}) => {  // {} - деструктуризация обьекта
            new MenuItems(img, altimg, title, descr, price, '[data-menu]').render();
        });
    });


    // getResource('http://localhost:3000/menu')   --создание эл страницы без конструктора
    // .then(data => createCard(data));            -- исп, если нужно создать отдельный обьект(без шаблонизации)
    
    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const div = document.createElement('div');
    //         div.classList.add('menu__item');

    //         div.innerHTML =  `
    //         <img src="${img}" alt="${altimg}">
    //         <h3 class="menu__item-subtitle">${title}</h3>
    //         <div class="menu__item-descr">${descr}</div>
    //         <div class="menu__item-divider"></div>
    //         <div class="menu__item-price">
    //             <div class="menu__item-cost">Цена:</div>
    //             <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //         </div>;
    //         `;

    //         document.querySelector('[data-menu]').append(div);

    //     });
    // }
    
    //--------------------------------------------Send to backEnd

    const forms = document.querySelectorAll('form');

    const massage = {
        loading: 'img/modal/spinner.svg',
        success: 'Спасибо! Скоро с вами свяжемся',
        failure: 'Что-то пошло не так'
    };

    forms.forEach(item => {
        bindPostData(item);
     });

    const postData = async (url, data) => { // для общения с сервером создаем отдельную функцию(async/await)
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        if(!res.ok) {
            throw new Error(`Не удалось отправить данные на сервер ${url}! Ошибка: ${res.status}`);
        }

        return await res.json(); //возвращает промисы
    };



    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let massDiv = document.createElement('img');
            massDiv.src = massage.loading;
            massDiv.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', massDiv);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries())); // из формдаты в JSON

            postData('http://localhost:3000/requests', json)
            .then(data => { // при успешной отправке выполнится эта функция
                console.log(data);
                    showThanksModal(massage.success);
                    massDiv.remove();
            }).catch(() => {            // при ошибке выполнится эта функция
                showThanksModal(massage.failure);
            }).finally( () => {         // в любом случае выполнится эта функция
                form.reset();
            });
        });
    }

    function showThanksModal(massage) {
        const modalDialog = document.querySelector('.modal__dialog');
        modalDialog.classList.add('hide');

        openModalF();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${massage}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            modalDialog.classList.add('show');
            modalDialog.classList.remove('hide');
            modalCloseF();
        }, 4000);
    }

    fetch('db.json')
        .then(data => data.json())
        .then(res => console.log(res));


    //---------------slider

    const slideImg = document.querySelectorAll('.offer__slide'),
          prev = document.querySelector('.offer__slider-prev'),
          next = document.querySelector('.offer__slider-next'),
          current = document.querySelector('#current'),
          total = document.querySelector('#total');
    let slideIndex = 0;

    function checkNum(num, el) { //если num от 1 до 9, то перед числом прибавляется 0 и выводится в el
        if (num + 1 < 10) {
            el.textContent = `0${num + 1}`;
        } else {
            el.textContent = num + 1;
        }
    }

    function showSlide(n) {
        if (n > slideImg.length - 1) {
            slideIndex = 0;
        } else if (n < 0) {
            slideIndex = slideImg.length - 1;
        }

        checkNum(slideIndex, current);

        slideImg.forEach(img => img.style.display = 'none');
        slideImg[slideIndex].style.display = '';
    }

    function plusShow(n) {
        showSlide(slideIndex += n);
    }

    showSlide(slideIndex); 

    checkNum(slideImg.length - 1, total);
    
   
    prev.addEventListener('click', () => {
        plusShow(-1);
    });

    next.addEventListener('click', () => {
        plusShow(1);
    });

    

});






// check!!!!

























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