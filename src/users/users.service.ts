import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService{
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    // Guardamos usuario
    async create(createUserDto: CreateUserDto): Promise<User>{
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }

    // Mostramos usuarios
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    // Mostramos usuario por id
    async findOne(id: string): Promise<User | null>{
        return this.userModel.findById(id).exec();
    }

    // Actualizamos usuario
    async update(id: string, UpdateUserDto: UpdateUserDto): Promise<User | null>{
        return this.userModel.findByIdAndUpdate(id, UpdateUserDto, {new:true}).exec();
    }

    // Eliminamos usuario
    async remove(id: string): Promise<User | null>{
        return this.userModel.findByIdAndDelete(id).exec();
    }
}