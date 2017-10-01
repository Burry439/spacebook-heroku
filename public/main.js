var SpacebookApp = function() {

  var posts = [];

  var $posts = $(".posts");

  

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      // console.log(newHTML);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }
function addPost(newPost) {
  $.ajax({
    method : 'POST',
    url: "posts",
    data: {text : newPost},
    success: function (result) {
      posts.push({text : newPost, _id : result._id, comments :[]})
      console.log(result)
      _renderPosts()
    },
    error: function (xhr, ajaxOptions, thrownError) {
      alert(xhr.status);
      alert(thrownError);
    }
  });
}


  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function(index) {
    $.ajax({
      url : '/posts/'+ posts[index]._id,
      method : 'DELETE',
      success : function(result){
        // console.log(result)
       posts.splice(index, 1);
        _renderPosts();
      }
    })
    
  };

  var addComment = function(newComment, postIndex) {
    $.ajax({
      url : '/posts/'+ posts[postIndex]._id + '/comments',
      method : 'POST',
      data : {text : newComment.text , user : newComment.user}, 
      success : function(data){      
       posts[postIndex].comments.push(newComment);
      //  console.log(posts)
       getPosts()
        
      }
    })
 
  };


  var deleteComment = function(postIndex, commentIndex) {
    console.log(posts[postIndex].comments[commentIndex]._id)
    $.ajax({
      url : '/posts/'+ posts[postIndex]._id + '/comments/' + posts[postIndex].comments[commentIndex]._id,
      method : 'DELETE',
      success : function(data){      
        posts[postIndex].comments.splice(commentIndex, 1);
        _renderComments(postIndex);      
      }
    })   
  };

  
function getPosts(){
  $.get({
    url: 'posts',
    success: function(data){   
     posts = data  
    //  console.log(data)
     _renderPosts()
    },
    error: function(err){
      console.log(err)
    }
  });
}

getPosts()

  return {
    _renderPosts : _renderPosts,
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
  };
};

var app = SpacebookApp();


$('#addpost').on('click', function() {
  //  console.log('hi')
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val())
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function() {
  var index = $(this).closest('.post').index();;
  app.removePost(index);
});

$posts.on('click', '.toggle-comments', function() {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function() {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');
  
  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var newComment = { text: $comment.val(), user: $user.val() };
  app.addComment(newComment, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function() {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();

  app.deleteComment(postIndex, commentIndex);
});




