import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, firstValueFrom } from "rxjs";
import { NATS_SERVICE, ROBOTICS_MS } from "src/core/constants/ms-names.constant";

@Injectable()
export class MsRoboticsService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  speak({message}:{ message: string }): Promise<void> {
    return firstValueFrom(this.client.send<void>(`${ROBOTICS_MS}.voiceService.speak`, { message }).pipe(
      catchError((error) => {
          throw new RpcException(error);
        }),
    ));
  }
}