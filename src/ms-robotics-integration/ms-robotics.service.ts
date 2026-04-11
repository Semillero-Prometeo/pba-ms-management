import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError } from "rxjs";
import { NATS_SERVICE, ROBOTICS_MS } from "src/core/constants/ms-names.constant";

@Injectable()
export class MsRoboticsService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async speak({message}:{ message: string }) {
    return this.client.send<void>(`${ROBOTICS_MS}.voiceService.speak`, { message }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }
}