const { Sequence } = require("./models/sequence");

async function getPrimaryKey(seqName) {
    try {
        const sequence = await Sequence.findOneAndUpdate(
            { name: seqName },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        return sequence.value;
    } catch (error) {
        console.error('Error occurred while getting the next value:', error);
        throw error;
    }
}

module.exports = { getPrimaryKey }