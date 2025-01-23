<?php
	$inData = getRequestInfo();
	
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $username = $inData["username"];
    $password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else{
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Username=?");
		$stmt->bind_param("s", $username);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithError("User Already Exists");
		}
		else{
		$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Username, Password) Values (?,?,?,?)");
		$stmt->bind_param("ssss", $firstName, $lastName, $username, $password);
		$stmt->execute();
		returnWithError("Finished Successfully");
		}
		$stmt->close();
		$conn->close();
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
