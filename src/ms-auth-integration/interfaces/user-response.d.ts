 
 export interface CountryResponse {
   name: string;
   code: string;
   created_at: Date;
   updated_at: Date;
   deleted_at: Date | null;
 }
 
 export interface DocumentTypeResponse {
    id: string;
    short_name: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
 }
 
 export interface PersonResponse {
    id: string;
    country_id: string;
    document_type_id: string;
    first_name: string;
    last_name: string;
    email: string;
    document_number: string | null;
    phone: string | null;
    image_url: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    moodle_id: number | null;
    synchronized_at: Date | null;
    birth_date: Date | null;
    person_type_id: string;
    country: CountryResponse;
    document_type: DocumentTypeResponse;
 }
 
 
 export interface UserResponse {
    id: string;
    person_id: string;
    username: string;
    password: string;
    temp_password: string | null;
    failed_attempts: number;
    lock_until: Date | null;
    is_first_login: boolean;
    deleted_reason: string | null;
    deleted_at: Date | null;
    created_at: Date;
    updated_at: Date;
    person?: PersonResponse;
 }