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
<<<<<<< HEAD
	else
	{
		//Returns if usename already exists in database
=======
	else{
>>>>>>> 165bc0d86d552737ebc9d4f2f28e8f4069f48d7e
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Username=?");
		$stmt->bind_param("s", $username);
		$stmt->execute();
		$result = $stmt->get_result();
		
		if( $row = $result->fetch_assoc()  )
		{
			returnWithError("error: User Already Exists");
		}
<<<<<<< HEAD
		else
		{
			//Inserts user into database
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Username, Password) Values (?,?,?,?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $username, $password);
            $stmt->execute();
            sendResultInfoAsJson('{"result":"Finished Successfully"}');
=======
		else{
		$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Username, Password) Values (?,?,?,?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $username, $password);
		$stmt->execute();
		returnWithError("Finished Successfully");
>>>>>>> 165bc0d86d552737ebc9d4f2f28e8f4069f48d7e
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
