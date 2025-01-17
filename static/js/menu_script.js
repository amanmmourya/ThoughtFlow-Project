// import statement
const socket = io('http://127.0.0.1:8000')
// prevent default
let formofsubmit=document.querySelector('#formofsubmit')
formofsubmit.addEventListener('submit',(evt)=>{
    evt.preventDefault()
})
// document node fetch
let searchtext = document.getElementById('searchtext')
let submitsearch = document.getElementById('submitsearch')
let foundusers = document.getElementById('foundusers')
let searcharea = document.querySelector('.searcharea')
let myusername = document.querySelector('#myusername')
let usernamediv = document.querySelector('#usernamediv')
let submittext = document.querySelector('#submittext')
let usertextarea=document.querySelector('#usertextarea')
let ejsuiddiv=document.querySelector('#ejsuniqueid')
var founduserdata = ''
var currUsername = myusername.innerText.trim()
var currUniqueid = ejsuiddiv.innerHTML.trim()
console.log(currUsername," ",currUniqueid)
let mySocketId=''
let toWhom='.'
// audio playing functions
const rting=new Audio('../audio/rting.wav')
const sting=new Audio('../audio/sendsound.mp3')
// defining username and id for other pages
let usernameinfoh=document.querySelector('#nusernameinfo')
let uniqueidinfoh=document.querySelector('#nuniqueidinfo')
usernameinfoh.value=currUsername
uniqueidinfoh.value=currUniqueid
console.log('usernameinfoh',usernameinfoh.value)
// time returning function
let getTime=function(){
    let date=new Date()
    let hr=date.getHours()
    let min=date.getMinutes()
    let timeString=`${hr}:${min}`
    return timeString
} 
// apppenders
// first we will select the node required for appending
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
// event listeners
submitsearch.addEventListener('click', () => {
    socket.emit('searchtextSent', searchtext.value)
})
submittext.addEventListener('click',()=>{
    if(usertextarea.value==''){
        alert("Type some message to send")
    }
    else if(toWhom=='.'){
        alert("No user selected. Search the users across database and then select them to talk with")
    }else{
    appendSentMessage('You',usertextarea.value,getTime())
    socket.emit('newMessageSent',currUsername,currUniqueid,toWhom,usertextarea.value)
    usertextarea.value=''
    }
})
// socket listeners
// socket.on('getCurrentUserData', object => {
//     if(currUsername=='.'){
//     console.log(`You are a user ${object['username']}`)
//     currUsername = object['username']
//     currUniqueid = object['uniqueid']
//     myusername.innerText = currUsername
//     socket.emit('foundANewSocket',mySocketId,currUniqueid)
//     }
    
// })
// socket.on('connect', () => {
//     mySocketId=socket.id
// });
socket.on('getFoundUsers', array => {
    foundusers.innerHTML = ''
    array.forEach((object) => {
        let aUser = document.createElement('div')
        let div1 = document.createElement('div')
        let div2 = document.createElement('div')
        let div3 = document.createElement('div')

        div1.className = 'aUserdiv1'
        div2.className = 'aUserdiv2'
        div3.className = 'aUserdiv3'
        aUser.className = 'founduserdata'

        div2.innerText = object['username']
        div3.innerText = object['uniqueid']

        aUser.appendChild(div1)
        aUser.appendChild(div2)
        aUser.appendChild(div3)
        foundusers.appendChild(aUser)
        founduserdata = aUser
        founduserdata.addEventListener('click', () => {
            toWhom=array[0]['uniqueid']
            usernamediv.innerText = array[0]['username']
            socket.emit('findOrCreateConnection', currUniqueid, array[0]['uniqueid'])
        })
    })
})
socket.on('getPastMessages',(data,uid)=>{
    messagecontent.innerHTML=''
    if(currUniqueid==uid){
        data.forEach((object)=>{
            if(object['sender']==currUniqueid){
                // sent append
                appendSentMessage('You',object['msg'],object['time'])
            }else{
                // receive append
                appendReceivedMessage(object['sender'],object['msg'],object['time'])
            }
        })
        messagecontent.scrollTop=messagecontent.scrollHeight
    
    }
})
socket.on('receiveAMessage',(sendername,sender,receiverId,msg,timeString)=>{
    
    if(receiverId==currUniqueid && sender==toWhom){
        appendReceivedMessage(sendername,msg,timeString)
    }
   
})
