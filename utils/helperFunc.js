const client = require('../connection')
let bulk = [];

exports.makebulk = function (list, callback) {
    for (var current of list) {
        for (var key in current) {
            if (current.hasOwnProperty(key)) {
                bulk.push(
                    { index: { _index: 'imagesbazaar', _type: 'search', _id: current._id } },
                    {
                        key: current[key]
                    }
                );
            }
        }
    }
    // console.log('check bulk', bulk)
    callback(bulk);
}

exports.indexall = function (madebulk, callback) {
    client.bulk({
        maxRetries: 5,
        index: 'imagesbazaar',
        type: 'search',
        body: madebulk
    }, function (err, resp, status) {
        if (err) {
            console.log(err);
        }
        else {
            callback(resp.items);
        }
    })
}