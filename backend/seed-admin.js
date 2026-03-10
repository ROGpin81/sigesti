require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./db/connection');
const Users = require('./models/Users');

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexion a BD exitosa');

        const emailAdmin = 'sigesti.web@gmail.com';

        const adminExistente = await Users.findOne({
            where: { email: emailAdmin }
        });

        if (adminExistente) {
            console.log('El usuario administrador ya existe');
            process.exit();
        }

        const password_hash = await bcrypt.hash('Admin12345', 10);

        const admin = await Users.create({
            email: emailAdmin,
            first_name: 'Administrador',
            last_name: 'Principal',
            password_hash,
            role: 'ADMIN',
            is_active: true
        });

        console.log('Administrador creado correctamente');
        console.log({
            id: admin.id,
            email: admin.email,
            role: admin.role
        });

        process.exit();
    } catch (error) {
        console.error('Error al crear administrador:', error);
        process.exit(1);
    }
};

seedAdmin();