<?php
//this pairs with savecube.html.
   $str = $_POST["hypercube"];
   $file = fopen("cube.txt","w");
   fwrite($file,$str);
   fclose($file);
?>