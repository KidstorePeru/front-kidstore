import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Panel — KidStore",
  robots: "noindex, nofollow",
};

export default function AdminRoute() {
  return <AdminDashboard />;
}
