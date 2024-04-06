import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { TicketPriority } from 'src/utils/custome.datatypes';
export class CreateTicketDTO {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  details: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TicketPriority)
  priority: TicketPriority;

  
}
