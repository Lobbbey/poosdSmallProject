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