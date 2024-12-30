import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  UserResponseDto,
} from 'shared-dtos';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('login_user') // Matches the 'create_user' pattern in Gateway
  async loginUser(
    @Payload() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    try {
      return await this.userService.loginUser(
        loginRequestDto.email,
        loginRequestDto.password,
      );
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
  @MessagePattern('register_user') // Matches the 'create_user' pattern in Gateway
  async registerUser(
    @Payload() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.userService.registerUser(registerDto); // Create user in MongoDB
  }

  @MessagePattern('get_all_users') // Matches the 'get_users' pattern
  async getAllUsers(): Promise<UserResponseDto[]> {
    // Fetch all users from MongoDB
    return this.userService.getAllUsers();
  }
  @MessagePattern('get_user_by_key') // Matches the 'get_users' pattern
  async getUserByKey(
    @Payload() payload: { key: 'id' | 'email' | 'name'; value: string },
  ): Promise<UserResponseDto | null> {
    const { key, value } = payload;
    return this.userService.getUserByKey(key, value);
  }
}
