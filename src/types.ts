export interface User {
  username: string;
  password: string;
  roles: {
    Admin: string;
    User: string;
    Editor: string;
  };
  profile?: {
    avatar: string;
    firstName: string;
    lastName?: string;
    gender?: string;
    birthDate?: string;
    bio: string;
    location?: string;
    website: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
}
