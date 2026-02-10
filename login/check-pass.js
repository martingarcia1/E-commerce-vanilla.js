// check-pass.js
import bcryptjs from 'bcryptjs';
const hash = '$2a$05$nLY2It8riku2vwwDIINdgO/XIyPXRg1Gn9LFgnhwKqC4TwcAwEUL2'; // hash del admin (copiar desde authentication.controller.js)
const candidate = 'admin';

bcryptjs.compare(candidate, hash).then(ok => {
  console.log('¿Coincide?', ok);
});