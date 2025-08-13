import { IsString, IsNumber, IsEnum, IsOptional, IsArray, Min, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum JobBudgetType {
  FIXED = 'fixed',
  HOURLY = 'hourly',
}

export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SHORTLISTING = 'shortlisting',
  HIRED = 'hired',
  CLOSED = 'closed',
  CANCELED = 'canceled',
}

export enum JobVisibility {
  PUBLIC = 'public',
  INVITE = 'invite',
}

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsObject()
  scope: any;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty({ enum: JobBudgetType })
  @IsEnum(JobBudgetType)
  budgetType: JobBudgetType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  budgetMin?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  budgetMax?: number;

  @ApiProperty({ enum: JobVisibility, required: false })
  @IsOptional()
  @IsEnum(JobVisibility)
  visibility?: JobVisibility = JobVisibility.PUBLIC;

  @ApiProperty({ enum: JobStatus, required: false })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus = JobStatus.DRAFT;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  attachments?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  orgId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brandGuideId?: string;
}
