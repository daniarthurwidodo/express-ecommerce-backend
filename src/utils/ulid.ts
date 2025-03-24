import { ulid } from 'ulid';
import { DataTypes } from 'sequelize';

export const ULID = {
  type: DataTypes.STRING(26),
  defaultValue: () => ulid(),
  primaryKey: true,
  validate: {
    isULID: (value: string) => {
      const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/;
      if (!ULID_REGEX.test(value)) {
        throw new Error('Invalid ULID format');
      }
    }
  }
};