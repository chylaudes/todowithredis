var express= require("express"),
app = express(),
redis = require("redis"),
client = redis.createClient(),
methodOverride = require("method-override"),
bodyParser = require("body-parser");
//MIDDLEWARE
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//If I want to include css/js/imgs
app.use(express.static(__dirname + '/public'));
//get request to the root route

//renders the whole entire list of students
app.get("/", function(req,res){
  client.smembers("students", function(err, students){
  res.render("index", {students: students});
  });
});

//creates a student's name
app.post("/create", function(req, res){
  var student = req.body.student;
  client.sadd("students", student);
  res.redirect("/");
});

//patching a student's name

app.get("/students/:student/edit", function(req, res){
  //using redis find the spcific student pased on req.params.name
  //set that equal to variable called name
  //render the edit page passing in the name variable I just defined
  var student = req.params.student;
  res.redirect("/edit/:student");
});



// app.put("/edit/:student", function(req, res){
//   client.smembers("students", function(err, students){
//         client.srem("students", req.params.student);
//         var name = req.body.student;
//         client.sadd("students", name);
//         res.redirect("/");
//req.params.name => Whatever the form action contained
//re.params.newName
//checkout our set and see if req.params.name is in there
//If we do login makes sure only the current user can change
//if it is delete that piece of data and create a new one
//with the anme equal to = req.body.newName
// //if there are any errors, display that to the user.
// res.redirect("/");
// //     });
// //   });

//deleting a student!
app.delete("/remove/:student", function(req, res){
  client.smembers("students", function(err, students){
  students.forEach(function(student){
    if (req.params.student === student){
      client.srem("students", student);
      res.redirect("/");
    }
  });
  });
});


//starting the server
app.listen(3000, function(){
    console.log("On board 3000");
});