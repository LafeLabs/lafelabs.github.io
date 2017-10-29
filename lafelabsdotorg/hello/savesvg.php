<?php
/* javascript this pairs with:

        var httpc = new XMLHttpRequest();
        var url = "savesvg.php";        
        httpc.open("POST", url, true);
        httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        httpc.send("svg=" + document.getElementById("textIO0630").value);

        */

   $str = $_POST["svg"]; //get svg data from index.html
   
   $timenow = time();
   $filename = "svg".$timenow.".svg";  //make a filename from the UNIX time(this trivially makes sure filename is unique)
   $file = fopen("svg/".$filename,"w");// create new file with this name
   fwrite($file,$str); //write svg data to file
   fclose($file);  //close file

   $txtfilename = "svg".$timenow.".txt";  //make a filename from the UNIX time(this trivially makes sure filename is unique)
   $file = fopen("svg/".$txtfilename,"w");// create new file with this name
   fwrite($file,$str); //write svg data to file
   fclose($file);  //close file

   $file = fopen("feed.txt","r"); //open the feed.txt file which contains a list of all files in /svg/ directory
   $olddata = fread($file,filesize("feed.txt")); //read contents of existing file list
   fclose($file);//close the file because computers are insane
   $file = fopen("feed.txt","w");   //re-open file, I have no idea why this fixed a mysterious bug
   $str = $olddata."\n".$filename;//append a "newline" to string representing contents of feed.txt file ,then append new filename
   fwrite($file,$str);//write string to file
   fclose($file);//close file

?>