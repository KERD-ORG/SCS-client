import Sidebar from "@/components/sidebar";
import { verifyToken } from "@/lib/auth";
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";

async function AdminLayout({ children }) {
  const accessToken = cookies().get('ACCESS_TOKEN')
  const refreshToken = cookies().get('REFRESH_TOKEN')
  if(!accessToken || !refreshToken) redirect('/login')
  
  const {authorized} = await verifyToken(accessToken.value, refreshToken.value)
  if(!authorized) redirect('/login')

  return (
    <main className="w-full flex">
      <Sidebar />
      <div className="w-full min-h-screen">{children}</div>
    </main>
  );
}

export default AdminLayout;
