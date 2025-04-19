interface jobListing {
    company: string;
    image: string;
    jobTitle: string;
    description: string;
}

interface GETAllJobListingsResponse
  extends WithPagination,
    DefaultResponse<Array<jobListing>> {}