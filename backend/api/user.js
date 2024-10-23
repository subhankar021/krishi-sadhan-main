const express = require('express');
const User = require('../database/models/users');
const { getPrimaryKey } = require('../database');
const router = express.Router();
router.post('/login', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone number is required' });
        }
        const cleanedPhoneNumber = phoneNumber.replace(/\s/g, '');
        const isValidPhoneNumber = /^\d{10}$/.test(cleanedPhoneNumber);

        if (!isValidPhoneNumber) {
            return res.status(400).json({ message: 'Invalid phone number' });
        }
        const isAlreadyExist = await User.findOne({ phoneNumber: phoneNumber, isRemoved: false });
        if (isAlreadyExist) {
            //save to the session
            req.session.user = { phoneNumber: phoneNumber };
            const updateOtp = await User.updateOne({ phoneNumber: phoneNumber }, { otp: '123456', isOtpVerified: false });
            if (updateOtp) {
                return res.status(200).json({ message: 'OTP sent successfully' });
            }
        } else {
            const createResult = await User.create({ userId: await getPrimaryKey('user'), phoneNumber: phoneNumber, otp: '123456', isOtpVerified: false,pinCode: null });
            if (createResult) {
                req.session.user = { phoneNumber: phoneNumber };
                return res.status(200).json({ message: 'OTP sent successfully' });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

})
router.post('/otp', async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json({ error: 'OTP is required' });
        }
        //check opt for the phoneNumber
        const updateOtp = await User.updateOne(
            { phoneNumber: req.session.user.phoneNumber,otp: otp.join('') },
            {  isOtpVerified: true }
        );
        if (updateOtp?.matchedCount !== 0) {
            console.log(`OTP verified successfully for ${req.session.user.phoneNumber}`);
            const pinCodeIsFound = await User.findOne({
                phoneNumber: req.session.user.phoneNumber,
                isRemoved: false,
            }).lean();
            if (pinCodeIsFound && pinCodeIsFound?.address?.pinCode) {     
                req.session.user =  pinCodeIsFound;
                console.log(pinCodeIsFound);
                return res.status(200).json({ message: 'OTP verified successfully' });
            } else {
                return res.status(200).json({  message: 'OTP verified successfully',redirectUrl: '/user/register'});
            }
        } else {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.get('/init-register', async (req, res) => {
    try {
        const { phoneNumber } = req.session.user;
        if (!phoneNumber) {
            return res.status(401).json({ error: 'Phone number is required' });
        }
        const registerRequestId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        req.session.registerRequestId = registerRequestId;
        return res.status(200).json({ phoneNumber: phoneNumber, registerRequestId: registerRequestId });
        
    } catch (error) {
        return res.status(500).json();
    }
})

router.post('/register', async (req, res) => {
    try {
        const { registerRequestId, fullName, email, address: { line1, line2, villageId, pinCode } } = req.body;
        const { phoneNumber } = req.session.user; 
        if (!phoneNumber) {
            return res.status(401).json({ error: 'Phone number is required' });
        }
        // find user by phone number
        const user = await User.findOne({ phoneNumber: phoneNumber, isRemoved: false });
        if (user) {
            const updateResult = await User.updateOne({
                phoneNumber: phoneNumber,
                userId: user.userId
            }, {
                fullName: fullName,
                email: email,
                address: {
                    line1: line1,
                    line2: line2,
                    villageId: villageId,
                    pinCode: pinCode
                }
            });
            if (updateResult) {

                const userInfo = await User.findOne({
                    phoneNumber: req.session.user.phoneNumber,
                    isRemoved: false,
                }).lean();    
                req.session.user =  userInfo;

                return res.status(200).json();
            }
        } else {
            return res.status(401).json();
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

})

router.get('/profile', async (req, res) => {
    try {
        console.log(req.session?.user);
        const { phoneNumber } = req.session?.user || {};
        if (!phoneNumber) {
            return res.status(401).json({ error: 'Phone number is required' });
        }
        const user = await User.findOne({ phoneNumber: phoneNumber, isRemoved: false });
        if (user) {
            const userInfo = await User.findOne({
                phoneNumber: req.session.user.phoneNumber,
                isRemoved: false,
            }).lean();    
            req.session.user =  userInfo;
            return res.status(200).json(user);
        } else {
            return res.status(401).json();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

// LOGOUT
router.get('/logout', async (req, res) => {
    try {
        req.session.destroy();
        return res.status(200).json();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})
module.exports = router;