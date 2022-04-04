'use strict'
const client = require('../connection')
// const inputfile = require('../constituencies.json')
const { makebulk, indexall, processText, seekResult } = require('../utils/helperFunc')
const T_images_full_archieve_Mongodb_2022 = require('../models/T_images_full_archieve_Mongodb_2022')
const T_allkeyword_full = require('../models/T_allkeyword_full')

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
    let countNow = 0
    const tc = await T_images_full_archieve_Mongodb_2022.count()
    while (countNow !== tc) {
      const inputfile = await T_images_full_archieve_Mongodb_2022.find({}).skip(countNow).limit(500)
      countNow += 500
      console.log('count now:', countNow)
      // res.status(201).send(`<h2>Please wait...</h2>`)

      makebulk(inputfile, function (response) {
        console.log("Bulk content prepared");
        indexall(response, function (response) {
          console.log(response);
        })
      });
    }

    res.status(201).send(`<h2>Indexing is in progress...</h2>`)
  } catch (error) {
    next(error)
  }
}

exports.simpleSearch = async (req, res, next) => {
  try {
    const { keyword } = req.query
    client.search({
      index: 'imagesbazaar',
      type: 'viewAll',
      body: {
        query: {
          match: { "F_imgid": keyword }
        },
      }
    }, function (error, response, status) {
      if (error) {
        console.log("search error: " + error)
      }
      else {
        console.log("--- Response ---");
        console.log(response);
        console.log("--- Hits ---");
        response.hits.hits.forEach(function (hit) {
          res.status(200).json({ data: hit })
          console.log(hit);
        })
      }
    });

  } catch (error) {
    next(error)
  }
}

exports.searchByText = async (req, res, next) => {
  try {
    const { keyword } = req.params
    let aidArr = [], data = [], keywordLength, keyNow = 0;

    processText(keyword, async function (resp) {
      console.log('check keywords', resp)
      keywordLength = resp.length;
      resp.forEach(async searchKey => {
        const Akeyword = new RegExp(`\\b${searchKey}\\b`, 'i')
        const keyAid = await T_allkeyword_full.find({ Akeyword })
        aidArr = [...aidArr, ...keyAid.map(item => item.aid.toString())]

        client.search({
          index: 'imagesbazaar',
          type: 'viewAll',
          body: {
            query: {
              terms: {
                "aid.keyword": aidArr
              }
            }
          }
        }, function (error, response, status) {
          if (error) {
            console.log("search error: " + error)
          }
          else {
            console.log("--- Response ---");
            console.log(response);
            // console.log("--- Hits ---");
            keyNow += 1
            response.hits.hits.forEach(function (hit) {
              data.push(hit._source)
              // console.log(hit._source);
            })
            // console.log('key', keyNow, keywordLength)
            if (keyNow === keywordLength) {
              res.status(200).json({ data, tc: data.length })
            }
          }
        });
      })
    })

  } catch (error) {
    next(error)
  }
}