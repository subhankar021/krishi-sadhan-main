const express = require('express');
const router = express.Router();
const dayjs = require('dayjs');
const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const { log_directory } = require('../utils/app_storage');
const { getLogger } = require('log4js');

const writeFile = promisify(fs.writeFile);

router.post('/', async (req, res) => {
    try {
        const { image, errorStack, errorMessage } = req.body;
        if (!fs.existsSync(path.join(log_directory, 'FrontendErrorReportImages'))) {
            fs.mkdirSync(path.join(log_directory, 'FrontendErrorReportImages'));
        }
        const imageName = `error_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.png`;
        const imagePath = path.join(log_directory, 'FrontendErrorReportImages', imageName);
        await writeFile(imagePath, image.split('base64,')[1], 'base64');
        getLogger().error(`UI Error Report: ${errorMessage}\n${errorStack}\n\Image: ${imagePath}`); 
        return res.status(200).end();

    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).end();
    }
});

module.exports = router;