const urlBase = 'http://cop4331g11.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin(){
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {username:login,password: hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try{
		xhr.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
                console.log(userId);
		
				if( userId < 1 ){		
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
	catch(err){
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doLogout(){
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function signin(event, form){
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

    if (firstName === "" || lastName === "" || login === "" || password === ""){
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

                    userId = jsonObject.userId;
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
    } 
    catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}

function saveCookie(){
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));
    document.cookie = 
        "firstName=" + firstName + 
        ",lastName=" + lastName + 
        ",userId=" + userId + 
        ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");

    for (var i = 0; i < splits.length; i++) {

        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");

        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }
}

function addContact(){
    let firstName = document.getElementById("addFirst").value;
    let lastName = document.getElementById("addLast").value;
    let phone = document.getElementById("addPhone").value;
    let email = document.getElementById("addEmail").value;

    let contactData = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        userId: userId
    };

    let jsonPayload = JSON.stringify(contactData);
    let url = urlBase + '/AddContact.' + extension;

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
                    document.getElementById("addingContacts").reset(); // Clear form inputs
                } else {
                    alert("failed to add contact: " + jsonObject.result);
                } 
            }
        };
        xhr.send(jsonPayload);
    } 
    catch (err) {
        console.error("error adding contact:", err.message);
    }
}

function editContact(event, form){
    
}

function deleteContact(){
    var firstName = document.getElementById("firstName" + no).innerText;
    var lastName = document.getElementById("lastName" + no).innerText;

    let check = confirm ('Are you sure you want to delete ' + firstName + ' ' + lastName + 'as a contact?');

    if(check) {
        document.getElementById("row" + no + "").outerHTML = "";
        let tmp = {
            firstName: firstName,
            lastName: lastName,
            userId: userId
        };
    }

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DeleteContact.' + extension;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readState == 4 && this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.result === "Finished Successfully") {
                    alert("Contact deleted successfully!");
                    document.getElementById("addingContacts").reset(); // Clear form inputs
                } else {
                    alert("failed to delete contact: " + jsonObject.result);
                } 
            }
        };
        xhr.send(jsonPayload);
    } catch(err){
        console.error("error deleteing contact:", err.message);
    }
}

function searchContact(){
    let search = document.getElementById("searchText").value;
    document.getElementById("contactSearchRes").innerHTML = "";

    let contactList = "";

    let tmp = {search: search, userId: userId};
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SearchContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                document.getElementById("contactSearchRes").innerHTML = "Contact(s) have been found";
                let jsonObject = JSON.parse(xhr.responseText);

                for(let i = 0; i < jsonObject.results.length; i++){
                    contactList += jsonObject.results[i];
                    if( i < jsonObject.results.length - 1){
                        contactList += "<br />\r\n";
                    }
                }
                document.getElementsByTagName("p")[0].innerHTML = contactList;

            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactSearchRes").innerHTML = err.message;
    }
    
}

function displayContacts(){}
