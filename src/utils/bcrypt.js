import bcrypt from 'bcryptjs'

// Hashing de contraseñas
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Comparación de contraseñas
export const isValidPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);
