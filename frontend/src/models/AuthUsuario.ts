export interface AuthUsuario {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: "ADMIN" | "QA" | "DEV";
}