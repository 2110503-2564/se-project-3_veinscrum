interface InterviewSession {
  _id: string;
  jobListing: JobListing;
  user: User;
  date: string;
}

interface GETAllInterviewSessionsResponse
  extends WithPagination,
    DefaultResponse<Array<InterviewSession>> {}

type GETInterviewSessionsByUserResponse = DefaultResponse<
  Array<InterviewSession>
>;
