const client = require('../connection')
let bulk = [];

exports.makebulk = function (list, callback) {
    for (var current of list) {
        bulk.push(
            { index: { _index: 'imagesbazaar', _type: 'search', _id: current._id } },
            {
                "f_sno": current.f_sno,
                "F_imgid": current.F_imgid,
                "F_rank": current.F_rank,
                "F_group": current.F_group,
                "f_agencyname": current.f_agencyname,
                "suspendate": current.suspendate,
                "f_Available": current.f_Available,
                "aid": current.aid,
                "f_Orientation": current.f_Orientation,
                "modelid": current.modelid,
                "f_rank1": current.f_rank1,
                "f_createdate": current.f_createdate,
            }
        );
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