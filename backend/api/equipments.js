var express = require('express');
const verifyUserSession = require('../middleware/auth');
const Equipments = require('../database/models/equipments');
const Categories = require('../database/models/categories');
const { getPrimaryKey } = require('../database');
const dayjs = require('dayjs');
const SlotConfig = require('../database/models/slots');
const EquipmentAvailability = require('../database/models/equipment-availability');
const Bookings = require('../database/models/bookings');
const { app_directory } = require('../utils/app_storage');
var router = express.Router();
const fs = require("fs-extra");

const path = require("path");
const EquipmentBlockage = require('../database/models/equipment-blockage');

router.get('/:categoryId/list', verifyUserSession, async (req, res) => {
  try {

    const { categoryId } = req.params;

    if (categoryId && typeof categoryId === "string") {
      // check if category exists
      const category = await Categories.findOne({ categoryId: parseInt(categoryId) }, { _id: 0, __v: 0 }, { lean: true });
      if (category) {
        const equipments = await Equipments.aggregate([
          {
            $match: {
              categoryId: parseInt(categoryId),
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

        return res.status(200).json({ categoryName: `${category.name} (${equipments.length})`, equipments });
      }
    }

    return res.status(400).json({ error: "Category not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

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

async function getEquipmentAvailability(equipmentId, date) {
  return await EquipmentAvailability.findOne({ equipmentId: equipmentId, date: date }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, isActive: 0, isRemoved: 0 }, { lean: true });
}

router.get(`/:equipmentId/details`, verifyUserSession, async (req, res) => {
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
          await addTestAvailability(equipmentId, formattedDate, systemSlotStartTime.add(2, 'hour').format('HH:mm:ss'), systemSlotEndTime.subtract(2, 'hour').format('HH:mm:ss'));
          const equipmentAvailability = await getEquipmentAvailability(equipmentId, formattedDate);
          // console.log(`Equipment Availability: ${JSON.stringify(equipmentAvailability)}`);
          // find all bookings on current day
          const bookingsList = await Bookings.find({ equipmentId: equipmentId, bookingDate: { $gte: formattedDate, $lte: formattedDate + " 23:59:59" } }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, isActive: 0, isRemoved: 0 }, { lean: true });
          const bookedSlots = new Set(bookingsList.map(booking => dayjs(booking.bookingDate).format('HH:mm:ss')));
          for (let hour = systemSlotStartTime.hour(); hour < systemSlotEndTime.hour(); hour++) {
            const slotTime = dayjs().add(i, 'day').startOf("day").add(hour, 'hour');
            const slotLabel = slotTime.format('hh:mm A');
            const currentDate = dayjs();
            // is equipment available on this slot
            const equipmentBlockage = await EquipmentBlockage.findOne({ equipmentId: equipmentId, date: formattedDate, startTime: slotTime.format('HH:mm:ss'), endTime: slotTime.add(1, 'hour').subtract(1, 'second').format('HH:mm:ss'), isActive: true, isRemoved: false }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, isActive: 0, isRemoved: 0 }, { lean: true });
            let equipmentSlotAvailability = false;
            if (equipmentAvailability && !equipmentBlockage) {
              const equipmentAvailabilityStartTime = dayjs(`${formattedDate} ${equipmentAvailability.startTime}`);
              const equipmentAvailabilityEndTime = dayjs(`${formattedDate} ${equipmentAvailability.endTime}`);
              equipmentSlotAvailability = slotTime.isAfter(equipmentAvailabilityStartTime) && slotTime.isBefore(equipmentAvailabilityEndTime);
            }
            const available = !equipmentBlockage && equipmentSlotAvailability && slotTime.isAfter(currentDate) && slotTime.isBefore(systemSlotEndTime) && (slotTime.isAfter(systemSlotStartTime) || slotTime.isSame(systemSlotStartTime));
            const isBooked = bookedSlots.has(slotTime.format('HH:mm:ss'));
            const daySegment = slotTime.hour() < 12 ? 'morning' : (slotTime.hour() < 18 ? 'afternoon' : 'evening');
            let isSelected = false;
            if (!isBooked && selectedSlots?.findIndex((slot) => equipmentId === slot.equipmentId && slot.timestamp === slotTime.format('YYYY-MM-DD HH:mm:ss')) > -1) {
              isSelected = true;
              selectedSlot = slotTime.format('YYYY-MM-DD HH:mm:ss');
            }
            slots[daySegment].push({
              slotTime: slotLabel,
              available,
              timestamp: slotTime.format('YYYY-MM-DD HH:mm:ss'),
              isBooked,
              isSelected
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

router.post(`/:equipmentId/select-slot`, verifyUserSession, async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const { timestamp } = req.body;
    // store it in session - handle multiple equipment selection
    req.session.selectedSlots = [
      { equipmentId, timestamp }
    ]

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;