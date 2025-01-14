function openComments(id){
    const BtnId = id.getAttribute('data-post-id')
    const comment = document.getElementById(`windowComments-${BtnId}`)
    comment.classList.add('ativeWindowComments')
}


function CloseComment(){
    const closeWindow = document.querySelectorAll('.windowComments')
    closeWindow.forEach(window => window.classList.remove('ativeWindowComments'))
}
