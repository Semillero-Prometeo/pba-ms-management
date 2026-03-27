import { AppSettings } from "../enum/app-settings.enum";

export interface AppSetting {
    id: string;
    key: AppSettings;
    value: string;
    start_at: Date;
    deleted_at: Date | null;
    created_at: Date;
    updated_at: Date;
}