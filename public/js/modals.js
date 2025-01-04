const windowPhot = document.getElementById('windowPhot')
function ativeWindowPhoto(){
    windowPhot.classList.add('ativeWindowPhoto')
}
windowPhot.addEventListener('click', (element) => {
    if(element.target.id === 'closeCustomPhot' || element.target.id === 'windowPhot'){
        windowPhot.classList.remove('ativeWindowPhoto')
    }
})