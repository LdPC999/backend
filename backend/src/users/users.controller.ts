import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req) {
    // Puedes devolver toda la info del usuario desde el token o hacer una consulta:
    const userId = req.user.userId; // Por tu JWT
    return this.usersService.findOne(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new Error(`ID inválido: ${id}`);
    }
    return this.usersService.findOne(parsedId);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  /**
   * 📦 Registro directo en PostgreSQL
   */
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.register(dto);
  }

  /**
   * 🔐 Login con email/contraseña desde base de datos (sin Firebase)
   */
  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    return this.usersService.loginWithCredentials(credentials);
  }

  @Patch('admin')
  async makeAdmin(@Body('email') email: string) {
    return this.usersService.giveAdminRole(email);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('favoritos/:recipeId')
  async addFavorito(@Param('recipeId') recipeId: number, @Req() req) {
    const userId = req.user.userId;
    return this.usersService.addFavorito(userId, +recipeId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('favoritos/:recipeId')
  async removeFavorito(@Param('recipeId') recipeId: number, @Req() req) {
    const userId = req.user.userId;
    return this.usersService.removeFavorito(userId, +recipeId);
  }

  // Endpoint para consultar favoritos del usuario actual
  @UseGuards(AuthGuard('jwt'))
  @Get('favoritos/me')
  async getFavoritos(@Req() req) {
    const userId = req.user.userId;
    return this.usersService.getFavoritos(userId);
  }

  
}
