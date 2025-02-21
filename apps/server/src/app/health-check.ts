import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthCheck {
  @Get('health-check')
  getData() {
    return 'Health check success!';
  }
}
