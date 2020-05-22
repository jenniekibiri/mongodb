const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express();
const User = require('./models/users.js')
//mongoose connection
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//specify the database in mycase its test
const password =process.env.MONGO_PWD
mongoose.connect("mongodb+srv://jenny:"+password+"@cluster0-ed52s.mongodb.net/test?retryWrites=true&w=majority")
.then(()=>{
    console.log('database connected succefully');

})
.catch((error)=>{
    console.log(`connection error ${error}`)
    process.exit();
})

app.post('/addusers',(req,res)=>{
    
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        role: req.body.role
    })
   user.save()
   .then(data =>{
       res.send(data);
   }).catch(err =>{
       res.status(500).send({
           message:err.message || 'something is wrong'
       })
   })
})
app.get('/users',(req,res)=>{
    User.find({}).exec()
    .then(users=>{
        res.send(users);
        console.log(users)
    }).catch(err=>{
        res.status(500).send({
            message:err.message || "error"
        })
    })

    
})
app.delete('/delUser/:userId',(req,res)=>{
    User.findByIdAndRemove(req.params.userId)
    .then(user=>{
        res.send('user deleted successfully')
    })
    .catch(err =>{
        return res.status(500).json({message:err.message || 'something is wrong'})
    })
})
//single users 
//disclaimer about the comments
app.get('/user/:userId',(req,res)=>{
    //you need t pass an id
    User.findById(req.params.userId)
    //callback
    .then(user =>{
    if(!user){
        return res.status(404).send({message:'user does not exist'})
    }
    
res.send(user)
    })
    .catch(err=>{
        return res.status(500).send({
            message : err.message || "something is wrong"
        })
    })
})
//update user 
app.put('/updateUser/:userId',(req,res)=>{
    if(!req.body.name){
        return res.status(400).send({message :'fields cannot be empty'})

    }

    User.findOneAndUpdate(req.params.userId,{
        name:req.body.name,
        role:req.body.role
    },{new: true})
    .then(user=>{
        return res.status(200).send({
            user : user
        })
    })
    .catch(err=>{
        return res.status(500).send({
            message : err.message || "something is wrong"
        })
    })
})



const PORT = process.env.PORT || 5000;
app.listen(PORT,console.log(`server running on port ${PORT}`))