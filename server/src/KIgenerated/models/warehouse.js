import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class warehouse extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    wid: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    plz: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    siteid: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'site',
        key: 'siteid'
      }
    }
  }, {
    sequelize,
    tableName: 'warehouse',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_siteid",
        fields: [
          { name: "siteid" },
        ]
      },
      {
        name: "warehouse_pkey",
        unique: true,
        fields: [
          { name: "wid" },
        ]
      },
    ]
  });
  }
}
