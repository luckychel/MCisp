export class Item {
  Name: string = "";
  ProfilePic: string = "";
  About: string = "";
  constructor(name: string, profilePic: string, about: string) {
    this.Name = name;
    this.ProfilePic = profilePic;
    this.About = about;
  }

}
