export interface User{
  id:string;
  username: string;
  email: string;
  lname: string;
  fname: string;
  favorites: [];
  uploads: [];
  comments: [];
  followerCount: number;
  followingCount: number;
  following: [];
  followedby: []
}

