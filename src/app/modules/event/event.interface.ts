export type TEvent = {
  name: string;
  eventDate: Date;
  image?: TeventImage; 
};


export type TeventImage = {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  eventId?: string;
  event?: TEvent;
};
