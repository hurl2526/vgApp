const bcrypt = require('bcryptjs');
const User = require('../models/User')
const express = require('express')

module.exports = {
  getAllUsers: (req, res) => {
    User.find()
      .then((users) => {
        return res.status(200).json(users);
      })
      .catch((err) => err);
  },
  getSingleUser: (req, res) => {
    const id = req.params.id;

    User.findById(id)
      .then((user) => {
        if (user) {
          return res.status(200).json({ confirmation: 'success', user });
        } else {
          return res
            .status(404)
            .json({ confirmation: 'fail', message: 'User Not Found' });
        }
      })
      .catch((err) =>
        res.json({ confirmation: 'fail', message: 'Server Error' })
      );
  },
  register: (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(504).json({ confirmation: 'fail', message: 'Fields must be completed' });
    }

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          return res.status(400).json({ message: 'User Exists' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        let newUser = new User();
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.password = hash;

        newUser.save().then((user) => {
            return res.status(201).json({confirmation:'success', user});
          })
          .catch((err) =>
            res.json({
              confirmation: 'fail',
              message: 'User not saved to database'
            })
          );
      })
      .catch((err) =>
        res.status(500).json({ confirmation: 'fail', message: 'Server Error' })
      );
  },
  login: (req, res) => {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        const matchPassword = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        if (!matchPassword) {
          return res.status(404).json({ message: 'Incorrect Input' });
        } else {
          return res.status(200).json({ message: 'You are logged in' });
        }
      } else {
        return res.status(404).json({ message: 'Server' });
      }
    });
  },
  updateUser: (req, res) => {
    const id = req.params.id;
    User.findById(id)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ confirmation: 'fail', message: 'User Not Found' });
        } else {
          const updatedUser = req.body;

          user.name = updatedUser.name ? updatedUser.name : user.name;
          user.email = updatedUser.email ? updatedUser.email : user.email;

          user
            .save()
            .then((user) => {
              return res.status(200).json({ message: 'User Updated', user });
            })
            .catch((err) =>
              res.json({ confirmation: 'fail', message: 'User Not Updated' })
            );
        }
      })
      .catch((err) =>
        res.json({ confirmation: 'fail', message: 'Server Error' })
      );
  },
  deleteUser: (req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
      .then((user) => {
        if (user) {
          return res.status(200).json({ message: 'User Deleted' });
        } else {
          return res.status(404).json({ message: 'No User To Delete' });
        }
      })
      .catch((err) => res.status(404).json({ message: 'User Not Found' }));
  }
};