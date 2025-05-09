interface User {
  _id: string;
  name: string;
  email: string;
  company: string;
  tel: string;
  role: "user" | "admin" | "company";
}

interface GETAllUsersResponse
  extends WithPagination,
    DefaultResponse<Array<User>> {}
