import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class site extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    siteid: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    country: {
      type: DataTypes.CHAR(3),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'site',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "site_pkey",
        unique: true,
        fields: [
          { name: "siteid" },
        ]
      },
    ]
  });
  }
}
