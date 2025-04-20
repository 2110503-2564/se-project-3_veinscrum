interface JobListing {
  _id: string;
  company: Company;
  image: string;
  jobTitle: string;
  description: string;
  address: string;
  tel: string;
}

interface GETAllJobListingsResponse
  extends WithPagination,
    DefaultResponse<Array<JobListing>> {}
