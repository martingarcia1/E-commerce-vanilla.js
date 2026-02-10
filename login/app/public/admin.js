function mostrarOpciones(tipoUsuario) {
    if (tipoUsuario === 'admin') {
        document.getElementById('adminOptions').classList.remove('none');
        document.getElementById('userOptions').classList.remove('none');
    } else if (tipoUsuario === 'usuario') {
        document.getElementById('userOptions').classList.remove('none');
    }
}


const tipoUsuario = localStorage.getItem('rolUsuario');
mostrarOpciones(tipoUsuario);


function irAPaginaPrincipalAdmin() {
    window.location.href = '/admin';
}

function irAPaginaPrincipalUsuario() {
    window.location.href = '/usuario';
}

/*document.getElementsByTagName("button")[0].addEventListener("click", () => {
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.location.href = "/";
});*/
document.getElementsByTagName("button")[0].addEventListener("click", async () => {
    try {
        const res = await fetch("/api/logout", {
            method: "POST",
            credentials: "include"
        });

        if (res.ok) {
            const resJson = await res.json();
            if (resJson.redirect) {
                window.location.href = resJson.redirect;
            }
        } else {
            console.error("Error al cerrar sesión:", res.statusText);
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }
});

function guardarDatosLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar));
}

function recuperarDatosLocal(llave) {
    try {
        const datos = JSON.parse(localStorage.getItem(llave)) || [];
        return datos;
    } catch (error) {
        console.error('Error al recuperar datos del localStorage:', error);
        return [];
    }
}

let productos = recuperarDatosLocal('productos');
let mensaje = document.getElementById('mensaje');

const añadirProducto = document.getElementById('productoAñadir');
const añadirValor = document.getElementById('valorAñadir');
const añadirExistencia = document.getElementById('existenciaAñadir');
const tipoImagen = document.getElementById('tipoImagen');
const añadirImagen = document.getElementById('ImagenAñadir');
const añadirImagen2 = document.getElementById('ImagenAñadir2');

tipoImagen.addEventListener('change', function () {
    if (this.value === 'url') {
        añadirImagen.style.display = 'block';
        añadirImagen2.style.display = 'none';
    } else {
        añadirImagen.style.display = 'none';
        añadirImagen2.style.display = 'block';
    }
});

document.getElementById("botonAñadir").addEventListener("click", function (event) {
    event.preventDefault();
    let productoAñadir = añadirProducto.value;
    let valorAñadir = añadirValor.value;
    let existenciaAñadir = añadirExistencia.value;
    let imagenAñadir;

    if (tipoImagen.value === 'url') {
        imagenAñadir = añadirImagen.value;
        procesarProducto();
    } else {
        let file = añadirImagen2.files[0];
        let reader = new FileReader();
        reader.onloadend = function () {
            imagenAñadir = reader.result;
            procesarProducto();
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            imagenAñadir = '';
            procesarProducto();
        }
    }

    function procesarProducto() {
        let ban = true;

        if (productoAñadir === '' || valorAñadir === '' || existenciaAñadir === '' || imagenAñadir === '') {
            mensaje.classList.add('llenarCampos');
            setTimeout(() => { mensaje.classList.remove('llenarCampos'); }, 2500);
            ban = false;
        } else {
            for (let i = 0; i < productos.length; i++) {
                if (productos[i].nombre === productoAñadir) {
                    mensaje.classList.add('repetidoError');
                    setTimeout(() => { mensaje.classList.remove('repetidoError'); }, 2500);
                    ban = false;
                }
            }
        }

        if (ban) {
            productos.push({
                id: Date.now(),
                nombre: productoAñadir,
                valor: valorAñadir,
                existencia: existenciaAñadir,
                urlImagen: imagenAñadir
            });
            mensaje.classList.add('realizado');
            setTimeout(() => {
                mensaje.classList.remove('realizado');
                window.location.reload();
            }, 1500);
            guardarDatosLocal('productos', productos);
        }
    }

    if (tipoImagen.value === 'url') {
        procesarProducto();
    }
});

// EDITAR
const productoEd = document.getElementById('productoEditar');
const atributoEd = document.getElementById('atributoEditar');
const nuevoAtributoEd = document.getElementById('nuevoValor');
const tipoImagenEditar = document.getElementById('tipoImagenEditar');
const nuevoValorImagen = document.getElementById('nuevoValorImagen');
const nuevoValorImagenArchivo = document.getElementById('nuevoValorImagenArchivo');

