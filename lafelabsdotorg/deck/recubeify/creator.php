<?php
//this code creates index.html from cube.txt.
$basecube = file_get_contents('cube.txt');
$basecubearray = explode("\n", $basecube);
for($index = 0;$index < count($basecubearray);$index++){
    $subarray = explode(":",$basecubearray[$index]);
    echo byteCode2string($subarray[1]);
}

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

