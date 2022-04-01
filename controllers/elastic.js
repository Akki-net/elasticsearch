'use strict'
const client = require('../connection')
const inputfile = require('../constituencies.json')
const { makebulk, indexall } = require('../utils/helperFunc')
const ImagesFullArchieveSchemaLatest = require('../models/ImagesFullArchieveSchemaLatest')

exports.info = async (req, res, next) => {
  try {
    let message;
    client.cluster.health({}, function (err, resp, status) {
      message = resp
      console.log("-- Client Health --", resp);
    });

    res.status(200).send(`<h2>-- Client Health -- Ok</h2>`)

  } catch (error) {
    next(error)
  }
}

exports.createIndex = async (req, res, next) => {
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

exports.deleteIndex = async (req, res, next) => {
  try {
    const { index } = req.params
    client.indices.delete({ index }, function (err, resp, status) {
      if (!err) {
        console.log("delete", resp);
      } else {
        throw err
      }
    });

    res.status(204).send(`<h2>index is deleted successfully!</h2>`)

  } catch (error) {
    next(error)
  }
}

exports.documentAdd = async (req, res, next) => {
  try {
    const { id, index, type } = req.body
    client.index({
      index,
      id,
      type,
      body: { ...req.body }
    }, function (err, resp, status) {
      if (!err) {
        console.log(resp);
      } else {
        throw err
      }
    });

    res.status(201).send(`<h2>Document is created successfully!</h2>`)

  } catch (error) {
    next(error)
  }
}

exports.documentShow = async (req, res, next) => {
  try {
    const { index, type } = req.params
    client.count({ index, type }, function (err, resp, status) {
      if (!err) {
        res.status(200).send(resp)
        console.log(type, resp);
      } else {
        throw err
      }
    });

  } catch (error) {
    next(error)
  }
}

exports.documentDel = async (req, res, next) => {
  try {
    const { index, type, id } = req.params
    client.delete({
      index,
      id,
      type
    }, function (err, resp, status) {
      if (!err) {
        console.log("delete", resp);
      } else {
        throw err
      }
    });

    res.status(204).send(`<h2>Document is deleted successfully!</h2>`)

  } catch (error) {
    next(error)
  }
}

exports.addBulk = async (req, res, next) => {
  try {
    makebulk(inputfile, function (response) {
      console.log("Bulk content prepared");
      indexall(response, function (response) {
        console.log(response);
      })
    });

    res.status(201).send(`<h2>Documents are added successfully!</h2>`)

  } catch (error) {
    next(error)
  }
}