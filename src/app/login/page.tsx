"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/components/auth/AuthModal";

export default function LoginPage() {
  const { openModal } = useAuthModal();
  const router        = useRouter();

  useEffect(() => {
    router.replace("/");
    // Small delay so the home page renders before modal opens
    const t = setTimeout(() => openModal("login"), 80);
    return () => clearTimeout(t);
  }, [openModal, router]);

  return null;
}
