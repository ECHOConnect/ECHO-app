const windowPhot = document.getElementById('windowPhot')
function ativeWindowPhoto(){
    windowPhot.classList.add('ativeWindowPhoto')
}
windowPhot.addEventListener('click', (element) => {
    if(element.target.id === 'closeCustomPhot' || element.target.id === 'windowPhot'){
        windowPhot.classList.remove('ativeWindowPhoto')
    }
})
//Funcionalidade de biografia
const dataUser = document.getElementById('dataUser')
function ativeBio(){
    dataUser.classList.toggle('ativeBio')
}
//Funcionalidade de info de user
const cardProfile = document.getElementById('cardProfile')
function ativeInfoUser(){
    cardProfile.classList.add('ativeCardProfile')
}
cardProfile.addEventListener('click', (button) => {
    if(button.target.id === 'iconCloseProfile' || button.target.id === 'cardProfile'){
        cardProfile.classList.remove('ativeCardProfile')
    }
})