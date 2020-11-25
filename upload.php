<?php

// 服务器端源码：  上传文件接收，版本管理
// 如果你需要架构自己的安装包服务器，请自行部署到你的服务器

$app = 'demo';
$manifest = $_POST['manifest'];
if(!$manifest){
  echo('manifest not exists');  exit(0);
}
$manifest = json_decode(  $manifest , true);
$app = $manifest['appid'];  


move_uploaded_file($_FILES["file"]["tmp_name"], "data/" . $app . '.wgt');


$version = [
    "version"=> $manifest['versionName'],
    "version_code"=> $manifest['versionCode'],
    "path"=>$app . '.wgt'
];
file_put_contents("data/" . $app . '.json',  json_encode($version));
