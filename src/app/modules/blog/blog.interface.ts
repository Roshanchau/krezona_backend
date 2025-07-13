export type TBlog = {
  title: string;
  content: string;
  image?: TImage; 
};


export type TImage = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  blogId?: string;
  blog?: TBlog;
};
