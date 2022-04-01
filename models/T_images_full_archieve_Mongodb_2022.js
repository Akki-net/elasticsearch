const mongoose = require("mongoose");

const T_images_full_viewing = mongoose.Schema(
    {
        f_sno: Number,
        F_imgid: String,
        F_rank: Number,
        F_group: Number,
        f_agencyname: String,
        suspendate: Date,
        f_Available: String,
        f_imgtype: String,
        aid: Array,
        f_Orientation: String,
        modelid: String,
        f_imgType: String,
        f_rank1: Number,
        f_createdate: Date
    },
    { collection: "T_images_full_archieve_Mongodb_2022" }
);

module.exports = mongoose.model(
    "T_images_full_archieve_Mongodb_2022",
    T_images_full_viewing
);
