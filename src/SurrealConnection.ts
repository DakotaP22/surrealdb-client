export class SurrealConnection {
  public url: string;
  public username: string;
  public password: string;

  constructor(url: string, username: string, password: string) {
    this.url = url;
    this.username = username;
    this.password = password;
  }
}
