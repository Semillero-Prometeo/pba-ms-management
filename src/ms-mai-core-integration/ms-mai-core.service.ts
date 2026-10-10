import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { MAI_CORE_MS, MAI_CORE_NATS } from 'src/core/constants/ms-names.constant';

@Injectable()
export class MsMaiCoreService {
  constructor(@Inject(MAI_CORE_NATS) private readonly client: ClientProxy) {}

  ask(message: string): Promise<{ reply: string; fuente?: string }> {
    return firstValueFrom(
      this.client
        .send<{ reply: string; fuente?: string }>(`${MAI_CORE_MS}.interactionService.ask`, { message })
        .pipe(catchError((error) => { throw new RpcException(error); })),
    );
  }
}
