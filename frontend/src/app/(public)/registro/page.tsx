// El registro de usuarios es solo para administradores, por lo que esta página redirige ahora al login.
// Si en el futuro se desea permitir el auto-registro, se puede implementar un formulario aquí.
// Por ahpra no se elimina la página para evitar romper enlaces o referencias existentes.

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}