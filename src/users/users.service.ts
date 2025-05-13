import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(dto);
    return this.userRepository.save(newUser);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new Error('User not found');

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async register(dto: CreateUserDto): Promise<User>{
    const existing = await this.userRepository.findOneBy({ email: dto.email });
    if(existing){
      return existing; // Esto es si ya está registrado
    }

    const newUser = this.userRepository.create(dto);
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null>{
    return this.userRepository.findOne({ where: {email}});
  }

  async syncFirebaseUser(decodedUser: { email: string; uid: string; role?: string}){
    const user = await this.userRepository.findOneBy({ email: decodedUser.email});

    if(user){
      return{
        message: 'El usuario ya existe',
        user,
      };
    }

    const newUser = this.userRepository.create({
      nombre: 'nombre',
       apellidos: 'Apellidos',
       email: decodedUser.email,
       password: '',
       role: 'user',
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      message: 'Usuario registrado en base de datos Postgres',
      user: savedUser,
    };
  }

}