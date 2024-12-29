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

//Funcionalidades de escolha de admin (forma temporária)
function verificar(element){
   console.log(element.value)
}

//Funcionalidade de janela de confirmação

function banConfirm(){
    const confirm = window.confirm('Tem certeza que deseja banir este usuário?')
    if(confirm){
        alert('Usuário banido com sucesso!')
    }
}

