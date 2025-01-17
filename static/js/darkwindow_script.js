const socket=io('http://127.0.0.1:8000')

// node fetching from document object
let darkformsubmit=document.querySelector('#darkformsubmit')
let usertextarea=document.querySelector('#usertextarea')

// fetching uniqueid and darkid
let uniqueiddiv=document.querySelector('#runiqueid')
let darkiddiv=document.querySelector('#rdarkid')
let admindiv=document.querySelector('#radminname')
const adminid=admindiv.value.trim()
const uniqueid=uniqueiddiv.value.trim()
const darkid=darkiddiv.value.trim()
// audio playing functions
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

// message appenders
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
const appendSentMessage2=function(username,msg,time){
    let tempdiv=document.createElement('div')
    tempdiv.className='sentcontent'
    tempdiv.style.backgroundColor='#40C9A2'
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
const appendReceivedMessage2=function(username,msg,time){
    let tempdiv=document.createElement('div')
    tempdiv.className='receivedcontent'
    tempdiv.style.backgroundColor='#40C9A2'
    tempdiv.innerText=`${username} : ${msg}`
    let childdiv=document.createElement('div')
    childdiv.className='timeofmsg'
    childdiv.innerText=time
    tempdiv.appendChild(childdiv)
    messagecontent.appendChild(tempdiv)
    messagecontent.scrollTop=messagecontent.scrollHeight
    rting.play()
}

// requesting for past messages
socket.emit('givePastMessageToDark',uniqueid,darkid)
socket.on('takePastMessages',(data)=>{
    data.forEach(object => {
        if(object['sender']==uniqueid){
            if(object['sender']==adminid){
                appendSentMessage2('You',object['msg'],object['time'])
            }else{
                appendSentMessage('You',object['msg'],object['time'])
            }
        }else{
            if(object['sender']==adminid){
                appendReceivedMessage2(object['sender'],object['msg'],object['time'])
            }else{
                appendReceivedMessage('Anonymous User',object['msg'],object['time'])
            }
        }
    });
})
// evt listeners
darkformsubmit.addEventListener('submit',(evt)=>{
    evt.preventDefault()
    if(usertextarea.value==''){
        alert("Please write something to send")
    }else{
    if(uniqueid==adminid){
        appendSentMessage2('You',usertextarea.value,getTime())
    }else{
        appendSentMessage('You',usertextarea.value,getTime())
    }
    console.log(usertextarea.value)
    socket.emit('newDarkMessageSent',uniqueid,darkid,usertextarea.value)
    usertextarea.value=''
    }
})
// socket listeners
socket.on('receiveMessageFromDark',(suniqueid,sdarkid,msg,timeString)=>{
    if(sdarkid==darkid){

        if(adminid==suniqueid){
            appendReceivedMessage2(adminid,msg,timeString)
        }else{
            appendReceivedMessage('Anonymous User',msg,timeString)
        }
        
    }
})