export type RoomsType = {
  conversation: (id: string) => string;
  user        : (id: string) => string;
  Location    : (id: string , id2:string) => string;
};
