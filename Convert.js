/**
 * デビルマン音声生成プログラム
 * Develop By Taka005
 */
async function ReadFile(text){//ファイル読み込み
  const wav = await fetch(`./sounds/${text}.wav`)
    .then(res=>res.blob())
    .catch(e=>{
      console.log(e)
      alert(e)
    })
  return wav;
}

async function ReadBlob(blob){//Blob解析
  return new Promise((resolve)=>{
    const reader = new FileReader();
    reader.onload = ()=>{
      resolve(new TWaveFormat(new Uint8Array(reader.result)));
    };
    reader.readAsArrayBuffer(blob);
  });
}

function Convert(wav1,wav2){//Wavファイル結合
  try{
    const st = new TWaveFormat(wav1.SaveToStream(16,true,48000,true));         
    const en = new TWaveFormat(wav2.SaveToStream(16,true,48000,true));

    let data1 = st.getData();
    let data2 = en.getData();
    let data = {};
    let tmpL = [];
    let tmpR = [];    

    for(let i=0;i<data1.L.length;i++){//L1
      tmpL.push(data1.L[i]); 
    }
    for(let i=0;i<data2.L.length;i++){//L2
      tmpL.push(data2.L[i]); 
    }    
 
    for(let i=0;i<data1.R.length;i++){//R1
      tmpR.push(data1.R[i]); 
    }
    for(let i=0;i<data2.R.length;i++){//R2
      tmpR.push(data2.R[i]); 
    }

    data.L = tmpL;
    data.R = tmpR;
    return wav1.WriteStream(16,data,48000);
  }catch(e){
    console.log(e);
    alert(e);
  }
}

function Output(wav){//Web上に出力
  const AudioElement = document.getElementById("audio");
  const Audio = new Blob([wav],{type:"audio/wav"});
  AudioElement.src = window.URL.createObjectURL(Audio);
}

function Replace(text){
  const data = text
    .replace(/っ/g,"つ")//小さい音
    .replace(/ぁ/g,"あ")
    .replace(/ぃ/g,"い")
    .replace(/ぅ/g,"う")
    .replace(/ぇ/g,"え")
    .replace(/ぉ/g,"お")
    .replace(/ゃ/g,"や")
    .replace(/ゅ/g,"ゆ")
    .replace(/ょ/g,"よ")
    .replace(/が/g,"か")//か行
    .replace(/ぎ/g,"き")
    .replace(/ぐ/g,"く")
    .replace(/げ/g,"け")
    .replace(/ご/g,"こ")
    .replace(/ざ/g,"さ")//さ行
    .replace(/じ/g,"し")
    .replace(/ず/g,"す")
    .replace(/ぜ/g,"せ")
    .replace(/ぞ/g,"そ")
    .replace(/ぢ/g,"ち")//た行(「だ」は例外)
    .replace(/づ/g,"つ")
    .replace(/で/g,"て")
    .replace(/ど/g,"と")
    .replace(/ば/g,"は")//は行 濁音
    .replace(/び/g,"ひ")
    .replace(/ぶ/g,"ふ")
    .replace(/べ/g,"へ")
    .replace(/ぼ/g,"ほ")
    .replace(/ぱ/g,"は")//は行 半濁音
    .replace(/ぴ/g,"へ")
    .replace(/ぷ/g,"ふ")
    .replace(/ぺ/g,"へ")
    .replace(/ぽ/g,"ほ")

  return data;
}

const form = document.getElementById("form");
form.addEventListener("submit",async(event)=>{
  event.preventDefault();
  let input = document.getElementById("input");
  if(!input.value||input.value.length<2) return alert("二文字以上で入力してください")
  if(!input.value.match(/^[ぁ-んー　]+$/)) return alert("全て「ひらがな」にしてください");
    const text = Replace(input.value).split("");
    console.log(text)
    
  try{
    let wav;
    let wav1;
    let wav2;
    let blob1;
    let blob2;
    for(let i=0;i<text.length-1;i++){
      if(i==0){
        blob1 = await ReadFile(text[i]);
      }
      blob2 = await ReadFile(text[i+1]);
      wav1 = await ReadBlob(blob1);
      wav2 = await ReadBlob(blob2);
      wav = Convert(wav1,wav2);
      blob1 = new Blob([new Uint8Array(wav)],{type:"audio/wav"})
      console.log(blob1)
    }
  //Output(new Uint8Array(wav))
  wav.SaveToFile("debiruman.wav","audio/wav");   
  }catch(e){
    console.log(e)
    alert(e)
  }             
})