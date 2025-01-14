
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
    // document.querySelectorAll('.likeIcon').forEach((like) => {
    //     like.addEventListener('click', () => {
    //         // Seleciona o contador relacionado ao botão clicado
    //         const likeCount = like.closest('.actionBtn').querySelector('.like-counts');
    //         like.classList.add('likeUp');
    //     });
    // });

//Funcionalidade de atualização de likes
addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.like').forEach((likeButtom) => {
        likeButtom.addEventListener('click', (e) => {
            const postId = likeButtom.id.replace('like-buttom-', '')
            fetch(`/user/like/${postId}`, {  // Alterado para o caminho correto da rota de like
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
            })
            .then((response) => response.json())  // Aguardar a resposta JSON
            .then((data) => {
                const likeCount = likeButtom.querySelector('.like-counts');
                if(likeCount) {
                    likeCount.textContent = data.likes;  // Atualiza o contador de likes
                    
                    //Efeito de like
                    const btnAnim = document.querySelectorAll('.likeIcon')
                    btnAnim.forEach(bt => bt.classList.toggle('likeUp'))
                }
            })
            .catch((error) => {
                console.log(`Erro ao adicionar/remover like, erro: ${error}`)
            })
        })
    })
})

//Funcionalidade ativar foto de perfil
document.getElementById('change-picture-btn').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('profilePicture', file);
  
      fetch('/upload-profile-picture', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            document.getElementById('profile-picture').src = data.user.profilePicture;
            alert(data.message);
          }
        })
        .catch((error) => console.error('Erro ao enviar a imagem:', error));
    };
  
    input.click();
  });

  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });