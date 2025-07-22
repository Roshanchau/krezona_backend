export type TUser = {
  name: string;
  email: string;
  password: string;
  role?: Role; 
};

export type TLoginAuth = {
    email: string;
    password: string;
  };


enum Role{
    USER = "USER",
    ADMIN = "ADMIN"
}