
//Funcionalidades do forúm 
const containerMsgForum = document.getElementById('containerMsgForum')
function ativeChat(){
    containerMsgForum.classList.toggle('openChat')
}

//Funcionalidades de respostas do fórum
const resps = [...document.querySelectorAll('.resps')]
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


//Funcionalidades de ativação de modal para edição de respostas
document.querySelectorAll('.editar-btn').forEach((buttom) => {
    buttom.addEventListener('click', (element) => {
        //Pegando dados do botão de editar
        const dataId = buttom.getAttribute('data-id')
        const conteudo = buttom.getAttribute('data-content')
        //Pegando dados do form
        document.getElementById('respostaId').value = dataId
        document.getElementById('conteudo').value = conteudo
        //Abrindo modal
        const windowEdit = document.getElementById('windowEditResp')
        windowEdit.classList.add('openModalResp')
        console.log(dataId, conteudo)

        const editResponses = document.getElementById('editResponses')
        editResponses.addEventListener('click', (element) =>  {
            if(element.target.id === 'closeModalEdit'){
               windowEdit.classList.remove('openModalResp')
            }
        })
    })
})

// Funcionalidades de estilo para posts
    // Likes
    document.querySelectorAll('.likeIcon').forEach((like) => {
        like.addEventListener('click', () => {
            // Seleciona o contador relacionado ao botão clicado
            const likeCount = like.closest('.actionBtn').querySelector('.like-counts');
            like.classList.add('likeUp');
            setTimeout(() => {
                like.classList.remove('likeUp')
            }, 500)
        });
    });

//Funcionalidade de atualização de likes
document.querySelectorAll('.like').forEach((likeButtom) => {
    likeButtom.addEventListener('click', () => {
        const postId = likeButtom.id.replace('like-buttom-', '')
        fetch(`/user/like/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type':'application-json',
            },
        })
        .then((response) => {
            response.json()
        })
        .then((data) => {
            const likeCount = document.querySelector('.like-counts')
            likeCount.textContent = data.msg === 'Like adicionado'
            ? parseInt(likeCount.textContent) + 1
            : parseInt(likeCount.textContent) - 1
        })
        .catch((error) => {
            console.log(`Erro ao adicionar/remover like, erro: ${error}`)
        })
    })
})