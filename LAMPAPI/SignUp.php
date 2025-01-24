<?php
	//Variables taken from js file
	$inData = getRequestInfo();
	
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $username = $inData["username"];
    $password = $inData["password"];

	//Interactions with database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError("error: Could not connect to database");
	}
	else
	{
		//Returns if usename already exists in database
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Username=?");
		$stmt->bind_param("s", $username);
		$stmt->execute();
		$result = $stmt->get_result();
		
		if( $row = $result->fetch_assoc()  )
		{
			returnWithError("error: User Already Exists");
		}
		else
		{
			//Inserts user into database
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Username, Password) Values (?,?,?,?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $username, $password);
            $stmt->execute();
            sendResultInfoAsJson('{"result":"Finished Successfully"}');
		}
		
		$stmt->close();
		$conn->close();
	}

	//Gets input from file in key-value pairs
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	//Returns JSON object
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	//Returns JSON error message
	function returnWithError( $err )
	{
		$retValue = '{"result":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
