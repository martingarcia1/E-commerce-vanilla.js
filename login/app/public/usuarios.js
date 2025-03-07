function guardarDatosLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar));
}


function recuperarDatosLocal(llave) {
    return JSON.parse(localStorage.getItem(llave)) || [];
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(lista));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        lista = JSON.parse(carritoGuardado);
        numero.innerHTML = lista.length;
        if (lista.length > 0) {
            numero.classList.add("diseñoNumero");
        }
        mostrarElementosLista();
    }
}


window.onload = function () {
    visualizarProductos();
    contenedorCompra.classList.add("none");
    cargarCarrito();
}


let productos = recuperarDatosLocal('productos') || [];
let lista = [];
let valortotal = 0;


const informacionCompra = document.getElementById('informacionCompra');
const contenedorCompra = document.getElementById('contenedorCompra');
const productosCompra = document.getElementById('productosCompra');
const contenedorProductos = document.getElementById('contenedorProductos');
const carrito = document.getElementById('carrito');
const numero = document.getElementById('numeroProductos');
const header = document.getElementById('header');
const total = document.getElementById('totalCompra');
const body = document.body;
const x = document.getElementById('cerrarCarrito');


window.addEventListener("scroll", function () {
    if (contenedorProductos.getBoundingClientRect().top < 10) {
        header.classList.add("scroll");
    } else {
        header.classList.remove("scroll");
    }
});

function mostrarOpcionesUsuario() {
    var userOptions = document.getElementById('userOptions');
    var adminOptions = document.getElementById('adminOptions');
    userOptions.classList.remove('none');
    adminOptions.classList.add('none');
}

function mostrarOpcionesAdmin() {
    var userOptions = document.getElementById('userOptions');
    var adminOptions = document.getElementById('adminOptions');
    adminOptions.classList.remove('none');
    userOptions.classList.add('none');
}

function esAdmin() {
    const rolUsuario = localStorage.getItem('rolUsuario');
    return rolUsuario === 'admin';
}

window.onload = function () {
    visualizarProductos();
    contenedorCompra.classList.add("none");
    cargarCarrito();


    if (esAdmin()) {
        document.getElementById('adminOptions').classList.remove('none');
    }


    if (localStorage.getItem('rolUsuario') === 'usuario' || esAdmin()) {
        document.getElementById('userOptions').classList.remove('none');
    }
};

function irAPaginaPrincipalAdmin() {
    window.location.href = '/admin';
}

function irAPaginaPrincipalUsuario() {
    window.location.href = '/usuario';
}

function visualizarProductos() {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto, i) => {
        let div = document.createElement('div');
        let img = document.createElement('img');
        img.src = producto.urlImagen;
        div.appendChild(img);
        let informacion = document.createElement('div');
        informacion.className = 'informacion';
        let pNombre = document.createElement('p');
        pNombre.textContent = producto.nombre;
        informacion.appendChild(pNombre);
        let pPrecio = document.createElement('p');
        pPrecio.className = 'precio';
        pPrecio.textContent = `$${producto.valor}`;
        informacion.appendChild(pPrecio);
        if (producto.existencia > 0) {
            let button = document.createElement('button');
            button.textContent = 'Comprar';
            button.addEventListener('click', function () { comprar(i); });
            informacion.appendChild(button);

            let buttons = document.createElement('button')
            buttons.textContent = 'alert'
            buttons.addEventListener('click', function () { alert("se añido al carrito") })
            informacion.appendChild(buttons)
        } else {
            let pSoldOut = document.createElement('p');
            pSoldOut.className = 'soldOut';
            pSoldOut.textContent = 'Sold Out';
            informacion.appendChild(pSoldOut);
        }
        div.appendChild(informacion);
        contenedorProductos.appendChild(div);
    });
}


