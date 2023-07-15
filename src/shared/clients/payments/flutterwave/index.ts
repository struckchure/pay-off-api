import { HttpService } from "@nestjs/axios";
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { AxiosError } from "axios";
import * as crypto from "crypto";
import { firstValueFrom } from "rxjs";

import {
  FlutterwaveInitializeArgs,
  FlutterwaveInitializeResponse,
  FlutterwaveVerifyPaymentArgs,
  FlutterwaveVerifyPaymentResponse,
} from "@/shared/clients/payments/flutterwave/interface";
import {
  FLUTTERWAVE_API_URL,
  FLUTTERWAVE_SK,
} from "@/shared/constants/env-vars";
import { removeNullOrEmptyValues } from "@/shared/utils";

@Injectable()
export class FlutterwaveClient {
  constructor(private httpService: HttpService) {}

  async flutterwaveInitialize(
    flutterwaveInitializeArgs: FlutterwaveInitializeArgs,
  ) {
    try {
      const headers = {
        Authorization: `Bearer ${FLUTTERWAVE_SK}`,
      };

      flutterwaveInitializeArgs.reference =
        flutterwaveInitializeArgs.reference ||
        crypto.randomBytes(6).toString("hex");

      const payload = {
        tx_ref: flutterwaveInitializeArgs.reference,
        amount: flutterwaveInitializeArgs.amount,
        currency: "NGN",
        redirect_url: flutterwaveInitializeArgs.redirectUrl,
        customer: { email: flutterwaveInitializeArgs.email },
        customizations: {
          title: "Pay Off",
          // TODO: add link logo
          // logo: 'https://avatars.githubusercontent.com/u/114983476',
        },
      };

      const flutterwavePaymentRequest =
        this.httpService.post<FlutterwaveInitializeResponse>(
          `${FLUTTERWAVE_API_URL}/payments/`,
          payload,
          { headers },
        );
      const { data: responseData } = await firstValueFrom(
        flutterwavePaymentRequest,
      );

      return {
        link: responseData.data.link,
        reference: flutterwaveInitializeArgs.reference,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException(
          error.response.data.message || "An error occurred",
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async fluttewaverVerifyPayment(
    flutterwaveVerifyPaymentArgs: FlutterwaveVerifyPaymentArgs,
  ) {
    try {
      const headers = {
        Authorization: `Bearer ${FLUTTERWAVE_SK}`,
      };

      const flutterwaveVerifyPaymentRequest =
        this.httpService.get<FlutterwaveVerifyPaymentResponse>(
          `${FLUTTERWAVE_API_URL}/transactions/${flutterwaveVerifyPaymentArgs.paymentId}/verify/`,
          { headers },
        );
      const { data: responseData } = await firstValueFrom(
        flutterwaveVerifyPaymentRequest,
      );

      return {
        status: responseData.data.status,
        reference: responseData.data.tx_ref,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException(
          error.response.data.message || "An error occurred",
          error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
