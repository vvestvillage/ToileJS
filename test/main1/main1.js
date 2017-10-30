/*
_param1 = location.search.match(/param1=(.*?)(&|$)/)[1];
console.log(_param1);
_param2 = location.search.match(/param2=(.*?)(&|$)/)[1];
console.log(_param2);
*/

//==========================
//作品リストとそのランダム化
//==========================
_videoList = [ //優先させたい作品は除く
    "AS-1","AS-2","AS-3","AS-4","AS-5","AS-6","AS-7","AS-8","AS-9","AS-10","AS-16","AS-17","AS-18","AS-20",
    "DA-24",
    "DAP-1","DAP-2","DAP-3","DAP-4","DAP-5",
    "DAS-1","DAS-2","DAS-3","DAS-4","DAS-5","DAS-6","DAS-7","DAS-8","DAS-9","DAS-10",
    "DB-30",
    "DG-21",
    "DK-10","DK-11","DK-12","DK-13","DK-14","DK-15","DK-16",
    "DN-50","DN-56","DN-57","DN-58","DN-59","DN-62","DN-63","DN-64","DN-65","DN-66","DN-67","DN-68","DN-69","DN-70","DN-71","DN-72","DN-73","DN-75","DN-76","DN-77","DN-78","DN-79","DN-80","DN-81","DN-82","DN-83",
    "DOK-1_1","DOK-1_2","DOK-1_3","DOK-1_4","DOK-1_5","DOK-1_6",
    "DOK-2_1","DOK-2_2","DOK-2_3","DOK-2_4","DOK-2_5","DOK-2_6","DOK-2_7",
    "DP-3"
]
randomArray = (_array) => { //作品リストをランダムにする
    _arrayCopy = _array.concat(); //複製
    _arrayNew = [];
    for (let i=0; i<_array.length; i++) { //0～80（81作品の場合）
        let _theNum = Math.floor(Math.random() * (_arrayCopy.length-1 + 1)); //整数の乱数
        let _video = _arrayCopy.splice(_theNum,1)[0];
        _arrayNew.push(_video);
    }
    return _arrayNew;
}
_videoRandamList = randomArray(_videoList);
_videoRandamList.unshift("DS-2", "DS-3"); //優先させたい作品


//======================================
// 最初に実行（Webページの準備が完了後）
//======================================
addEventListener("load", load_window, false);
function load_window() {
    _isMove = false;
    _choiceBitmap = undefined;
    _disX = _disY = 0;
    _mouseX = _mouseY = 0;

    //「Canvas」関連
    _canvas = new toile.Canvas("myCanvas");
    _canvas.addEventListener("enterframe", enterframe_canvas);
    _canvas.addEventListener("mousemove", mousemove_canvas);
    _canvas.enabledMouseMove(true);
    _canvas.enabledContextMenu(false);
    //_canvas.cursor = "../common/dummy.png"; //マウスカーソルを消す場合
    _canvas.isBorder(true)
    _canvas.fps = 60;

    //「作品」の画像関連
    _bitmapArray = [];
    for (let i = 0; i < 81; i++) { //81作品の場合（0,1,2...79,80）
        let _theVideoName = _videoRandamList.pop();
        let _bitmap = new Bitmap("png/" + _theVideoName + ".png");
        _bitmap.name = _theVideoName;
        _bitmap.addEventListener("load", load_bitmap);
        //_bitmap.addEventListener("mousedown", mousedown_bitmap);
        //_bitmap.addEventListener("mouseup", mouseup_bitmap);
        //_bitmap.addEventListener("mouseupoutside", mouseup_bitmap);

        _canvas.addChild(_bitmap);

        // _bitmap.addEventListener("mousedown", mousedown_bitmap);
        // _bitmap.addEventListener("mouseup", mouseup_bitmap);
        // _bitmap.addEventListener("mouseupoutside", mouseup_bitmap);
        //_bitmap.addEventListener("load", load_bitmap);

        _bitmapArray.push(_bitmap);
    }
    _bitmapArrayCopy = _bitmapArray.concat(); //複製

    //「タイトル」関連
    _text = new toile.Text("SHINANOJS");
    _text.addWebFont("ZilapAfricademo", "../demo/Zilap Africa demo.ttf", "opentype");
    _text.font = "ZilapAfricademo";
    _text.size = 80;
    _text.x = 20;//12;
    _text.y = 5; //-1;
    _text.color = "#222222";
    _text.alpha = 1;
    _canvas.addChild(_text);
}

