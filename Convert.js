/**
 * デビルマン音声生成プログラム
 * Develop By Taka005
 */

async function Run(){
  const input = document.getElementById("input");
  const text = input.value.split("")
  if(!input.match(/^[ぁ-んー　]+$/)) return alert("全て「ひらがな」にしてください");
  
  text.forEach((e,i)=>{
    const wav1 = await ReadBlob(await ReadFile(e));
    const wav2 = await ReadBlob(await ReadFile(text[i+1]));
    Output(await Convert(wav1,wav2))
  });
}

function ReadFile(text){//ファイル読み込み
  return fetch(`./sounds/${text}.wav`)
    .then(res=>res.blob)
    .catch(e=>{
      console.log(e);
      alert(e)
    });
}

function ReadBlob(blob){//Blob解析
  const reader = new FileReader();  
  const wav;
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

Run()
return;
function test(){
  let wav1;
  let wav2;
  const input = document.getElementById("input");
  const value = input.value.split("")

  try{
    for(let r=0;r<value.length-1;r++){
    
      for(let e=0;e<2;e++){
        const reader = new FileReader();  
        reader.onload = ()=>{
          if(i === 0){
            wav1 = new TWaveFormat(new Uint8Array(reader.result));
          }else{
            wav2 = new TWaveFormat(new Uint8Array(reader.result));
          }
        };
  
        if(i === 0){
          fetch(`./sounds/${value[i]}.wav`)
            .then(res=>res.blob)
            .then(d=>reader.readAsArrayBuffer(d))
        }else{
          fetch(`./sounds/${value[i+1]}.wav`)
            .then(res=>res.blob)
            .then(d=>reader.readAsArrayBuffer(d))
        }
      }

      let st = new TWaveFormat(wav1.SaveToStream(16,true,48000,true));         
      let en = new TWaveFormat(wav2.SaveToStream(16,true,48000,true));
    
      let data1 = st.getData();
      let data2 = en.getData();
    
      let data = {};
      let tmpL = [];
      let tmpR = [];    
    
      for(let i=0;i<data1.L.length;i++){
        tmpL.push(data1.L[i]); 
      }
      for(let i=0;i<data2.L.length;i++){
        tmpL.push(data2.L[i]); 
      }    
     
      for(let i=0;i<data1.R.length;i++){
        tmpR.push(data1.R[i]); 
      }
      for(let i=0;i<data2.R.length;i++){
        tmpR.push(data2.R[i]); 
      }
 
      data.L = tmpL;
      data.R = tmpR;
      
      var F = wav1.WriteStream(16,data,48000);
  }
    F.SaveToFile("debiruman.wav","audio/wav");       

  }catch(e){
    alert(e);
    console.error(e);         
  }
  
  return false;
}     