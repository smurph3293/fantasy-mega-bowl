import { IsOptional, IsString, ValidateNested, IsBoolean, IsDate } from 'class-validator';
import CreateAddressDto from './address.dto';

class CreateUserDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsOptional()
  public phone?: number;

  @IsString()
  public email: string;

  @IsDate()
  public date: Date = new Date();

  @IsBoolean()
  public status: boolean = false;

  @IsString()
  public password: string;

  @IsString()
  public yahooId: string;

  /*@IsOptional()
  @ValidateNested()
  public address?: CreateAddressDto;*/
}

export default CreateUserDto;
