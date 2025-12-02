import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class producer extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    producerid: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    country: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'producer',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "producer_pk",
        unique: true,
        fields: [
          { name: "producerid" },
        ]
      },
    ]
  });
  }
}
