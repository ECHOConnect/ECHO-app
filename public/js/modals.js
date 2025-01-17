const windowPhot = document.getElementById('windowPhot')
function ativeWindowPhoto(){
    windowPhot.classList.add('ativeWindowPhoto')
}
windowPhot.addEventListener('click', (element) => {
    if(element.target.id === 'closeCustomPhot' || element.target.id === 'windowPhot'){
        windowPhot.classList.remove('ativeWindowPhoto')
    }
})


//Funcionalidade de info de user
function ativeInfoUser(id){
    const btn = id.getAttribute('data-user')
    const cardProfile = document.getElementById(`cardProfile-${btn}`)
    cardProfile.classList.add('ativeCardProfile')
    console.log(id, cardProfile)
}
function closeInfoUser(){
    document.querySelectorAll('.cardProfile').forEach(window => window.classList.remove('ativeCardProfile'))
}

//Funcionalidade de janela de denúncia
const windowBan = document.getElementById('windowBan')
function openBan(){
    windowBan.classList.add('ativeWindowBan')
}
windowBan.addEventListener('click', (area) => {
    if(area.target.id === 'windowBan'){
        windowBan.classList.remove('ativeWindowBan')
    }
})
const ban = document.getElementById('selectBan')
ban.addEventListener('change', (element) => {
    console.log(element.target.value)
    if(element.target.value === 'Outro'){
        document.getElementById('textOther').classList.remove('d-none')
    }
    else{
        document.getElementById('textOther').classList.add('d-none')
    }
})

//Janela modal de perfil de usuário

function ativeProfileUserTools(){
    const window = document.getElementById('window-profile-user-tools')
    window.classList.add('active-window-profile-tools')
}

function closeWindowProfileToos(){
    const window = document.getElementById('window-profile-user-tools')
    window.classList.remove('active-window-profile-tools')
}

//Funcionalidade de dados de likes
function openLikesInfo(id){
    const btnId = id.getAttribute('data-posts-id')
    const dataLikes = document.getElementById(`windowLikes-${btnId}`)
    dataLikes.classList.add('ativeDataLikes')
}
function closeDataLikes(){
    const closeDataLike = document.querySelectorAll('.closeWindowLikes')
    closeDataLike.forEach((btnClose) => {
        btnClose.addEventListener('click', () => {
            document.querySelectorAll('.windowLikes').forEach(windows => {
                windows.classList.remove('ativeDataLikes')
            })
        })
    })
}
