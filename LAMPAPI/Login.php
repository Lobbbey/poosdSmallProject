<?php
	//Variables taken from js file
	$inData = getRequestInfo();

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
		//Returns if username and password match with user in database
		$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Username=? AND Password=?");
		$stmt->bind_param("ss", $username, $password);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		}
		else
		{
			returnWithError("error: No Records Found");
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
		$retValue = '{"id":0, "result":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	//Returns JSON id, first name, last name, success message
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","result":"Finished Successfully"}';
		sendResultInfoAsJson( $retValue );
	}
?>
