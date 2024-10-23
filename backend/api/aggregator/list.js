var express = require('express');
const dayjs = require('dayjs');
var router = express.Router();
const UAParser = require('ua-parser-js');
const Villages = require('../database/models/villages');

router.get('/', async (req, res) => {
  try {
    const result = {
      pinCode: null,
      villageName: null,
      villageId: null
    }

    if(req.session?.location?.villageId) {
      const villageDetails = await Villages.findOne({ villageId: req.session.location.villageId }, { _id: 0, __v: 0 });
      result.villageName = `${villageDetails.pinCode} - ${villageDetails.villageName}`; 
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;