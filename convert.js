var wav1;
var wav2;
 
function run(){
  if (!document.getElementById("num_Hz").checkValidity()){
    return true;
  }   
      
  var bit       = parseInt(document.getElementById("lst_bit").value,10);
  var frequency = parseInt(document.getElementById("num_Hz").value,10);
  var channel   = parseInt(document.getElementById("lst_channel").value,10);
  
  var stereo; 
  if (channel == 2){
    stereo = true;
  }else{  
    stereo = false;
  }        
  
  if(!wav1 && !wav2) return false;
  
console.time("run");     
      
  try{
    
    // Convert 1
    var file = wav1.SaveToStream(bit, stereo, frequency, true);
    var st = new TWaveFormat(file);         
    
    // Convert 2
    var file = wav2.SaveToStream(bit, stereo, frequency, true);
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
    if(data1.R.length != 0){ 
      for(var i=0;i<data1.R.length;i++){
        tmpR.push(data1.R[i]); 
      }
      for(var i=0;i<data2.R.length;i++){
        tmpR.push(data2.R[i]); 
      }    
    }
 
    data.L = tmpL;
    data.R = tmpR;
    
    // Save
    var F = wav1.WriteStream(bit, data, frequency);
    F.SaveToFile("debiruman.wav","audio/wav");                
    
     
  }catch(e){
    alert("Could not acquire waveform data. (unsupported format)");
    console.error(e);         
  }
  
console.timeEnd("run");
  
  return false;
}
 
function onAddFile(event, val) {
  var files;
  var reader = new FileReader();
  
  if(event.target.files){
    files = event.target.files;
  } 
  
  reader.onload = function (event) {
 
    try{
      
      var wav;
      if(val == "1"){
         wav1 = new TWaveFormat(new Uint8Array(reader.result));
         wav = wav1;
      }else{
         wav2 = new TWaveFormat(new Uint8Array(reader.result));
         wav = wav2;
      }     
      
      var str = wav.Analyst.WaveFomat.wBitsPerSample + "bit ";
      str += wav.Analyst.WaveFomat.nSamplesPerSec + "Hz ";
     
      if(wav.Analyst.WaveFomat.nChannels == 1){
        str += " Mono ";
      }else{
        str += " Stereo ";
      }
      
      str += Math.round(wav.Analyst.time)/1000 + "s";
      
      document.getElementById("msg"+ val).innerHTML =str;  
     
    }catch(e){
      alert(e);
      console.error(e); 
    }    
  };
  
  if (files[0]){    
    reader.readAsArrayBuffer(files[0]); 
  }
}     