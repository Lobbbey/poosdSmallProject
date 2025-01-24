<<<<<<< HEAD
<?php
    //Variables taken from js file
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $ID = $inData["ID"];

    //Interactions with database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
    if($conn->connect_error){
        returnWithError("error: Could not connect to database");
    }
    else{
        //Updates contact in database
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, 
                                                    LastName = ?,
                                                    Phone = ?,
                                                    Email = ?
                                                    WHERE ID = ?");
        $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $ID);
        $stmt->execute();
        sendResultInfoAsJson('{"result":"Finished Successfully"}');

        $stmt->close();
        $conn->close();
    }

    //Gets input from file in key-value pairs
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    //Returns JSON object
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    //Returns JSON error message
    function returnWithError($err)
    {
        $retValue = '{"result":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
=======
<?php
    $inData = getRequestInfo();
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userId = $inData["userId"];
    $ID = $inData["ID"];
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }
    else{
        $stmt = $conn->prepare("UPDATE Contacts Set FirstName = ?, 
                                                    LastName = ?,
                                                    Phone = ?,
                                                    Email = ?,
                                                    WHERE ID = ? AND UserID = ?");
        $stmt->bind_param("ssssss", $firstName, $lastName, $phone, $email, $ID, $userId);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        returnWithError("Finished Successfully");
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
?>
>>>>>>> 165bc0d86d552737ebc9d4f2f28e8f4069f48d7e
