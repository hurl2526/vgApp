const express = require('express');
const router = express.Router();
const Game = require('./models/Game')

/* GET home page. */
router.get('/games',auth,(req,res)=>{
  Game.find().then((gameData) => 
  // console.log(movieData))
  res.render('games',{gameData}))
.catch(error => console.log(error))
});


router.get('/single-word/:word', (req, res, next) => {
  Word.findOne({word:req.params.word}).populate('comments').exec((err,word)=>{
    res.json({word})
  })
  // .then((word)=>{
  //   if(word){
  //   return res.status(200).json({ word})
  //   }
  //   return res.send('No Words Found')
  // }).catch((err)=>{
  //   next(err);
  });


router.post('/add-word', (req,res,next)=>{
  Word.findOne({word:req.body.word}).then((word)=>{
    if(word){
      return res.send('Word already exists')
    }else{
      let newWord= new Word()

      if(req.body.word && req.body.meaning){ //or use express validator
        newWord.word = req.body.word
        newWord.meaning = req.body.meaning
        
        newWord.save().then((word)=>{
          return res.status(200).json({word});
        }).catch((err)=>{
          res.json({message:'Word not created'})
        })
      }else{
        res.status(400).json({message:'you must input all fields'})
      }
    }
  }).catch((err)=>next(err))
})

module.exports = router;