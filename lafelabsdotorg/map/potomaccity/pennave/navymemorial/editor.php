<!DOCTYPE html>
<html>
<body>
<head>

<!-- PUBLIC DOMAIN, NO COPYRIGHTS, NO PATENTS.
LAWS OF GEOMETRON:
    NO PROPERTY 
    NO MONEY
    NO MINING
    EVERYTHING IS RECURSIVE
    EVERYTHING IS FRACTAL
    EVERYTHING IS PHYSICAL
[EGO DEATH]:
    LOOK TO THE FUNGI
    LOOK TO THE INSECTS
    LANGUAGE IS THE TOOL THE MIND USES TO PARSE REALITY

    EDITOR.PHP
-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ace.js"></script>    
</head>
<div id = "editor" class = "bigeditor"></div>

<script>

    editor = ace.edit("editor");
    editor.setTheme("ace/theme/cobalt");
    editor.getSession().setMode("ace/mode/html");
    editor.$blockScrolling = Infinity;
    editor.setValue("");     

    var httpc = new XMLHttpRequest();
    httpc.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var instring = this.responseText;
            editor.setValue(instring);
       }
    };
    httpc.open("GET", "index.html", true);
    httpc.send();

</script>

<?php
//echo "My first PHP script!";
?>

<style>
.bigeditor{ 
    position:absolute;
    left:1%;
    right:1%;
    bottom:1%;
    top:100px;
    border:solid;
}
</style>
</body>
</html>