<?php
echo "<h2>PHP is Fun!</h2>";
echo "Hello world!<br>";
echo "I'm about to learn PHP!<br>";
echo "This ", "string ", "was ", "made ", "with multiple parameters.";

$myfile = fopen("testfile.txt", "w");
$txt = "Jane Doe\n";
fwrite($myfile, $txt);
fclose($myfile);
?>