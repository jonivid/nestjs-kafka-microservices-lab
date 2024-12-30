export class User {
  id: string; // or number based on your database setup
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'user' | 'admin';
}
