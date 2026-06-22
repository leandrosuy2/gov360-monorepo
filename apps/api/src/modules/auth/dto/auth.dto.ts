import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Matches(EMAIL_PATTERN, { message: "E-mail inválido" })
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Matches(EMAIL_PATTERN, { message: "E-mail inválido" })
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}
