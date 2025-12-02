import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class productcategory extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    pcid: {
      autoIncrement: true,
      autoIncrementIdentity: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    mintemp: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    maxtemp: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    minhumidity: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    minquality: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    isbio: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'productcategory',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "productcategory_pk",
        unique: true,
        fields: [
          { name: "pcid" },
        ]
      },
    ]
  });
  }
}
