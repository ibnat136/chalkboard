

const express = require('express')
const router = express.Router()
const Course = require("../database.js").CourseModel;
const Search = require("../database.js").SearchModel;
const Assignment = require("../database.js").AssignmentModel;


router.use(express.static(__dirname + '../public'));

router.post('/createcourse', loggedin, async (req, res) => {
  console.log("reqbody:", req.body);
  console.log("accounttype:", req.user.accounttype);

  const exists = await Course.exists({ coursename: req.body.coursename });
  if (exists) {
    return res.send('This course name already exists.');
  };
  let newcourse;
  if (req.body.instructors == "") {
    newcourse = new Course({
      coursename: req.body.coursename,
      creatorid: req.user.id,
      creatorname: req.user.fname + " " + req.user.lname,
      coursedesc: req.body.coursedescription
    });
  }
  else {
    newcourse = new Course({
      coursename: req.body.coursename,
      creatorid: req.user.id,
      creatorname: req.user.fname + " " + req.user.lname,
      instructors: req.body.instructors,
      coursedesc: req.body.coursedescription
    });
  }
  newcourse.save((err, data) => {
    if (err) return console.log(err);
    console.log(newcourse.coursename + newcourse.id + " saved to database");
    console.log(data)
  });
  res.redirect('/course/' + newcourse.id);

})

router.get('/course/:id', loggedin, async (req, res) => {
  let data = await Course.findById(req.params.id);
  if (!data) res.send("We weren't able to create the course.");
  else {
    if (req.user.accounttype == "Student") {
      Course.find({ _id: req.params.id, students: req.user.id }, (err, notenrolled) => {
        if (notenrolled == "") {
          res.render('course.ejs', {
            data: {
              coursename: data.coursename,
              coursedesc: data.coursedesc
            }
          })
        }
        else {
          const url = req.url;
          Assignment.find({ courseid: req.params.id }, (err, assignmentdata) => {
            if (!assignmentdata) res.send("Ohhho assignment was not created.");
            else {
              res.render('course.ejs', { data, assignmentdata, url })
            }
          })
        }
      })
    }
    else {
      Course.find({
        courseid: req.params.id, $or: [
          { creatorid: req.user.id },
          { instructors: req.user.id }
        ]
      }, (err, notassigned) => {
        if (notassigned == "") {
          console.log("notassigned:", req.user.id)
          res.render('course.ejs', {
            data: {
              coursename: data.coursename,
              coursedesc: data.coursedesc
            }
          })
        }
        else {
          // console.log("Youre a wizard, Harry.");
          const url = req.url;
          Assignment.find({ courseid: req.params.id }, (err, assignmentdata) => {
            if (err) console.log(err);
            else {
              res.render('course.ejs', { data, assignmentdata, url })
            }
          })
        }
      })
    }
  }
})

router.post('/createassignment', loggedin, async (req, res) => {
  console.log("reqbody:", req.body);
  console.log("accounttype:", req.user.accounttype);

  const questionarray = req.body.inputquestion;
  const answerarray = req.body.inputanswer;

  Course.findById({ _id: req.body.inputcourseid }, (err, coursedata) => {
    if (err) res.send("Course does not exist.")
    else {
      const newassignment = new Assignment({
        assignmentname: req.body.inputassignmenttitle,
        assignmentdesc: req.body.inputdesc,
        questions: questionarray,
        answers: answerarray,
        duedate: req.body.duedate,
        courseid: req.body.inputcourseid
      });
      newassignment.save((err, data) => {
        if (err) return console.log(err);
        else {
          console.log(newassignment.assignmentname + newassignment.id + " saved to database");
          console.log(data);
          coursedata.assignments.push(data.id);
          coursedata.save((err, success) => {
            if (err) console.log(err);
            else res.redirect('/course/' + req.body.inputcourseid + '/assignment/' + data.id);
          })
        }
      });
    }
  })
})

router.get('/course/:courseid/assignment/:id', loggedin, (req, res) => {
  Course.findById(req.params.courseid, (err, coursedata) => {
    if (!coursedata) res.send("Course does not exist.");
    else {
      Assignment.findById(req.params.id, (err, data) => {
        if (!data) res.send("Assignment does not exist.");
        else {
          console.log(data);
          res.render('assignment.ejs', { accounttype: req.user.accounttype, data })
        }
      })
    }
  })
})

router.post('/searchresults', loggedin, (req, res) => {
  const searchterm = new Search({
    searchterm: req.body.searchterm
  });
  searchterm.save((err, data) => {
    if (err) return console.log(err);
    console.log(searchterm.coursename + searchterm.id + " saved to database");
    console.log(data)
  });
  res.send("Search successfully saved to DB.")
  // res.redirect('/searchresults')
})

function loggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router
