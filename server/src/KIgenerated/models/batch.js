import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class batch extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    batchid: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    producerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'producer',
        key: 'producerid'
      }
    },
    deliverydate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'batch',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "batch_pk",
        unique: true,
        fields: [
          { name: "batchid" },
        ]
      },
    ]
  });
  }
}
