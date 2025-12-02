import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _batch from  "./batch.js";
import _batchitem from  "./batchitem.js";
import _producer from  "./producer.js";
import _producerproduct from  "./producerproduct.js";
import _product from  "./product.js";
import _productcategory from  "./productcategory.js";
import _site from  "./site.js";
import _slot from  "./slot.js";
import _slotentry from  "./slotentry.js";
import _storage from  "./storage.js";
import _warehouse from  "./warehouse.js";

export default function initModels(sequelize) {
  const batch = _batch.init(sequelize, DataTypes);
  const batchitem = _batchitem.init(sequelize, DataTypes);
  const producer = _producer.init(sequelize, DataTypes);
  const producerproduct = _producerproduct.init(sequelize, DataTypes);
  const product = _product.init(sequelize, DataTypes);
  const productcategory = _productcategory.init(sequelize, DataTypes);
  const site = _site.init(sequelize, DataTypes);
  const slot = _slot.init(sequelize, DataTypes);
  const slotentry = _slotentry.init(sequelize, DataTypes);
  const storage = _storage.init(sequelize, DataTypes);
  const warehouse = _warehouse.init(sequelize, DataTypes);

  producer.belongsToMany(product, { as: 'productid_products', through: producerproduct, foreignKey: "producerid", otherKey: "productid" });
  product.belongsToMany(producer, { as: 'producerid_producers', through: producerproduct, foreignKey: "productid", otherKey: "producerid" });
  batchitem.belongsTo(batch, { as: "batch", foreignKey: "batchid"});
  batch.hasMany(batchitem, { as: "batchitems", foreignKey: "batchid"});
  slotentry.belongsTo(batchitem, { as: "bi", foreignKey: "biid"});
  batchitem.hasMany(slotentry, { as: "slotentries", foreignKey: "biid"});
  batch.belongsTo(producer, { as: "producer", foreignKey: "producerid"});
  producer.hasMany(batch, { as: "batches", foreignKey: "producerid"});
  producerproduct.belongsTo(producer, { as: "producer", foreignKey: "producerid"});
  producer.hasMany(producerproduct, { as: "producerproducts", foreignKey: "producerid"});
  batchitem.belongsTo(product, { as: "product", foreignKey: "productid"});
  product.hasMany(batchitem, { as: "batchitems", foreignKey: "productid"});
  producerproduct.belongsTo(product, { as: "product", foreignKey: "productid"});
  product.hasMany(producerproduct, { as: "producerproducts", foreignKey: "productid"});
  product.belongsTo(productcategory, { as: "pc", foreignKey: "pcid"});
  productcategory.hasMany(product, { as: "products", foreignKey: "pcid"});
  warehouse.belongsTo(site, { as: "site", foreignKey: "siteid"});
  site.hasMany(warehouse, { as: "warehouses", foreignKey: "siteid"});
  slotentry.belongsTo(slot, { as: "sl", foreignKey: "slid"});
  slot.hasMany(slotentry, { as: "slotentries", foreignKey: "slid"});
  slot.belongsTo(storage, { as: "storage", foreignKey: "storageid"});
  storage.hasMany(slot, { as: "slots", foreignKey: "storageid"});
  storage.belongsTo(warehouse, { as: "wid_warehouse", foreignKey: "wid"});
  warehouse.hasMany(storage, { as: "storages", foreignKey: "wid"});

  return {
    batch,
    batchitem,
    producer,
    producerproduct,
    product,
    productcategory,
    site,
    slot,
    slotentry,
    storage,
    warehouse,
  };
}
