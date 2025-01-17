//Importing required packages
const express = require('express');
const path = require('path');
// Imorting mongoose
const mongoose = require('mongoose')
let connectMongoose = async function () {
    await mongoose.connect('mongodb://127.0.0.1:27017/thoughtflowDatabase', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}
connectMongoose()
// Importing Database Schema models
const allUser = require('./model/allUser');
const conMsgCollection = require('./model/conMsgCollection')
const allNetwork = require('./model/allNetworks')
const netMsgCollection = require('./model/netMsgCollection')
const allDark=require('./model/allDarks')
const darkMsgCollection=require('./model/darkMsgCollection')
// Defining port and initializing express app
const port = process.env.PORT || 3000;
const app = express();
// Importing socket.io and requirements
const io = require('socket.io')(8000, {
    cors: "https://127.0.0.1:3000",
    methods: ['GET', 'POST']
})
// Defining users in the socket
let users = {}
// const Server=socketIo.Server
// const http=require('http')
// const server=http.createServer(app)
// const io = new Server(server)

// allowing static files to load on server
app.use(express.static(path.join(__dirname, '../static')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(path.join(__dirname, '../static/audio')))
// Setting ejs template engine
app.set('view engine', 'ejs')
// Routes for the server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/html/home.html'));
})
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/html/signup.html'));
})
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/html/signin.html'));
})
app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/html/menu.html'));
})
app.post('/cnetwork', async (req, res) => {
    const myusername = req.body.myusername
    const myuniqueid = req.body.myuniqueid
    const networkName = req.body.cnetname
    const networkId = req.body.cnetid
    // first we need to store the group in database
    if (await allNetwork.exists({ networkid: networkId })) {
        res.status(400).json({ 'message': 'The entered network id already exists.Please create a different one' })
    } else {
        const newNetwork = new allNetwork({ networkname: networkName, networkid: networkId })
        try {
            await newNetwork.save()
        } catch (error) {
            res.status(400)
            res.json({ 'message': error })
        }

        res.render(path.join(__dirname, '../static/html/network'), { myusername: myusername, myuniqueid: myuniqueid, networkname: networkName, networkid: networkId })
    }
})
app.post('/enetwork', async (req, res) => {
    const myusername = req.body.myusername
    const myuniqueid = req.body.myuniqueid
    const networkId = req.body.networkid

    if (await allNetwork.exists({ networkid: networkId })) {
        const aNetwork = await allNetwork.findOne({ networkid: networkId })
        const networkName = aNetwork['networkname']

        res.render(path.join(__dirname, '../static/html/network'), { myusername: myusername, myuniqueid: myuniqueid, networkname: networkName, networkid: networkId })

    } else {
        res.status(400)
        res.json({ 'message': "This network is not found" })
    }
})
app.get('/dark', (req, res) => {
    res.sendFile(path.join(__dirname, '../static/html/darkwindow.ejs'));
    
})
app.post('/cdark',async (req,res)=>{
    const username=req.body.myusername
    const uniqueid=req.body.myuniqueid
    const adminid=req.body.cadminid
    const darkid=req.body.cdarkid
    // save the dark window in database
    const newDark=new allDark({adminid:adminid,darkid:darkid})
    try{
       await newDark.save()
    }catch(error){
        res.status(400)
        res.json({'message':error})
    }
    // render the dark window file with required attributes
    res.render(path.join(__dirname,'../static/html/darkwindow'),{rusername:username,rdarkid:darkid,runiqueid:uniqueid,rdarkid:darkid,radminname:adminid})
})
app.post('/edark',async (req,res)=>{
    const username=req.body.myusername
    const uniqueid=req.body.myuniqueid
    const darkid=req.body.darkid
   
    if(await allDark.exists({darkid:darkid})){
        const aDark=await allDark.findOne({darkid:darkid})
        const adminid=aDark['adminid']
        res.render(path.join(__dirname,'../static/html/darkwindow'),{rusername:username,rdarkid:darkid,runiqueid:uniqueid,rdarkid:darkid,radminname:adminid})
        // get past messages
        
    }else{
        res.status(400)
        res.json({'message':'The following dark window does not exists'})
    }
    
})
app.post('/predark', (req, res) => {
    const myusername=req.body.usernameinfo
    const myuniqueid=req.body.uniqueidinfo
    res.render(path.join(__dirname, '../static/html/predarkwindow'),{rusername:myusername,runiqueid:myuniqueid})
})
app.post('/prenetwork', (req, res) => {
    let prenetwork_username = req.body.usernameinfo
    let prenetwork_uniqueid = req.body.uniqueidinfo
    res.render(path.join(__dirname, '../static/html/prenetwork'), { rusername: prenetwork_username, runiqueid: prenetwork_uniqueid })
})
app.post('/signuprequest', async (req, res) => {
    const un = req.body.fusername
    const uid = req.body.funiqueid
    const upass = req.body.fpassword
    //save the user in the database
    const newuser = new allUser({ username: un, uniqueid: uid, password: upass })
    try {
        await newuser.save()
    } catch (err) {
        res.status(400)
        res.json(err)

    }

    res.sendFile(path.join(__dirname, '../static/html/signin.html'))
})
app.post('/signinrequest', async (req, res) => {
    const uid = req.body.funiqueid
    const pass = req.body.fpassword
    // check for the user in database
    if (await allUser.exists({ uniqueid: uid })) {
        let objectofUser = await allUser.findOne({ uniqueid: uid });
        let passwordofUser = objectofUser['password'];
        if (passwordofUser == pass) {
            res.render(path.join(__dirname, '../static/html/menu'), { ejsusername: objectofUser['username'], ejsuniqueid: objectofUser['uniqueid'] })
            // io.on('connection',socket=>{

            //     socket.emit('getCurrentUserData',objectofUser)
            // })
        } else {
            res.status(400)
            res.json({ 'message': "password is incorrect" })
        }
    } else {
        res.status(400)
        res.json({ 'message': "User with this unique id is not found. Please sign up first!" })
    }

})
// Get current time function
let getTime = function () {
    let date = new Date()
    let hr = date.getHours()
    let min = date.getMinutes()
    let timeString = `${hr}:${min}`
    return timeString
}
// Socket handling
io.on('connection', socket => {
    socket.on('searchtextSent', async value => {

        // finding and storing users in the database with that unique id
        let founduserArray = await allUser.find({ uniqueid: value })
        socket.emit('getFoundUsers', founduserArray)
    })
    socket.on('findOrCreateConnection', async (currUniqueid, foundUserid) => {
        // we have to fetch all previous messages from the database
        const msgData = await conMsgCollection.find({ $or: [{ sender: currUniqueid, receiver: foundUserid }, { sender: foundUserid, receiver: currUniqueid }] }).sort({ createdAt: 1 })

        socket.emit('getPastMessages', msgData, currUniqueid)
    })
    socket.on('newMessageSent', async (sendername, sender, receiver, msg) => {
        // 1.to append the message to sender and receiver's msgwindow
        let currTime = getTime()
        socket.broadcast.emit('receiveAMessage', sendername, sender, receiver, msg, currTime)
        // 2.to store the messages into the database
        const newMsgDocument = new conMsgCollection({ sender: sender, receiver: receiver, msg: msg, time: currTime })
        await newMsgDocument.save()


    })
    socket.on('foundANewSocket', (sid, uid) => {
        users[uid] = sid;
    })
    socket.on('newMessageToNetwork', async (sendername, networkid, msg) => {

        const timeString = getTime()
        socket.broadcast.emit('receiveFromNetwork', sendername, networkid, msg, timeString)
        // store the message in the database
        const newnetMsg = new netMsgCollection({ sender: sendername, networkid: networkid, msg: msg, time: timeString })
        await newnetMsg.save()
    })
    socket.on('requestingPastMessages', async (itsnetworkid) => {
        const netMsgData = await netMsgCollection.find({ networkid: itsnetworkid })
        socket.emit('getPastNetworkMessages', netMsgData)
    })
    socket.on('newDarkMessageSent',async (uniqueid,darkid,msg)=>{
        const timeString=getTime()
        socket.broadcast.emit('receiveMessageFromDark',uniqueid,darkid,msg,timeString)
        // save the message in the database
        const newDarkMsg=new darkMsgCollection({sender:uniqueid,darkid:darkid,msg:msg,time:timeString})
        await newDarkMsg.save()
    })
    socket.on('givePastMessageToDark',async (uniqueid,darkid)=>{
        const data=await darkMsgCollection.find({darkid:darkid})
        socket.emit('takePastMessages',data)
    })

})
// ---------------------------------network personal------------------------------------------------------

// Listening to the port
app.listen(port, () => {
    console.log(`App listening at port ${port}`);
})

