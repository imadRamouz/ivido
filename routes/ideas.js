const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');
const { ensureAuthenticated } = require('../helpers/auth');

router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render('ideas/index', { ideas });
    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({ _id: req.params.id })
    .then(idea => {
      if (idea.user != req.user.id) {
        req.flash('errorMsg', 'Not authorized');
        res.redirect('/ideas');
      } else {
        res.render('ideas/edit', { idea });
      }
    });

})

// process data for add idea
router.post('/', ensureAuthenticated, (req, res) => {
  const errors = [];
  if (!req.body.title) {
    errors.push({ text: 'the title is required' });
  }

  if (!req.body.details) {
    errors.push({ text: "please add some details" });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      details: req.body.details,
    });
  } else {
    const newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }

    new Idea(newIdea).save().then((idea) => {
      req.flash('successMsg', 'Idea added successfully')
      res.redirect('/ideas');
    });
  }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({ _id: req.params.id })
    .then(idea => {
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.save()
        .then(() => {
          req.flash('successMsg', 'Idea updated successfully')
          res.redirect('/ideas');
        });
    })
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOneAndRemove({ _id: req.params.id })
    .then(() => {
      req.flash('successMsg', 'Idea deleted successfully')
      res.redirect('/ideas');
    })
});

module.exports = router;