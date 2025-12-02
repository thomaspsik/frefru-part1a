import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class slot extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    slid: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    capacitykg: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacityunits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    storageid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'storage',
        key: 'storageid'
      }
    }
  }, {
    sequelize,
    tableName: 'slot',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_storageid",
        fields: [
          { name: "storageid" },
        ]
      },
      {
        name: "slot_pkey",
        unique: true,
        fields: [
          { name: "slid" },
        ]
      },
    ]
  });
  }
}
