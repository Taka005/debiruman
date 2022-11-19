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
  const URL = window.URL||window.webkitURL;
  AudioElement.src = URL.createObjectURL(Audio);
}

function Replace(text){
  text.replace("っ","つ")//小さい音
      .replace("ぁ","あ")
      .replace("ぃ","い")
      .replace("ぅ","う")
      .replace("ぇ","え")
      .replace("ぉ","お")
      .replace("ゃ","や")
      .replace("ゅ","ゆ")
      .replace("ょ","よ")
      .replace("が","か")//か行
      .replace("ぎ","き")
      .replace("ぐ","く")
      .replace("げ","け")
      .replace("ご","こ")
      .replace("ざ","さ")//さ行
      .replace("じ","し")
      .replace("ず","す")
      .replace("ぜ","せ")
      .replace("ぞ","そ")
      .replace("ぢ","ち")//た行(「だ」は例外)
      .replace("づ","つ")
      .replace("で","て")
      .replace("ど","と")
      .replace("ば","は")//は行 濁音
      .replace("び","ひ")
      .replace("ぶ","ふ")
      .replace("べ","へ")
      .replace("ぼ","ほ")
      .replace("ぱ","は")//は行 半濁音
      .replace("ぴ","へ")
      .replace("ぷ","ふ")
      .replace("ぺ","へ")
      .replace("ぽ","ほ")

  return text;
}
const form = document.getElementById("form");
form.addEventListener("submit",async(event)=>{
  event.preventDefault();
  let input = document.getElementById("input");
  if(!input.value.match(/^[ぁ-んー　]+$/)) return alert("全て「ひらがな」にしてください");
    const text = Replace(input.value).split("");
    
    const blob1 = await ReadFile(text[0]);
    const blob2 = await ReadFile(text[1]);
    const wav1 = await ReadBlob(blob1);
    const wav2 = await ReadBlob(blob2);
    Convert(wav1,wav2).SaveToFile("debiruman.wav","audio/wav");                
})