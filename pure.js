//録音
window.onload = function () {

    document.getElementById("p1").style.display = "none";

}

//時計
function showClock1() {
    var nowTime = new Date();
    var nowHour = nowTime.getHours();
    var nowMin = nowTime.getMinutes();
    var nowSec = nowTime.getSeconds();
    var msg = "プレトレが" + nowHour + ":" + nowMin + ":" + nowSec + "ぐらいをおしらせします";
    document.getElementById("zikan").innerHTML = msg;
}
setInterval('showClock1()', 1000);

//コピー機能
function copy() {
    //範囲を指定
    let range = document.createRange();
    let span = document.getElementById('span');
    range.selectNodeContents(span);

    //指定した範囲を選択状態にする
    let selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    //コピー
    document.execCommand('copy');
    alert('コピーしました');
}
//削除機能
function clearTextarea() {
    var textareaForm = document.getElementById("kesu");
    textareaForm.value = '';
}

//文字数カウント機能
function ShowLength(str) {
    document.getElementById("inputlength").innerHTML = str.length + "文字";
}

//タイマー
var timer1; //タイマーを格納する変数


//カウントダウン関数を1000ミリ秒毎に呼び出す関数
function cntStart() {
    document.timer.elements[2].disabled = true;
    timer1 = setInterval("countDown()", 1000);
}

//タイマー停止関数
function cntStop() {
    document.timer.elements[2].disabled = false;
    clearInterval(timer1);
}

//カウントダウン関数
function countDown() {
    var min = document.timer.elements[0].value;
    var sec = document.timer.elements[1].value;

    if ((min == "") && (sec == "")) {
        alert("時刻を設定してください！");
        reSet();
    }
    else {
        if (min == "") min = 0;
        min = parseInt(min);

        if (sec == "") sec = 0;
        sec = parseInt(sec);

        tmWrite(min * 60 + sec - 1);
    }
}

//残り時間を書き出す関数
function tmWrite(int) {
    int = parseInt(int);

    if (int <= 0) {
        reSet();
        alert("時間です！");
    }
    else {
        //残り分数はintを60で割って切り捨てる
        document.timer.elements[0].value = Math.floor(int / 60);
        //残り秒数はintを60で割った余り
        document.timer.elements[1].value = int % 60;
    }
}

//フォームを初期状態に戻す（リセット）関数
function reSet() {
    document.timer.elements[0].value = "0";
    document.timer.elements[1].value = "0";
    document.timer.elements[2].disabled = false;
    clearInterval(timer1);
}

