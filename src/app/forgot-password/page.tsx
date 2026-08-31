"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/components/auth/AuthModal";

export default function ForgotPage() {
  const { openModal } = useAuthModal();
  const router        = useRouter();

  useEffect(() => {
    router.replace("/");
    const t = setTimeout(() => openModal("forgot"), 80);
    return () => clearTimeout(t);
  }, [openModal, router]);

  return null;
}
