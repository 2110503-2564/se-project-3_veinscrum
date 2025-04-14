import { auth } from "@/auth";
import { BackendRoutes } from "@/constants/routes/Backend";
import { withBaseRoute } from "@/utils/routes/withBaseRoute";
import { Ellipsis, Globe, Mail, MapPin, Phone } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  const user = session?.token
    ? await fetch(withBaseRoute(BackendRoutes.AUTH_ME), {
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json() as Promise<GETMeResponse>)
        .catch(() => null)
    : null;

  const accountRole = user?.data.role;

  const company =
    session?.token && user?.data.company
      ? await fetch(
          withBaseRoute(BackendRoutes.COMPANIES_ID({ id: user.data.company })),
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
              "Content-Type": "application/json",
            },
          },
        )
          .then((res) => res.json() as Promise<GETCompanyResponse>)
          .catch(() => null)
      : null;

  return (
    <main className="mx-auto mt-16">
      {accountRole === "user" ? (
        //  user session
        <div className="mx-auto max-w-sm space-y-2 rounded-xl bg-white px-4 py-6 text-center drop-shadow-xl">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="mx-auto max-w-md text-left">
            <p>User Name : {user?.data.name}</p>
            <p>Email : {user?.data.email}</p>
            <p>Tel : {user?.data.tel}</p>
          </div>
        </div>
      ) : // admin session
      accountRole === "admin" ? (
        <div className="mx-auto max-w-sm space-y-2 rounded-xl bg-white px-4 py-6 text-center drop-shadow-xl">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="mx-auto max-w-md text-left">
            <p>User Name : {user?.data.name}</p>
            <p>Email : {user?.data.email}</p>
            <p>Tel : {user?.data.tel}</p>
          </div>
        </div>
      ) : // company session
      accountRole === "company" ? (
        <div className="mx-auto max-w-4xl rounded-xl bg-white px-6 py-10 shadow-md">
          <div className="mb-8 text-center">
            <div className="mb-2 flex justify-end">
              <Ellipsis className="h-5 w-5 cursor-pointer transition-colors hover:text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold">{company?.data.name}</h1>
          </div>

          <div className="flex flex-col items-start gap-8 md:flex-row">
            {/* Company Icon */}
            <div className="flex w-full justify-center md:w-1/3">
              <div className="h-48 w-48 rounded-md bg-gray-200" />
            </div>

            {/* Company info  */}
            <div className="w-full space-y-4 md:w-2/3">
              {/* Info box */}
              <div className="space-y-2 rounded-lg bg-gray-100 p-4 text-sm">
                <p className="flex gap-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  {company?.data.address}
                </p>

                <p className="flex gap-3">
                  <Mail className="h-5 w-5 text-gray-600" />
                  {user?.data.email}
                </p>

                <p className="flex gap-3">
                  <Globe className="h-5 w-5 text-gray-600" />
                  {company?.data.website}
                </p>

                <p className="flex gap-3">
                  <Phone className="h-5 w-5 text-gray-600" />
                  {company?.data.tel}
                </p>
              </div>

              {/* Company description */}
              <p className="text-sm leading-relaxed text-gray-700">
                {company?.data.description}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto">
          <p>Role is undefile</p>
        </div>
      )}
    </main>
  );
}
