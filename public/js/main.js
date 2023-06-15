const publications = document.querySelectorAll('.publication')
const { session } = document.querySelector('#session-status').dataset
const likeInCache = localStorage.getItem('likeInCache')

// publication actions
for (const publication of publications) {
  const likeBtn = publication.querySelector('.like-btn')
  const commentBtn = publication.querySelector('.comment-btn')
  const publicationImage = publication.querySelector('.publication__image')

  if (session !== 'unauthenticated') {
    likeBtn.addEventListener('click', () => (
      likePublication(publication, likeBtn)
    ))

    commentBtn.addEventListener('click', () => (
      commentPublication(publication, commentBtn)
    ))

    publicationImage.addEventListener('dblclick', () => (
      likePublication(publication, likeBtn, true)
    ))

    // load like cache
    const { id } = publication.dataset
    if (id === likeInCache) {
      likePublicationTxt(publication, likeBtn)
      localStorage.removeItem('likeInCache')
    }
  } else {
    likeBtn.addEventListener('click', loginRedirect)
    commentBtn.addEventListener('click', loginRedirect)
    publicationImage.addEventListener('click', loginRedirect)
  }
}

function loginRedirect () {
  location.href = '/login'
}

async function likePublication (post, btn, heartAni) {
  const publication = post
  const { id } = publication.dataset

  likePublicationTxt(post, btn, heartAni)
  localStorage.setItem('likeInCache', id)

  axios.post('/user/like', {
    id
  }).then((response) => {
    const { data } = response
    if (data !== 'liked') {
      location.href = '/login'
      return
    }

    localStorage.removeItem('likeInCache')
  }).catch((err) => {
    console.log(err)
  })
}

function likePublicationTxt (post, btn, heartAni) {
  const publication = post
  const likedBtn = btn
  const liked = publication.dataset.state === 'liked'
  const likesNum = publication.querySelector('.likes-qty')

  if (heartAni) {
    likeHeartEffect(publication)
  }

  if (liked) {
    likedBtn.classList.remove('like-btn--liked')
    publication.dataset.state = 'unliked'
    likesNum.textContent = parseInt(likesNum.textContent, 10) - 1
  }
  if (!liked) {
    likedBtn.classList.add('like-btn--liked')
    publication.dataset.state = 'liked'
    likesNum.textContent = parseInt(likesNum.textContent, 10) + 1
  }
}

function likeHeartEffect (post) {
  const publication = post
  const heart = publication.querySelector('.publication__heart')
  heart.classList.toggle('publication__heart--animated')
}

async function commentPublication (post, btn) {
  const publication = post
  const commentBtn = btn
  const { id } = publication.dataset
  const { value: comment } = publication.querySelector('.comment')

  commentBtn.classList.add('button--disabled')

  await axios.post('/user/comment', {
    id,
    comment
  }).then((response) => {
    const { data } = response
    if (data !== 'commented') {
      location.href = '/login'
      return
    }

    publication.querySelector('.comment').value = ''
    commentBtn.classList.remove('button--disabled')
    commentPublicationTxt(publication, commentBtn, comment)
  }).catch((err) => {
    console.log(err)
  })
}

function commentPublicationTxt (post, btn, value) {
  const publication = post
  const comment = document.createElement('li')
  const comments = publication.querySelector('.comments')
  const commentsTitle = comments.querySelector('.comments__title')

  if (commentsTitle) {
    comments.removeChild(commentsTitle)
  }

  comment.classList.add('comments__item')
  comment.innerHTML =
    `
    <img src="/images/person-circle.svg" alt="Imagem do usuário" class="comments__user-pic">
    <div class="publication__user-infors">
      <h2 class="comments__author">Você</h2>
      <span class="comments__comment">${value}</span>
    </div>
    `

  comments.insertBefore(comment, comments.firstChild)
}
