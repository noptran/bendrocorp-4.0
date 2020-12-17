import { Character } from './character.model';

export class UserSessionResponse
{
    id?: number;
    first_name?: string;
    last_name?: string;
    character_id?: number;
    avatar?: string;
    expires?: number;
    roles?: number[];
    tfa_enabled?: boolean;
    job_title?: string;
}

export class LoginRequest
{
  email: string;
  password: string;
  code?: number;
}

// deprecated?
export class Claim {
    id?: number;
    title?: string;
}

export class User {
    id?: number;
    username?: string;
    rsi_handle?: string;
    main_character?: Character;
    roles?: Role[];
}

// deprecated?
export class Role extends Claim {
    name?: string;
    description?: string;
    nested_roles?: NestedRole[];
}

export class NestedRole {
    id?: number;
    role_id?: number;
    role_nested_id?: number;
    role_nested?: Role;
}
