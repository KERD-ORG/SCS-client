import Sidebar from "@/components/sidebar";

function AdminLayout({ children }) {
  return (
    <main className="w-full flex">
      <Sidebar />
      <div className="w-full min-h-screen">{children}</div>
    </main>
  );
}

export default AdminLayout;