//===========================================
// 各作品の画像（.png）がロード完了したら実行
//===========================================
load_bitmap = (_bitmap) => {
    _bitmap.width = 140;
    _bitmap.height = 200;
    _bitmap.x = 80 + (_canvas.width - 300) * Math.random();
    _bitmap.y = _canvas.height;
    _bitmap.__posY = 80 + (_canvas.height - 360) * Math.random();
    _bitmap.__disY = _bitmap.y - _bitmap.__posY;

    _bitmap.__timerID = setTimeout(callback_start, 1000*Math.random(), _bitmap);
}

//=============================================================
// 各作品をランダムに登場させるためのタイマー（各作品１回実行）
//=============================================================
callback_start = (_bitmap) => {
    _bitmap.__count = 0;
    clearTimeout(_bitmap.__timerID);
}

//=======================
//（1）全作品が下から登場
//=======================
enterframe_canvas = (_canvas) => {
    for (let i=0; i<_bitmapArrayCopy.length; i++) {
        let _bitmap = _bitmapArrayCopy[i];
        if (_bitmap.__count != undefined) {
            _bitmap.__count += 0.04;
            if (_bitmap.y > _bitmap.__posY + 1) {
                _bitmap.y = (_bitmap.__posY + _bitmap.__disY) +  _bitmap.__disY * Math.cos(_bitmap.__count);
            } else {
                _bitmap.__count = undefined; //（3）用
                _bitmap.y = _bitmap.__posY;
                _bitmapArrayCopy.splice(i,1); //登場し終えたものを_bitmapArrayCopyから削除
                if (_bitmapArrayCopy.length == 0) { //全て登場し終えたら...
                    //作品ボタンにマウスイベントリスナーの定義
                    _bitmapArray.forEach(function(_theBitmap) {
                        _theBitmap.addEventListener("mousedown", mousedown_bitmap);
                        _theBitmap.addEventListener("mouseup", mouseup_bitmap);
                        _theBitmap.addEventListener("mouseupoutside", mouseup_bitmap);
                    });

                    //changeボタンの表示
                    _changeButton = new toile.Bitmap("change.png");
                    _changeButton.addEventListener("mouseup", mouseup_changeButton);
                    _changeButton.x = 40; //_canvas.width - 50;
                    _changeButton.y = _canvas.height - 100;//20;
                    _changeButton.scale = 2;
                    _canvas.addChild(_changeButton);

                    //「ホームに戻るボタン」関連
                    _homeButton = new toile.Bitmap("../demo/home.png");
                    _homeButton.scale = 0.5;
                    _homeButton.x = _canvas.width - 70;
                    _homeButton.y = _canvas.height - 70;
                    _homeButton.addEventListener("mouseup", mouseup_home);
                    _canvas.addChild(_homeButton);

                    //ループ関数の変更
                    _canvas.removeEventListener("enterframe");
                    _canvas.addEventListener("enterframe", enterframe_canvas2);
                }
            }
        }
    }
    _canvas.drawScreen("#fefefe");
}

//=================================
//（2）全作品が登場後に繰り返し実行
//=================================
enterframe_canvas2 = (_canvas) => {
    if (_isMove) {
        _mouseX = _canvas.mouseX; //for Mobile
        _mouseY = _canvas.mouseY; //for Mobile
        _choiceBitmap.x = _mouseX - _disX;
        _choiceBitmap.y = _mouseY - _disY;
    }
    _canvas.drawScreen("#fefefe");
}

