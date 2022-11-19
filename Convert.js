/**
 * デビルマン音声生成プログラム
 * Develop By Taka005
 */
function ReadFile(text){//ファイル読み込み
  const wav = fetch(`./sounds/${text}.wav`)
    .then(res=>res.blob())
    //.then(d=>d.arraybuffer())
    .catch(e=>{
      console.log(e)
      alert(e)
    })
  return wav
}

function ReadBlob(blob){//Blob解析
  const reader = new FileReader();  
  let wav;
  reader.onload = ()=>{
    wav = new TWaveFormat(new Uint8Array(reader.result));
  };

  reader.readAsArrayBuffer(blob);

  return wav;
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

const form = document.getElementById("form");
form.addEventListener("submit",async(event)=>{
  event.preventDefault();
  const input = document.getElementById("input");
  const text = input.value.split("")
  if(!input.value.match(/^[ぁ-んー　]+$/)) return alert("全て「ひらがな」にしてください");
  
  text.forEach(async(e,i)=>{
    const blob1 = await ReadFile(e);
    const blob2 = await ReadFile(text[i+1]);
    const wav1 = await ReadBlob(blob1);
    const wav2 = await ReadBlob(blob2);
    Output(Convert(wav1,wav2))
  });
})