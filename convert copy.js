function run(){
  let wav1;
  let wav2;
  const input = document.getElementById("input");
  const value = input.value.split("")

  try{

    value.forEach(e=>{
    
    const reader = new FileReader();  
    reader.onload = ()=>{
        var wav;
        if(val == "1"){
          wav1 = new TWaveFormat(new Uint8Array(reader.result));
          wav = wav1;
        }else{
          wav2 = new TWaveFormat(new Uint8Array(reader.result));
          wav = wav2;
        }  
    };
  
    fetch(`./sounds/${text}.mp3`)
      .then(res=>res.blob)
      .then(d=>reader.readAsArrayBuffer(d)) 

    // Convert 1
    var st = new TWaveFormat(wav1.SaveToStream(16,true,48000,true));         
    // Convert 2
    var en = new TWaveFormat(wav2.SaveToStream(16,true,48000,true));
    
    // Raw
    var data1 = st.getData();
    var data2 = en.getData();
    
    var data = {}, tmpL = [], tmpR = [];    
    
    // L
    for(var i=0;i<data1.L.length;i++){
      tmpL.push(data1.L[i]); 
    }
    for(var i=0;i<data2.L.length;i++){
      tmpL.push(data2.L[i]); 
    }    
    // R 
    for(var i=0;i<data1.R.length;i++){
      tmpR.push(data1.R[i]); 
    }
    for(var i=0;i<data2.R.length;i++){
      tmpR.push(data2.R[i]); 
    }
 
    data.L = tmpL;
    data.R = tmpR;
  })
    // Save
    var F = wav1.WriteStream(16,data,48000);
    F.SaveToFile("debiruman.wav","audio/wav");       

  }catch(e){
    alert(e);
    console.error(e);         
  }
  
  return false;
}     