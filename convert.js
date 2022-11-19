var wav1;
var wav2;
 
function run(){
  if(!wav1 && !wav2) return false;
      
  try{
    // Convert 1
    var file = wav1.SaveToStream(16,true,48000,true);
    var st = new TWaveFormat(file);         
    
    // Convert 2
    var file = wav2.SaveToStream(16,true,48000,true);
    var en = new TWaveFormat(file);
    
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
    
    // Save
    var F = wav1.WriteStream(16,data,48000);
    F.SaveToFile("debiruman.wav","audio/wav");                

  }catch(e){
    alert("Could not acquire waveform data. (unsupported format)");
    console.error(e);         
  }
  
  return false;
}
 
function onAddFile(event, val) {
  var files;
  var reader = new FileReader();
  
  if(event.target.files){
    files = event.target.files;
  } 
  
  reader.onload = function(){
 
    try{
      var wav;
      if(val == "1"){
         wav1 = new TWaveFormat(new Uint8Array(reader.result));
         wav = wav1;
      }else{
         wav2 = new TWaveFormat(new Uint8Array(reader.result));
         wav = wav2;
      }  
    }catch(e){
      alert(e);
      console.error(e); 
    }    
  };
  
  if (files[0]){    
    reader.readAsArrayBuffer(files[0]); 
  }
}     