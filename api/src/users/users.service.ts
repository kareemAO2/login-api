import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { readFile, writeFile } from 'fs/promises';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema.js';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const oldUser = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (oldUser) {
      throw new ConflictException('Username is already used');
    }

    const hashedPwd = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPwd,
    });
    return createdUser.save();
  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).lean().exec();
    if (!user) {
      throw new NotFoundException('User not exists');
    }
    return user;
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      { username: username },
      { username: updateUserDto.username },
    );
    if (!user) {
      throw new NotFoundException('User not exists');
    }
    return `user ${user?.username} updated`;
  }

  async remove(username: string) {
    const user = await this.userModel.findOneAndDelete({ username });
    if (!user) {
      throw new NotFoundException('User not exists');
    }
    return `user ${user.username} deleted`;
  }
}
