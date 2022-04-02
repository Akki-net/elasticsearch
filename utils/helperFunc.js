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

exports.processText = function (keyword, callback) {
    let filterKeys = new Array("a", "$", "&", ";", ",", "?", "no", "0", "6", "7", "8", "9", "#", "-", "+", "*", "b", "c", "d", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "at", "above", "ad", ",ads", "ages", "all", "along", "among", "an", "and", "are", "as", "behind", "being", "beings", "below", "besides", "body", "bodies", "both", "but", "clothing", "cloth", "clothes", "clad", "does", "down", "dress", "dresses", "each", "eight", "either", "few", "find", "from", "front", "get", "garment", "garments", "had", "has", "have", "having", "id", "if", "image", "images", "into", "is", "isn", "it", "last", "life", "like", "moods", "much", "must", "next", "of", "on", "ours", "outfits", "outfit", "over", "pc", "Photo", "photos", "photographs", "photograph", "photography", "pictures", "picture", "pic", "pics", "pix", "same", "shoot", "shoots", "shots", "shot", "site", "so", "still", "stock", "ten", "text", "than", "that", "the", "their", "them", "through", "towards", "under", "up", "using", "viewed", "very", "wala", "wear", "wearing", "website", "whose", "with", "within", "year", "years", "in", "able", "about", "after", "again", "almost", "already", "also", "although", "am", "another", "any", "around", "based", "be", "because", "been", "before", "being", "between", "both", "bring", "but", "by", "came", "can", "com", "come", "comes", "could", "collection", "collections", "did", "do", "does", "doing", "done", "each", "eight", "else", "ethnicity", "even", "every", "f", "for", "from", "g", "get", "gets", "getting", "go", "going", "got", "h", "had", "has", "have", "he", "her", "here", "him", "himself", "his", "how", "however", "i", "if", "in", "including", "into", "is", "it", "its", "j", "just", "k", "kb", "know", "l", "like", "looks", "m", "making", "many", "may", "mb", "me", "means", "might", "more", "most", "move", "mr", "much", "must", "my", "n", "need", "needs", "never", "nice", "nine", "no", "now", "o", "of", "often", "oh", "ok", "on", "or", "org", "other", "our", "out", "over", "own", "p", "piece", "q", "r", "rather", "re", "really", "s", "said", "same", "say", "says", "see", "seven", "several", "she", "should", "since", "six", "so", "some", "something", "still", "stuff", "such", "t", "take", "ten", "than", "that", "the", "their", "them", "then", "there", "these", "they", "thing", "things", "this", "those", "through", "to", "too", "took", "u", "under", "up", "us", "use", "used", "using", "usual", "v", "ve", "very", "via", "w", "want", "was", "way", "we", "well", "were", "what", "when", "where", "whether", "which", "while", "whilst", "who", "why", "will", "with", "within", "would", "x", "y", "yes", "yet", "you", "your", "putting", "give", "taking", "take", "near", "ups", "small", "dressing", "age");
    let keyArr = keyword.split(' ');
    let keyCases = keyArr.map(key => key.toLowerCase())
    let filteredCases = keyCases.filter(sKey => {
        if (!filterKeys.find(fKey => fKey === sKey))
            return sKey
    })
    callback(filteredCases)
}