import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";


@Controller('/api')
export class AppController {

    constructor(private AppService: AppService) {}

    @Get()
    getUsers() {
        // return 'Get all users'
        return this.AppService.getUsers()
    }

}