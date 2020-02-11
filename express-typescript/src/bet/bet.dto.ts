import { IsString, IsDate, IsBoolean, ValidateNested } from 'class-validator';
import CreateUserDto from '../user/user.dto';

class CreateBetDto {
  @ValidateNested()
  public owner: CreateUserDto;

  @ValidateNested()
  public opponents: CreateUserDto;

  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsString()
  public imageUrl: string;

  @IsDate()
  public createAt: string;

  @IsBoolean()
  public completed: Date;
}

export default CreateBetDto;
