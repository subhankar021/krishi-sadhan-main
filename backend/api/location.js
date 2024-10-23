const express = require('express');
const { getPrimaryKey } = require('../database');
const PinCodes = require('../database/models/pincodes');
const router = express.Router();

router.put("/update", async (req, res) => {
    try {
        const { villageId } = req.body;

        if (!villageId) {
            return res.status(400).json({ error: 'villageId is required' });
        }
        req.session.location = { villageId };
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post('/pincode', async (req, res) => {
    try {
        const { pincode } = req.body;
        if (!pincode || pincode.length !== 6) {
            console.log(pincode);
            return res.status(400).json({ error: 'pincode is required' });
        }

        const pincodeInfo = await PinCodes.find({ pincode: pincode }, { _id: 0, __v: 0 }, { sort: { villageName: 1 } });

        const vilagesList = [];

        for (const item of pincodeInfo) {
            vilagesList.push({
                villageId: item.villageId,
                villageName: item.village,
                districtName: item.district,
                stateName: item.state
            });
        }
        return res.status(200).json(vilagesList);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.post('/pincode-search', async (req, res) => {
    try {
        const { pinCode } = req.body;
        let result = [];
        if(pinCode){
            // pincode start with string
            const villagesList = await PinCodes.aggregate([
                {
                   $addFields: {
                        pincode: {
                            $toString: "$pincode"
                        }
                    }
                },
                {
                    $match: {
                        pincode: {
                            $regex: `^${pinCode}`
                        }
                    }
                }
            ])

            villagesList.forEach((item) => {
                result.push({
                    title: `${item.pincode} - ${item.village}`,
                    id: item.villageId
                })
            })
        }
        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;