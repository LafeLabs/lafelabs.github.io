<?php
/*
takes index.html and makes a cube.txt file
*/

$indexhtml = file_get_contents('index.html');//get the local index.html
$cubetxt = "";



for ($index = 0; $index < 1024; $index++) {
    $pagename = "page0".decoct(ord($inputstring[$index]));
    if
    if(strlen("<" . $pagename . ">") > 1){
        $foo = explode("",)
    }
}


tableout = "0:" + string2byteCode(cubifytext) + "\n"
for index in range(len(hyperCube)):
    pagename = "page" + oct(index)
    if len(indexstring.split("<" + pagename + ">")) > 1:
        foo = indexstring.split("<" + pagename + ">")[1]
        bar = foo.split("</" + pagename + ">")[0]
        hyperCube[index] = string2byteCode(bar)
        tableout += oct(index) + ":" + hyperCube[index] + "\n"



function byteCode2string($inputbytecode) {
    $bytecodearray = explode(",", $inputbytecode);
    $outputstring = " ";
    for ($index = 0; $index < count($bytecodearray); $index++) {
        if(strlen($bytecodearray[$index]) > 0){
            $outputstring .= chr(octdec($bytecodearray[$index]));
        }
    }
    return $outputstring;
}
function string2byteCode($inputstring){
    $outputcode = "";
    for( $index = 0; $index < strlen($inputstring);$index++){
        $outputcode .= "0".decoct(ord($inputstring[$index])).",";
    }
    return $outputcode;
}
?>

