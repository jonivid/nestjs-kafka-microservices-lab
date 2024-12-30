import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  UserResponseDto,
} from 'shared-dtos';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      // Send the login request to the User Service
      return await firstValueFrom(
        this.client.send<LoginResponseDto, LoginRequestDto>(
          'login_user',
          loginRequestDto,
        ),
      );
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      if (error.message === 'User not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      // Default to internal server error for unexpected cases
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async register(
    registerRequestDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    try {
      return await firstValueFrom(
        this.client.send<RegisterResponseDto, RegisterRequestDto>(
          'register_user',
          registerRequestDto,
        ),
      );
    } catch (error) {
      if (error.message === 'Email already in use') {
        throw new HttpException(error.message, HttpStatus.CONFLICT); // 409 Conflict
      }
      // Default fallback for unexpected errors
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAllUsers(): Promise<UserResponseDto[]> {
    try {
      return firstValueFrom(
        this.client.send<User[], string>('get_all_users', ''), // Use an empty object as payload
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getUserByKey(
    key: string,
    value: string,
  ): Promise<UserResponseDto | null> {
    try {
      return await firstValueFrom(
        this.client.send<
          UserResponseDto | null,
          { key: string; value: string }
        >('get_user_by_key', { key, value }),
      );
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND); // 409 Conflict
      }
      // Default fallback for unexpected errors
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
