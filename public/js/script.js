// Show and hide password function

const passBtn = document.querySelector('#passButton');
passBtn.addEventListener('click', function () {
    const passInput = document.querySelector('#pswrd');
    const type = passInput.getAttribute('type');
    if (type == 'password') {
        passInput.setAttribute('type', 'text');
        passBtn.innerHTML = 'Hide Password';
    } else {
        passInput.setAttribute('type', 'password');
        passBtn.innerHTML = 'Show Password';
    }
});
