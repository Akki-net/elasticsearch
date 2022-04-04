var client = require('./connection');

client.indices.putMapping({
    index: 'imagesbazaar',
    body: {
        properties: {
            'f_sno': {
                'type': 'integer',
            },
            'F_imgid': {
                'type': 'text',
            },
            'F_rank': {
                'type': 'integer',
            },
            'F_group': {
                'type': 'integer',
            },
            'f_agencyname': {
                'type': 'text',
            },
            'suspendate': {
                'type': 'date',
            },
            'f_Available': {
                'type': 'text',
            },
            'f_Orientation': {
                'type': 'text',
            },
            'modelid': {
                'type': 'text',
            },
            'f_rank1': {
                'type': 'long',
            },
            'f_createdate': {
                'type': 'date',
            },
            'aid': {
                'type': 'nested',
                properties: {
                    'name': {
                        'type': 'keyword',
                        // 'index': 'not_analyzed'
                    }
                }
            }
        }
    }
}, function (err, resp, status) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(resp);
    }
});
