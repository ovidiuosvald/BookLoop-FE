import { UserRole } from '../enums/user-role.enum';

export interface UserInterface {
  userId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  newPassword?: string;
  creationDate?: Date;
  role?: UserRole;
}
