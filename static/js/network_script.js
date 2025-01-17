const socket=io('http://127.0.0.1:8000')


// importing username uniqueid networkname and networkid

const usernamediv=document.querySelector('#myusername')
const uniqueiddiv=document.querySelector('#myuniqueid')
const networknamediv=document.querySelector('#networkname')
const networkiddiv=document.querySelector('#networkid')

const username=usernamediv.innerHTML.trim()
const uniqueid=uniqueiddiv.innerHTML.trim()
const networkname=networknamediv.innerHTML.trim()
const networkid=networkiddiv.innerHTML.trim()
console.log(username,uniqueid,networkname,networkid)
// request for past messages
socket.emit('requestingPastMessages',networkid)

// preventing default and get user message
let submitdiv=document.querySelector('#submitusertextform')
let usertext=document.querySelector('#usertextarea')
// audio 
const rting=new Audio('../audio/rting.wav')
const sting=new Audio('../audio/sendsound.mp3')
// time giving function
let getTime=function(){
    let date=new Date()
    let hr=date.getHours()
    let min=date.getMinutes()
    let timeString=`${hr}:${min}`
    return timeString
} 
// appenders
let messagecontent=document.querySelector('#messagecontent') 

const appendSentMessage=function(username,msg,time){
    let tempdiv=document.createElement('div')
    tempdiv.className='sentcontent'
    tempdiv.innerText=`${username} : ${msg}`
    let childdiv=document.createElement('div')
    childdiv.className='timeofmsg'
    childdiv.innerText=time
    tempdiv.appendChild(childdiv)
    messagecontent.appendChild(tempdiv)
    messagecontent.scrollTop=messagecontent.scrollHeight
    sting.play()
}
const appendReceivedMessage=function(username,msg,time){
    let tempdiv=document.createElement('div')
    tempdiv.className='receivedcontent'
    tempdiv.innerText=`${username} : ${msg}`
    let childdiv=document.createElement('div')
    childdiv.className='timeofmsg'
    childdiv.innerText=time
    tempdiv.appendChild(childdiv)
    messagecontent.appendChild(tempdiv)
    messagecontent.scrollTop=messagecontent.scrollHeight
    rting.play()
}
// evt listeners
submitdiv.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    let message=usertext.value
    if(message==''){
        alert("Please type some text to send")
    }else{
        appendSentMessage('You',usertext.value,getTime())
        socket.emit('newMessageToNetwork',username,networkid,message)
        usertext.value=''
    }
})
// socket listeners
socket.on('receiveFromNetwork',(sendername,somenetworkid,msg,timeString)=>{
    if(networkid==somenetworkid){
        appendReceivedMessage(sendername,msg,timeString)
    }
})
socket.on('getPastNetworkMessages',(data)=>{
    
        data.forEach(object => {
            if(object['sender']==username){
                appendSentMessage('You',object['msg'],object['time'])
            }else{
                appendReceivedMessage(object['sender'],object['msg'],object['time'])
            }
        });
    
})