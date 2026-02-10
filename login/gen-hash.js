import bcryptjs from 'bcryptjs';
const plain = 'usuarios123'; // cambia por la contraseña que quieras
bcryptjs.genSalt(10).then(s => bcryptjs.hash(plain, s)).then(h => console.log(h));