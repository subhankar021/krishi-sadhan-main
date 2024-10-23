const { Router } = require('express');
const router = Router();
router.post('/login', async (req, res) => {
  const { phoneNumber } = req.body;

 
  return res.status(200).json({ success: true });
});

module.exports = router;