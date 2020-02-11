interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: number;
  createdAt: Date;
  status: boolean;
  email: string;
  password?: string;
  address?: {
    street: string,
    city: string,
  };
}

export default User;
