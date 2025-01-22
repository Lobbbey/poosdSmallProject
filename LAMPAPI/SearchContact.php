<?php
    $inData = getRequestInfo();
    $searchResults = "";
    $searchAmnt = 0;
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
    
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }
    else{
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName like ? OR LastName like ?) AND UserID = ?");
        $searchName = "%" . $inData["search"] . "%";
        $stmt->bind_param("sss", $searchName, $searchName, $inData["userId"]);
        $stmt->execute();
        $result = $stmt->get_result();

        while($row = $result->fetch_assoc())
        {
            if($searchAmnt > 0){
                $searchResults .= ",";
            }
            $searchAmnt++;
            $searchResults .= '{
                                "FirstName":"'.$row["FirstName"].'"
                                "LastName":"'.$row["LastName"].'"
                                "Phone":"'.$row["Phone"].'"
                                "Email":"'.$row["Email"].'"
                                "UserId":"'.$row["UserId"].'"
                                "ID":"'.$row["ID"].'"}';
        }
        
        if( $searchAmnt == 0)
        {
            returnWithError("No Records Found");
        }
        else
        {
            returnWithInfo($searchResults);
        }
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo(){
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj){
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err){
        $retValue = '{"id":0, "firstName":"", "lastName":"", "error":"'.$err.'"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($searchResults){
        $retValue = '{"results":['.$searchResults.'],"error":""}';
        sendResultInfoAsJson($retValue);
    }

?>