<?php
/* javascript this pairs with:

document.getElementById("editor").onkeypress = function(){//save on every key press
    var httpc = new XMLHttpRequest();
    var url = "saver.php";        
    httpc.open("POST", url, true);
    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpc.send("text=" + document.getElementById("editor").value);//send text to saver.php
}        

*/

    $str = $_POST["text"]; //get text from textarea at /editor/editor.html 
    $filename = $POST["fileName"];  //put it in main webpage there
    $file = fopen($filename,"w");// create new file with this name
    fwrite($file,$str); //write data to file
    fclose($file);  //close file
?>