"use strict";

var Models = require("../model/User");

const getUserById = id =>
  new Promise((resolve, reject) => {
    Models.findById(id)
      .then(client => resolve(client))
      .catch(err => reject(err));
  });

const getUsers = criteria =>
  new Promise((resolve, reject) => {
    Models.find(criteria)
      .then(client => resolve(client))
      .catch(err => reject(err));
  });

const createUser = objToSave =>
  new Promise((resolve, reject) => {
    new Models(objToSave)
      .save()
      .then(client => resolve(client))
      .catch(err => reject(err));
  });

const updateUser = (criteria, dataToSet, options) =>
  new Promise((resolve, reject) => {
    options.new = true;
    options.upsert = true;
    Models.findOneAndUpdate(criteria, dataToSet, options)
      .then(client => resolve(client))
      .catch(err => reject(err));
  });

const deleteUser = criteria =>
  new Promise((resolve, reject) => {
    Models.findOneAndRemove(criteria)
      .exec()
      .then(client => resolve(client))
      .catch(err => reject(err));
  });


module.exports = {
  updateUser: updateUser,
  createUser: createUser,
  deleteUser: deleteUser,
  getUsers: getUsers
};