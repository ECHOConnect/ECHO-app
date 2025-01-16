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
