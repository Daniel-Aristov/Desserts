document.addEventListener("DOMContentLoaded", onDOMReady);

function onDOMReady() {
    window.addEventListener('scroll', onWindowScroll)

    let menu = document.getElementById('navigation');
    let logo = document.getElementById('link_logo');

    function onWindowScroll() {
        if(window.document.scrollingElement.scrollTop > 100){
            menu.classList.add("fixed");
            menu.style.padding = '15px 0px';
            menu.style.zIndex = '1000';
            logo.style.display = 'none';
        }
        else {
            menu.classList.remove("fixed")
            menu.style.padding = '8px 0px';
            menu.style.zIndex = '1000';
            logo.style.display = 'block';
        }
    }
}

let popupBg = document.querySelector('.popup__bg');
let popup = document.querySelector('.popup'); 
let openPopupButtons = document.querySelectorAll('.open-popup'); 
let closePopupButton = document.querySelector('.close-popup'); 

openPopupButtons.forEach((button) => { 
    button.addEventListener('click', (e) => { 
        e.preventDefault(); 
        popupBg.classList.add('active'); 
        popup.classList.add('active'); 
    })
});

closePopupButton.addEventListener('click',() => { 
    popupBg.classList.remove('active'); 
    popup.classList.remove('active'); 
});

document.addEventListener('click', (e) => { 
    if(e.target === popupBg) { 
        popupBg.classList.remove('active'); 
        popup.classList.remove('active'); 
    }
});

let swiper = new Swiper(".cakesSwiper", {
	loop: true,
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
});
