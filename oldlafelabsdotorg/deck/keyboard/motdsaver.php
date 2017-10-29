<?php
//this pairs with index.html.
   $str = $_POST["motd"];
   $file = fopen("motd.txt","w");
   fwrite($file,$str);
   fclose($file);
?>