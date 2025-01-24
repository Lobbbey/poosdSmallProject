const urlBase = 'http://cop4331g11.xyz/LAMPAPI';
const extension = 'php';
 
function foo() {
    console.log("FOO!");
}

function signin(event, form) {
    event.preventDefault();
    console.log(form.email.value);
    console.log(form.password.value);

    return false;
}