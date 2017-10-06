<?php
//this pairs with savecube.html.
   $str = $_POST["data0442"];
   $file = fopen("data0442.txt","w");
   fwrite($file,$str);
   fclose($file);
?>