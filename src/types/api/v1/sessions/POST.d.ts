interface POSTSessionRequest {
  jobListing: string;
  company: string;
  date: string;
}

type POSTSessionResponse = DefaultResponse<InterviewSession>;
