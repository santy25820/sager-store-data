(function () {
  "use strict";

  // ==========================================
  // 1. BOTÓN FLOTANTE DE WHATSAPP
  // ==========================================

  function instalarWhatsApp() {
    if (document.getElementById("sager-whatsapp-float")) return;

    var boton = document.createElement("a");

    boton.id = "sager-whatsapp-float";
    boton.className = "sager-whatsapp-float";
    boton.href = "https://wa.me/593984441100?text=Hola%2C%20estoy%20interesado%2C%20en%20un%20set%20LEGO%20de%20Sager%20Store";
    boton.target = "_blank";
    boton.rel = "noopener noreferrer";
    boton.setAttribute(
      "aria-label",
      "Chatea con Sager Store por WhatsApp"
    );

    boton.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          fill="none"
          stroke="#FFFFFF"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <g transform="translate(0.8, 0.9)">
          <path
            d="M15.05 13.15c-.25-.12-1.45-.72-1.68-.8-.23-.08-.4-.12-.57.12-.17.24-.65.8-.8.96-.15.16-.3.18-.55.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.57-1.38-.78-1.89-.21-.5-.43-.43-.59-.44l-.5-.01c-.17 0-.45.06-.69.32-.24.26-.92.9-.92 2.2 0 1.3.94 2.56 1.07 2.73.13.17 1.85 2.82 4.47 3.95.63.27 1.12.43 1.5.55.63.2 1.21.17 1.66.1.51-.08 1.57-.64 1.79-1.26.22-.62.22-1.15.16-1.26-.06-.11-.23-.18-.48-.3z"
            fill="none"
            stroke="#FFFFFF"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>

      Chatea con nosotros
    `;

    document.body.appendChild(boton);
  }

  if (document.body) {
    instalarWhatsApp();
  } else {
    document.addEventListener("DOMContentLoaded", instalarWhatsApp);
  }

})();


// ==========================================
// 2. BOTÓN PERSONALIZADO DEL CARRITO
// ==========================================

(function () {
  "use strict";

  var PAGINA_PEDIDO =
    "https://sagerstore.mitiendanube.com/finalizar-pedido";

  function insertarBloqueSager() {
    var botonOriginal = document.querySelector(
      'input[data-component="cart.checkout-button"]'
    );

    if (!botonOriginal) return;

    var contenedor = botonOriginal.parentElement;

    // Ocultar el botón nativo de Tiendanube.
    botonOriginal.style.display = "none";
    botonOriginal.setAttribute("aria-hidden", "true");

    // Evitar que el botón personalizado aparezca más de una vez.
    if (contenedor.querySelector("#sager-custom-checkout")) {
      return;
    }

    var bloque = document.createElement("div");
    bloque.id = "sager-custom-checkout";

    bloque.innerHTML = `
      <div class="sager-checkout-content">
        <div class="sager-checkout-title">
          Continúa tu pedido en Sager Store
        </div>

        <p class="sager-checkout-description">
          Completa tus datos, selecciona tu método de entrega
          y realiza tu pedido de forma sencilla y segura.
        </p>

        <button
          type="button"
          class="sager-checkout-button"
        >
          Continuar con mi pedido
        </button>
      </div>
    `;

    var botonPersonalizado = bloque.querySelector(
      ".sager-checkout-button"
    );

    botonPersonalizado.addEventListener("click", function () {

      var carrito = window.LS && window.LS.cart;
      var productos = carrito && Array.isArray(carrito.items)
        ? carrito.items
        : [];

      if (productos.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de continuar.");
        return;
      }

      console.log("SAGER | Continuando con el pedido.");
      console.log("Productos detectados:", productos.length);
      console.log("Carrito:", carrito);

      window.location.assign(PAGINA_PEDIDO);
    });

    contenedor.insertBefore(bloque, botonOriginal);

    console.log("SAGER: Botón conectado correctamente.");
  }

  // Detectar aperturas y actualizaciones del carrito lateral.
  var observador = new MutationObserver(insertarBloqueSager);

  observador.observe(document.body, {
    childList: true,
    subtree: true
  });

  insertarBloqueSager();

})();


// ==========================================
// 3. RESUMEN DEL PEDIDO
// ==========================================

(function () {
  "use strict";

  // Ejecutar únicamente en nuestra página de pedidos.
  if (window.location.pathname.replace(/\/+$/, "") !== "/finalizar-pedido") {
    return;
  }

  function formatoDinero(valor, moneda) {
    return new Intl.NumberFormat("es-EC", {
      style: "currency",
      currency: moneda || "USD"
    }).format(valor);
  }

  function renderizarPedido() {
    var tienda = window.LS;
    var carrito = tienda && tienda.cart;

    var contenedor = document.getElementById("sager-products");
    var subtotalElemento = document.getElementById("sager-subtotal");

    if (!contenedor || !subtotalElemento) return false;
    if (!carrito || !Array.isArray(carrito.items)) return false;

    var productos = carrito.items;
    var moneda = tienda.currency && tienda.currency.code
      ? tienda.currency.code
      : "USD";

    contenedor.replaceChildren();

    if (productos.length === 0) {
      var vacio = document.createElement("div");
      vacio.className = "sager-empty";
      vacio.textContent = "Tu carrito está vacío.";

      var enlace = document.createElement("a");
      enlace.href = "/";
      enlace.textContent = "Volver a la tienda";

      vacio.appendChild(enlace);
      contenedor.appendChild(vacio);

      subtotalElemento.textContent = formatoDinero(0, moneda);
      return true;
    }

    productos.forEach(function (producto) {
      var fila = document.createElement("div");
      fila.className = "sager-product";

      var informacion = document.createElement("div");
      informacion.className = "sager-product-info";

      var nombre = document.createElement("a");
      nombre.className = "sager-product-name";
      nombre.textContent = producto.name || "Producto LEGO";

      if (producto.url) {
        try {
          var url = new URL(producto.url, window.location.origin);
          if (url.origin === window.location.origin) {
            nombre.href = url.href;
          }
        } catch (e) {}
      }

      informacion.appendChild(nombre);

      if (producto.short_variant_name) {
        var variante = document.createElement("div");
        variante.className = "sager-product-detail";
        variante.textContent = producto.short_variant_name;
        informacion.appendChild(variante);
      }

      var cantidad = document.createElement("div");
      cantidad.className = "sager-product-detail";
      cantidad.textContent = "Cantidad: " + Number(producto.quantity || 0);
      informacion.appendChild(cantidad);

      var precio = document.createElement("div");
      precio.className = "sager-product-price";

      var subtotalProducto =
        Number(producto.unit_price || 0) *
        Number(producto.quantity || 0) / 100;

      precio.textContent = formatoDinero(subtotalProducto, moneda);

      fila.appendChild(informacion);
      fila.appendChild(precio);
      contenedor.appendChild(fila);
    });

    subtotalElemento.textContent = formatoDinero(
  Number(carrito.subtotal || 0) / 100,
  moneda
);

    window.sagerSubtotalPedido = Number(carrito.subtotal || 0) / 100;
    window.sagerMonedaPedido = moneda;

    document.dispatchEvent(new Event("sager:subtotal-actualizado"));

    console.log("SAGER | Resumen del pedido actualizado.");
    return true;
  }

  var intentos = 0;

  function iniciar() {
    if (renderizarPedido()) return;

    intentos++;

    if (intentos < 40) {
      setTimeout(iniciar, 250);
    } else {
      var contenedor = document.getElementById("sager-products");

      if (contenedor) {
        contenedor.textContent =
          "No pudimos recuperar tu carrito. Recarga la página e inténtalo nuevamente.";
      }
    }
  }

  iniciar();

})();


// ==========================================
// 4. FORMULARIO DE DATOS DEL CLIENTE
// ==========================================

(function () {
  "use strict";

  if (window.location.pathname.replace(/\/+$/, "") !== "/finalizar-pedido") return;

  function crearCampo(contenedor, texto, id, tipo, placeholder, opcional) {
    var grupo = document.createElement("div");
    grupo.className = "sager-field" + (
      id === "sager-fullname" ||
      id === "sager-email" ||
      id === "sager-birthdate"
        ? " sager-field-full"
        : ""
    );

    var etiqueta = document.createElement("label");
    etiqueta.htmlFor = id;
    etiqueta.textContent = texto + (opcional ? "" : " *");

    if (opcional) {
      var nota = document.createElement("span");
      nota.textContent = " (opcional)";
      etiqueta.appendChild(nota);
    }

    var campo = document.createElement("input");
    campo.type = tipo;
    campo.id = id;
    campo.name = id;
    campo.placeholder = placeholder || "";
    campo.required = !opcional;

    if (id === "sager-id") {
      campo.inputMode = "numeric";
    }

    if (id === "sager-phone") campo.autocomplete = "tel";
    if (id === "sager-fullname") campo.autocomplete = "name";
    if (id === "sager-email") campo.autocomplete = "email";
    if (id === "sager-birthdate") campo.autocomplete = "bday";

    grupo.appendChild(etiqueta);
    grupo.appendChild(campo);
    contenedor.appendChild(grupo);
  }

  function construirFormulario() {
    var destino = document.getElementById("sager-customer-section");
    if (!destino || destino.dataset.ready === "true") return;

    destino.dataset.ready = "true";

    var tarjeta = document.createElement("div");
    tarjeta.className = "sager-form-card";

    var encabezado = document.createElement("div");
    encabezado.className = "sager-form-heading";

    var titulo = document.createElement("h2");
    titulo.textContent = "Datos del cliente";

    var descripcion = document.createElement("p");
    descripcion.textContent =
      "Necesitamos estos datos para gestionar tu pedido y mantenernos en contacto contigo.";

    encabezado.appendChild(titulo);
    encabezado.appendChild(descripcion);

    var cuadrícula = document.createElement("div");
    cuadrícula.className = "sager-form-grid";

    crearCampo(
      cuadrícula,
      "Nombres y apellidos",
      "sager-fullname",
      "text",
      "Escribe tus nombres y apellidos",
      false
    );

    crearCampo(
      cuadrícula,
      "Cédula de identidad",
      "sager-id",
      "text",
      "Ej. 0501234567",
      false
    );

    crearCampo(
      cuadrícula,
      "Teléfono / WhatsApp",
      "sager-phone",
      "tel",
      "Ej. 0991234567",
      false
    );

    crearCampo(
      cuadrícula,
      "Correo electrónico",
      "sager-email",
      "email",
      "ejemplo@correo.com",
      false
    );

    crearCampo(
      cuadrícula,
      "Fecha de nacimiento",
      "sager-birthdate",
      "date",
      "",
      true
    );

    var nota = document.createElement("p");
    nota.className = "sager-form-required";
    nota.textContent = "* Campos obligatorios";

    tarjeta.appendChild(encabezado);
    tarjeta.appendChild(cuadrícula);
    tarjeta.appendChild(nota);

    destino.appendChild(tarjeta);

    console.log("SAGER | Campos del cliente creados correctamente.");
  }

  var intentos = 0;

  function iniciar() {
    var destino = document.getElementById("sager-customer-section");

    if (destino) {
      construirFormulario();
      return;
    }

    intentos++;

    if (intentos < 40) {
      setTimeout(iniciar, 250);
    }
  }

  iniciar();

})();

// ==========================================
// 5. OPCIONES DE ENTREGA
// ==========================================

(function () {
  "use strict";

  if (window.location.pathname.replace(/\/+$/, "") !== "/finalizar-pedido") return;

  function compararAlfabeticamente(a, b) {
    return a.localeCompare(b, "es", {
      sensitivity: "base"
    });
  }

  var destinos = window.destinos || {};

  if (Object.keys(destinos).length === 0) {
    console.error("SAGER | No se pudo cargar la base de destinos.");
    return;
  }

  function crearSelect(contenedor, etiqueta, id, opciones) {
    var grupo = document.createElement("div");
    grupo.className = "sager-delivery-field";

    var label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = etiqueta;

    var select = document.createElement("select");
    select.id = id;
    select.name = id;
    select.required = true;

    var inicial = document.createElement("option");
    inicial.value = "";
    inicial.textContent = "Selecciona una opción";
    select.appendChild(inicial);

    (opciones || []).forEach(function (valor) {
      var op = document.createElement("option");
      op.value = valor;
      op.textContent = valor;
      select.appendChild(op);
    });

    grupo.appendChild(label);
    grupo.appendChild(select);
    contenedor.appendChild(grupo);

    return select;
  }

  function crearInput(contenedor, etiqueta, id, placeholder) {
    var grupo = document.createElement("div");
    grupo.className = "sager-delivery-field full";

    var label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = etiqueta;

    var input = document.createElement("input");
    input.id = id;
    input.name = id;
    input.placeholder = placeholder || "";
    input.required = true;

    grupo.appendChild(label);
    grupo.appendChild(input);
    contenedor.appendChild(grupo);

    return input;
  }

  function configurarUbicacion(provincia, canton, localidad) {
    provincia.addEventListener("change", function () {
      canton.innerHTML = '<option value="">Selecciona una opción</option>';
      localidad.innerHTML = '<option value="">Selecciona una opción</option>';

      Object.keys(destinos[provincia.value] || {})
        .sort(compararAlfabeticamente)
        .forEach(function (nombre) {
          var op = document.createElement("option");
          op.value = nombre;
          op.textContent = nombre;
          canton.appendChild(op);
        });
    });

    canton.addEventListener("change", function () {
      localidad.innerHTML = '<option value="">Selecciona una opción</option>';

      var localidades = (destinos[provincia.value] || {})[canton.value] || [];

      localidades.slice().sort(compararAlfabeticamente)
        .forEach(function (nombre) {
          var op = document.createElement("option");
          op.value = nombre;
          op.textContent = nombre;
          localidad.appendChild(op);
        });
    });
  }

  function iniciar() {
    var customer = document.getElementById("sager-customer-section");
    if (!customer || document.getElementById("sager-delivery-section")) return;

    var section = document.createElement("section");
    section.id = "sager-delivery-section";

    var card = document.createElement("div");
    card.className = "sager-delivery-card";

    var title = document.createElement("h2");
    title.textContent = "¿Cómo deseas recibir tu pedido?";

    var intro = document.createElement("p");
    intro.className = "sager-delivery-intro";
    intro.textContent = "Selecciona la opción que te resulte más conveniente.";

    var options = document.createElement("div");
    options.className = "sager-delivery-options";

    var choices = [
      {
        value: "domicilio",
        title: "Entrega a domicilio",
        description: "Recibe tu pedido en la dirección que nos indiques."
      },
      {
        value: "agencia",
        title: "Retiro en agencia",
        description: "Retira tu pedido en una agencia habilitada del transportista."
      },
      {
        value: "latacunga",
        title: "Retiro gratuito en Latacunga",
        description: "Recoge tu pedido en nuestro punto de retiro en La Fornace. Sin costo de entrega."
      }
    ];

    choices.forEach(function (choice, index) {
      var label = document.createElement("label");
      label.className = "sager-delivery-option";

      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "sager-delivery-method";
      radio.value = choice.value;
      radio.required = true;
      if (index === 0) radio.checked = true;

      var content = document.createElement("span");
      var strong = document.createElement("strong");
      strong.textContent = choice.title;

      var small = document.createElement("small");
      small.textContent = choice.description;

      content.appendChild(strong);
      content.appendChild(small);
      label.appendChild(radio);
      label.appendChild(content);
      options.appendChild(label);
    });

    var details = document.createElement("div");
    details.className = "sager-delivery-details";

    // ENTREGA A DOMICILIO
    var domicilio = document.createElement("div");
    domicilio.id = "sager-home-fields";
    domicilio.className = "sager-delivery-fields";

    var transportistaDomicilio = crearSelect(
      domicilio,
      "Transportista",
      "sager-home-carrier",
      ["Tramaco", "Servientrega"]
    );

    var provincia = crearSelect(
      domicilio,
      "Provincia",
      "sager-province",
      Object.keys(destinos).sort(compararAlfabeticamente)
    );

    var canton = crearSelect(
      domicilio,
      "Cantón",
      "sager-canton",
      []
    );

    var localidad = crearSelect(
      domicilio,
      "Parroquia / localidad",
      "sager-locality",
      []
    );

    configurarUbicacion(provincia, canton, localidad);

    var direccion = crearInput(
      domicilio,
      "Dirección exacta",
      "sager-address",
      "Calle principal, número y calle secundaria"
    );

    var referencia = crearInput(
      domicilio,
      "Referencia para encontrar el domicilio",
      "sager-address-reference",
      "Casa, edificio, local, color o punto de referencia (opcional)"
    );

    referencia.required = false;

    var domicilioNota = document.createElement("p");
    domicilioNota.className = "sager-delivery-help";
    domicilioNota.textContent =
      "La cobertura se muestra según las localidades confirmadas en nuestra base. Si tu destino no aparece, contáctanos para revisar otras alternativas antes de continuar.";

    domicilio.appendChild(domicilioNota);


    // RETIRO EN AGENCIA
    var agencia = document.createElement("div");
    agencia.id = "sager-agency-fields";
    agencia.className = "sager-delivery-fields";
    agencia.hidden = true;

    var transportista = crearSelect(
      agencia,
      "Transportista",
      "sager-carrier",
      ["Tramaco", "Servientrega"]
    );

    var provinciaAgencia = crearSelect(
      agencia,
      "Provincia",
      "sager-agency-province",
      Object.keys(destinos).sort(compararAlfabeticamente)
    );

    var cantonAgencia = crearSelect(
      agencia,
      "Cantón",
      "sager-agency-canton",
      []
    );

    var localidadAgencia = crearSelect(
      agencia,
      "Ciudad / localidad de la agencia",
      "sager-agency-locality",
      []
    );

    configurarUbicacion(
      provinciaAgencia,
      cantonAgencia,
      localidadAgencia
    );

    var nombreAgencia = crearInput(
      agencia,
      "Nombre de la agencia",
      "sager-agency-name",
      "Nombre de la sucursal"
    );

    var direccionAgencia = crearInput(
      agencia,
      "Dirección de la agencia",
      "sager-agency-address",
      "Dirección que aparece en el buscador oficial"
    );

    nombreAgencia.required = false;
    direccionAgencia.required = false;

    var ayudaAgencia = document.createElement("p");
    ayudaAgencia.className = "sager-delivery-help";
    ayudaAgencia.textContent =
      "Antes de elegir, confirma que la agencia recibe paquetes para retiro. Puedes consultar los puntos disponibles en los buscadores oficiales de Tramaco y Servientrega.";

    var links = document.createElement("p");
    links.className = "sager-delivery-help";
    links.innerHTML =
      '<a href="https://www.tramaco.com.ec/puntosdeatencion.html" target="_blank" rel="noopener">Consultar agencias Tramaco</a> · ' +
      '<a href="https://www.servientrega.com.ec/Establecimientos/Agencias" target="_blank" rel="noopener">Consultar agencias Servientrega</a>';

    agencia.appendChild(ayudaAgencia);
    agencia.appendChild(links);


    // RETIRO EN LATACUNGA
    var retiro = document.createElement("div");
    retiro.id = "sager-local-pickup";
    retiro.hidden = true;

    var lugar = document.createElement("div");
    lugar.className = "sager-pickup-place";

    var lugarTitulo = document.createElement("strong");
    lugarTitulo.textContent = "La Fornace — Punto de retiro";

    var lugarDireccion = document.createElement("p");
    lugarDireccion.textContent = "Calle Quito 17-49 y calle Guayaquil, Latacunga.";

    var lugarHorario = document.createElement("p");
    lugarHorario.textContent = "Horario: todos los días, de 12:00 p. m. a 8:00 p. m.";

    var lugarNota = document.createElement("p");
    lugarNota.textContent = "La Fornace es un establecimiento independiente que funciona como punto de retiro para Sager Store. No es un local propio de Sager Store.";

    var lugarCoordinacion = document.createElement("p");
    lugarCoordinacion.textContent = "Una vez que tu pedido esté en Ecuador, te notificaremos para coordinar la entrega. Escríbenos por WhatsApp con anticipación e indícanos el día y la hora en que deseas recogerlo, para que podamos tenerlo preparado.";

    lugar.appendChild(lugarTitulo);
    lugar.appendChild(lugarDireccion);
    lugar.appendChild(lugarHorario);
    lugar.appendChild(lugarNota);
    lugar.appendChild(lugarCoordinacion);
    retiro.appendChild(lugar);


    // COSTO DE ENTREGA Y ACTUALIZACIÓN DEL TOTAL
    var precio = document.createElement("div");
    precio.className = "sager-delivery-price";

    var precioLabel = document.createElement("span");
    precioLabel.textContent = "Costo de entrega";

    var precioValor = document.createElement("strong");
    precioValor.id = "sager-delivery-cost";
    precioValor.textContent = "Por confirmar";

    var subtotalPedido = Number(window.sagerSubtotalPedido || 0);
    var monedaPedido = window.sagerMonedaPedido || "USD";
    var ultimoCostoEnvio = null;

    function formatoDineroEntrega(valor, moneda) {
      return new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: moneda || "USD"
      }).format(valor);
    }

    function actualizarResumenTotal(costoEnvio) {
      var envioElemento = document.getElementById("sager-shipping-cost");
      var totalElemento = document.getElementById("sager-grand-total");

      if (!envioElemento || !totalElemento) return;

      if (costoEnvio === null || costoEnvio === undefined) {
        envioElemento.textContent = "Por confirmar";
        totalElemento.textContent = "Por confirmar";
        return;
      }

      envioElemento.textContent = formatoDineroEntrega(costoEnvio, monedaPedido);

      totalElemento.textContent = formatoDineroEntrega(
        subtotalPedido + costoEnvio,
        monedaPedido
      );
    }

    document.addEventListener("sager:subtotal-actualizado", function () {
      subtotalPedido = Number(window.sagerSubtotalPedido || 0);
      monedaPedido = window.sagerMonedaPedido || "USD";
      actualizarResumenTotal(ultimoCostoEnvio);
    });

    precio.appendChild(precioLabel);
    precio.appendChild(precioValor);

    details.appendChild(domicilio);
    details.appendChild(agencia);
    details.appendChild(retiro);
    details.appendChild(precio);

    card.appendChild(title);
    card.appendChild(intro);
    card.appendChild(options);
    card.appendChild(details);
    section.appendChild(card);

    customer.insertAdjacentElement("afterend", section);


    // TARIFAS BASE POR PROVINCIA
    var capitales = {
      "Azuay": "Cuenca",
      "Bolívar": "Guaranda",
      "Cañar": "Azogues",
      "Carchi": "Tulcán",
      "Chimborazo": "Riobamba",
      "Cotopaxi": "Latacunga",
      "El Oro": "Machala",
      "Esmeraldas": "Esmeraldas",
      "Galápagos": "San Cristóbal",
      "Guayas": "Guayaquil",
      "Imbabura": "Ibarra",
      "Loja": "Loja",
      "Los Ríos": "Babahoyo",
      "Manabí": "Portoviejo",
      "Morona Santiago": "Macas",
      "Napo": "Tena",
      "Orellana": "Francisco de Orellana",
      "Pastaza": "Puyo",
      "Pichincha": "Quito",
      "Santa Elena": "Santa Elena",
      "Santo Domingo de los Tsáchilas": "Santo Domingo",
      "Sucumbíos": "Lago Agrio",
      "Tungurahua": "Ambato",
      "Zamora Chinchipe": "Zamora"
    };

    function obtenerTarifa(prov, can, transportistaSeleccionado) {
      if (prov === "Galápagos") return 15;

      var base = capitales[prov] === can ? 7 : 8;

      if (transportistaSeleccionado === "Servientrega") {
        base += 1;
      }

      return base;
    }

    function actualizar() {
      var selected = document.querySelector(
        'input[name="sager-delivery-method"]:checked'
      );

      var value = selected ? selected.value : "domicilio";

      domicilio.hidden = value !== "domicilio";
      agencia.hidden = value !== "agencia";
      retiro.hidden = value !== "latacunga";

      var esLatacungaUrbana =
        value === "domicilio" &&
        provincia.value === "Cotopaxi" &&
        canton.value === "Latacunga" &&
        localidad.value === "Latacunga";

      // Campos de domicilio
      domicilio.querySelectorAll("select, input").forEach(function (el) {
        el.required =
          value === "domicilio" &&
          el.id !== "sager-address-reference" &&
          !(esLatacungaUrbana && el.id === "sager-home-carrier");
      });

      // En Latacunga urbana no se necesita transportista nacional.
      var grupoTransportistaLocal = transportistaDomicilio.parentElement;
      grupoTransportistaLocal.hidden = esLatacungaUrbana;

      // Campos de retiro en agencia
      agencia.querySelectorAll("select, input").forEach(function (el) {
        el.required =
          value === "agencia" &&
          !["sager-agency-name", "sager-agency-address"].includes(el.id);
      });

      var costoEnvio = null;

      if (value === "latacunga") {
        costoEnvio = 0;
        precioValor.textContent = "$0,00 — Sin costo";

      } else if (esLatacungaUrbana) {
        costoEnvio = 2;
        precioValor.textContent = "$2,00";

      } else if (value === "domicilio" && provincia.value && canton.value) {
        if (localidad.value && transportistaDomicilio.value) {
          costoEnvio = obtenerTarifa(
            provincia.value,
            canton.value,
            transportistaDomicilio.value
          );

          precioValor.textContent =
            "$" + costoEnvio.toFixed(2).replace(".", ",");

        } else {
          precioValor.textContent = "Selecciona tu destino y transportista";
        }

      } else if (value === "agencia" && provinciaAgencia.value && cantonAgencia.value) {
        if (localidadAgencia.value && transportista.value) {
          costoEnvio = obtenerTarifa(
            provinciaAgencia.value,
            cantonAgencia.value,
            transportista.value
          );

          precioValor.textContent =
            "$" + costoEnvio.toFixed(2).replace(".", ",");

        } else {
          precioValor.textContent = "Selecciona tu destino y transportista";
        }

      } else {
        precioValor.textContent = "Selecciona tu destino";
      }

      ultimoCostoEnvio = costoEnvio;
      actualizarResumenTotal(costoEnvio);
    }

    [
      provincia,
      canton,
      localidad,
      transportistaDomicilio,
      provinciaAgencia,
      cantonAgencia,
      localidadAgencia,
      transportista
    ].forEach(function (campo) {
      campo.addEventListener("change", actualizar);
    });

    options.addEventListener("change", actualizar);
    actualizar();

    console.log("SAGER | Opciones de entrega creadas correctamente.");
  }

  var intentos = 0;

  function esperar() {
    if (document.getElementById("sager-customer-section")) {
      iniciar();
      return;
    }

    intentos++;

    if (intentos < 40) setTimeout(esperar, 250);
  }

  esperar();

})();


// ==========================================
// 6. MÉTODOS DE PAGO
// ==========================================

(function () {
  if (window.location.pathname.replace(/\/+$/, "") !== "/finalizar-pedido") return;

  function createPaymentSection() {
    const delivery = document.getElementById("sager-delivery-section");

    if (!delivery || document.getElementById("sager-payment-section")) return;

    const section = document.createElement("section");
    section.id = "sager-payment-section";

    section.innerHTML = `
      <h2>Método de pago</h2>
      <p class="sager-payment-intro">
        Selecciona cómo deseas realizar el pago de tu pedido.
      </p>

      <div class="sager-payment-options">
        <label class="sager-payment-option">
          <input type="radio" name="sager-payment-method" value="transferencia" required>
          <span>
            <strong>Transferencia bancaria</strong>
            <small>Realiza la transferencia y adjunta tu comprobante de pago.</small>
          </span>
        </label>

        <label class="sager-payment-option">
          <input type="radio" name="sager-payment-method" value="tarjeta" required>
          <span>
            <strong>Pago con tarjeta</strong>
            <small>Recibirás un enlace de pago de Payphone después de recibir tu pedido.</small>
          </span>
        </label>
      </div>

      <div id="sager-transfer-panel" class="sager-payment-panel" hidden>
        <h3>Selecciona tu banco</h3>

        <select id="sager-bank-select">
          <option value="">Selecciona tu banco</option>
          <option value="guayaquil">Banco Guayaquil</option>
          <option value="pichincha">Banco Pichincha</option>
        </select>

        <div id="sager-bank-guayaquil" class="sager-bank-details" hidden>
          <h4>Banco Guayaquil</h4>
          <div class="sager-bank-row">
            <div class="sager-bank-info">
              <span class="sager-bank-label">Banco</span>
              <span class="sager-bank-value">Banco Guayaquil</span>
            </div>
            <button type="button" class="sager-copy-button" data-copy="Banco Guayaquil">Copiar</button>
          </div>
          <div class="sager-bank-row">
            <div class="sager-bank-info">
              <span class="sager-bank-label">Titular</span>
              <span class="sager-bank-value">Ramos Carrillo Santiago German</span>
            </div>
            <button type="button" class="sager-copy-button" data-copy="Ramos Carrillo Santiago German">Copiar</button>
          </div>
          <div class="sager-bank-row">
            <div class="sager-bank-info">
              <span class="sager-bank-label">Tipo de cuenta</span>
              <span class="sager-bank-value">Cuenta de ahorros</span>
            </div>
            <button type="button" class="sager-copy-button" data-copy="Cuenta de ahorros">Copiar</button>
          </div>
          <div class="sager-bank-row">
            <div class="sager-bank-info">
              <span class="sager-bank-label">Número de cuenta</span>
              <span class="sager-bank-value">35539748</span>
            </div>
            <button type="button" class="sager-copy-button" data-copy="35539748">Copiar</button>
          </div>
          <div class="sager-bank-row">
            <div class="sager-bank-info">
              <span class="sager-bank-label">Cédula</span>
              <span class="sager-bank-value">1804085379</span>
            </div>
            <button type="button" class="sager-copy-button" data-copy="1804085379">Copiar</button>
          </div>
        </div>

        <div id="sager-bank-pichincha" class="sager-bank-details" hidden>
          <h4>Banco Pichincha</h4>
          <div class="sager-bank-row">
            <div class="sager-bank-info">
              <span class="sager-bank-label">Banco</span>
              <span class="sager-bank-value">Banco Pichincha</span>
            </div>
            <button type="button" class="sager-copy-button" data-copy="Banco Pichincha">Copiar</button>
          </div>
          <div class="sager-bank-row">
            <div class="sager-bank-info">
              <span class="sager-bank-label">Titular</span>
              <span class="sager-bank-value">Ramos Carrillo Santiago German</span>
            </div>
            <button type="button" class="sager-copy-button" data-copy="Ramos Carrillo Santiago German">Copiar</button>
          </div>
          <div class="sager-bank-row">
            <div class="sager-bank-info">
              <span class="sager-bank-label">Tipo de cuenta</span>
              <span class="sager-bank-value">Cuenta de ahorro transaccional</span>
            </div>
            <button type="button" class="sager-copy-button" data-copy="Cuenta de ahorro transaccional">Copiar</button>
          </div>
          <div class="sager-bank-row">
            <div class="sager-bank-info">
              <span class="sager-bank-label">Número de cuenta</span>
              <span class="sager-bank-value">2214597921</span>
            </div>
            <button type="button" class="sager-copy-button" data-copy="2214597921">Copiar</button>
          </div>
          <div class="sager-bank-row">
            <div class="sager-bank-info">
              <span class="sager-bank-label">Cédula</span>
              <span class="sager-bank-value">1804085379</span>
            </div>
            <button type="button" class="sager-copy-button" data-copy="1804085379">Copiar</button>
          </div>
        </div>

        <p class="sager-payment-warning">
          Antes de confirmar la transferencia, verifica que el nombre del beneficiario coincida con el titular indicado por Sager Store.
        </p>

        <label class="sager-receipt-label" for="sager-payment-receipt">
          Adjunta tu comprobante de transferencia
        </label>
        <input
          type="file"
          id="sager-payment-receipt"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        >
        <span id="sager-receipt-name">Formatos permitidos: JPG, PNG y PDF.</span>
      </div>

      <div id="sager-card-panel" class="sager-payment-panel" hidden>
        <div class="sager-card-message">
          Una vez que recibamos tu pedido, nos comunicaremos contigo para enviarte el enlace de pago seguro de Payphone.
        </div>
      </div>
    `;

    delivery.insertAdjacentElement("afterend", section);

    const transferPanel = section.querySelector("#sager-transfer-panel");
    const cardPanel = section.querySelector("#sager-card-panel");
    const bankSelect = section.querySelector("#sager-bank-select");
    const receiptInput = section.querySelector("#sager-payment-receipt");
    const receiptName = section.querySelector("#sager-receipt-name");

    section.querySelectorAll('input[name="sager-payment-method"]').forEach(radio => {
      radio.addEventListener("change", function () {
        const isTransfer = this.value === "transferencia";

        transferPanel.hidden = !isTransfer;
        cardPanel.hidden = isTransfer;

        bankSelect.required = isTransfer;
        receiptInput.required = isTransfer;

        if (!isTransfer) {
          bankSelect.value = "";
          section.querySelector("#sager-bank-guayaquil").hidden = true;
          section.querySelector("#sager-bank-pichincha").hidden = true;
          receiptInput.value = "";
          receiptName.textContent = "Formatos permitidos: JPG, PNG y PDF.";
        }
      });
    });

    bankSelect.addEventListener("change", function () {
      section.querySelector("#sager-bank-guayaquil").hidden = this.value !== "guayaquil";
      section.querySelector("#sager-bank-pichincha").hidden = this.value !== "pichincha";
    });

    receiptInput.addEventListener("change", function () {
      const file = this.files && this.files[0];

      if (!file) {
        receiptName.textContent = "Formatos permitidos: JPG, PNG y PDF.";
        return;
      }

      const allowed = [
        "image/jpeg",
        "image/png",
        "application/pdf"
      ];

      if (!allowed.includes(file.type)) {
        this.value = "";
        receiptName.textContent = "Formato no permitido. Selecciona un archivo JPG, PNG o PDF.";
        return;
      }

      receiptName.textContent = "Archivo seleccionado: " + file.name;
    });

    section.querySelectorAll(".sager-copy-button").forEach(button => {
      button.addEventListener("click", async function () {
        const value = this.dataset.copy;
        const originalText = "Copiar";

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(value);
          } else {
            const temporary = document.createElement("textarea");
            temporary.value = value;
            temporary.style.position = "fixed";
            temporary.style.opacity = "0";
            document.body.appendChild(temporary);
            temporary.select();

            const copied = document.execCommand("copy");
            temporary.remove();

            if (!copied) throw new Error("No se pudo copiar");
          }

          this.textContent = "¡Copiado!";
          setTimeout(() => {
            this.textContent = originalText;
          }, 1500);

        } catch (error) {
          this.textContent = "No se pudo copiar";
          setTimeout(() => {
            this.textContent = originalText;
          }, 1800);
        }
      });
    });
  }

  const observer = new MutationObserver(createPaymentSection);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  createPaymentSection();

})();

// ==========================================
// 7. CORRECCIÓN DE MODALIDADES DE ENTREGA
// ==========================================

(function () {
  "use strict";

  if (
    window.location.pathname.replace(/\/+$/, "") !==
    "/finalizar-pedido"
  ) return;

  function configurarEntrega() {
    var section = document.getElementById("sager-delivery-section");

    if (!section || section.dataset.sagerFixReady === "true") {
      return false;
    }

    var domicilio = section.querySelector("#sager-home-fields");
    var agencia = section.querySelector("#sager-agency-fields");
    var retiro = section.querySelector("#sager-local-pickup");
    var precio = section.querySelector("#sager-delivery-cost");
    var precioContenedor = section.querySelector(".sager-delivery-price");
    var opciones = section.querySelector(".sager-delivery-options");

    if (!domicilio || !agencia || !retiro || !precio ||
        !precioContenedor || !opciones) {
      return false;
    }

    section.dataset.sagerFixReady = "true";

    // Identificar los campos opcionales de retiro en agencia.
    ["sager-agency-name", "sager-agency-address"].forEach(function (id) {
      var campo = section.querySelector("#" + id);

      if (campo) {
        campo.required = false;

        var label = section.querySelector('label[for="' + id + '"]');

        if (label && !label.textContent.includes("opcional")) {
          label.textContent += " (opcional)";
        }
      }
    });

    // Aviso visible para todas las modalidades con costo.
    var nota = document.createElement("p");
    nota.id = "sager-delivery-cost-note";
    nota.textContent =
      "La tarifa de envío incluye flete, embalaje y seguro del paquete. Para Galápagos, el envío está sujeto a disponibilidad de vuelos.";

    precioContenedor.insertAdjacentElement("afterend", nota);

    function actualizarEntrega() {
      var seleccionado = section.querySelector(
        'input[name="sager-delivery-method"]:checked'
      );

      var modalidad = seleccionado ? seleccionado.value : "domicilio";

      domicilio.hidden = modalidad !== "domicilio";
      agencia.hidden = modalidad !== "agencia";
      retiro.hidden = modalidad !== "latacunga";

      // Los campos de domicilio solo son obligatorios al elegir domicilio.
      domicilio.querySelectorAll("select, input").forEach(function (campo) {
        campo.required =
          modalidad === "domicilio" &&
          campo.id !== "sager-address-reference" &&
          !(campo.id === "sager-home-carrier" && campo.parentElement.hidden);
      });

      // En agencia: transportista y ubicación obligatorios.
      // Nombre y dirección de sucursal son opcionales.
      agencia.querySelectorAll("select, input").forEach(function (campo) {
        campo.required =
          modalidad === "agencia" &&
          !["sager-agency-name", "sager-agency-address"].includes(campo.id);
      });

      nota.hidden = modalidad === "latacunga";
    }

    opciones.addEventListener("change", actualizarEntrega);
    actualizarEntrega();

    console.log("SAGER | Corrección de modalidades de entrega aplicada.");
    return true;
  }

  if (configurarEntrega()) return;

  var observador = new MutationObserver(function () {
    if (configurarEntrega()) {
      observador.disconnect();
    }
  });

  observador.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

})();


// ==========================================
// 8. VERIFICACIÓN DE SEGURIDAD TURNSTILE
// ==========================================

(function () {
  var SITE_KEY = "0x4AAAAAAF4NzOkuPPhDk60_";

  function instalarTurnstile() {
    var payment = document.getElementById("sager-payment-section");

    if (!payment || document.getElementById("sager-turnstile-container")) {
      return;
    }

    var section = document.createElement("div");
    section.id = "sager-turnstile-container";
    section.style.cssText =
      "margin-top:24px;padding:18px 0;border-top:1px solid #444;";

    var title = document.createElement("h3");
    title.textContent = "Verificación de seguridad";
    title.style.cssText = "color:#222;margin-bottom:12px";

    var description = document.createElement("p");
    description.textContent =
      "Completa esta verificación para continuar con tu pedido.";
    description.style.cssText = "color:#666;margin-bottom:14px";

    var widget = document.createElement("div");
    widget.className = "cf-turnstile";
    widget.setAttribute("data-sitekey", SITE_KEY);
    widget.setAttribute("data-action", "sager_checkout");
    widget.setAttribute("data-theme", "dark");
    widget.setAttribute("data-language", "es");

    section.appendChild(title);
    section.appendChild(description);
    section.appendChild(widget);

    payment.appendChild(section);

    if (!document.getElementById("sager-turnstile-script")) {
      var script = document.createElement("script");
      script.id = "sager-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  instalarTurnstile();

  var observer = new MutationObserver(instalarTurnstile);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();


// ==========================================
// 9. REGISTRO DEL PEDIDO
// ==========================================

(function () {
  const API = "https://sager-pedidos-api.santy25820.workers.dev/";
  const REQUEST_KEY = "sager_checkout_request_id";

  const requestId =
    sessionStorage.getItem(REQUEST_KEY) || crypto.randomUUID();

  sessionStorage.setItem(REQUEST_KEY, requestId);

  const $ = id => document.getElementById(id);
  const val = id => $(id)?.value?.trim() || "";

  const radio = n =>
    document.querySelector('input[name="' + n + '"]:checked')?.value || "";

  const msg = document.createElement("p");

  function instalarBoton() {
    const zona = $("sager-turnstile-container");

    if (!zona || $("sager-submit-order")) return;

    const btn = document.createElement("button");
    btn.id = "sager-submit-order";
    btn.type = "button";
    btn.textContent = "Finalizar pedido";

    btn.style.cssText =
      "display:block;width:100%;padding:16px;margin-top:20px;background:#fff;color:#000;border:0;border-radius:5px;font-weight:bold;cursor:pointer";

    msg.style.cssText = "color:#424242;margin-top:12px";

    zona.append(btn, msg);

    btn.onclick = async () => {
      if (btn.disabled) return;

      btn.disabled = true;
      btn.textContent = "Preparando pedido...";

      msg.style.color = "#424242";

      try {
        const nombre = val("sager-fullname");
        const cedula = val("sager-id");
        const telefono = val("sager-phone");
        const correo = val("sager-email");

        const metodoPago = radio("sager-payment-method");
        const modalidadEntrega = radio("sager-delivery-method");

        if (
          !nombre ||
          !cedula ||
          !telefono ||
          !correo ||
          !metodoPago ||
          !modalidadEntrega
        ) {
          throw Error("Completa todos los datos obligatorios.");
        }

        const subtotal = Number(window.sagerSubtotalPedido);

        const textoTotal = $("sager-grand-total")?.textContent || "";

        const total = Number(
          textoTotal
            .replace(/[^\d,.-]/g, "")
            .replace(/\./g, "")
            .replace(",", ".")
        );

        const costoEnvio = Number((total - subtotal).toFixed(2));

        if (
          !Number.isFinite(subtotal) ||
          !Number.isFinite(total) ||
          costoEnvio < 0
        ) {
          throw Error(
            "No pudimos calcular el total del pedido. Recarga la página."
          );
        }

        const productos = (window.LS?.cart?.items || []).map(p => ({
          id: p.id,
          nombre: p.name,
          cantidad: p.quantity,
          precio: Number(p.unit_price) / 100,
          url: p.url
        }));

        if (!productos.length) {
          throw Error("Tu carrito está vacío.");
        }

        const banco = val("sager-bank-select");
        let comprobante = null;

        if (metodoPago === "transferencia") {
          const archivo = $("sager-payment-receipt")?.files?.[0];

          if (!banco || !archivo) {
            throw Error("Selecciona el banco y adjunta el comprobante.");
          }

          if (archivo.size > 7 * 1024 * 1024) {
            throw Error("El comprobante no puede superar 7 MB.");
          }

          comprobante = await new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve({
              fileName: archivo.name,
              mimeType: archivo.type,
              base64: String(reader.result).split(",")[1]
            });

            reader.onerror = () =>
              reject(Error("No se pudo leer el comprobante."));

            reader.readAsDataURL(archivo);
          });
        }

        const token = window.turnstile?.getResponse();

        if (!token) {
          throw Error("Completa la verificación de seguridad.");
        }

        const modalidad = modalidadEntrega;

        const campos = modalidad === "domicilio"
          ? [
              "sager-home-carrier",
              "sager-province",
              "sager-canton",
              "sager-locality",
              "sager-address",
              "sager-address-reference"
            ]
          : modalidad === "agencia"
          ? [
              "sager-carrier",
              "sager-agency-province",
              "sager-agency-canton",
              "sager-agency-locality",
              "sager-agency-name",
              "sager-agency-address"
            ]
          : [];

        const direccionEntrega = campos.map(id => {
          const e = $(id);

          return e
            ? e.previousElementSibling?.textContent?.trim() +
                ": " +
                e.value.trim()
            : "";
        }).filter(Boolean).join("\n") ||
          (modalidad === "latacunga" ? "Retiro en La Fornace" : "");

        if (campos.some(id => !val(id))) {
          throw Error("Completa los datos de entrega.");
        }

        const pedido = {
          requestId: requestId,
          nombre,
          cedula,
          telefono,
          correo,
          fechaNacimiento: val("sager-birthdate"),
          productos,
          subtotal,
          costoEnvio,
          total,
          metodoPago,
          banco,
          comprobante,
          modalidadEntrega,
          direccionEntrega,
          turnstileToken: token
        };

        btn.textContent = "Registrando pedido...";
        msg.style.color = "#424242";
        msg.textContent =
        "Estamos registrando tu pedido. No cierres esta página.";

        let r, d;

        try {
          r = await fetch(API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
          });

          d = await r.json();

        } catch (e) {
          btn.textContent = "No se pudo confirmar";

          msg.style.color = "#c62828";

          msg.textContent =
            "No pudimos confirmar la respuesta del servidor. No vuelvas a enviar el pedido todavía. Contáctanos por WhatsApp para comprobar su estado.";

          return;
        }

        if (!r.ok || !d.success) {
          window.turnstile?.reset();

          throw Error(
            d.message || "No se pudo registrar el pedido."
          );
        }

        btn.textContent = "Pedido registrado correctamente";

        sessionStorage.removeItem(REQUEST_KEY);

        msg.style.color = "#2e7d32";

        msg.textContent =
          "¡Gracias por comprar en Sager Store! Tu número de pedido es " +
          d.orderNumber +
          ". Recibirás la información para continuar con tu compra.";

        btn.style.cursor = "default";

      } catch (e) {
        msg.style.color = "#c62828";
        msg.textContent = e.message;
        btn.disabled = false;
        btn.textContent = "Finalizar pedido";

        console.error("SAGER | Error:", e);
      }
    };
  }

  instalarBoton();

  new MutationObserver(instalarBoton).observe(document.body, {
    childList: true,
    subtree: true
  });

})();


// ==========================================
// 10. AVISO PARA PEDIDOS SUPERIORES A $100
// ==========================================

(function () {
  function actualizar() {
    var aviso = document.getElementById("sager-high-order-notice");

    if (!aviso) return;

    var subtotal = Number(window.sagerSubtotalPedido);

    if (!isFinite(subtotal) || subtotal <= 100) {
      aviso.style.display = "none";
      aviso.innerHTML = "";
      return;
    }

    aviso.innerHTML =
      "<h2>Importante: pedidos superiores a $100</h2>" +
      "<p>El costo de envío mostrado corresponde a una tarifa base y puede variar según el peso del paquete, el valor asegurado y la cobertura de la empresa transportista.</p>" +
      "<p>Puedes continuar con tu pedido y pagar el valor mostrado. Si existe alguna diferencia, te avisaremos antes de realizar el envío nacional.</p>" +
      "<p>Si prefieres conocer el costo definitivo antes de pagar, puedes solicitar una cotización por WhatsApp.</p>" +
      "<p>Los valores incluyen flete, embalaje y seguro.</p>" +
      '<p style="margin-top:16px;"><a href="https://wa.me/593984441100" target="_blank" rel="noopener" style="display:inline-block;background:#111;color:#fff;padding:12px 18px;border-radius:5px;text-decoration:none;font-weight:bold;">Solicitar cotización por WhatsApp</a></p>';

    aviso.style.display = "block";
  }

  window.addEventListener("sager:subtotal-actualizado", actualizar);

  actualizar();

})();
