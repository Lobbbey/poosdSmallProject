<?php
	$inData = getRequestInfo();
	
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "root", "Group11COP", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		if (userAlreadyExists($conn, $firstName, $lastName)){
            returnWithError("User Already Exists");
        }
        else
        {
            $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) Values (?,?,?,?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
            $stmt->execute();
        }
        returnWithError("");
		$stmt->close();
		$conn->close();
	}
	
    function userAlreadyExists($conn, $firstName, $lastName)
    {
        $stmt = $conn->prepare("SELECT firtName,lastName FROM Users WHERE FirstName=? AND LastName=?");
		$stmt->bind_param("ss", $firstName, $lastName);
		$stmt->execute();
		$result = $stmt->get_result();
        if ($result){
            return 1;
        }
        return 0;
    }

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
