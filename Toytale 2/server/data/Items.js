const { GetCollection } = require("./mongodb");
const { ObjectId } = require("mongodb");

// 📥 Add new item
async function insertItem({
  ownerId,
  title,
  description,
  type,
  mode,
  ageRange,
  condition,
  photoUrl
}) {
  const items = await GetCollection("items");

  const newItem = {
    ownerId: new ObjectId(ownerId),
    title,
    description,
    type,         // "book" or "toy"
    mode,         // "donation", "swap", or "borrow"
    ageRange,     // e.g., "3-5"
    condition,    // e.g., "like new", "used", etc.
    photoUrl,     // path to image file or base64 string
    available: true,
    createdAt: new Date()
  };

  const result = await items.insertOne(newItem);
  return result.insertedId;
}

// 📜 Get all items
async function findAllItems() {
  const items = await GetCollection("items");
  return await items.find().toArray();
}

// 🔍 Get item by ID
async function findItemById(id) {
  const items = await GetCollection("items");
  return await items.findOne({ _id: new ObjectId(id) });
}

// 🛠️ Optionally: update availability or status
async function updateItemStatus(itemId, available) {
  const items = await GetCollection("items");
  return await items.updateOne(
    { _id: new ObjectId(itemId) },
    { $set: { available } }
  );
}

module.exports = {
  insertItem,
  findAllItems,
  findItemById,
  updateItemStatus
};
