import bcrypt from 'bcryptjs';

//la función hashPassword recibe el pass del frontend y lo encripta.
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
//la función comparePassword recibe el pass del frontend y lo compara al que está encriptado en la base de datos.
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}