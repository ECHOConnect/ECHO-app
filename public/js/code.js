//Funcionalidades do forúm 
const containerMsgForum = document.getElementById('containerMsgForum')
function ativeChat(){
    containerMsgForum.classList.toggle('openChat')
}

//Funcionalidades de respostas do fórum
const resps = [...document.querySelectorAll('.resps')]
// btnOpen.addEventListener('click', (btn) => {
    
//     console.log(btn.target)
//     resps.forEach((element) => {
//         element.classList.toggle('ativeResps')
//     })
// })
function openResps(id){
    const respDiv = document.getElementById(`resp-${id}`)
    respDiv.classList.toggle('ativeResps')
}
