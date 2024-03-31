export interface AccessToken {
  slug: string;
  access_token: string;
}

export class Base {
  constructor(public accessToken: AccessToken) {}

  // Users
  async getUsername() {
    return "demo user";
  }
}
