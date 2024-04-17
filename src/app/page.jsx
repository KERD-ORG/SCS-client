import { redirect } from "next/navigation";

export default function Home() {
  redirect('/university')
  return (
    <div className="bg-[whitesmoke] w-full h-full px-8">
      Home Page
    </div>
  );
}
