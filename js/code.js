const urlBase = 'http://cop4331g11.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let curContact = [];

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    var hash = md5(password);

    document.getElementById("loginResult").innerHTML = "";

    let tmp = { username: login, password: hash };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
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
    catch (err) {
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

    if (passwordValidation(password) == false) return;

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

function passwordValidation(pass){

    var validationText = document.getElementById("validationText");

    var minChar = /^.{8,}$/;  // At least 8 characters
    var lowCase = /[a-z]/;  // Contains at least one lowercase letter
    var uppCase = /[A-Z]/;  // Contains at least one uppercase letter
    var num = /\d/;  // Contains at least one digit
    var specialChar = /[@.#$!%*?&]/;  // Contains at least one special character
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

    //Password Validation
    //Checks minimum character count
    if (!minChar.test(pass)) {
        validationText.innerText = "Password needs at least 8 characters";
        return false;
    }

    //Checks for lower case characters
    if (!lowCase.test(pass)) {
        validationText.innerText = "Password needs at least 1 lowercase character";
        return false;
    }

    //Checks for upper case characters
    if (!uppCase.test(pass)) {
        validationText.innerText = "Password needs at least 1 upper case letter";
        return false;
    }

    //Checks for numbers
    if (!num.test(pass)) {
        validationText.innerText = "Password needs at least 1 number";
        return false;
    }

    //Checks for special character
    if (!specialChar.test(pass)) {
        validationText.innerText = "Password needs at least 1 special character";
        return false;
    }

    //Checks the full regex and ensures only the specified characters are used in the password
    if (regex.test(pass)) {
        validationText.innerText = " ";
        return true;
    }
    else{
        validationText.innerText = "Please use only the specified characters";
        return false;
    }

}

function contactValidation(firstName, lastName, phone, email) {
    var phoneRegex = /^(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    //Check for empty or undefined fields
    if (!firstName || !lastName || !phone || !email) {
        console.log("Field is empty");
        return false;
    }

    //Test phone and email against regex
    if (!phoneRegex.test(phone)) {
        console.log("Invalid phone number");
        return false;
    }

    if (!emailRegex.test(email)) {
        console.log("Invalid email address");
        return false;
    }

    return true;
}

function saveCookie(){
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
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
    document.getElementById("addContactResult").innerHTML = "";


    if (!contactValidation(firstName, lastName, phone, email)){
        document.getElementById("addContactResult").innerHTML = "Some fields have been entered incorrectly";
        return;
    }
    
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
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); 
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.result === "Finished Successfully") {
                    document.getElementById("addingContacts").reset(); // Clear form inputs
                    document.getElementById("addContactResult").innerHTML = "Contact added successfully!";
                } else {
                    document.getElementById("addContactResult").innerHTML = "Failed to add contact";
                } 
            }
        };
        xhr.send(jsonPayload);
    } 
    catch (err) {
        console.error("error adding contact:", err.message);
    }
}

function editContact(id) {
    document.getElementById("editButton" + id).style.display = "none";
    document.getElementById("saveButton" + id).style.display = "inline-block";

    var firstNameInput = document.getElementById("firstName" + id);
    var lastNameInput = document.getElementById("lastName" + id);
    var emaiInput = document.getElementById("email" + id);
    var phoneInput = document.getElementById("phone" + id);
 
    firstNameInput.innerHTML = "<input type='text' id='newFirstName" + id + "' value='" + firstNameInput.innerText + "'>";
    lastNameInput.innerHTML = "<input type='text' id='newLastName" + id + "' value='" + lastNameInput.innerText + "'>";
    phoneInput.innerHTML = "<input type='text' id='newPhone" + id + "' value='" + phoneInput.innerText + "'>"
    emaiInput.innerHTML = "<input type='text' id='newEmail" + id + "' value='" + emaiInput.innerText + "'>";
}

function saveContact(curId){
    let newFirstName = document.getElementById("newFirstName" + curId).value;
    let newLastName = document.getElementById("newLastName" + curId).value;
    let newPhone = document.getElementById("newPhone" + curId).value;
    let newEmail = document.getElementById("newEmail" + curId).value;

    if (!contactValidation(newFirstName, newLastName, newPhone, newEmail)) {
        alert("Some fields have been entered incorrectly");
        return;
    }

    let tmp = {
        firstName: newFirstName,
        lastName: newLastName,
        phone: newPhone,
        email: newEmail,
        ID: curContact[curId]
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/EditContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.result == "Finished Successfully"){
                    alert("Updated Contact");
                    searchContact();
                }
                else{
                    alert("Failed to update contact " + jsonObject.result);
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        console.error("Error editing contact:", err.message);
    }
}

function deleteContact(curId){
    //Confirm Contact Deletion
    var firstName = document.getElementById("firstName" + curId).innerText;
    var lastName = document.getElementById("lastName" + curId).innerText;
    let check = confirm('Are you sure you want to delete ' + firstName + ' ' + lastName + ' as a contact?');
    if(!check) {
        return;
    }

    let tmp = {
        ID: curContact[curId],
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DeleteContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function(){
            if(this.readState == 4 && this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.result === "Finished Successfully") {
                    alert("Contact deleted successfully!");
                    searchContact();
                } else {
                    alert("Failed to delete contact: " + jsonObject.result);
                } 
            }
        };
        xhr.send(jsonPayload);
    } catch(err){
        console.error("error deleteing contact:", err.message);
    }
    searchContact();

}

function searchContact(){
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchRes").innerHTML = "";

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SearchContact.' + extension;

    // Create and send the request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try{
        xhr.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                let jsonObject = JSON.parse(xhr.responseText);
                let srchRes = "<table border ='1'>";                      
                for (let i = 0; i < jsonObject.searchResults.length; i++) {
                    curContact[i] = jsonObject.searchResults[i].ID
                    srchRes += "<tr id='row" + i + "'>"
                    srchRes += "<td id='firstName" + i + "'><span>" + jsonObject.searchResults[i].FirstName + "</span></td>";
                    srchRes += "<td id='lastName" + i + "'><span>" + jsonObject.searchResults[i].LastName + "</span></td>";
                    srchRes += "<td id='phone" + i + "'><span>" + jsonObject.searchResults[i].Phone + "</span></td>";
                    srchRes += "<td id='email" + i + "'><span>" + jsonObject.searchResults[i].Email + "</span></td>";
                    srchRes += "<td>" +
                        "<button type='button' id='editButton" + i + "' onclick='editContact(" + i + ")'>" + "Edit" + "</button>" +
                        "<button type='button' id='saveButton" + i + "' onclick='saveContact(" + i + ")' style='display: none'>" + "Save" + "</button>" +
                        "<button type='button' id='deleteButton'" + i + "' onclick='deleteContact(" + i + ")'>" + "Delete" + "</button>" + "</td>";
                    srchRes += "<tr/>"
                    srchRes += "<tr/>"
                }
                srchRes += "</table>"
                document.getElementById("tbody").innerHTML = srchRes;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err){
        document.getElementById("contactSearchRes").innerHTML = err.message;
    }
}