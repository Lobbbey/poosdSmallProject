const urlBase = 'http://cop4331g11.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	//let tmp = {username:login,password:password};
	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contact_list.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie(){
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName +",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie(){
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++){
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if(tokens[0] == "firstName"){
            firstName = tokens[1];
        }
        else if(tokens[0] == "lastName"){
            lastName = tokens[1];
        }
        else if(tokens[0] == "userId"){
            userId = parseInt(tokens[1].trim());
        }
    }

    if(userId < 0){
        window.location.href = "index.html"  
    }
    else{
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function doLogout(){
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function addContact(event,form){
    //let firstName = document.getElementById("
    event.preventDefault(); 
     //collect details for form
    let contactData = {
        firstName: form["firstName"].value,
        lastName: form["lastName"].value,
        phone: form["phone"].value,
        email: form["email"].value,
        userId: userId 
    };

    let jsonPayload = JSON.stringify(contactData);
    let url = `${urlBase}/addContact.${extension}`;

    // Create and send the request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); //correctly set request header

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.result === "Finished Successfully") {
                    alert("Contact added successfully!");
                    form.reset(); // Clear form inputs
                } else {
                    alert("failed to add contact: " + jsonObject.result);
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.error("error adding contact:", err.message);
    }
}

function editContact(event, form){
	
}

function deleteContact(event,form){
}

function searchContact(){
}	

function signin(event, form) {
    event.preventDefault();
//    console.log(form.email.value);
//   console.log(form.password.value);

    return false;
}

function signUp(event, form) {
    event.preventDefault();

    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let login = document.getElementById("signUpUsername").value;
    let password = document.getElementById("signUpPassword").value;

    if (firstName === "" || lastName === "" || login === "" || password === "") {
        alert("Missing fields. Please try again");
        return;
    }

    document.getElementById("signupResult").innerHTML = "";
    var hashPass = md5(password);
    let tmp = { firstName: firstName, lastName: lastName, username: login, password: hashPass };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SignUp.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    let jsonObject = JSON.parse(xhr.responseText);

                    if (jsonObject.id < 1) {
                        document.getElementById("signupResult").innerHTML = "Sign up failed: " + jsonObject.error;
                        return;
                    }

                    userId = jsonObject.id;
                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;

                    saveCookie();
		    window.location.href = "contact_list.html";
                    alert("Sign up successful!");
                    console.log("Sign up successful!")

                } else {
                    document.getElementById("signupResult").innerHTML = `Error: ${this.statusText}`;
                    console.log(`Error: ${this.statusText}`);
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}
