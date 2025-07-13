export type TGame = {
  title: string;
  description: string;
  image?: TgameImage; 
};


export type TgameImage = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  gameId?: string;
  game?: TGame;
};
