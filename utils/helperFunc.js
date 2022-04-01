const client = require('../connection')
let bulk = [];

exports.makebulk = function(constituencylist,callback){
  for (var current in constituencylist){
    bulk.push(
      { index: {_index: 'gov', _type: 'constituencies', _id: constituencylist[current].PANO } },
      {
        'constituencyname': constituencylist[current].ConstituencyName,
        'constituencyID': constituencylist[current].ConstituencyID,
        'constituencytype': constituencylist[current].ConstituencyType,
        'electorate': constituencylist[current].Electorate,
        'validvotes': constituencylist[current].ValidVotes,
        'regionID': constituencylist[current].RegionID,
        'county': constituencylist[current].County,
        'region': constituencylist[current].Region,
        'country': constituencylist[current].Country
      }
    );
  }
  callback(bulk);
}

exports.indexall = function(madebulk,callback) {
  client.bulk({
    maxRetries: 5,
    index: 'gov',
    type: 'constituencies',
    body: madebulk
  },function(err,resp,status) {
      if (err) {
        console.log(err);
      }
      else {
        callback(resp.items);
      }
  })
}