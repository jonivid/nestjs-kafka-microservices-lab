import { IsString, IsEmail, MinLength, IsOptional } from "class-validator";

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  constructor(name: string, email: string, id: string) {
    this.name = name;
    this.email = email;
    this.id = id;
  }
}

export class RegisterRequestDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
  @IsString()
  @IsOptional()
  role?: "user" | "admin";

  constructor(
    name: string,
    email: string,
    password: string,
    role?: "user" | "admin",
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export class RegisterResponseDto {
  id: string;
  name: string;
  email: string;
  role?: string;
  constructor(name: string, email: string, id: string, role: string) {
    this.name = name;
    this.email = email;
    this.id = id;
    this.role = role;
  }
}

export class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class LoginResponseDto {
  username: string;
  accessToken: string;

  constructor(username: string, accessToken: string) {
    this.username = username;
    this.accessToken = accessToken;
  }
}
