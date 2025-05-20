import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Added

class GlobalSearchDto {
  @ApiProperty({
    description: 'Text to search for in apartments',
    example: 'Luxury apartment with pool',
  }) // Added
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    example: 10,
    minimum: 1,
    maximum: 50,
    default: 10,
    type: Number,
  }) // Added
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;
}
export default GlobalSearchDto;
