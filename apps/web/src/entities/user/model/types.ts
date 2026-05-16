export type User = {
  id: string;
  email: string;
  name: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
