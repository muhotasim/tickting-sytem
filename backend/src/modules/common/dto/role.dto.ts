import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
export class CreateRoleDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsArray()
  permissions: number[];
  @ApiProperty()
  @IsNotEmpty()
  is_active: boolean;
}

export class UpdateRoleDTO extends PartialType(CreateRoleDTO) {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  is_active: boolean;
  
  @ApiProperty()
  @IsArray()
  permissions: number[];
}