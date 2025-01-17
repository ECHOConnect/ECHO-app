function openComments(id){
    const BtnId = id.getAttribute('data-post-id')
    const comment = document.getElementById(`windowComments-${BtnId}`)
    comment.classList.add('ativeWindowComments')
}

function CloseComment(){
    const closeWindow = document.querySelectorAll('.windowComments')
    closeWindow.forEach(window => window.classList.remove('ativeWindowComments'))
}

//Curtir comentários de postagens do feed
addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.likeBtnComment').forEach((btnLike) => {
        btnLike.addEventListener('click', () => {
            //Extraindo o id do comentário
            const btnId = btnLike.id.replace('like-comment-', '')
            console.log(btnId)
            fetch(`/user/likeComment/${btnId}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            //Convertendo dados para json
            .then(response => response.json())
            .then((data) => {
                const likeCountsComment = btnLike.closest('.CommentStyle').querySelector('.quantLikes')
                if(likeCountsComment){
                    likeCountsComment.textContent = data.likeCount
                }
            })
            .catch((error) => {
                console.log(error)
            })
        })
    })
})

//Respostas de comentários de feed
function ativeRes(id){
    const idComment = id.getAttribute('data-id')
    const btnAtive = document.getElementById(`responsesArea-${idComment}`)
    btnAtive.classList.toggle('ativeAreaResponses')
}

//Área para visualizar respostas
function ativeArea(id) {
    const btnIdArea = id.getAttribute('data-id-Res')
    const areaRes = document.getElementById(`area-resp-${btnIdArea}`)
    areaRes.classList.toggle('ativeAreaResp')
}
