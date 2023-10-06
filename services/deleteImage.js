const util = require("util");
const fs = require("fs");

module.exports = {
    async imageDelete(id, schema, field) {
        const path = await schema.findOne({ _id: id }, { [field]: 1, _id: 0 });
        const unlinkFile = util.promisify(fs.unlink);
        try {
            await unlinkFile(path[field].replace(process.env.BASEURL, ""));
        } catch (err) {
            console.log(err.message);
        }
    },

    async galaryImageDelete(link, schema, field) {
        const path = await schema.findOne({ image: link }, { [field]: 1, _id: 0 });
        const unlinkFile = util.promisify(fs.unlink);
        try {
            await unlinkFile(path[field].replace(process.env.BASEURL, ""));
        } catch (err) {
            console.log(err.message);
        }
    },
};

// async function deleteFile(path) {
 

//   const unlinkFile = util.promisify(fs.unlink);
//   try {
//     await unlinkFile(path);
//   } catch (err) {
//     console.log(err.message);
//   }
// }
