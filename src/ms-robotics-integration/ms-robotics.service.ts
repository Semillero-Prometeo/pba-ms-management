import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, firstValueFrom } from "rxjs";
import { NATS_SERVICE, ROBOTICS_MS } from "src/core/constants/ms-names.constant";
import { SpeakPayload } from "./dto/voice.dto";

@Injectable()
export class MsRoboticsService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  speak(speakPayload: SpeakPayload): Promise<void> {
    return firstValueFrom(this.client.send<void>(`${ROBOTICS_MS}.voiceService.speak`, speakPayload).pipe(
      catchError((error) => {
          throw new RpcException(error);
        }),
    ));
  }
}