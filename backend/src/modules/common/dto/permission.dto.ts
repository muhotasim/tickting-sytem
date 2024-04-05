import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreatePermissionDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  

  @ApiProperty()
  @IsNotEmpty()
  is_active: boolean;
}

export class UpdatePermissionDTO extends PartialType(CreatePermissionDTO){
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  is_active: boolean;
}