tipoImagenEditar.addEventListener('change', function () {
    if (this.value === 'url') {
        nuevoValorImagen.style.display = 'block';
        nuevoValorImagenArchivo.style.display = 'none';
    } else {
        nuevoValorImagen.style.display = 'none';
        nuevoValorImagenArchivo.style.display = 'block';
    }
});

document.getElementById("botonEditar").addEventListener("click", function (event) {
    event.preventDefault();
    let productoEditar = productoEd.value;
    let atributoEditar = atributoEd.value;
    let nuevoAtributo = nuevoAtributoEd.value;
    let ban = false;
    if (productoEditar === '' || atributoEditar === '' || (nuevoAtributo === '' && nuevoValorImagen.value === '' && !nuevoValorImagenArchivo.files.length)) {
        mensaje.classList.add('llenarCampos');
        setTimeout(() => { mensaje.classList.remove('llenarCampos'); }, 2500);
    } else {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre === productoEditar) {
                if (atributoEditar === 'urlImagen') {
                    if (tipoImagenEditar.value === 'url' && nuevoValorImagen.value !== '') {
                        productos[i][atributoEditar] = nuevoValorImagen.value;
                        ban = true;
                    } else if (tipoImagenEditar.value === 'file' && nuevoValorImagenArchivo.files.length) {
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            productos[i][atributoEditar] = e.target.result;
                            guardarDatosLocal('productos', productos);
                            window.location.reload();
                        }
                        reader.readAsDataURL(nuevoValorImagenArchivo.files[0]);
                        ban = true;
                    }
                } else {
                    productos[i][atributoEditar] = nuevoAtributo;
                    ban = true;
                }
            }
        }
        if (ban) {
            mensaje.classList.add('realizado');
            setTimeout(() => {
                mensaje.classList.remove('realizado');
                if (atributoEditar !== 'urlImagen' || tipoImagenEditar.value === 'url') {
                    window.location.reload();
                }
            }, 1500);
            guardarDatosLocal('productos', productos);
        } else {
            mensaje.classList.add('noExisteError');
            setTimeout(() => { mensaje.classList.remove('noExisteError'); }, 2500);
        }
    }
});

// ELIMINAR
const productoE = document.getElementById('productoEliminar');

document.getElementById("botonEliminar").addEventListener("click", function (event) {
    event.preventDefault();
    let productoEliminar = productoE.value;
    let ban = false;

    for (let i = productos.length - 1; i >= 0; i--) {
        if (productos[i].nombre === productoEliminar) {
            productos.splice(i, 1);
            ban = true;
            break;
        }
    }

    if (!ban) {
        mensaje.classList.add('noExisteError');
        setTimeout(() => { mensaje.classList.remove('noExisteError'); }, 2500);
    } else {
        mensaje.classList.add('realizado');
        setTimeout(() => {
            mensaje.classList.remove('realizado');
            window.location.reload();
        }, 1500);
    }
    guardarDatosLocal('productos', productos);
});

// MOSTRAR
window.addEventListener("load", () => {
    const productoEd = document.getElementById('productoEditar');
    const productoEl = document.getElementById('productoEliminar');

    for (let i = 0; i < productos.length; i++) {
        productoEd.innerHTML += `<option value="${productos[i].nombre}">${productos[i].nombre}</option>`;
        productoEl.innerHTML += `<option value="${productos[i].nombre}">${productos[i].nombre}</option>`;
    }

    if (productos.length > 0) {
        Object.keys(productos[0]).forEach(element => {
            atributoEd.innerHTML += `<option>${element}</option>`;
        });
    }

    let mostrarProductos = document.getElementById('mostrarProductos');
    mostrarProductos.innerHTML = '';

    for (let i = 0; i < productos.length; i++) {
        let productoDiv = document.createElement('div');
        productoDiv.classList.add('contenedorProductos');

        let img = document.createElement('img');
        img.src = productos[i].urlImagen;
        img.alt = productos[i].nombre;

        let infoDiv = document.createElement('div');
        infoDiv.classList.add('informacion');

        let pNombre = document.createElement('p');
        pNombre.textContent = productos[i].nombre;

        let pPrecio = document.createElement('p');
        pPrecio.classList.add('precio');
        pPrecio.innerHTML = `<span>Precio: ${productos[i].valor}$</span>`;

        let pExistencia = document.createElement('p');
        pExistencia.textContent = `Existencia: ${productos[i].existencia}`;

        infoDiv.appendChild(pNombre);
        infoDiv.appendChild(pPrecio);
        infoDiv.appendChild(pExistencia);

        productoDiv.appendChild(img);
        productoDiv.appendChild(infoDiv);

        mostrarProductos.appendChild(productoDiv);
    }
});