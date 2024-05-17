import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers'

export default async function Home() {
  const accessToken = cookies().get('ACCESS_TOKEN')
  const refreshToken = cookies().get('REFRESH_TOKEN')
  if(!accessToken || !refreshToken) redirect('/login')
  
  const {authorized} = await verifyToken(accessToken.value, refreshToken.value)

  if(authorized) redirect('/university')
  else redirect('/login')

  return <div className="bg-[whitesmoke] w-full h-full px-8">Home Page</div>;
}

