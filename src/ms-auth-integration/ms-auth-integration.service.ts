import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { AUTH_MS, NATS_SERVICE } from 'src/core/constants/ms-names.constant';
import { AppSettings } from './enum/app-settings.enum';
import { AppSetting } from './interfaces/app-setting';
import { CountryResponse } from './interfaces/country-response';
import { UserResponse } from './interfaces/user-response';

@Injectable()
export class MsAuthIntegrationService {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  findOneAppSetting(key: AppSettings): Promise<AppSetting | null> {
    return firstValueFrom<AppSetting | null>(
      this.client.send<AppSetting | null>(`${AUTH_MS}.appSettingsService.findOne`, { key }).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  findActiveCountry(): Promise<CountryResponse> {
    return firstValueFrom<CountryResponse>(
      this.client.send<CountryResponse>(`${AUTH_MS}.countryService.findActive`, {}).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  findOneUser(id: string): Promise<UserResponse> {
    return firstValueFrom<UserResponse>(
      this.client.send<UserResponse>(`${AUTH_MS}.usersService.findOne`, { id }).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }
}
