<?php
	$inData = getRequestInfo();
	
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	

	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		if (userAlreadyExists($conn, $login)){
            returnWithError("User Already Exists");
        }
        else
        {
            $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) Values (?,?,?,?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
            $stmt->execute();
			$stmt->close();
            returnWithError("Finished Successfully");
        }
		$conn->close();
	}
	
    function userAlreadyExists($conn, $login)
    {
        $stmt = $conn->prepare("SELECT firstName FROM Users WHERE Login=?");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();
		if ($result){
			$stmt->close();
            return 1;
        }
		$stmt->close();
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