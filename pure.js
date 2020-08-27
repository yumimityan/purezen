window.onload = function () {

    document.getElementById("p1").style.display = "none";

}

function showClock1() {
    var nowTime = new Date();
    var nowHour = nowTime.getHours();
    var nowMin = nowTime.getMinutes();
    var nowSec = nowTime.getSeconds();
    var msg = "プレトレが" + nowHour + ":" + nowMin + ":" + nowSec + "ぐらいをおしらせします";
    document.getElementById("RealtimeClockArea").innerHTML = msg;
}
setInterval('showClock1()', 1000);




$(".tab_label").on("click", function () {
    var $th = $(this).index();
    $(".tab_label").removeClass("active");
    $(".tab_panel").removeClass("active");
    $(this).addClass("active");
    $(".tab_panel").eq($th).addClass("active");
});



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

function clearTextarea() {
    var textareaForm = document.getElementById("kesu");
    textareaForm.value = '';
}



function ShowLength(str) {
    document.getElementById("inputlength").innerHTML = str.length + "文字";
}




//タイマー
var timer1; //タイマーを格納する変数（タイマーID）の宣言


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

//録音機能
// for html
const downloadLink = document.getElementById('download');
const stopButton = document.getElementById('stop');

// for audio
let audio_sample_rate = null;
let scriptProcessor = null;
let audioContext = null;

// audio data
let audioData = [];
let bufferSize = 1024;

let saveAudio = function () {
    downloadLink.href = exportWAV(audioData);
    downloadLink.download = 'test.wav';
    downloadLink.click();

    audioContext.close().then(function () {
        stopButton.setAttribute('disabled', 'disabled');
    });
}

// export WAV from audio float data
let exportWAV = function (audioData) {

    let encodeWAV = function (samples, sampleRate) {
        let buffer = new ArrayBuffer(44 + samples.length * 2);
        let view = new DataView(buffer);

        let writeString = function (view, offset, string) {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        let floatTo16BitPCM = function (output, offset, input) {
            for (let i = 0; i < input.length; i++, offset += 2) {
                let s = Math.max(-1, Math.min(1, input[i]));
                output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            }
        };

        writeString(view, 0, 'RIFF');  // RIFFヘッダ
        view.setUint32(4, 32 + samples.length * 2, true); // これ以降のファイルサイズ
        writeString(view, 8, 'WAVE'); // WAVEヘッダ
        writeString(view, 12, 'fmt '); // fmtチャンク
        view.setUint32(16, 16, true); // fmtチャンクのバイト数
        view.setUint16(20, 1, true); // フォーマットID
        view.setUint16(22, 1, true); // チャンネル数
        view.setUint32(24, sampleRate, true); // サンプリングレート
        view.setUint32(28, sampleRate * 2, true); // データ速度
        view.setUint16(32, 2, true); // ブロックサイズ
        view.setUint16(34, 16, true); // サンプルあたりのビット数
        writeString(view, 36, 'data'); // dataチャンク
        view.setUint32(40, samples.length * 2, true); // 波形データのバイト数
        floatTo16BitPCM(view, 44, samples); // 波形データ

        return view;
    };

    let mergeBuffers = function (audioData) {
        let sampleLength = 0;
        for (let i = 0; i < audioData.length; i++) {
            sampleLength += audioData[i].length;
        }
        let samples = new Float32Array(sampleLength);
        let sampleIdx = 0;
        for (let i = 0; i < audioData.length; i++) {
            for (let j = 0; j < audioData[i].length; j++) {
                samples[sampleIdx] = audioData[i][j];
                sampleIdx++;
            }
        }
        return samples;
    };

    let dataview = encodeWAV(mergeBuffers(audioData), audio_sample_rate);
    let audioBlob = new Blob([dataview], { type: 'audio/wav' });
    console.log(dataview);

    let myURL = window.URL || window.webkitURL;
    let url = myURL.createObjectURL(audioBlob);
    return url;
};

// stop button
stopButton.addEventListener('click', function () {
    saveAudio();
    console.log('saved wav');
});

// save audio data
var onAudioProcess = function (e) {
    var input = e.inputBuffer.getChannelData(0);
    var bufferData = new Float32Array(bufferSize);
    for (var i = 0; i < bufferSize; i++) {
        bufferData[i] = input[i];
    }

    audioData.push(bufferData);
};

// getusermedia
let handleSuccess = function (stream) {
    audioContext = new AudioContext();
    audio_sample_rate = audioContext.sampleRate;
    console.log(audio_sample_rate);
    scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
    var mediastreamsource = audioContext.createMediaStreamSource(stream);
    mediastreamsource.connect(scriptProcessor);
    scriptProcessor.onaudioprocess = onAudioProcess;
    scriptProcessor.connect(audioContext.destination);

    console.log('record start?');

    // when time passed without pushing the stop button
    setTimeout(function () {
        console.log("10 sec");
        if (stopButton.disabled == false) {
            saveAudio();
            console.log("saved audio");
        }
    }, 10000);
};

// getUserMedia
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess);

// google 翻訳
button[3].onclick = () => {
    window.open(siteLink[2] + wordInput.value);
};


