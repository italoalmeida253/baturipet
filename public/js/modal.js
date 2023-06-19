const modalContent = document.querySelector('.modal__content')
const modal = document.querySelector('.modal')

function showModal (child) {
  child.classList.remove('modal__template')
  modalContent.appendChild(child)
  modal.classList.add('modal--showing')
}

function hiddenModal () {
  modal.classList.remove('modal--showing')
  modalContent.removeChild(modalContent.firstChild)
}
