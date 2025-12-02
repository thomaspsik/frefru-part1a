import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class product extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    productid: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    pcid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productcategory',
        key: 'pcid'
      }
    },
    image: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    handlingunit: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    numofhaun: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    kgperunit: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    sellprice: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'product',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "product_pk",
        unique: true,
        fields: [
          { name: "productid" },
        ]
      },
    ]
  });
  }
}
