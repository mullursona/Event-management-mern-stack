const router = require("express").Router();
const Booking = require("../models/Booking");
const Event = require("../models/Event");


// ✅ BOOK EVENT
router.post("/book", async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // 🔒 Prevent duplicate booking
    const existing = await Booking.findOne({ userId, eventId });
    if (existing) {
      return res.status(400).json("Already booked this event");
    }

    // 🔒 Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json("Event not found");
    }

    const booking = new Booking({ userId, eventId });
    await booking.save();

    res.json("Event booked");

  } catch (err) {
    console.log(err);
    res.status(500).json("Error booking event");
  }
});


// ✅ GET USER BOOKINGS WITH EVENT DETAILS (FIXED)
router.get("/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });

    const result = [];

    for (let b of bookings) {
      const event = await Event.findById(b.eventId);

      // ✅ Skip broken bookings (event deleted)
      if (event) {
        result.push({
          ...b._doc,
          event,
        });
      }
    }

    res.json(result);

  } catch (err) {
    console.log(err);
    res.status(500).json("Error fetching bookings");
  }
});


// ❌ OPTIONAL: CANCEL BOOKING
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json("Booking cancelled");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error cancelling booking");
  }
});


module.exports = router;