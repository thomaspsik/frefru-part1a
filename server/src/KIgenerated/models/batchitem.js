import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class batchitem extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    biid: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    batchid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'batch',
        key: 'batchid'
      }
    },
    productid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product',
        key: 'productid'
      }
    },
    chargeid: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    expiredate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    units: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    buyprice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'batchitem',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "batchitem_pk",
        unique: true,
        fields: [
          { name: "biid" },
        ]
      },
    ]
  });
  }
}
