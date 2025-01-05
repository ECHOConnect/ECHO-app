const comment = document.getElementById('windowComments')
function openComments(){
    comment.classList.add('ativeWindowComments')
}
comment.addEventListener('click', (btn) => {
    if(btn.target.id === 'closeComments'){
        comment.classList.remove('ativeWindowComments')
    }
})