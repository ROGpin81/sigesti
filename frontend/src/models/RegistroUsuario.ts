export interface RegistroUsuario {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    role: "QA" | "DEV";
    is_active: boolean;
}