function comprar(indice) {
    if (productos[indice].existencia > 0) {
        lista.push({ nombre: productos[indice].nombre, precio: productos[indice].valor });
        productos[indice].existencia -= 1;
        guardarDatosLocal("productos", productos);
        numero.innerHTML = lista.length;
        numero.classList.add("diseñoNumero");
        if (productos[indice].existencia === 0) {
            visualizarProductos();
        }
        guardarCarrito();
    } else {
        console.error('Producto agotado');
    }
    return lista;
}


carrito.addEventListener("click", function () {
    body.style.overflow = "hidden";
    contenedorCompra.classList.remove('none');
    contenedorCompra.classList.add('contenedorCompra');
    informacionCompra.classList.add('informacionCompra');
    mostrarElementosLista();
});


function mostrarElementosLista() {
    productosCompra.innerHTML = "";
    valortotal = 0;
    lista.forEach((item, i) => {
        const producto = productos.find(p => p.nombre === item.nombre);
        if (producto) {
            productosCompra.innerHTML += `
            <div class="carritoItem">
                <img src="${producto.urlImagen}" alt="${item.nombre}">
                <div class="itemDetails">
                    <p class="itemName">${item.nombre}</p>
                    <p class="itemPrice">$${item.precio}</p>
                    <input type="number" value="1" min="1">
                </div>
                <div class="deleteBtn" onclick="eliminar(${i})">🗑️</div>
            </div>`;
            valortotal += parseFloat(item.precio);
        }
    });
    total.innerHTML = `
    <div class="carritoTotal">
        <span class="totalLabel">Total</span>
        <span class="totalAmount">$${valortotal.toFixed(2)}</span>
    </div>`;
}


function eliminar(indice) {
    const productoEliminado = lista[indice];
    const producto = productos.find(p => p.nombre === productoEliminado.nombre);
    if (producto) {
        producto.existencia += 1;
    }
    lista.splice(indice, 1);
    guardarDatosLocal("productos", productos);
    numero.innerHTML = lista.length;
    if (lista.length === 0) {
        numero.classList.remove("diseñoNumero");
    }
    visualizarProductos();
    mostrarElementosLista();
    guardarCarrito();
}


x.addEventListener("click", function () {
    body.style.overflow = "auto";
    contenedorCompra.classList.add('none');
    contenedorCompra.classList.remove('contenedorCompra');
    informacionCompra.classList.remove('informacionCompra');
});


function final() {
    if (lista.length === 0) {
        alert("¡Aún no hay ningún pedido para realizar!\nPor favor, haga un pedido primero.");
    } else {
        const nombreUsuario = localStorage.getItem('nombreUsuario');
        alert(`Compra exitosa, ${nombreUsuario}`);
        lista = [];
        guardarCarrito();
        mostrarElementosLista();
        numero.innerHTML = lista.length;
        numero.classList.remove("diseñoNumero");
        contenedorCompra.classList.add('none');
        body.style.overflow = "auto";
    }
}

document.getElementById('comprar').addEventListener('click', final);


document.getElementById("cerrarSesion").addEventListener("click", async () => {
    console.log('Intentando cerrar sesión...');
    try {
        const res = await fetch("http://localhost:3000/api/logout", {
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



window.addEventListener("DOMContentLoaded", () => {
    const productoEd = document.getElementById('productoEditar');
    const productoEl = document.getElementById('productoEliminar');
    const atributoEd = document.getElementById('atributoEditar');
    if (productoEd && productoEl && atributoEd) {
        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.nombre;
            option.text = producto.nombre;
            productoEd.appendChild(option);

            const option2 = document.createElement('option');
            option2.value = producto.nombre;
            option2.text = producto.nombre;
            productoEl.appendChild(option2);
        });


        const atributos = ['existencia', 'valor', 'urlImagen'];
        atributos.forEach(atributo => {
            const option = document.createElement('option');
            option.value = atributo;
            option.text = atributo;
            atributoEd.appendChild(option);
        });
    }
});
