const { ObjectId } = require("mongodb");
const { insertMessage, findMessagesBetweenUsers } = require("../data/messageData");
const { GetCollection } = require("../data/mongodb");

async function sendMessage(from, to, content) {
  return insertMessage({
    from: new ObjectId(from),
    to: new ObjectId(to),
    content,
    timestamp: new Date(),
  });
}

async function getConversation(user1, user2) {
  return findMessagesBetweenUsers(new ObjectId(user1), new ObjectId(user2));
}

async function getUserConversations(userId) {
  try {
    const collection = await GetCollection("messages");
    const userObjectId = new ObjectId(userId);
    
    // Find all messages where user is sender or receiver
    const messages = await collection.find({
      $or: [
        { from: userObjectId },
        { to: userObjectId }
      ]
    }).toArray();
    
    // Group by conversation partners
    const conversations = new Map();
    
    messages.forEach(msg => {
      const partnerId = msg.from.equals(userObjectId) ? msg.to.toString() : msg.from.toString();
      
      if (!conversations.has(partnerId) || msg.timestamp > conversations.get(partnerId).timestamp) {
        conversations.set(partnerId, {
          partnerId,
          lastMessage: msg.content,
          timestamp: msg.timestamp
        });
      }
    });
    
    return Array.from(conversations.values());
  } catch (err) {
    console.error("Error getting user conversations:", err);
    return [];
  }
}

module.exports = { sendMessage, getConversation, getUserConversations };
