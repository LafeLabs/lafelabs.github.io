<?php
//this pairs with index.html.
   $str = $_POST["data0466"];
   $file = fopen("data0466.txt","r");
   $olddata = fread($file,filesize("data0466.txt"));
   fclose($file);
   $file = fopen("data0466.txt","w");   
   $str = $olddata.",\n".$str;
   fwrite($file,$str);//this creates badly formatted JSON, add [ at start and ] at end to format into proper json
   fclose($file);
?>