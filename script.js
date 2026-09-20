/* =========================================
   BOCADO — CARRITO
========================================= */

const carrito = [];

const abrirCarrito = document.getElementById("abrirCarrito");
const cerrarCarrito = document.getElementById("cerrarCarrito");
const seguirComprando = document.getElementById("seguirComprando");

const carritoOverlay = document.getElementById("carritoOverlay");
const carritoProductos = document.getElementById("carritoProductos");
const carritoTotal = document.getElementById("carritoTotal");
const contadorCarrito = document.getElementById("contadorCarrito");

const pedirWhatsApp = document.getElementById("pedirWhatsApp");
const botonesAgregar = document.querySelectorAll(".btn-agregar");

function formatoPrecio(numero) {
	return "$" + numero.toLocaleString("es-AR");
}

abrirCarrito.addEventListener("click", () => {
	carritoOverlay.classList.add("activo");
});

cerrarCarrito.addEventListener("click", () => {
	carritoOverlay.classList.remove("activo");
});

seguirComprando.addEventListener("click", () => {
	carritoOverlay.classList.remove("activo");
});

carritoOverlay.addEventListener("click", (evento) => {
	if (evento.target === carritoOverlay) {
		carritoOverlay.classList.remove("activo");
	}
});

botonesAgregar.forEach((boton) => {
	boton.addEventListener("click", () => {
		const nombre = boton.dataset.nombre;
		const precio = Number(boton.dataset.precio);
		const productoExistente = carrito.find(
			(producto) => producto.nombre === nombre
		);

		if (productoExistente) {
			productoExistente.cantidad++;
		} else {
			carrito.push({ nombre, precio, cantidad: 1 });
		}

		actualizarCarrito();
		carritoOverlay.classList.add("activo");
	});
});

function actualizarCarrito() {
	carritoProductos.innerHTML = "";

	if (carrito.length === 0) {
		carritoProductos.innerHTML = `
			<div class="carrito-vacio">
				<div class="carrito-vacio-icon">🛒</div>
				<h3>Tu carrito está vacío</h3>
				<p>Agregá algo rico y empezá tu pedido.</p>
			</div>
		`;
		carritoTotal.textContent = "$0";
		contadorCarrito.textContent = "0";
		pedirWhatsApp.disabled = true;
		return;
	}

	carrito.forEach((producto, indice) => {
		const subtotal = producto.precio * producto.cantidad;
		const item = document.createElement("div");
		item.className = "carrito-item";
		item.innerHTML = `
			<div class="carrito-item-top">
				<div>
					<h3>${producto.nombre}</h3>
					<p class="carrito-item-precio">
						${formatoPrecio(producto.precio)} cada uno
					</p>
				</div>
				<strong class="carrito-item-subtotal">
					${formatoPrecio(subtotal)}
				</strong>
			</div>
			<div class="cantidad-control">
				<button type="button" data-accion="restar" data-indice="${indice}">−</button>
				<span>${producto.cantidad}</span>
				<button type="button" data-accion="sumar" data-indice="${indice}">+</button>
			</div>
		`;
		carritoProductos.appendChild(item);
	});

	const total = carrito.reduce(
		(suma, producto) => suma + producto.precio * producto.cantidad,
		0
	);
	const cantidadTotal = carrito.reduce(
		(suma, producto) => suma + producto.cantidad,
		0
	);

	carritoTotal.textContent = formatoPrecio(total);
	contadorCarrito.textContent = cantidadTotal;
	pedirWhatsApp.disabled = false;
	configurarControlesCantidad();
}

function configurarControlesCantidad() {
	document.querySelectorAll(".cantidad-control button").forEach((boton) => {
		boton.addEventListener("click", () => {
			const indice = Number(boton.dataset.indice);
			if (boton.dataset.accion === "sumar") {
				carrito[indice].cantidad++;
			} else {
				carrito[indice].cantidad--;
				if (carrito[indice].cantidad <= 0) {
					carrito.splice(indice, 1);
				}
			}
			actualizarCarrito();
		});
	});
}

pedirWhatsApp.addEventListener("click", () => {
	if (carrito.length === 0) return;

	let mensaje = "Hola Bocado 👋 Quiero hacer el siguiente pedido:%0A%0A";
	carrito.forEach((producto) => {
		const subtotal = producto.precio * producto.cantidad;
		mensaje += `• ${producto.nombre} x${producto.cantidad} — ${formatoPrecio(subtotal)}%0A`;
	});

	const total = carrito.reduce(
		(suma, producto) => suma + producto.precio * producto.cantidad,
		0
	);
	mensaje += `%0A*TOTAL: ${formatoPrecio(total)}*`;
	window.open(`https://wa.me/5491157493977?text=${mensaje}`, "_blank");
});

actualizarCarrito();
/* =========================================
   FILTRO DE CATEGORÍAS
========================================= */

const botonesCategorias =
    document.querySelectorAll(".categorias-menu button");

const productosMenu =
    document.querySelectorAll(".producto");


botonesCategorias.forEach((boton) => {

    boton.addEventListener("click", () => {

        const categoria =
            boton.textContent.trim();


        /* Cambiar botón activo */

        botonesCategorias.forEach((otroBoton) => {

            otroBoton.classList.remove(
                "categoria-activa"
            );

        });

        boton.classList.add(
            "categoria-activa"
        );


        /* Mostrar / ocultar productos */

        productosMenu.forEach((producto) => {

            const categoriaProducto =
                producto
                    .querySelector(".producto-categoria")
                    .textContent
                    .trim();


            if (categoria === "Todos") {

                producto.style.display = "";

            } else if (
                categoria.includes(categoriaProducto)
            ) {

                producto.style.display = "";

            } else {

                producto.style.display = "none";

            }

        });

    });

});
