const mongoose = require("mongoose");

const ArchiveKey_monogoDB = mongoose.Schema(
    {
        f_sno: Number,
        f_keyphare: String,
        f_keyworddisplay: String,
        f_totalImg: String
    },
    { collection: "T_ArchiveKey_monogoDB" }
);

module.exports = mongoose.model(
    "T_ArchiveKey_monogoDB",
    ArchiveKey_monogoDB
);
