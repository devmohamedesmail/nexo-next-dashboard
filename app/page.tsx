'use client'
import LanguageSwitcher from "@/components/common/language-switcher";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation()
  return (
    <div className="flex ">
    <Link href="/auth/login" className="bg-blue-500 m-2">{t("auth.signIn")}</Link>
    <Link href="/auth/register" className="bg-blue-500 m-2">register</Link>
    <Link href="/dashboard" className="bg-blue-500 m-2">dashboard</Link>
    
    <LanguageSwitcher/>
    
    </div>
  );
}
