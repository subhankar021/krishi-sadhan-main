var express = require('express');
const verifyUserSession = require('../../middleware/auth');
const Equipments = require('../../database/models/equipments');
const Categories = require('../../database/models/categories');
const { getPrimaryKey } = require('../../database');
const dayjs = require('dayjs');
const SlotConfig = require('../../database/models/slots');
const EquipmentAvailability = require('../../database/models/equipment-availability');
const Bookings = require('../../database/models/bookings');
const { app_directory } = require('../../utils/app_storage');
var router = express.Router();
const fs = require("fs-extra");

const path = require("path");
const EquipmentBlockage = require('../../database/models/equipment-blockage');

router.get('/list', verifyUserSession, async (req, res) => {
  try {
    if (!req.session?.user?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const equipments = await Equipments.aggregate([
      {
        $match: {
          aggregatorId: req.session?.user?.userId,
          isRemoved: false,
          isActive: true
        }
      },
      {
        $addFields: {
          price: { $concat: ["₹ ", { $toString: "$price" }, " / hr"] }
        }
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
          // price: 0
        }
      }
    ]);
    // console.log(equipments);

    return res.status(200).json({ equipments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:equipmentId/details', verifyUserSession, async (req, res) => {
  try {
    const { equipmentId } = req.params;
    if (equipmentId && typeof equipmentId === "string") {
      // check if category exists
      const equipment = await Equipments.findOne({ equipmentId: parseInt(equipmentId) }, { _id: 0, __v: 0 }, { lean: true });
      if (equipment) {
        console.log(equipment);
        return res.status(200).json(equipment);
      }
    }
    return res.status(404).json({ error: "Equipment not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }
  return '0.0.0.0';
}

router.post(`/add`, verifyUserSession, async (req, res) => {
  try {
    if (!req.session?.user?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { equipmentId, categoryId, name, description, price, imageData, imageUrl, villageIds, pincode } = req.body;
    let imageFileUrl = imageUrl || null;
    if (imageData) {
      const imagePath = imageData && imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      const imageBuffer = Buffer.from(imagePath, 'base64'); String
      const imageFileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
      const imageFilePath = path.join(app_directory, "equipment_images", imageFileName);
      fs.ensureDirSync(path.dirname(imageFilePath));
      fs.writeFileSync(imageFilePath, imageBuffer);
      imageFileUrl = `http://${getIPAddress()}:8080/pub/equipment-images/${imageFileName}`
    }
    const data = {
      equipmentId: equipmentId || await getPrimaryKey("equipments"),
      categoryId,
      name,
      description,
      imageUrl: imageFileUrl,
      price,
      villageIds: [...villageIds || []],
      aggregatorId: req.session.user.userId,
      pincode: parseInt(pincode),
      isActive: true,
      isRemoved: false
    }
    if (equipmentId) {
      const result = await Equipments.updateOne({ equipmentId: parseInt(equipmentId) }, data);
      return res.status(result?.modifiedCount ? 200 : 500).json({ success: result ? true : false });
    } else {
      const result = await Equipments.create(data);
      return res.status(result ? 200 : 500).json({ success: result ? true : false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
async function getEquipmentAvailability(equipmentId, date) {
  return await EquipmentAvailability.findOne({ equipmentId: equipmentId, date: date }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, isActive: 0, isRemoved: 0 }, { lean: true });
}
async function addTestAvailability(equipmentId, date, startTime, endTime) {
  // check if availability already exists
  const availability = await getEquipmentAvailability(equipmentId, date);
  if (availability) {
    return;
  }
  await EquipmentAvailability.create({
    availabilityId: await getPrimaryKey("equipment_availability"),
    equipmentId: equipmentId,
    date: date,
    startTime: startTime,
    endTime: endTime,
    isActive: true,
    isRemoved: false
  });
}
router.get(`/:equipmentId/schedule`, verifyUserSession, async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const { selectedSlots } = req.session;
    let selectedSlot = null;
    if (equipmentId && typeof equipmentId === "string") {
      const equipment = await Equipments.findOne({ equipmentId: parseInt(equipmentId) }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, isActive: 0, isRemoved: 0 }, { lean: true });
      if (equipment) {
        const slotConfiguration = await SlotConfig.findOne({ isActive: true });
        if (!slotConfiguration) {
          await SlotConfig.create({
            slotId: await getPrimaryKey("slot_config"),
            startTime: "06:00:00",
            endTime: "19:59:59",
            daysCount: 5,
            isActive: true,
            isRemoved: false
          });
        }
        const slotConfig = await SlotConfig.findOne({ isActive: true });

        const slotsList = [];

        for (let i = 0; i < slotConfig.daysCount; i++) {
          const date = dayjs().add(i, 'day').startOf("hour");
          const formattedDate = date.format('YYYY-MM-DD');
          const slots = { morning: [], afternoon: [], evening: [] };
          const systemSlotStartTime = dayjs(`${formattedDate} ${slotConfig.startTime}`);
          const systemSlotEndTime = dayjs(`${formattedDate} ${slotConfig.endTime}`);
          await addTestAvailability(equipmentId, formattedDate, systemSlotStartTime.add(0, 'hour').format('HH:mm:ss'), systemSlotEndTime.subtract(0, 'hour').format('HH:mm:ss'));
          const equipmentAvailability = await getEquipmentAvailability(equipmentId, formattedDate);
          // find all bookings on current day
          const bookingsList = await Bookings.find({ equipmentId: equipmentId, bookingDate: { $gte: formattedDate, $lte: formattedDate + " 23:59:59" } }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, isActive: 0, isRemoved: 0 }, { lean: true });
          const bookedSlots = new Set(bookingsList.map(booking => dayjs(booking.bookingDate).format('HH:mm:ss')));
          for (let hour = systemSlotStartTime.hour(); hour < systemSlotEndTime.hour(); hour++) {
            const slotTime = dayjs().add(i, 'day').startOf("day").add(hour, 'hour');
            const slotLabel = slotTime.format('hh:mm A');
            const currentDate = dayjs();
            // is equipment available on this slot
            let equipmentSlotAvailability = false;
            if (equipmentAvailability) {
              const equipmentAvailabilityStartTime = dayjs(`${formattedDate} ${equipmentAvailability.startTime}`);
              const equipmentAvailabilityEndTime = dayjs(`${formattedDate} ${equipmentAvailability.endTime}`);
              equipmentSlotAvailability = slotTime.isAfter(equipmentAvailabilityStartTime) && slotTime.isBefore(equipmentAvailabilityEndTime);
            }

            const available = equipmentSlotAvailability && slotTime.isAfter(currentDate) && slotTime.isBefore(systemSlotEndTime) && (slotTime.isAfter(systemSlotStartTime) || slotTime.isSame(systemSlotStartTime));
            const isBooked = bookedSlots.has(slotTime.format('HH:mm:ss'));
            const daySegment = slotTime.hour() < 12 ? 'morning' : (slotTime.hour() < 18 ? 'afternoon' : 'evening');
            const equipmentBlockage = await EquipmentBlockage.findOne({ equipmentId: parseInt(equipmentId), date: formattedDate, startTime: slotTime.format('HH:mm:ss'), endTime: slotTime.add(1, 'hour').subtract(1, 'second').format('HH:mm:ss') }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, isActive: 0, isRemoved: 0 }, { lean: true });
            // console.log(equipmentBlockage);
            let isBlocked = false;
            if (equipmentBlockage) {
              isBlocked = true;
            }
            // console.log({ equipmentId: equipmentId, date: formattedDate, startTime: slotTime.format('HH:mm:ss'), endTime: slotTime.format('HH:mm:ss') }, isBlocked);
            slots[daySegment].push({
              slotTime: slotLabel,
              available,
              timestamp: slotTime.format('YYYY-MM-DD HH:mm:ss'),
              isBooked,
              isSelected: false,
              isBlocked
            });
          }

          slotsList.push({
            date: formattedDate,
            day: date.format('ddd'),
            dateOnly: date.format('DD'),
            month: date.format('MMM'),
            year: date.format('YYYY'),
            slots
          });
        }

        return res.status(200).json({
          slotInfo: slotsList,
          selectedSlot: selectedSlot,
          equipmentInfo: {
            ...equipment,
            price: `₹ ${equipment.price} / hr`,
          }
        });
      }
    }
    return res.status(400).json({ error: "Equipment not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:equipmentId/update-blockage', verifyUserSession, async (req, res) => {
  try {

    const { equipmentId } = req.params;
    const { timestamp } = req.body;

    if(isNaN(parseInt(equipmentId))) {
      return res.status(400).json({ error: "Invalid equipment id" });
    }

    const formattedDate = dayjs(timestamp).format('YYYY-MM-DD');
    const startTime = dayjs(timestamp).format('HH:mm:ss');
    const endTime = dayjs(timestamp).add(1, 'hour').subtract(1, 'second').format('HH:mm:ss');
    // console.log({ formattedDate, startTime, endTime });
    const blockage = await EquipmentBlockage.find({ equipmentId: parseInt(equipmentId), date: formattedDate, startTime, endTime });
    if (blockage.length > 0) {
      await EquipmentBlockage.deleteMany({ equipmentId: parseInt(equipmentId), date: formattedDate, startTime, endTime });
    } else {
      const blockage = await EquipmentBlockage.create({
        blockageId: await getPrimaryKey("equipment_blockage"),
        equipmentId: parseInt(equipmentId),
        date: formattedDate,
        startTime,
        endTime,
        isActive: true,
        isRemoved: false
      });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;