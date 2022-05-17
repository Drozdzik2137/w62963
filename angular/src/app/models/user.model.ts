export interface IUserResponseModel{
  token: string;
  auth: boolean;
  userId: number;
  email: string;
  fname: string;
  lname: string;
  photoUrl: string;
  type: string;
  isAdmin: boolean;
}
