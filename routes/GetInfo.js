// function GetInfo(){
//     var XHP = new XMLHttpRequest();
//     console.log("Get function in progress");
//     XHP.onreadystatechange = function(){
//         if(this.readyState==4 && this.status==200){
//             document.getElementById('DisplayData').innerHTML=JSON.stringify(XHP.responseText);
//             console.log(XHP.responseText);
//         }
//     };
//     XHP.open('get', 'http://localhost:3000/info_get', true);
//     XHP.setRequestHeader('Content-Type', 'text-plain');
//     XHP.send();
//     console.log("Get function Done");
// }