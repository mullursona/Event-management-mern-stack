const router = require("express").Router();
const Event = require("../models/Event");


// ➕ CREATE EVENT
router.post("/create", async (req, res) => {
  try {
    const { title, description, date, image } = req.body;

    // 🔒 STRICT validation (IMPORTANT)
    if (!title || !description || !date || !image) {
      return res.status(400).json("All fields including image are required");
    }

    const newEvent = new Event({
      title,
      description,
      date,
      image   // ✅ ALWAYS SAVE IMAGE
    });

    await newEvent.save();

    res.json({ message: "Event created", event: newEvent });

  } catch (err) {
    console.log(err);
    res.status(500).json("Error creating event");
  }
});


// 📋 GET ALL EVENTS
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ _id: -1 });
    res.json(events);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error fetching events");
  }
});


// 🗑 DELETE EVENT
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json("Event not found");
    }

    res.json("Event deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json("Error deleting event");
  }
});


// ✏️ UPDATE EVENT
router.put("/:id", async (req, res) => {
  try {
    const { title, description, date, image } = req.body;

    if (!title || !description || !date || !image) {
      return res.status(400).json("All fields including image are required");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, image },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json("Event not found");
    }

    res.json(updatedEvent);

  } catch (err) {
    console.log(err);
    res.status(500).json("Error updating event");
  }
});


module.exports = router;