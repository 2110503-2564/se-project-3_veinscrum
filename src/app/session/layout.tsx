import { BackendRoutes } from "@/constants/routes/Backend";
import { auth } from '@/auth';
import { withBaseRoute } from '@/utils/routes/withBaseRoute';

export default async function Layout({
  user,
  company,
}: {
  user: React.ReactNode;
  company: React.ReactNode;
}) {

  const session = await auth();

  const me = session?.token
    ? await fetch(withBaseRoute(BackendRoutes.AUTH_ME), {
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json() as Promise<GETMeResponse>)
        .catch(() => null)
    : null;


  if (me?.data.role === 'company') return <>{company}</>;
  return <>{user}</>;
}