//===================================
// 作品のドラッグ時のカーソル位置検知
//===================================
mousemove_canvas = (_canvas) => {
    _mouseX = _canvas.mouseX;
    _mouseY = _canvas.mouseY;
}

//=======================
// 作品の階層変更用ボタン
//=======================
mouseup_changeButton = (_bitmap) => {
    _bitmap.removeEventListener("mouseup");
    _screenShot = _canvas.screenShot();

    _bitmapArray.forEach(function(_bitmap) {
       let _randomNum = Math.floor(Math.random() * (_canvas.getDepthMax() + 1));
       _canvas.setDepthIndex(_bitmap, _randomNum);
    });
    _canvas.setDepthIndex(_text, 0); //_canvas.getDepthMax()); //最下位
    _canvas.setDepthIndex(_changeButton, _canvas.getDepthMax()); //最上位?????????????????????????????????????
    
    _canvas.addChild(_screenShot);
    _timerScreenShotID = setInterval(callback_screenShot, 25, _screenShot);
}

//===============================
// 作品の階層を変更（フェード）用
//===============================
callback_screenShot = (_screenShot) => {
    if (_screenShot.alpha > 0) {
        _screenShot.alpha -= 0.05;
    } else {
        clearInterval(_timerScreenShotID);
        _canvas.deleteChild(_screenShot);
        _screenShot = undefined;
        _changeButton.addEventListener("mouseup", mouseup_changeButton);
    }
}

//===================================
// 作品を押した時に実行（内部処理用）
//===================================
mousedown_bitmap = (_bitmap) => {
    //console.log("mouseDown: " + _bitmap.name);
    _canvas.setDepthIndex(_bitmap, _canvas.getDepthMax());
    _canvas.stopMouseDownEvent();
    _isMove = true;
    _choiceBitmap = _bitmap;

    _disX = _canvas.mouseX - _bitmap.x;
    _disY = _canvas.mouseY - _bitmap.y;
}

//===========================
// 作品をクリックした時に実行
//===========================
mouseup_bitmap = (_bitmap) => {
    console.log("mouseUp: " + _bitmap.name);
    _canvas.stopMouseUpEvent();
    _isMove = false;
    _choiceBitmap = undefined;
}

//===================
// ホームに戻るボタン
//===================
mouseup_home = (_bitmap) => {
    //homeボタンの削除
    _homeButton.removeEventListener("mouseup");
    _canvas.deleteChild(_homeButton); //すぐ消去する場合

    //changeボタンの削除
    _changeButton.removeEventListener("mouseup");
    _canvas.deleteChild(_changeButton); //すぐ消去する場合

    //各作品をランダムに登場させるためのタイマー設定
    _bitmapArray.forEach(function(_bitmap) {
        _bitmap.__timerID = setTimeout(callback_start, 500*Math.random(), _bitmap);
        _bitmap.__disY = _bitmap.y + 200; //カードの高さ
        //マウスイベントリスナーの削除
        _bitmap.removeEventListener("mousedown");
        _bitmap.removeEventListener("mouseup");
        _bitmap.removeEventListener("mouseupoutside");
    });

    _canvas.removeEventListener("enterframe");
    _canvas.addEventListener("enterframe", enterframe_canvas3);
}

//===========================
//（3）全作品が上へ消えていく
//===========================
enterframe_canvas3 = (_canvas) => {
    for (let i=0; i<_bitmapArray.length; i++) {
        let _bitmap = _bitmapArray[i];
        if (_bitmap.__count != undefined) {
            _bitmap.__count += 0.03;
            if (_bitmap.y > -200) {
                _bitmap.y = _bitmap.y - 5;
                _bitmap.y = -200 + _bitmap.__disY * Math.cos(_bitmap.__count);
            } else {
                _bitmap.y = -200;
                _bitmapArray.splice(i,1); //登場し終えたものを_bitmapArrayCopyから削除                
                if (_bitmapArray.length == 0) { //全て登場し終えたら...
                    _canvas.removeEventListener("enterframe");
                    location.href = "../main1/index1.html";
                }
            }
        }
    }
    _canvas.drawScreen("#fefefe");
}