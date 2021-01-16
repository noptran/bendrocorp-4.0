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
    subscriber?: boolean;
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
    main_character_full_name?: string;
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

export class SignUp
{
    username?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
}
