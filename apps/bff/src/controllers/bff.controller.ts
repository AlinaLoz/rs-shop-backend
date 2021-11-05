import { ApiTags } from "@nestjs/swagger";
import { Controller, Req, Request, Param, Inject, All, Body} from '@nestjs/common';

import { HandleRequestParamDTO } from '../dtos/bff.controller.dtos';
import { BffService } from '../services/bff.service';

@Controller('/')
@ApiTags('/')
export class BffController {
	@Inject() private readonly bffService: BffService;
	
	@All(':service')
	async handleRequest(
		@Param() param: HandleRequestParamDTO,
		@Req() req: Request,
		@Body() body: any,
	): Promise<unknown> {
		return this.bffService.handleRequest(param.service, req, body);
	}
	@All(':service/*')
	async handleSubRequestGet(
		@Param() param: HandleRequestParamDTO,
		@Req() req: Request,
		@Body() body: any,
	): Promise<unknown> {
		return this.bffService.handleRequest(param.service, req, body);
	}
	
}
