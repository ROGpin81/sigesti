import type { Metadata } from "next";
import "./globals.css";
import ProviderAuth from "@/providers/ProviderAuth";

export const metadata: Metadata = {
    title: "Sigesti",
    description: "Sistema Web de Gestion de Tickets de Calidad",
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="es">
            <body>
                <ProviderAuth>{children}</ProviderAuth>
            </body>
        </html>
    );
}