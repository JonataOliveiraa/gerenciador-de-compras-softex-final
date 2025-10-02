//Aside parte responsiva
const button = document.querySelector('#menu-aside-opener')
const aside = document.querySelector('aside')

button.addEventListener('click', () => {
    aside.classList.toggle('hidden')
})  