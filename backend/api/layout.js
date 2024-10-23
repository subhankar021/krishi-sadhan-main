var express = require('express');
const dayjs = require('dayjs');
var router = express.Router();
const UAParser = require('ua-parser-js');
const PinCodes = require('../database/models/pincodes');

router.get('/', async (req, res) => {
  try {
    const result = {
      pinCode: null,
      villageName: null,
      villageId: null
    }
    cosole.log(req.session);
    if(req.session?.location?.villageId) {

      const villageDetails = await PinCodes.findOne({ villageId: req.session.location.villageId }, { _id: 0, __v: 0 });
      result.villageName = `${villageDetails.pincode} - ${villageDetails.village}`; 
      result.villageId = req.session.location.villageId;
      result.pinCode = req.session.location.pincode;
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;