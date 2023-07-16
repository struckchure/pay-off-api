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
  FlutterwaveInitiateTransferArgs,
  FlutterwaveInitiateTransferResponse,
  FlutterwaveListBanksResponse,
  FlutterwaveResolveBankAccountArgs,
  FlutterwaveResolveBankAccountResponse,
  FlutterwaveVerifyPaymentArgs,
  FlutterwaveVerifyPaymentResponse,
  FlutterwaveVerifyTransferResponse,
} from "@/shared/clients/payments/flutterwave/interface";
import {
  FLUTTERWAVE_API_URL,
  FLUTTERWAVE_SK,
} from "@/shared/constants/env-vars";
import { sortByKey } from "@/shared/utils";

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

  async flutterwaveVerifyPayment(
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
        status: responseData.data.status.toLowerCase() === "successful",
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

  async flutterwaveInitiateTransfer(
    flutterwaveInitiateTransferArgs: FlutterwaveInitiateTransferArgs,
  ) {
    try {
      const headers = {
        Authorization: `Bearer ${FLUTTERWAVE_SK}`,
      };
      const payload = {
        account_bank: flutterwaveInitiateTransferArgs.accountBank,
        account_number: flutterwaveInitiateTransferArgs.accountNumber,
        amount: flutterwaveInitiateTransferArgs.amount,
        narration: flutterwaveInitiateTransferArgs.narration,
        currency: "NGN",
        reference: flutterwaveInitiateTransferArgs.reference,
        callback_url: flutterwaveInitiateTransferArgs.redirectUrl,
      };

      const flutterwaveInitiateTransferRequest =
        this.httpService.post<FlutterwaveInitiateTransferResponse>(
          `${FLUTTERWAVE_API_URL}/transfers/`,
          payload,
          { headers },
        );
      const { data: responseData } = await firstValueFrom(
        flutterwaveInitiateTransferRequest,
      );

      return {
        id: responseData.data.id,
        reference: responseData.data.reference,
        status: responseData.data.status === "NEW",
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

  async flutterwaveVerifyTransfer(
    flutterwaveVerifyPaymentArgs: FlutterwaveVerifyPaymentArgs,
  ) {
    try {
      const headers = {
        Authorization: `Bearer ${FLUTTERWAVE_SK}`,
      };

      const flutterwaveVerifyTransferRequest =
        this.httpService.get<FlutterwaveVerifyTransferResponse>(
          `${FLUTTERWAVE_API_URL}/transfers/${flutterwaveVerifyPaymentArgs.paymentId}/`,
          { headers },
        );
      const { data: responseData } = await firstValueFrom(
        flutterwaveVerifyTransferRequest,
      );

      return {
        status: responseData.data.status.toLowerCase() === "successful",
        reference: responseData.data.reference,
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

  async flutterwaveResolveBankAccount(
    flutterwaveResolveBankAccountArgs: FlutterwaveResolveBankAccountArgs,
  ) {
    try {
      const headers = {
        Authorization: `Bearer ${FLUTTERWAVE_SK}`,
      };
      const payload = {
        account_number: flutterwaveResolveBankAccountArgs.accountNumber,
        account_bank: flutterwaveResolveBankAccountArgs.accountBank,
      };

      const flutterwaveResolveBankAccountRequest =
        this.httpService.post<FlutterwaveResolveBankAccountResponse>(
          `${FLUTTERWAVE_API_URL}/accounts/resolve/`,
          payload,
          {
            headers,
          },
        );
      const { data: responseData } = await firstValueFrom(
        flutterwaveResolveBankAccountRequest,
      );

      return {
        accountNumber: responseData.data.account_number,
        accountName: responseData.data.account_name,
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

  async flutterwaveListBanks() {
    try {
      const headers = {
        Authorization: `Bearer ${FLUTTERWAVE_SK}`,
      };

      const flutterwaveListBanksRequest =
        this.httpService.get<FlutterwaveListBanksResponse>(
          `${FLUTTERWAVE_API_URL}/banks/NG/`,
          {
            headers,
          },
        );
      const { data: responseData } = await firstValueFrom(
        flutterwaveListBanksRequest,
      );

      return sortByKey(responseData.data, "name");
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
