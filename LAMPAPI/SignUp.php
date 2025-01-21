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
		if (userAlreadyExists($conn, $login)){
            returnWithError("User Already Exists");
        }
        else
        {
            $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) Values (?,?,?,?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
            $stmt->execute();
            returnWithError("Finished Successfully");
        }
		$stmt->close();
		$conn->close();
	}
	
    function userAlreadyExists($conn, $login)
    {
        $stmt = $conn->prepare("SELECT firstName FROM Users WHERE Login=?");
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_assoc();
		echo is_null($row);
		/*while ($row = $result->fetch_array(MYSQLI_NUM)) {
			foreach ($row as $r) {
				echo $r;
			}
			echo "\n";
		}*/
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