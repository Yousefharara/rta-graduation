export interface IPostState {
  isLoading: boolean;
  errorMessage: string;
  posts: IPost[];
  post: IPost | null;
}

export interface IPost {
  id: string;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}
