const mongoose = require("mongoose");

const T_allkeyword = mongoose.Schema(
    {
        aid: Number,
        Akeyword: String,
        deletedrow: String
    },
    { collection: "T_allkeyword_full" }
);

module.exports = mongoose.model(
    "T_allkeyword_full",
    T_allkeyword
);