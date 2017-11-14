<?php
/* javascript this pairs with:
   
document.getElementById("savebutton").onclick = function(){
    var localString = "";
    for(var index = 040;index < 0277;index++){
        localString += "0" + index.toString(8) + ":" + currentTable[index] + "\n";
    }
    document.getElementById("textIO0630").value = localString;
    var httpc = new XMLHttpRequest();
    var url = "metabot.php";        
    httpc.open("POST", url, true);
    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpc.send("data=" + document.getElementById("textIO0630").value);//send text to metabot.php
}
*/
    $str = $_POST["data"]; //get text from textarea at /editor/editor.html 
    $filename = "metabot.txt";  
    $file = fopen($filename,"w");// open data.txt
    fwrite($file,$str); //write data to file
    fclose($file);  //close file
?>