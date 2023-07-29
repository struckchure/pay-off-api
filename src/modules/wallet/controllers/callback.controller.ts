import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";

@Controller("callback")
export class CallbackController {
  @Get("mobile")
  async callbackMobile(@Res() response: Response) {
    return response.redirect("app://pay_off.app");
  }
}
