import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class storage extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    storageid: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    temperature: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    humidity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quality: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    wid: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'warehouse',
        key: 'wid'
      }
    }
  }, {
    sequelize,
    tableName: 'storage',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_wid",
        fields: [
          { name: "wid" },
        ]
      },
      {
        name: "storage_pkey",
        unique: true,
        fields: [
          { name: "storageid" },
        ]
      },
    ]
  });
  }
}
