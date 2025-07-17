const { GetCollection } = require("./mongodb");
const { ObjectId } = require("mongodb");

// 📍 Find user by email
async function findUserByEmail(email) {
  const users = await GetCollection("users");
  return await users.findOne({ email });
}

// 🔍 Find user by ID
async function findUserById(id) {
  const users = await GetCollection("users");
  return await users.findOne({ _id: new ObjectId(id) });
}

// ✨ Insert new user (plain password + Toytale fields)
async function insertUser(userData) {
  const users = await GetCollection("users");

  const defaultUser = {
    name: userData.name || `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    password: userData.password, // plain text password
    location: userData.location || "",
    childrenAges: userData.childrenAges || [],
    joinedAt: new Date()
  };

  const result = await users.insertOne(defaultUser);
  return result.insertedId;
}

// ✏️ Update profile fields (e.g. name, location, childrenAges)
async function updateUserProfile(userId, updates) {
  const users = await GetCollection("users");

  const allowedFields = ["name", "firstName", "lastName", "location", "email", "bio", "childrenAges", "profileImage"];
  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key))
  );

  return await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: filteredUpdates }
  );
}

module.exports = {
  findUserByEmail,
  findUserById,
  insertUser,
  updateUserProfile
};
