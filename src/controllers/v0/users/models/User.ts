import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { config } from "../../../../config/config";

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Column
  public email!: string;

  @Column
  public password_hash!: string; // for nullable fields

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();
  static comparePasswords: (
    plainTextPassword: string,
    hash: string
  ) => Promise<boolean>;
  static generatePassword: (plainTextPassword: string) => Promise<string>;
  static generateJWT: (user: User) => string;

  short() {
    return {
      email: this.email,
    };
  }
}

User.generatePassword = async function (
  plainTextPassword: string
): Promise<string> {
  const rounds = 10;
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(plainTextPassword, salt);
};

User.comparePasswords = async function (
  plainTextPassword: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hash);
};

User.generateJWT = function (user: User): string {
  return jwt.sign(user.toJSON(), config.jwt.secret);
};
