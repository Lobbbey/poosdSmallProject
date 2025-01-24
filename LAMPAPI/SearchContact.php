<?php
    //Variables taken from js file
    $inData = getRequestInfo();

    $userId = $inData["userId"];
    $searchName = "%" . $inData["search"] . "%";

    //Interactions with database
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
    if($conn->connect_error){
        returnWithError("error: Could not connect to database");
    }
    else{
        //Returns contacts with first or last name including substring from search
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName like ? OR LastName like ?) AND UserID = ?");
        $stmt->bind_param("ssi", $searchName, $searchName, $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        //Appends contacts to searchResults array
        $searchResults = "";
        $searchAmnt = 0;
        while($row = $result->fetch_assoc())
        {
            if($searchAmnt > 0){
                $searchResults .= ",";
            }
            $searchAmnt++;
            $searchResults .= '{
                                "FirstName":"'.$row["FirstName"].'",
                                "LastName":"'.$row["LastName"].'",
                                "Phone":"'.$row["Phone"].'",
                                "Email":"'.$row["Email"].'",
                                "ID":"'.$row["ID"].'"
                                }';
        }
        returnWithInfo($searchResults);

        $stmt->close();
        $conn->close();
    }

    //Gets input from file in key-value pairs
    function getRequestInfo(){
        return json_decode(file_get_contents('php://input'), true);
    }

    //Returns JSON object
    function sendResultInfoAsJson($obj){
        header('Content-type: application/json');
        echo $obj;
    }

    //Returns JSON error message
    function returnWithError($err){
        $retValue = '{"result":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    //Returns JSON array of objects with (first name, last name, phone, email, id) and success message
    function returnWithInfo($searchResults){
        $retValue = '{"result":"Finished Successfully", "searchResults":[' .$searchResults. ']}';
        sendResultInfoAsJson($retValue);
    }

?>