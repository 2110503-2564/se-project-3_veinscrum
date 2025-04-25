interface Flag {
  _id: string;
  jobListing: string;
  user: User;
}

type GETFlagsByJobListingResponse = DefaultResponse<Array<Flag>>;
