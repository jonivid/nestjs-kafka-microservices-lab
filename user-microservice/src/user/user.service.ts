import { Injectable, Inject } from '@nestjs/common';
import { Db, Collection, ObjectId } from 'mongodb';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import {
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  UserResponseDto,
} from 'shared-dtos';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  private readonly users: Collection;

  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Db,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {
    this.users = db.collection('users');
  }
  async loginUser(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.users.findOne<User>({ email });
    if (!user) {
      throw new RpcException('User not found');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new RpcException('Invalid credentials');
    }

    const payload = { username: user.name, sub: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      username: user.name,
      accessToken,
    };
  }

  async registerUser(
    registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const existingUser = await this.users.findOne({
      email: registerDto.email,
    });
    if (existingUser) {
      throw new RpcException('Email already in use');
    }
    const { password, ...userData } = registerDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.users.insertOne({
      ...userData,
      password: hashedPassword,
      role: 'user',
    });
    return {
      id: newUser.insertedId.toString(),
      ...userData,
    };
  }

  async getAllUsers(): Promise<User[]> {
    // Fetch all users from the MongoDB collection
    const result = await this.users
      .find({}, { projection: { password: 0 } })
      .toArray();
    return result.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    }));
  }

  async getUserByKey(
    key: 'id' | 'email' | 'name',
    value: string,
  ): Promise<UserResponseDto | null> {
    const query = this.buildKeyQuery(key, value);
    const user = await this.users.findOne(query, {
      projection: { password: 0 },
    });

    if (!user) {
      throw new RpcException('User not found'); // Throw TCP exception
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }

  private buildKeyQuery(key: string, value: string): Record<string, any> {
    if (key === 'id') {
      if (!ObjectId.isValid(value)) {
        throw new Error('Invalid ObjectId');
      }
      return { _id: new ObjectId(value) }; // Exact match for ObjectId
    }

    // Use $regex for partial matching for `email` and `name`
    const regex = new RegExp(value, 'i'); // Case-insensitive match
    return { [key]: { $regex: regex } };
  }

  async findUserById(id: string) {
    return this.users.findOne({ _id: new ObjectId(id) });
  }

  async updateUser(id: string, updates: any) {
    return this.users.updateOne({ _id: new ObjectId(id) }, { $set: updates });
  }

  async deleteUser(id: string) {
    return this.users.deleteOne({ _id: new ObjectId(id) });
  }
}
