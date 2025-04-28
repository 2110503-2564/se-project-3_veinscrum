interface Flag {
  _id: string;
  jobListing: string;
  user: Pick<User, "_id", "name" | "email" | "tel">;
}

type GETFlagsByJobListingResponse = DefaultResponse<Array<Flag>>;
