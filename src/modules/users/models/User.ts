import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/database';
import { ULID } from '../../../utils/ulid';

interface UserAttributes {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }

class User extends Model implements UserAttributes{
  public id!: number;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public password!: string;
  public role!: 'admin' | 'customer' | 'guest';
  public isEmailVerified!: boolean;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public verificationToken!: string | null;
  public verificationTokenExpires!: Date | null;
}

User.init({
  id: ULID,
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'customer', 'guest'),
    defaultValue: 'customer'
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  authProvider: {
    type: DataTypes.ENUM('local', 'google'),
    defaultValue: 'local'
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verificationTokenExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'users'
});

export default User;