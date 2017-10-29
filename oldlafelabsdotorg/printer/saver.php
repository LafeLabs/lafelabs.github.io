<?php
//this pairs with savecube.html.
   $str = $_POST["arduino"];
   $file = fopen("arduino.txt","w");
   fwrite($file,$str);
   fclose($file);
?>