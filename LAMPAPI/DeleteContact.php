<?php
    //Variables taken from js file
    $inData = getRequestInfo();

    $ID = $inData["ID"];

    //Interactions with database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error){
        returnWithError("error: Could not connect to database");
    }
    else{
        //Deletes contact from database
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
        $stmt->bind_param("i", $ID);
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
