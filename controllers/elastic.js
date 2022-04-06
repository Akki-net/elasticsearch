'use strict'
const client = require('../connection')
// const inputfile = require('../constituencies.json')
const { makebulk, indexall, processText, stopKeyword } = require('../utils/helperFunc')
const T_images_full_archieve_Mongodb_2022 = require('../models/T_images_full_archieve_Mongodb_2022')
const T_allkeyword_full = require('../models/T_allkeyword_full')
const T_ArchiveKey_monogoDB = require('../models/T_ArchiveKey_monogoDB')

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
    let data = []

    var queryKey = stopKeyword(keyword);
    var searchKeyword = queryKey.toLocaleLowerCase().trim().replace(/\s+/g, " ")

    T_ArchiveKey_monogoDB.findOne({
      f_keyworddisplay: searchKeyword.trim()
    }, (err, searchResult) => {
      // console.log('search result', searchResult)
      if (searchResult) {
        var finalKeywod = searchResult.f_keyphare
        var finalKeys = finalKeywod.includes("not")
        if (finalKeys === false) {
          var filtered = finalKeywod.split(' ')
          var splitKey = filtered.filter(function (el) {
            return el != "";
          });
          // console.log('chec splitKey', splitKey)
          if (splitKey.length > 0) {
            var finalAid = []
            splitKey.forEach(async function (element, index) {
              T_allkeyword_full.findOne({
                Akeyword: element
              }, async (err2, aidRes) => {
                console.log('check result:', aidRes);
                finalAid.push(aidRes.aid.toString())
                if (finalAid.length === splitKey.length) {
                  client.search({
                    index: 'imagesbazaar',
                    type: 'viewAll',
                    body: {
                      size: 30,
                      query: {
                        terms: {
                          "aid.keyword": finalAid
                        }
                      },
                      sort: [
                        {
                          "f_rank1": {
                            order: "desc"
                          }
                        }
                      ]
                    }
                  }, function (error, response, status) {
                    if (error) {
                      console.log("search error: " + error)
                    }
                    else {
                      console.log("--- Response ---");
                      console.log(response);
                      // console.log("--- Hits ---");
                      response.hits.hits.forEach(function (hit) {
                        data.push(hit._source)
                        // console.log(hit._source);
                      })
                      // console.log('key', keyNow, keywordLength)
                      res.status(200).json({ data, tc: response.hits.total.value })
                    }
                  });
                }
              }).collation(
                { locale: 'en', strength: 2 }
              );
            })
          }
        }
      }
      else {
        // console.log("search error: " + err)
        processText(searchKeyword, async function (resp) {
          // console.log('check keywords', resp)
          let myAid = [], spKey = [];
          let countrTme = 1;

          for (let searchKey of resp) {
            const seekHidden = await T_ArchiveKey_monogoDB.findOne({
              f_keyworddisplay: searchKey
            })

            if (seekHidden) {
              let finalKeywod = seekHidden.f_keyphare
              let finalKeys = finalKeywod.includes("not")
              if (finalKeys === false) {
                let filtered = finalKeywod.split(' ')
                spKey = filtered.filter(function (el) {
                  return el != "";
                });

                for (let element of spKey) {
                  countrTme += 1
                  const aidResult = await T_allkeyword_full.findOne({
                    Akeyword: element
                  })
                  // console.log('check akeyword', aidResult)
                  aidResult && myAid.push(aidResult.aid.toString())
                  if (countrTme === resp.length) {
                 //   console.log('check aiddds', myAid)
                    client.search({
                      index: 'imagesbazaar',
                      type: 'viewAll',
                      body: {
                        size: 30,
                        query: {
                          terms: {
                            "aid.keyword": myAid
                          }
                        },
                        sort: [
                          {
                            "f_rank1": {
                              order: "desc"
                            }
                          }
                        ]
                      }
                    }, function (error, response, status) {
                      if (error) {
                        console.log("search error: " + error)
                        return response.status(204).json({ message: 'no content' })
                      }
                      else {
                        console.log("--- Response ---");
                        console.log(response);
                        // console.log("--- Hits ---");
                        response.hits.hits.forEach(function (hit) {
                          data.push(hit._source)
                          // console.log(hit._source);
                        }
                        )
                        // console.log('key', keyNow, keywordLength)
                        return res.status(200).json({ data, tc: response.hits.total.value })
                      }
                    });
                  }
                }
                
              }
            } else {
              console.log('hello akash')
              return res.status(204).json({ message: 'no content' })
            }
          }

        })
      }
    })
  } catch (error) {
    next(error)
  }
}