<?php
/* javascript this pairs with:
   
document.getElementById("saveFileButton").onclick = function(){
    document.getElementById("textIO0630").value = JSON.stringify(dataTXT,null,"   ");
    var httpc = new XMLHttpRequest();
    var url = "saver.php";        
    httpc.open("POST", url, true);
    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpc.send("data=" + document.getElementById("textIO0630").value);//send text to saver.php
}
*/
    $str = $_POST["data"]; //get text from textarea at /editor/editor.html 
    $filename = "data.txt";  
    $file = fopen($filename,"w");// open data.txt
    fwrite($file,$str); //write data to file
    fclose($file);  //close file
?>