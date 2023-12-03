
module.exports = {
    mutipleConvertToObject : function(Arrays) {
        return Arrays.map((r) => r.dataValues)
    },
    convertToObject : function (Array) {
        return Array.dataValues;
    }
}
