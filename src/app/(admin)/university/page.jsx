// app/university/page.js
import DataTable from "@/components/DataTable/DataTable";

import { Suspense } from "react";
import Loading from "@/components/Loading";

// utils/fetchData.js
import axios from "axios";
import { cookies } from "next/headers";
import University from "./university";

export async function fetchData() {
  const token = cookies().get("ACCESS_TOKEN");
  try {
    const res = await axios.get("http://localhost:8000/universities/", {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    return res.data;
  } catch (error) {
    // toast.error(error.message);
    return [];
  }
}

export default async function UniversityWrapper({ params, searchParams }) {
  const data = await fetchData(); // Fetch data on the server side

  return (
    <div className="p-8 bg-[whitesmoke] h-full overflow-hidden">
      <University />
      <div className="h-full">
        <Suspense fallback={<Loading />}>
          <DataTable data={data} entity={'university'} />
        </Suspense>
      </div>
    </div>
  );
}
