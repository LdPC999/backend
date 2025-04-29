import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService{
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async create(createUserDto: CreateUserDto): Promise<User>{
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User | null>{
        return this.userModel.findById(id).exec();
    }

    async update(id: string, UpdateUserDto: UpdateUserDto): Promise<User | null>{
        return this.userModel.findByIdAndUpdate(id, UpdateUserDto, {new:true}).exec();
    }

    async remove(id: string): Promise<User | null>{
        return this.userModel.findByIdAndDelete(id).exec();
    }
}