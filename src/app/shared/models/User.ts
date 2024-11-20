export interface User{
  id:string;
  username: string;
  email: string;
  lname: string;
  fname: string;
  favorites: [];
  uploads: [];
  comments: [];
  collections: [];
  followerCount: number;
  followingCount: number;
  following: [];
  followedby: [];
  intro: string;
}

