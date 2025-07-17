const userData = require("../data/userData");

async function createUser({ firstName, lastName, email, password, location, childrenAges = [] }) {
  const existing = await userData.findUserByEmail(email);
  if (existing) throw new Error("User already exists");

  const user = {
    name: `${firstName} ${lastName}`,
    email,
    password,
    location,
    childrenAges,
    joinedAt: new Date(),
  };

  return await userData.insertUser(user);
}

async function loginUser({ email, password }) {
  const user = await userData.findUserByEmail(email);
  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }
  return user._id;
}

async function getUser(id) {
  return await userData.findUserById(id);
}

async function updateUserProfile(userId, updates) {
  return await userData.updateUserProfile(userId, updates);
}

module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUserProfile,
};
