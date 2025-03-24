interface InterviewSession {
  _id: string;
  company: Company;
  user: User;
  date: string;
}

interface GETAllInterviewSessionsResponse
  extends WithPagination,
    DefaultResponse<Array<InterviewSession>> {}

type GETInterviewSessionsByUserResponse = DefaultResponse<
  Array<InterviewSession>
>;
