// Importamos los decoradores y utilidades de NestJS para crear el controlador y gestionar rutas, parámetros y autenticación.
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
// Importamos el servicio de usuarios y los DTOs para crear y actualizar.
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Importamos el guard de autenticación JWT.
import { AuthGuard } from '@nestjs/passport';

/**
 * Controlador de usuarios.
 * 
 * Gestiona rutas relacionadas con usuarios: registro, login, CRUD, favoritos, 
 * y consulta de usuario autenticado.
 */
@Controller('users')
export class UsersController {
  /**
   * Inyección del servicio de usuarios.
   * 
   * @param usersService Servicio de lógica de negocio para usuarios.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Obtiene todos los usuarios.
   * Ruta: GET /users
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Devuelve el usuario autenticado, extrayendo el id desde el JWT.
   * Ruta protegida.
   * Ruta: GET /users/me
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req) {
    const userId = req.user.userId; // Extraído del token JWT
    return this.usersService.findOne(userId);
  }

  /**
   * Obtiene un usuario por id (parámetro en la ruta).
   * Ruta: GET /users/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new Error(`ID inválido: ${id}`);
    }
    return this.usersService.findOne(parsedId);
  }

  /**
   * Crea un usuario (sin lógica de registro, solo crea directo en BD).
   * Ruta: POST /users
   */
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  /**
   * Actualiza parcialmente un usuario por id.
   * Ruta: PATCH /users/:id
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(+id, dto);
  }

  /**
   * Elimina un usuario por id.
   * Ruta: DELETE /users/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  /**
   * Registro de usuario directamente en PostgreSQL.
   * Ruta: POST /users/register
   */
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.register(dto);
  }

  /**
   * Login de usuario usando email y contraseña contra la base de datos.
   * Ruta: POST /users/login
   */
  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    return this.usersService.loginWithCredentials(credentials);
  }

  /**
   * Asigna el rol admin a un usuario dado su email.
   * Ruta: PATCH /users/admin
   */
  @Patch('admin')
  async makeAdmin(@Body('email') email: string) {
    return this.usersService.giveAdminRole(email);
  }

  /**
   * Añade una receta a la lista de favoritos del usuario autenticado.
   * Ruta protegida.
   * Ruta: POST /users/favoritos/:recipeId
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('favoritos/:recipeId')
  async addFavorito(@Param('recipeId') recipeId: number, @Req() req) {
    const userId = req.user.userId;
    return this.usersService.addFavorito(userId, +recipeId);
  }

  /**
   * Elimina una receta de la lista de favoritos del usuario autenticado.
   * Ruta protegida.
   * Ruta: DELETE /users/favoritos/:recipeId
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete('favoritos/:recipeId')
  async removeFavorito(@Param('recipeId') recipeId: number, @Req() req) {
    const userId = req.user.userId;
    return this.usersService.removeFavorito(userId, +recipeId);
  }

  /**
   * Devuelve la lista de recetas favoritas del usuario autenticado.
   * Ruta protegida.
   * Ruta: GET /users/favoritos/me
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('favoritos/me')
  async getFavoritos(@Req() req) {
    const userId = req.user.userId;
    return this.usersService.getFavoritos(userId);
  }
}
