import { Module } from '@nestjs/common';
import { ImportsService } from './services/imports.service';

@Module({
	providers: [ImportsService],
})
export class ImportsModule {}
