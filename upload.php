<?php

// 服务器端源码：  上传文件接收，版本管理
// 如果你需要架构自己的安装包服务器，请自行部署到你的服务器

$app      = 'demo';
$manifest = $_POST['manifest'];
if (!$manifest) {
    echo ('manifest not exists');exit(0);
}
$manifest = json_decode($manifest, true);
$app      = $manifest['appid'];
checkAppID($app);

if ($_GET['makeapk'] == 'start') {
    unlink("data/" . $app . '.apk_ready.json');
    file_put_contents("data/" . $app . '.need_apk.json', $app);

}

move_uploaded_file($_FILES["file"]["tmp_name"], "data/" . $app . '.wgt');

$version = [
    'appid'        => $app,
    "version"      => $manifest['versionName'],
    "version_code" => $manifest['versionCode'],
    "path"         => $app . '.wgt',
];
file_put_contents("data/" . $app . '.json', json_encode($version));

//--------> make apk

echo "___HOTPATCH_OK";

function checkAppID($app)
{
    //
    if (strpos($app, '/') === false || strpos($app, '\\') === false
        || strpos($app, '\0') === false || strpos($app, '.') === false) {
        ; //nothing
    } else {
        exit("appid $app : 不合格!!");
    }
}
