interface Company {
  id: string;
  name: string;
  address: string;
  website: string;
  description: string;
  tel: string;
  owner: string;
  sessions: Array<InterviewSession>;
  logo?: string;
}

interface GETAllCompaniesResponse
  extends WithPagination,
    DefaultResponse<Array<Company>> {}
