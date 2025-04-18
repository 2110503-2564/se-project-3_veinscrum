interface User {
  _id: string;
  name: string;
  email: string;
  company: string;
  tel: string;
  role: string;
}

interface GETAllUsersResponse
  extends WithPagination,
    DefaultResponse<Array<User>> {}
