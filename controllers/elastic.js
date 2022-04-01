'use strict'
const client = require('../connection')
const ImagesFullArchieveSchemaLatest = require('../models/ImagesFullArchieveSchemaLatest')

exports.info = async (req, res, next) => {
  try {
    let message;
    client.cluster.health({},function(err,resp,status) {  
      message = resp
      console.log("-- Client Health --",resp);
    });

    res.status(200).send(`<h2>-- Client Health -- Ok</h2>`)

  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const { index } = req.params
    let message;
    client.indices.create({
      index
    }, function (err, resp, status) {
      if (err) {
        throw err
      }
      else {
        message = 'index is created successfully!'
        console.log("create", resp);
      }
    });


    res.status(201).send(`<h2>index is created successfully!</h2>`)

  } catch (error) {
    next(error)
  }
}