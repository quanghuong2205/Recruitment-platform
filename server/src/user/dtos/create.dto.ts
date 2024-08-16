export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  role: string;
  age?: number;
  address?: string;
  avatar?: string;
  createdBy?: Record<string, any>;
}
