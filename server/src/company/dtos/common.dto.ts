import { IsNotEmpty } from 'class-validator';

export class LogoUrl {
  @IsNotEmpty()
  public_id: string;

  @IsNotEmpty()
  original_url: string;

  @IsNotEmpty()
  resized_url: string;
}
