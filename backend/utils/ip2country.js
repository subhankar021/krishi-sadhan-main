const path = require('path');
const maxmind = require('maxmind');
const axios = require('axios');
const fs = require('fs');
const zlib = require('zlib');

const mmdbFolderPath = path.join(process.cwd(), 'MMDB');

async function fileExists(url) {
    try {
        const response = await axios.head(url);
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

async function getUserCountry(req) {
    try {
        const ipAddress = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (!maxmind.validate(ipAddress)) {
            console.log('Invalid IP address: ', ipAddress);
            return null;
        }
        const currentDate = new Date().toISOString().slice(0, 7);
        const mmdbFileName = `dbip-country-lite-${currentDate}.mmdb`;
        const mmdbFilePath = path.join(mmdbFolderPath, mmdbFileName);
        const mmdbFileUrl = `https://download.db-ip.com/free/${mmdbFileName}.gz`;

        if (!fs.existsSync(mmdbFilePath)) {
            if (await fileExists(mmdbFileUrl)) {
                console.log('MMDB file not found for current month, downloading...');
                await downloadAndUnzipMMDBFile(mmdbFileUrl);
            } else {
                console.log('MMDB file not found in db-ip.com. Skipping...');
                return null;
            }
        }

        const buffer = fs.readFileSync(mmdbFilePath);
        const lookup = new maxmind.Reader(buffer);
        const lookupResult = lookup.get(ipAddress);
        return lookupResult?.country?.iso_code || null;
    } catch (e) {
        console.log("ERROR IN GET USER COUNTRY: ", e);
    }
    return null;
}

async function downloadAndUnzipMMDBFile(fileUrl) {
    const gzippedFileName = path.join(mmdbFolderPath, `${fileUrl.split('/').pop()}.gz`);
    const unzippedFileName = path.join(mmdbFolderPath, `${fileUrl.split('/').pop().replace('.gz', '')}`);

    if (!fs.existsSync(mmdbFolderPath)) {
        fs.mkdirSync(mmdbFolderPath, { recursive: true });
    }

    const fileStream = fs.createWriteStream(gzippedFileName);

    await new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream',
        }).then((response) => {
            response.data.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close(() => {
                    console.log(`Downloaded: ${gzippedFileName}`);

                    // Unzip the downloaded file
                    const readStream = fs.createReadStream(gzippedFileName);
                    const writeStream = fs.createWriteStream(unzippedFileName);
                    const unzip = zlib.createGunzip();

                    readStream.pipe(unzip).pipe(writeStream);

                    writeStream.on('finish', () => {
                        console.log(`Unzipped and saved: ${unzippedFileName}`);

                        // Optional: Delete the gzipped file after unzipping
                        fs.unlink(gzippedFileName, () => {
                            console.log(`Deleted: ${gzippedFileName}`);
                            resolve();
                        });
                    });
                });
            });
        }).catch((err) => {
            fs.unlink(gzippedFileName, () => { });
            console.error(`Error downloading file: ${err.message}`);
            reject(err);
        });
    });
}

module.exports = getUserCountry