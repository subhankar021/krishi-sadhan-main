var express = require('express');
const verifyUserSession = require('../middleware/auth');
const Equipments = require('../database/models/equipments');
const Categories = require('../database/models/categories');
const { getPrimaryKey } = require('../database');
const dayjs = require('dayjs');
const SlotConfig = require('../database/models/slots');
const EquipmentAvailability = require('../database/models/equipment-availability');
const Bookings = require('../database/models/bookings');
const User = require('../database/models/users');
var router = express.Router();


router.get(`/book`, verifyUserSession, async (req, res) => {
  try {
    if (!req.session?.user?.phoneNumber) {
      return res.status(401).end();
    }

    for (const { equipmentId, timestamp } of req.session?.selectedSlots || []) {
      const equipment = await Equipments.findOne({ equipmentId }, { _id: 0, __v: 0 });
      const user = await User.findOne({ phoneNumber: req.session.user.phoneNumber }, { _id: 0, __v: 0 });
      const booking = await Bookings.create({
        bookingId: await getPrimaryKey("bookings"),
        equipmentId,
        bookingNumber: Math.floor(Math.random() * 1000000000).toString(10),
        userId: user.userId,
        bookingDate: timestamp,
        price: equipment.price,
        status: "pending",
      });
      req.session.bookingId = booking.bookingId;
      return res.status(200).json({
        name: equipment.name,
        description: equipment.description,
        imageUrl: equipment.imageUrl,
        price: `₹ ${booking.price} / hr`,
        bookingDate: timestamp,
        bookingId: booking.bookingId
      });
    }

    return res.status(400).json({ error: "No slots selected" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
router.post(`/confirm`, async (req, res) => {
  try {
    if (!req.session?.user?.phoneNumber) {
      return res.status(401).end();
    }

    // get booking id
    const booking = await Bookings.findOne({ bookingId: req.session.bookingId });

    if (!booking) {
      return res.status(400).json({ error: "Booking not found" });
    }

    if (booking.status === "pending") {
      booking.status = "confirmed";
      booking.save();
    }
    // delete session booking id
    delete req.session.bookingId;
    delete req.session.selectedSlots;
    return res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get(`/history`, verifyUserSession, async (req, res) => {
  try {
    if (!req.session?.user?.phoneNumber) {
      return res.status(401).end();
    }
    const user = await User.findOne({ phoneNumber: req.session.user.phoneNumber }, { _id: 0, __v: 0 });
    const bookings = await Bookings.find({ userId: user.userId }, { _id: 0, __v: 0 }).lean();
  //   {
  //     bookingNumber: "ORD1A2B3C",
  //     equipmentName: "Harvesting Equipment",
  //     bookingInfo: {
  //         customerName: "Ravi Kumar", // Indian name
  //         customerEmail: "ravi@example.com",
  //         bookingDate: "2024-05-22",
  //         bookingTime: "10:00 AM"
  //     },
  //     slot: {
  //         startTime: "10:00 AM",
  //         endTime: "12:00 PM"
  //     },
  //     location: "Chandannagar",
  //     amount: 50.00,
  //     status: "Pending"
  // },
    const result = await Promise.all(bookings.map(async (booking) => {
      const equipment = await Equipments.findOne({ equipmentId: booking.equipmentId }, { _id: 0, __v: 0 });
      return {
        // ...booking,
        bookingNumber: booking.bookingNumber,
        equipmentName: equipment?.name,
        imageUrl: equipment?.imageUrl,
        bookingInfo: {
          customerName: user.name,
          bookingDate: dayjs(booking.createdAt).format('DD-MM-YYYY'),
          bookingTime: dayjs(booking.createdAt).format('hh:mm A'),
        },
        slot: {
          startTime: dayjs(booking.bookingDate).format('hh:mm A'),
          endTime: dayjs(booking.bookingDate).add(1, 'hour').format('hh:mm A'),
        },
        location: equipment?.location || "",
        amount: booking.price,
        status: booking.status
      }
    }));
    const filteredResult = result.filter((item) => item.equipmentName);
    return res.status(200).json(filteredResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;