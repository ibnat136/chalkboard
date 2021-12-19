// Name: Daniel Yoh
// Date: 11.25.2022
// Course: CS 355
// This is for backend functionality of the admin page.
const express = require('express')
const router = express.Router()

const Person = require("../database.js").PersonModel;
const Course = require("../database.js").CourseModel;
const Search = require("../database.js").SearchModel;
const Assignment = require("../database.js").AssignmentModel;

router.get('/adminpage', loggedin, async (req, res) => {
  if (req.user.accounttype != "Admin") res.redirect('/')
  const userdata = await Person.find({});
  const searchdata = await Search.find({});
  const coursedata = await Course.find({});
  const assignmentdata = await Assignment.find({});
  res.render('adminpage.ejs', {
    userdata,
    searchdata,
    coursedata,
    assignmentdata
  });
});

function loggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router
