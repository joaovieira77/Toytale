const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const userService = require("./services/userService");
const messageService = require("./services/message");
const itemsService = require("./services/ItemsService");
const { GetCollection } = require("./data/mongodb");

const app = express();
const PORT = process.env.PORT || 3032;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json({ limit: '5mb' }));

/* ---------------------- AUTH ---------------------- */

app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, location, childrenAges = [] } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword || !location) {
    return res.status(400).json({ error: "All fields required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords don't match." });
  }

  try {
    const userId = await userService.createUser({
      firstName,
      lastName,
      email,
      password,
      location,
      childrenAges
    });
    res.json({ userId });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userId = await userService.loginUser({ email, password });
    res.json({ userId });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

/* ---------------------- USERS ---------------------- */

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post("/api/users/update-profile", async (req, res) => {
  const { userId, ...updates } = req.body;

  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    await userService.updateUserProfile(userId, updates);
    res.json({ message: "Profile successfully updated" });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res.status(500).json({ error: "Profile update failed" });
  }
});

app.get("/api/all-users", async (req, res) => {
  try {
    const users = await GetCollection("users");
    const all = await users.find().toArray();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/* ---------------------- ITEMS ---------------------- */

app.post("/api/items", async (req, res) => {
  const { ownerId, title, description, type, mode, ageRange, condition, photoUrl, price } = req.body;

  if (!ownerId || !title || !description || !type || !mode || !ageRange) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const itemData = {
      ownerId,
      title,
      description,
      type,
      mode,
      ageRange,
      condition: condition || "good",
      photoUrl: photoUrl || null,
     price: mode === "sale" && !isNaN(parseFloat(price)) && parseFloat(price) > 0
  ? parseFloat(price)
  : null,

      available: true,
      createdAt: new Date()
    };

    const itemId = await itemsService.createItem(itemData);
    res.json({ itemId, message: "Item created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/items", async (req, res) => {
  try {
    const items = await itemsService.getAllItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.get("/api/items/:id", async (req, res) => {
  try {
    const item = await itemsService.getItemById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.put("/api/items/:id/availability", async (req, res) => {
  const { available } = req.body;

  try {
    const updated = await itemsService.updateItemAvailability(req.params.id, available);
    if (updated) {
      res.json({ message: "Item availability updated" });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------- MESSAGES ---------------------- */

app.post("/messages", async (req, res) => {
  try {
    const { from, to, content } = req.body;
    const result = await messageService.sendMessage(from, to, content);

    res.json({
      from,
      to,
      content,
      timestamp: result.ops ? result.ops[0].timestamp : new Date(),
      _id: result.insertedId
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.get("/messages/:user1/:user2", async (req, res) => {
  try {
    const messages = await messageService.getConversation(req.params.user1, req.params.user2);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.get("/conversations/:userId", async (req, res) => {
  try {
    const conversations = await messageService.getUserConversations(req.params.userId);
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

/* ---------------------- SERVER ---------------------- */

app.listen(PORT, () => {
  console.log(`🧸 Toytale backend running on port ${PORT}`);
});
