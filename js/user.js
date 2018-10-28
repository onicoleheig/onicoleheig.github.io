class User {
  constructor(userName) {
    // this.user = fetch(`/api/users/${userName}`).then(res => res.json());
    // this.name = this.user.name;
    // this.avatar = this.user.avatar_url;
    this.user = userName;
    this.name = userName;

    if (userName === "Kylo Ren") {
      this.avatar = "images/"+ "kyloren" + ".png";
    } else if (userName === "Patrick Sebastien") {
      this.avatar = "images/"+ "patseb" + ".png";
    } else if (userName === "Donald Trump") {
      this.avatar = "images/"+ "trump" + ".png";
    } else {
      this.avatar = "images/"+ "alain" + ".png";
    }

  }

  getUser() {
    return this.user;
  }

  getName() {
    return this.name;
  }

  getAvatar() {
    return this.avatar;
  }
}
