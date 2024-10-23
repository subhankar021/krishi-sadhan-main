// "CircleName","RegionName","DivisionName","OfficeName","Pincode","OfficeType","Delivery","District","StateName","Latitude","Longitude"
const fs = require("fs-extra");
const mongoose = require("mongoose");
const { app_directory, session_directory, log_directory, config_directory } = require("./utils/app_storage");
fs.ensureDirSync(app_directory);
fs.ensureDirSync(session_directory);
fs.ensureDirSync(log_directory);
fs.ensureDirSync(config_directory);
const readline = require('readline');


const { getAppConfig } = require("./utils/config");
const Districts = require('./database/models/districts');
const States = require('./database/models/states');
const Villages = require('./database/models/villages');
const { getPrimaryKey } = require("./database");
const PinCodes = require("./database/models/pincodes");
const appConfig = getAppConfig();

function getHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
}


async function insertPincodes(pincodeData = []) {
    await mongoose.connect(appConfig.database.dbHost, {
        dbName: appConfig.database.dbName,
        retryWrites: true,
        autoCreate: true,
        // autoIndex: true,
        auth: {
            password: appConfig.database.dbPassword,
            username: appConfig.database.dbUser
        }
    }).then(() => {
        console.log("Database connected");
    }).catch((err) => {
        console.log(err);
        return
    });
    try {
        const bulkInsert = pincodeData.sort((a, b) => a.pinCode - b.pinCode).map(({ stateName, districtName, villageName, pinCode, latitude, longitude }, index) => {
            const villageId = index + 1;
            return {
                updateOne: {
                    filter: { villageId },
                    update: {
                        $set: {
                            villageId,
                            village: villageName,
                            district: districtName,
                            state: stateName,
                            pincode: pinCode,
                            loc: { type: "Point", coordinates: [longitude, latitude] }
                        }
                    },
                    upsert: true
                }
            }
        });
        console.log("INSERTING PINCODES");
        console.log("BULK SIZE: ", bulkInsert.length);
        await PinCodes.bulkWrite(bulkInsert);
        // count pincodes
        const count = await PinCodes.countDocuments();
        console.log(`INSERTED ${count} PINCODES`);
    } catch (err) {
        console.log(err);
    }
    await mongoose.connection.close();
}

function capitalizeWords(str) {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

function parseCSV(filePath) {

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let isFirstLine = true;
    const pincodeData = [];
    const statesAndDistricts = {};
    rl.on('line', (line) => {
        if (isFirstLine) {
            isFirstLine = false;
            return;
        }

        const [CircleName, RegionName, DivisionName, OfficeName, Pincode, OfficeType, Delivery, District, StateName, Latitude, Longitude] = splitCsvData(line);
        // if (StateName == "TAMIL NADU" && District == "SALEM") {
        if (isNaN(parseInt(Pincode))) {
            return;
        }
        const regex = /\b\s*(?:B\.O|BO|S\.O|SO|GPO|G\.P\.O|H\.O|HO)\s*\b/g;
        const villageName = OfficeName.replace(regex, "").trim();
        const pinCode = parseInt(Pincode);

        pincodeData.push({
            stateName:  capitalizeWords(StateName.trim()),
            districtName: capitalizeWords(District.trim()),
            villageName,
            pinCode,
            latitude: isFinite(Latitude) ? parseFloat(Latitude) : null,
            longitude: isFinite(Longitude) ? parseFloat(Longitude) : null
        });
    });


    rl.on('close', () => {
        // Call update functions with parsed data
        // console.log(statesAndDistricts);
        console.log('Done parsing CSV file.');
        console.log(`DATA COLLECTED: ${pincodeData.length}`);
        // insertPincodes(pincodeData);
        return;
    });
}

function splitCsvData(data) {
    // Regular expression to split on commas outside quotes
    let regex = /"([^"]+)"|([^,]+)/g;
    let fields = [];
    let match;

    // Iterate through matches
    while ((match = regex.exec(data)) !== null) {
        // Push non-empty groups to fields array
        fields.push((match[1] !== undefined) ? match[1] : match[2].trim());
    }
    return fields;
}

// Call parseCSV function with your CSV file path
parseCSV("pincode.csv");
