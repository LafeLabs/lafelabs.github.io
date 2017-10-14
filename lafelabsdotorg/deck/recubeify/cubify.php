<?php
/*
cubify takes index.html and makes a cube.txt file

*/

//$indexhtml = file_get_contents('index.html');//get the local index.html

$cube = array();
array_push($cube,"0400:0101,0102,");
print_r($cube);


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

