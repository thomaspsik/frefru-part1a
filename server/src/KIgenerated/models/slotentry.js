import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class slotentry extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    slotentryid: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    slid: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'slot',
        key: 'slid'
      }
    },
    biid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'batchitem',
        key: 'biid'
      }
    },
    unitscount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'slotentry',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "slotentry_pk",
        unique: true,
        fields: [
          { name: "slotentryid" },
        ]
      },
    ]
  });
  }
}
