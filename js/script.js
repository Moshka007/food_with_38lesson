window.addEventListener('DOMContentLoaded', () => {
//--------------------------------------------------------------------------tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
          parentTabs = document.querySelector('.tabheader__items'),
          tabContent = document.querySelectorAll('.tabcontent');

    const hideTabContent = () => {                                  // скрываем все контенты табов
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });

        tabContent.forEach(item => {                                
            item.style.display = 'none';
        });
    };

    const showTabContent = (i = 0) => {                              // показываем контент определенного таба
        tabs[i].classList.add('tabheader__item_active');
        tabContent[i].style.display = 'block';
    };

    hideTabContent();
    showTabContent();                                                 // открывается дефолтный таб(1-ый)

    parentTabs.addEventListener('click', event => {   // при нажатии таб показывается его контент(делегирование событий)
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

    function getTime(deadLine) {                                    // считает разницу во времени(дедлайн-сейчас)
        const t = Date.parse(deadLine) - Date.parse(new Date()),
          days = Math.floor(t/(1000 * 60 * 60 * 24)),
          hours =  Math.floor((t / (1000 * 60 * 60)) % 24),
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
    
    function addZero(num) {                         // если число однозначное, то добавляет перед ним 0
        if (num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setTime(selector) {                                // устанавливает время на таймере на сайте
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              indInt = setInterval(updateTime, 1000);
              
        updateTime();

        function updateTime() {                                 // обновляет время и устанавливает его
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


