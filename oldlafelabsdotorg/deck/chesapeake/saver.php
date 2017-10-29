<?php
//this pairs with index.html.
   $str = $_POST["hypercube"];
   $file = fopen("data.txt","w");
   fwrite($file,$str);
   fclose($file);
?>