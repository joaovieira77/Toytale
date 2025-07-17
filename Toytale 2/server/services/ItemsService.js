const itemData = require("../data/Items");

async function createItem({ ownerId, title, description, type, mode, ageRange, condition, photoUrl }) {
  if (!ownerId || !title || !description || !type || !mode || !ageRange || !condition || !photoUrl) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  const newItemId = await itemData.insertItem({
    ownerId,
    title,
    description,
    type,       
    mode,       
    ageRange,   
    condition,  
    photoUrl    
  });

  return newItemId;
}

async function getAllItems() {
  return await itemData.findAllItems();
}

async function getItemById(id) {
  const item = await itemData.findItemById(id);
  if (!item) throw new Error("Item não encontrado.");
  return item;
}

async function updateItemAvailability(itemId, available) {
  const result = await itemData.updateItemStatus(itemId, available);
  return result.modifiedCount > 0;
}

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItemAvailability
};
