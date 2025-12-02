import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class producerproduct extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    producerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'producer',
        key: 'producerid'
      }
    },
    productid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'product',
        key: 'productid'
      }
    }
  }, {
    sequelize,
    tableName: 'producerproduct',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "producerproduct_pk",
        unique: true,
        fields: [
          { name: "producerid" },
          { name: "productid" },
        ]
      },
    ]
  });
  }
}
