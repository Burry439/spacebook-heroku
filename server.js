var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebook', function() {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');


var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
app.get('/posts', function(req, res){
  Post.find(function(err, result){
    if(err){
     throw (err)
    }else{    
      
      res.send(result)
      }
    
  })
})



// 2) to handle adding a post

app.post('/posts', function(req, res){
  console.log('hey i work')
  var post = new Post(req.body)
  console.log(post)
  post.save(function(err, result){
    if(err){
      console.log(err)
    }else{
      console.log('working')
      res.send(result)
    }
  })
})

// 3) to handle deleting a post

app.delete('/posts/:id', function(req, res){
  Post.findByIdAndRemove(req.params.id, function(err, result){
    if(err){
      console.log(err)
    }else{
     res.send(result)
    }
  })
})

// 4) to handle adding a comment to a post

app.post('/posts/:id/comments', function(req, res){



  Post.findById(req.params.id, function(err, post){
    var comment =  req.body
    post.comments.push(comment)
    post.save(function(err, post){
      if(err){
        console.log(err)
      }else{
        res.send(post)
      }
    })
  })
})


// 5) to handle deleting a comment from a post



app.delete('/posts/:id/comments/:commentID', function(req, res){
  console.log(req.params.id)
  console.log(req.params.commentID)
  Post.findOneAndUpdate({_id : req.params.id}, 
    {$pull : {comments : {_id : req.params.commentID}}}, function(err, result){
       console.log(result)
       res.send(result)
    }) 
  })


app.listen(8000, function() {
  console.log("what do you want from me! get me on 8000 ;-)");
});
