<?php
$url = $_POST["url"];
$basecube = file_get_contents($url);
echo $basecube;
?>