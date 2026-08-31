import { AdminAuthProvider } from "@/context/AdminAuthContext";

export const metadata = {
  title: "Admin — KidStore",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      {children}
    </AdminAuthProvider>
  );
}
