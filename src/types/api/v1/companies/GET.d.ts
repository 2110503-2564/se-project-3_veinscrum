interface Company {
  id: string;
  name: string;
  address: string;
  website: string;
  description: string;
  tel: string;
  sessions: Array<InterviewSession>;
}

interface GETAllCompaniesResponse
  extends WithPagination,
    DefaultResponse<Array<Company>> {}
