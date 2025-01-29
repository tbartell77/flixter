const loaderWrapper = document.querySelector(".loader__wrapper")

function handleLoader() {
    loaderWrapper.innerHTML='<i class="fa-solid fa-spinner"></i>'
    loaderWrapper.classList += ' loader__clicked'
}

