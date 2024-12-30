import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  UserResponseDto,
} from 'shared-dtos';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return this.userService.login(loginRequestDto);
  }
  @Post('/register')
  async createUser(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.userService.register(registerRequestDto);
  }

  @Get()
  @UseGuards(AuthGuard) // Secure the route
  async getUsers(
    @Query('key') key?: 'id' | 'email' | 'name', // Optional key
    @Query('value') value?: string, // Optional value
  ): Promise<UserResponseDto[] | UserResponseDto | null> {
    if (key && value) {
      // Get user by specific parameter
      return this.userService.getUserByKey(key, value);
    } else {
      // Get all users
      return this.userService.getAllUsers();
    }
  }
}
