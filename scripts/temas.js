const root = document.querySelector(':root');
const tema = document.querySelector('.btn-theme');

tema.onclick = () => {
    if (root.className.includes('dark')){
        root.classList.toggle('dark');
        tema.src = './assets/light-mode.svg';
        btnPrev.src = './assets/arrow-left-dark.svg';
        btnNext.src = './assets/arrow-right-dark.svg';
        return;
    }
    root.classList.toggle('dark');
    tema.src = './assets/dark-mode.svg';
    btnPrev.src = './assets/arrow-left-light.svg';
    btnNext.src = './assets/arrow-right-light.svg';
};