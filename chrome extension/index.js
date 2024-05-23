
 document.getElementById("scan_text").onclick = function(){

    let tAndC= document.getElementById("input").value;

    console.log(tAndC);

    window.location.replace("success.html");

 }


 

 document.getElementById("copy").onclick = function() {
   let copy = document.getElementById("output").value;

   navigator.clipboard.writeText(copy).then(function() {
       window.alert("Copied the text: " + copy);
   }).catch(function(err) {
       console.error('Could not copy text: ', err);
   });
}


document.getElementById("summarize_again").onclick = function(){

   window.location.replace("index.html");
   
}





