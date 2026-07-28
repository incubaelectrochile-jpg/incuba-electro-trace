/* =========================================================
   INCUBA ELECTRO TRACE
   APP.JS COMPLETO
   Trazabilidad + Control de pérdida de peso
========================================================= */


/* =========================================================
   VARIABLES PRINCIPALES
========================================================= */

let lotes = JSON.parse(
    localStorage.getItem("incubaElectroLotes")
) || [];

let loteActual = null;


/* =========================================================
   GUARDAR DATOS
========================================================= */

function guardarDatos() {

    localStorage.setItem(
        "incubaElectroLotes",
        JSON.stringify(lotes)
    );

}


/* =========================================================
   CAMBIAR DE PANTALLA
========================================================= */

function mostrarPantalla(nombrePantalla) {

    const pantallas =
        document.querySelectorAll(".pantalla");

    pantallas.forEach(function(pantalla) {

        pantalla.classList.remove("activa");

    });


    const pantallaSeleccionada =
        document.getElementById(nombrePantalla);


    if (pantallaSeleccionada) {

        pantallaSeleccionada.classList.add("activa");

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   CREAR NUEVA INCUBACIÓN
========================================================= */

function crearLote() {

    const nombre =
        document.getElementById("nombreLote").value.trim();

    const fecha =
        document.getElementById("fechaLote").value;

    const especie =
        document.getElementById("especieLote").value.trim();

    const incubadora =
        document.getElementById("incubadoraLote").value.trim();

    const huevos =
        Number(
            document.getElementById("huevosIngresados").value
        );

    const observaciones =
        document
            .getElementById("observacionInicial")
            .value
            .trim();


    if (!nombre) {

        alert(
            "Debes ingresar un nombre para la incubación."
        );

        return;

    }


    if (!fecha) {

        alert(
            "Debes ingresar la fecha de carga."
        );

        return;

    }


    if (!especie) {

        alert(
            "Debes ingresar la especie."
        );

        return;

    }


    if (!incubadora) {

        alert(
            "Debes ingresar la incubadora."
        );

        return;

    }


    if (!huevos || huevos < 1) {

        alert(
            "Debes ingresar una cantidad válida de huevos."
        );

        return;

    }


    const nuevoLote = {

        id: Date.now(),

        nombre: nombre,

        fecha: fecha,

        especie: especie,

        incubadora: incubadora,

        huevosIngresados: huevos,

        observacionesIniciales:
            observaciones,

        etapas: {

            etapa1: null,

            etapa2: null,

            etapa3: null,

            etapa4: null

        }

    };


    lotes.push(nuevoLote);


    guardarDatos();


    mostrarLotes();


    abrirLote(nuevoLote.id);


    document.getElementById(
        "nombreLote"
    ).value = "";


    document.getElementById(
        "fechaLote"
    ).value = "";


    document.getElementById(
        "especieLote"
    ).value = "";


    document.getElementById(
        "incubadoraLote"
    ).value = "";


    document.getElementById(
        "huevosIngresados"
    ).value = "";


    document.getElementById(
        "observacionInicial"
    ).value = "";

}


/* =========================================================
   MOSTRAR LISTA DE INCUBACIONES
========================================================= */

function mostrarLotes() {

    const contenedor =
        document.getElementById("listaLotes");


    if (!contenedor) {

        return;

    }


    if (lotes.length === 0) {

        contenedor.innerHTML = `

            <p class="vacio">

                Todavía no tienes incubaciones registradas.

            </p>

        `;

        return;

    }


    contenedor.innerHTML = "";


    lotes.forEach(function(lote) {

        const elemento =
            document.createElement("div");


        elemento.className = "lote";


        elemento.innerHTML = `

            <div>

                <h3>
                    🥚 ${lote.nombre}
                </h3>

                <p>

                    ${lote.especie}

                    ·

                    ${lote.huevosIngresados}
                    huevos

                    ·

                    ${formatearFecha(lote.fecha)}

                </p>

            </div>


            <div class="acciones-lote-lista">

                <button
                    class="btn-abrir"
                    onclick="abrirLote(${lote.id})">

                    Abrir

                </button>


                <button
                    class="btn-lista-excel"
                    onclick="exportarLote(${lote.id})">

                    📊 Excel

                </button>


                <button
                    class="btn-lista-eliminar"
                    onclick="eliminarLote(${lote.id})">

                    🗑️ Eliminar

                </button>

            </div>

        `;


        contenedor.appendChild(elemento);

    });

}


/* =========================================================
   ABRIR INCUBACIÓN
========================================================= */

function abrirLote(id) {

    loteActual =
        lotes.find(function(lote) {

            return lote.id === id;

        });


    if (!loteActual) {

        alert(
            "No se encontró la incubación."
        );

        return;

    }


    document.getElementById(
        "tituloLote"
    ).textContent =
        "🥚 " + loteActual.nombre;


    mostrarResumen();


    mostrarResultados();


    document.getElementById(
        "formularioEtapa"
    ).style.display = "none";


    mostrarPantalla("detalle");

}


/* =========================================================
   MOSTRAR RESUMEN DEL LOTE
========================================================= */

function mostrarResumen() {

    const resumen =
        document.getElementById(
            "resumenLote"
        );


    if (!resumen || !loteActual) {

        return;

    }


    resumen.innerHTML = `

        <div class="dato-resumen">

            <strong>
                Fecha de carga
            </strong>

            <span>
                ${formatearFecha(loteActual.fecha)}
            </span>

        </div>


        <div class="dato-resumen">

            <strong>
                Especie
            </strong>

            <span>
                ${loteActual.especie}
            </span>

        </div>


        <div class="dato-resumen">

            <strong>
                Incubadora
            </strong>

            <span>
                ${loteActual.incubadora}
            </span>

        </div>


        <div class="dato-resumen">

            <strong>
                Huevos ingresados
            </strong>

            <span>
                ${loteActual.huevosIngresados}
            </span>

        </div>

    `;

}


/* =========================================================
   MOSTRAR FORMULARIO DE ETAPA
========================================================= */

function mostrarFormularioEtapa(etapa) {

    const formulario =
        document.getElementById(
            "formularioEtapa"
        );


    formulario.style.display = "block";


    let contenido = "";


    /* =====================================================
       ETAPA 1 — DÍA 1
    ===================================================== */

    if (etapa === 1) {

        contenido = `

            <h2>
                🥚 Día 1 — Selección inicial
            </h2>


            <div class="campo">

                <label>
                    Huevos descartados inicialmente
                </label>

                <input
                    type="number"
                    id="descartadosIniciales"
                    min="0"
                    value="0"
                >

            </div>


            <div class="campo">

                <label>
                    Motivo principal del descarte
                </label>

                <select id="motivoDescarte">

                    <option value="">
                        Seleccionar
                    </option>

                    <option value="Sucios">
                        Sucios
                    </option>

                    <option value="Quebrados">
                        Quebrados
                    </option>

                    <option value="Deformes">
                        Deformes
                    </option>

                    <option value="Muy pequeños">
                        Muy pequeños
                    </option>

                    <option value="Otros">
                        Otros
                    </option>

                </select>

            </div>


            <hr>


            <h3>
                ⚖️ Control de peso y pérdida de humedad
            </h3>


            <p>
                Registra el peso inicial de referencia.
                INDEX utilizará este valor para calcular
                automáticamente la pérdida de peso esperada.
            </p>


            <div class="campo">

                <label>
                    Peso inicial de referencia (g)
                </label>

                <input
                    type="number"
                    id="pesoInicial"
                    min="0"
                    step="0.01"
                    placeholder="Ej: 60"
                >

            </div>


            <div class="referencia-peso">

                <strong>
                    🎯 Referencia Día 1
                </strong>

                <p>
                    100% del peso inicial
                </p>

                <p>
                    El peso registrado corresponde
                    al peso inicial de referencia.
                </p>

            </div>


            <div class="campo">

                <label>
                    Observaciones
                </label>

                <textarea
                    id="observacionEtapa1"
                ></textarea>

            </div>


            <div class="acciones">

                <button
                    class="btn-principal"
                    onclick="guardarEtapa(1)">

                    💾 Guardar etapa

                </button>

            </div>

        `;

    }


    /* =====================================================
       ETAPA 2 — DÍA 7–9
    ===================================================== */

    if (etapa === 2) {

        contenido = `

            <h2>
                🔦 Día 7–9 — Primera ovoscopia
            </h2>


            <div class="campo">

                <label>
                    Huevos fértiles / embrionados
                </label>

                <input
                    type="number"
                    id="fertiles"
                    min="0"
                    value="0"
                >

            </div>


            <div class="campo">

                <label>
                    Embriones muertos
                </label>

                <input
                    type="number"
                    id="muertosPrimera"
                    min="0"
                    value="0"
                >

            </div>


            <div class="campo">

                <label>
                    Huevos sin desarrollo
                </label>

                <input
                    type="number"
                    id="sinDesarrollo"
                    min="0"
                    value="0"
                >

            </div>


            <hr>


            <h3>
                ⚖️ Control de peso y pérdida de humedad
            </h3>


            <div class="referencia-peso">

                <strong>
                    🎯 Pérdida esperada
                </strong>

                <p>
                    6–7% del peso inicial
                </p>

                <p id="pesoIdealDia7">

                    Ingresa el peso inicial
                    en Día 1 para calcular
                    el peso ideal.

                </p>

            </div>


            <div class="campo">

                <label>
                    Peso real del huevo / muestra (g)
                </label>

                <input
                    type="number"
                    id="pesoDia7"
                    min="0"
                    step="0.01"
                    placeholder="Ej: 56"
                >

            </div>


            <div
                id="resultadoPesoDia7"
                class="resultado-peso"
            >

                Ingresa el peso para calcular
                la pérdida real.

            </div>


            <div class="campo">

                <label>
                    Observaciones
                </label>

                <textarea
                    id="observacionEtapa2"
                ></textarea>

            </div>


            <div class="acciones">

                <button
                    class="btn-principal"
                    onclick="guardarEtapa(2)">

                    💾 Guardar etapa

                </button>

            </div>

        `;

    }


    /* =====================================================
       ETAPA 3 — DÍA 18
    ===================================================== */

    if (etapa === 3) {

        contenido = `

            <h2>
                🔦 Día 18 — Segunda ovoscopia
            </h2>


            <div class="campo">

                <label>
                    Embriones vivos
                </label>

                <input
                    type="number"
                    id="vivosDia18"
                    min="0"
                    value="0"
                >

            </div>


            <div class="campo">

                <label>
                    Embriones muertos
                </label>

                <input
                    type="number"
                    id="muertosDia18"
                    min="0"
                    value="0"
                >

            </div>


            <hr>


            <h3>
                ⚖️ Control de peso y pérdida de humedad
            </h3>


            <div class="referencia-peso">

                <strong>
                    🎯 Pérdida esperada acumulada
                </strong>

                <p>
                    12% del peso inicial
                </p>

                <p id="pesoIdealDia18">

                    Ingresa el peso inicial
                    en Día 1 para calcular
                    el peso ideal.

                </p>

            </div>


            <div class="campo">

                <label>
                    Peso real del huevo / muestra (g)
                </label>

                <input
                    type="number"
                    id="pesoDia18"
                    min="0"
                    step="0.01"
                    placeholder="Ej: 52.8"
                >

            </div>


            <div
                id="resultadoPesoDia18"
                class="resultado-peso"
            >

                Ingresa el peso para calcular
                la pérdida real.

            </div>


            <div class="campo">

                <label>
                    Observaciones
                </label>

                <textarea
                    id="observacionEtapa3"
                ></textarea>

            </div>


            <div class="acciones">

                <button
                    class="btn-principal"
                    onclick="guardarEtapa(3)">

                    💾 Guardar etapa

                </button>

            </div>

        `;

    }


    /* =====================================================
       ETAPA 4 — NACIMIENTO
    ===================================================== */

    if (etapa === 4) {

        contenido = `

            <h2>
                🐣 Nacimiento — Resultado final
            </h2>


            <div class="campo">

                <label>
                    Pollitos nacidos vivos
                </label>

                <input
                    type="number"
                    id="nacidos"
                    min="0"
                    value="0"
                >

            </div>


            <div class="campo">

                <label>
                    Pollitos muertos al nacer
                </label>

                <input
                    type="number"
                    id="muertosNacimiento"
                    min="0"
                    value="0"
                >

            </div>


            <div class="campo">

                <label>
                    Huevos no eclosionados
                </label>

                <input
                    type="number"
                    id="noEclosionados"
                    min="0"
                    value="0"
                >

            </div>


            <div class="campo">

                <label>
                    Observaciones finales
                </label>

                <textarea
                    id="observacionEtapa4"
                ></textarea>

            </div>


            <div class="acciones">

                <button
                    class="btn-principal"
                    onclick="guardarEtapa(4)">

                    💾 Finalizar incubación

                </button>

            </div>

        `;

    }


    formulario.innerHTML =
        contenido;


    /* =====================================================
       ACTIVAR CÁLCULO AUTOMÁTICO
    ===================================================== */

    if (etapa === 2) {

        calcularPesoDia7EnPantalla();

    }


    if (etapa === 3) {

        calcularPesoDia18EnPantalla();

    }


    formulario.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================================
   OBTENER PESO INICIAL
========================================================= */

function obtenerPesoInicial() {

    if (!loteActual) {

        return null;

    }


    if (
        loteActual.etapas &&
        loteActual.etapas.etapa1 &&
        loteActual.etapas.etapa1.pesoInicial
    ) {

        return Number(
            loteActual.etapas.etapa1.pesoInicial
        );

    }


    return null;

}


/* =========================================================
   CALCULAR PÉRDIDA DE PESO
========================================================= */

function calcularPerdidaPeso(
    pesoInicial,
    pesoActual
) {

    if (
        !pesoInicial ||
        pesoInicial <= 0 ||
        pesoActual === null ||
        pesoActual === undefined ||
        pesoActual === ""
    ) {

        return null;

    }


    return (

        (
            (
                pesoInicial -
                Number(pesoActual)
            )
            /
            pesoInicial
        )
        *
        100

    );

}


/* =========================================================
   CALCULAR PESO IDEAL SEGÚN PORCENTAJE
========================================================= */

function calcularPesoIdeal(
    pesoInicial,
    porcentajePerdida
) {

    if (
        !pesoInicial ||
        pesoInicial <= 0
    ) {

        return null;

    }


    return (

        pesoInicial *
        (
            1 -
            (
                porcentajePerdida /
                100
            )
        )

    );

}


/* =========================================================
   DETERMINAR ESTADO DÍA 7–9
========================================================= */

function determinarEstadoDia7(
    perdidaReal
) {

    if (
        perdidaReal === null
    ) {

        return "Sin datos";

    }


    if (
        perdidaReal >= 6 &&
        perdidaReal <= 7
    ) {

        return "🟢 Dentro del rango esperado";

    }


    if (
        perdidaReal < 6
    ) {

        return "🟠 Pérdida inferior a la esperada";

    }


    return "🔴 Pérdida superior a la esperada";

}


/* =========================================================
   DETERMINAR ESTADO DÍA 18
========================================================= */

function determinarEstadoDia18(
    perdidaReal
) {

    if (
        perdidaReal === null
    ) {

        return "Sin datos";

    }


    /*
       Se utiliza un margen de ±1 punto porcentual
       alrededor del objetivo del 12%.
    */

    if (
        perdidaReal >= 11 &&
        perdidaReal <= 13
    ) {

        return "🟢 Dentro del rango esperado";

    }


    if (
        perdidaReal < 11
    ) {

        return "🟠 Pérdida inferior a la esperada";

    }


    return "🔴 Pérdida superior a la esperada";

}


/* =========================================================
   CALCULAR Y MOSTRAR DÍA 7–9
========================================================= */

function calcularPesoDia7EnPantalla() {

    const pesoInicial =
        obtenerPesoInicial();


    const referencia =
        document.getElementById(
            "pesoIdealDia7"
        );


    if (!referencia) {

        return;

    }


    if (!pesoInicial) {

        referencia.innerHTML = `

            ⚠️ Primero debes registrar
            el peso inicial en Día 1.

        `;

        return;

    }


    const pesoIdealMax =
        calcularPesoIdeal(
            pesoInicial,
            6
        );


    const pesoIdealMin =
        calcularPesoIdeal(
            pesoInicial,
            7
        );


    referencia.innerHTML = `

        🎯 Pérdida esperada:
        <strong>6–7%</strong>

        <br><br>

        ⚖️ Peso ideal esperado:

        <strong>
            ${pesoIdealMin.toFixed(2)}
            g
            –
            ${pesoIdealMax.toFixed(2)}
            g
        </strong>

    `;


    const input =
        document.getElementById(
            "pesoDia7"
        );


    if (input) {

        input.addEventListener(
            "input",
            actualizarResultadoDia7
        );

    }

}


/* =========================================================
   ACTUALIZAR RESULTADO DÍA 7–9
========================================================= */

function actualizarResultadoDia7() {

    const pesoInicial =
        obtenerPesoInicial();


    const pesoActual =
        document.getElementById(
            "pesoDia7"
        ).value;


    const resultado =
        document.getElementById(
            "resultadoPesoDia7"
        );


    if (
        !pesoInicial ||
        !pesoActual
    ) {

        resultado.innerHTML = `

            Ingresa el peso para calcular
            la pérdida real.

        `;

        return;

    }


    const perdida =
        calcularPerdidaPeso(
            pesoInicial,
            Number(pesoActual)
        );


    const estado =
        determinarEstadoDia7(
            perdida
        );


    resultado.innerHTML = `

        ⚖️ Peso inicial:
        <strong>
            ${pesoInicial.toFixed(2)} g
        </strong>

        <br>

        ⚖️ Peso actual:
        <strong>
            ${Number(pesoActual).toFixed(2)} g
        </strong>

        <br>

        📉 Pérdida real:
        <strong>
            ${perdida.toFixed(2)}%
        </strong>

        <br>

        🎯 Pérdida esperada:
        <strong>
            6–7%
        </strong>

        <br><br>

        <strong>
            ${estado}
        </strong>

    `;

}


/* =========================================================
   CALCULAR Y MOSTRAR DÍA 18
========================================================= */

function calcularPesoDia18EnPantalla() {

    const pesoInicial =
        obtenerPesoInicial();


    const referencia =
        document.getElementById(
            "pesoIdealDia18"
        );


    if (!referencia) {

        return;

    }


    if (!pesoInicial) {

        referencia.innerHTML = `

            ⚠️ Primero debes registrar
            el peso inicial en Día 1.

        `;

        return;

    }


    const pesoIdeal =
        calcularPesoIdeal(
            pesoInicial,
            12
        );


    referencia.innerHTML = `

        🎯 Pérdida esperada acumulada:
        <strong>12%</strong>

        <br><br>

        ⚖️ Peso ideal esperado:

        <strong>
            ${pesoIdeal.toFixed(2)} g
        </strong>

    `;


    const input =
        document.getElementById(
            "pesoDia18"
        );


    if (input) {

        input.addEventListener(
            "input",
            actualizarResultadoDia18
        );

    }

}


/* =========================================================
   ACTUALIZAR RESULTADO DÍA 18
========================================================= */

function actualizarResultadoDia18() {

    const pesoInicial =
        obtenerPesoInicial();


    const pesoActual =
        document.getElementById(
            "pesoDia18"
        ).value;


    const resultado =
        document.getElementById(
            "resultadoPesoDia18"
        );


    if (
        !pesoInicial ||
        !pesoActual
    ) {

        resultado.innerHTML = `

            Ingresa el peso para calcular
            la pérdida real.

        `;

        return;

    }


    const perdida =
        calcularPerdidaPeso(
            pesoInicial,
            Number(pesoActual)
        );


    const estado =
        determinarEstadoDia18(
            perdida
        );


    const pesoIdeal =
        calcularPesoIdeal(
            pesoInicial,
            12
        );


    resultado.innerHTML = `

        ⚖️ Peso inicial:
        <strong>
            ${pesoInicial.toFixed(2)} g
        </strong>

        <br>

        ⚖️ Peso actual:
        <strong>
            ${Number(pesoActual).toFixed(2)} g
        </strong>

        <br>

        📉 Pérdida real:
        <strong>
            ${perdida.toFixed(2)}%
        </strong>

        <br>

        🎯 Pérdida esperada:
        <strong>
            12%
        </strong>

        <br>

        ⚖️ Peso ideal esperado:
        <strong>
            ${pesoIdeal.toFixed(2)} g
        </strong>

        <br><br>

        <strong>
            ${estado}
        </strong>

    `;

}


/* =========================================================
   GUARDAR ETAPA
========================================================= */

function guardarEtapa(etapa) {

    if (!loteActual) {

        alert(
            "No hay una incubación seleccionada."
        );

        return;

    }


    let datos = {};


    /* =====================================================
       ETAPA 1
    ===================================================== */

    if (etapa === 1) {

        const pesoInicial =
            Number(
                document.getElementById(
                    "pesoInicial"
                ).value
            );


        datos = {

            descartados:

                Number(
                    document.getElementById(
                        "descartadosIniciales"
                    ).value
                ),


            motivo:

                document.getElementById(
                    "motivoDescarte"
                ).value,


            pesoInicial:

                pesoInicial > 0
                    ? pesoInicial
                    : null,


            porcentajePerdida:

                0,


            pesoIdeal:

                pesoInicial > 0
                    ? pesoInicial
                    : null,


            estadoPeso:

                pesoInicial > 0
                    ? "🟢 Peso inicial de referencia"
                    : "Sin datos",


            observaciones:

                document.getElementById(
                    "observacionEtapa1"
                ).value.trim()

        };

    }


    /* =====================================================
       ETAPA 2
    ===================================================== */

    if (etapa === 2) {

        const pesoInicial =
            obtenerPesoInicial();


        const pesoActual =
            Number(
                document.getElementById(
                    "pesoDia7"
                ).value
            );


        let perdida = null;

        let estado = "Sin datos";


        if (
            pesoInicial &&
            pesoActual > 0
        ) {

            perdida =
                calcularPerdidaPeso(
                    pesoInicial,
                    pesoActual
                );


            estado =
                determinarEstadoDia7(
                    perdida
                );

        }


        datos = {

            fertiles:

                Number(
                    document.getElementById(
                        "fertiles"
                    ).value
                ),


            muertos:

                Number(
                    document.getElementById(
                        "muertosPrimera"
                    ).value
                ),


            sinDesarrollo:

                Number(
                    document.getElementById(
                        "sinDesarrollo"
                    ).value
                ),


            pesoActual:

                pesoActual > 0
                    ? pesoActual
                    : null,


            perdidaPeso:

                perdida,


            perdidaEsperada:

                "6–7%",


            pesoIdealMin:

                pesoInicial
                    ? calcularPesoIdeal(
                        pesoInicial,
                        7
                    )
                    : null,


            pesoIdealMax:

                pesoInicial
                    ? calcularPesoIdeal(
                        pesoInicial,
                        6
                    )
                    : null,


            estadoPeso:

                estado,


            observaciones:

                document.getElementById(
                    "observacionEtapa2"
                ).value.trim()

        };

    }


    /* =====================================================
       ETAPA 3
    ===================================================== */

    if (etapa === 3) {

        const pesoInicial =
            obtenerPesoInicial();


        const pesoActual =
            Number(
                document.getElementById(
                    "pesoDia18"
                ).value
            );


        let perdida = null;

        let estado = "Sin datos";


        if (
            pesoInicial &&
            pesoActual > 0
        ) {

            perdida =
                calcularPerdidaPeso(
                    pesoInicial,
                    pesoActual
                );


            estado =
                determinarEstadoDia18(
                    perdida
                );

        }


        datos = {

            vivos:

                Number(
                    document.getElementById(
                        "vivosDia18"
                    ).value
                ),


            muertos:

                Number(
                    document.getElementById(
                        "muertosDia18"
                    ).value
                ),


            pesoActual:

                pesoActual > 0
                    ? pesoActual
                    : null,


            perdidaPeso:

                perdida,


            perdidaEsperada:

                "12%",


            pesoIdeal:

                pesoInicial
                    ? calcularPesoIdeal(
                        pesoInicial,
                        12
                    )
                    : null,


            estadoPeso:

                estado,


            observaciones:

                document.getElementById(
                    "observacionEtapa3"
                ).value.trim()

        };

    }


    /* =====================================================
       ETAPA 4
    ===================================================== */

    if (etapa === 4) {

        datos = {

            nacidos:

                Number(
                    document.getElementById(
                        "nacidos"
                    ).value
                ),


            muertos:

                Number(
                    document.getElementById(
                        "muertosNacimiento"
                    ).value
                ),


            noEclosionados:

                Number(
                    document.getElementById(
                        "noEclosionados"
                    ).value
                ),


            observaciones:

                document.getElementById(
                    "observacionEtapa4"
                ).value.trim()

        };

    }


    datos.fechaRegistro =
        new Date().toISOString();


    loteActual.etapas[
        "etapa" + etapa
    ] = datos;


    const indice =
        lotes.findIndex(function(lote) {

            return lote.id === loteActual.id;

        });


    if (indice !== -1) {

        lotes[indice] =
            loteActual;

    }


    guardarDatos();


    mostrarResultados();


    document.getElementById(
        "formularioEtapa"
    ).style.display = "none";


    alert(

        "✅ Etapa " +
        etapa +
        " guardada correctamente."

    );

}


/* =========================================================
   MOSTRAR RESULTADOS
========================================================= */

function mostrarResultados() {

    if (!loteActual) {

        return;

    }


    const resultados =
        document.getElementById(
            "resultados"
        );


    const etapa1 =
        loteActual.etapas.etapa1;


    const etapa2 =
        loteActual.etapas.etapa2;


    const etapa3 =
        loteActual.etapas.etapa3;


    const etapa4 =
        loteActual.etapas.etapa4;


    let html = "";


    /* =====================================================
       DÍA 1
    ===================================================== */

    if (etapa1) {

        html += `

            <div class="resultado">

                <strong>
                    ⚖️ Peso inicial
                </strong>

                <span>

                    ${
                        etapa1.pesoInicial !== null
                        ? etapa1.pesoInicial + " g"
                        : "No registrado"
                    }

                </span>

            </div>


            <div class="resultado">

                <strong>
                    🎯 Referencia Día 1
                </strong>

                <span>
                    100%
                </span>

            </div>

        `;

    }


    /* =====================================================
       DÍA 7–9
    ===================================================== */

    if (etapa2) {

        html += `

            <div class="resultado">

                <strong>
                    ⚖️ Peso Día 7–9
                </strong>

                <span>

                    ${
                        etapa2.pesoActual !== null
                        ? etapa2.pesoActual + " g"
                        : "No registrado"
                    }

                </span>

            </div>


            <div class="resultado">

                <strong>
                    📉 Pérdida real
                </strong>

                <span>

                    ${
                        etapa2.perdidaPeso !== null
                        ? etapa2.perdidaPeso.toFixed(2) + "%"
                        : "No calculada"
                    }

                </span>

            </div>


            <div class="resultado">

                <strong>
                    🎯 Pérdida esperada
                </strong>

                <span>
                    6–7%
                </span>

            </div>


            <div class="resultado">

                <strong>
                    ⚖️ Peso ideal esperado
                </strong>

                <span>

                    ${
                        etapa2.pesoIdealMin !== null
                        ?
                        etapa2.pesoIdealMin.toFixed(2)
                        +
                        "–"
                        +
                        etapa2.pesoIdealMax.toFixed(2)
                        +
                        " g"
                        :
                        "No calculado"
                    }

                </span>

            </div>


            <div class="resultado">

                <strong>
                    Estado
                </strong>

                <span>

                    ${etapa2.estadoPeso}

                </span>

            </div>

        `;

    }


    /* =====================================================
       DÍA 18
    ===================================================== */

    if (etapa3) {

        html += `

            <div class="resultado">

                <strong>
                    ⚖️ Peso Día 18
                </strong>

                <span>

                    ${
                        etapa3.pesoActual !== null
                        ? etapa3.pesoActual + " g"
                        : "No registrado"
                    }

                </span>

            </div>


            <div class="resultado">

                <strong>
                    📉 Pérdida real acumulada
                </strong>

                <span>

                    ${
                        etapa3.perdidaPeso !== null
                        ? etapa3.perdidaPeso.toFixed(2) + "%"
                        : "No calculada"
                    }

                </span>

            </div>


            <div class="resultado">

                <strong>
                    🎯 Pérdida esperada
                </strong>

                <span>
                    12%
                </span>

            </div>


            <div class="resultado">

                <strong>
                    ⚖️ Peso ideal esperado
                </strong>

                <span>

                    ${
                        etapa3.pesoIdeal !== null
                        ? etapa3.pesoIdeal.toFixed(2) + " g"
                        : "No calculado"
                    }

                </span>

            </div>


            <div class="resultado">

                <strong>
                    Estado
                </strong>

                <span>

                    ${etapa3.estadoPeso}

                </span>

            </div>

        `;

    }


    /* =====================================================
       NACIMIENTO
    ===================================================== */

    if (etapa4) {

        html += `

            <div class="resultado">

                <strong>
                    🐣 Pollitos nacidos
                </strong>

                <span>
                    ${etapa4.nacidos}
                </span>

            </div>


            <div class="resultado">

                <strong>
                    Pollitos muertos al nacer
                </strong>

                <span>
                    ${etapa4.muertos}
                </span>

            </div>


            <div class="resultado">

                <strong>
                    Huevos no eclosionados
                </strong>

                <span>
                    ${etapa4.noEclosionados}
                </span>

            </div>

        `;

    }


    if (!html) {

        resultados.innerHTML = `

            <p>

                Registra las etapas para ver
                los resultados.

            </p>

        `;

        return;

    }


    resultados.innerHTML = `

        <div class="resultado-grid">

            ${html}

        </div>

    `;

}


/* =========================================================
   ELIMINAR INCUBACIÓN
========================================================= */

function eliminarLote(id) {

    const lote =
        lotes.find(function(item) {

            return item.id === id;

        });


    if (!lote) {

        return;

    }


    const confirmar =
        confirm(

            "⚠️ ¿Estás seguro de eliminar la incubación '" +

            lote.nombre +

            "'?\n\n" +

            "Se eliminarán todos los registros asociados " +

            "a esta incubación.\n\n" +

            "Esta acción no se puede deshacer."

        );


    if (!confirmar) {

        return;

    }


    lotes =
        lotes.filter(function(item) {

            return item.id !== id;

        });


    guardarDatos();


    if (
        loteActual &&
        loteActual.id === id
    ) {

        loteActual = null;

    }


    mostrarLotes();


    mostrarPantalla(
        "inicio"
    );


    alert(
        "🗑️ La incubación fue eliminada correctamente."
    );

}


/* =========================================================
   ELIMINAR INCUBACIÓN ACTUAL
========================================================= */

function eliminarLoteActual() {

    if (!loteActual) {

        return;

    }


    eliminarLote(
        loteActual.id
    );

}


/* =========================================================
   EXPORTAR INCUBACIÓN ACTUAL
========================================================= */

function exportarLoteActual() {

    if (!loteActual) {

        alert(
            "No hay una incubación seleccionada."
        );

        return;

    }


    exportarLote(
        loteActual.id
    );

}


/* =========================================================
   EXPORTAR A EXCEL
========================================================= */

function exportarLote(id) {

    const lote =
        lotes.find(function(item) {

            return item.id === id;

        });


    if (!lote) {

        alert(
            "No se encontró la incubación."
        );

        return;

    }


    if (typeof XLSX === "undefined") {

        alert(

            "No se pudo cargar la herramienta de Excel. " +

            "Comprueba que tienes conexión a Internet " +

            "y vuelve a cargar INDEX."

        );

        return;

    }


    const datosGenerales = [

        [
            "INCUBA ELECTRO TRACE"
        ],

        [
            "Reporte de trazabilidad de incubación"
        ],

        [],

        [
            "Campo",
            "Información"
        ],

        [
            "Nombre del lote",
            lote.nombre
        ],

        [
            "Fecha de carga",
            lote.fecha
        ],

        [
            "Especie",
            lote.especie
        ],

        [
            "Incubadora",
            lote.incubadora
        ],

        [
            "Huevos ingresados",
            lote.huevosIngresados
        ],

        [
            "Observaciones iniciales",
            lote.observacionesIniciales || ""
        ]

    ];


    const datosEtapas = [

        [
            "Etapa",
            "Dato",
            "Valor"
        ]

    ];


    const etapa1 =
        lote.etapas.etapa1;


    const etapa2 =
        lote.etapas.etapa2;


    const etapa3 =
        lote.etapas.etapa3;


    const etapa4 =
        lote.etapas.etapa4;


    /* =====================================================
       DÍA 1
    ===================================================== */

    if (etapa1) {

        datosEtapas.push(

            [
                "Día 1",
                "Huevos descartados",
                etapa1.descartados
            ],

            [
                "Día 1",
                "Motivo descarte",
                etapa1.motivo
            ],

            [
                "Día 1",
                "Peso inicial",
                etapa1.pesoInicial !== null
                    ? etapa1.pesoInicial + " g"
                    : ""
            ],

            [
                "Día 1",
                "Pérdida esperada",
                "0%"
            ],

            [
                "Día 1",
                "Peso ideal",
                etapa1.pesoIdeal !== null
                    ? etapa1.pesoIdeal + " g"
                    : ""
            ],

            [
                "Día 1",
                "Estado",
                etapa1.estadoPeso
            ],

            [
                "Día 1",
                "Observaciones",
                etapa1.observaciones
            ]

        );

    }


    /* =====================================================
       DÍA 7–9
    ===================================================== */

    if (etapa2) {

        datosEtapas.push(

            [
                "Día 7–9",
                "Fértiles / embrionados",
                etapa2.fertiles
            ],

            [
                "Día 7–9",
                "Muertes tempranas",
                etapa2.muertos
            ],

            [
                "Día 7–9",
                "Sin desarrollo",
                etapa2.sinDesarrollo
            ],

            [
                "Día 7–9",
                "Peso real",
                etapa2.pesoActual !== null
                    ? etapa2.pesoActual + " g"
                    : ""
            ],

            [
                "Día 7–9",
                "Pérdida real",
                etapa2.perdidaPeso !== null
                    ? etapa2.perdidaPeso.toFixed(2) + "%"
                    : ""
            ],

            [
                "Día 7–9",
                "Pérdida esperada",
                "6–7%"
            ],

            [
                "Día 7–9",
                "Peso ideal esperado",
                etapa2.pesoIdealMin !== null
                    ?
                    etapa2.pesoIdealMin.toFixed(2)
                    +
                    "–"
                    +
                    etapa2.pesoIdealMax.toFixed(2)
                    +
                    " g"
                    :
                    ""
            ],

            [
                "Día 7–9",
                "Estado",
                etapa2.estadoPeso
            ],

            [
                "Día 7–9",
                "Observaciones",
                etapa2.observaciones
            ]

        );

    }


    /* =====================================================
       DÍA 18
    ===================================================== */

    if (etapa3) {

        datosEtapas.push(

            [
                "Día 18",
                "Embriones vivos",
                etapa3.vivos
            ],

            [
                "Día 18",
                "Muertes",
                etapa3.muertos
            ],

            [
                "Día 18",
                "Peso real",
                etapa3.pesoActual !== null
                    ? etapa3.pesoActual + " g"
                    : ""
            ],

            [
                "Día 18",
                "Pérdida real acumulada",
                etapa3.perdidaPeso !== null
                    ? etapa3.perdidaPeso.toFixed(2) + "%"
                    : ""
            ],

            [
                "Día 18",
                "Pérdida esperada",
                "12%"
            ],

            [
                "Día 18",
                "Peso ideal esperado",
                etapa3.pesoIdeal !== null
                    ?
                    etapa3.pesoIdeal.toFixed(2)
                    +
                    " g"
                    :
                    ""
            ],

            [
                "Día 18",
                "Estado",
                etapa3.estadoPeso
            ],

            [
                "Día 18",
                "Observaciones",
                etapa3.observaciones
            ]

        );

    }


    /* =====================================================
       NACIMIENTO
    ===================================================== */

    if (etapa4) {

        datosEtapas.push(

            [
                "Nacimiento",
                "Pollitos nacidos vivos",
                etapa4.nacidos
            ],

            [
                "Nacimiento",
                "Pollitos muertos",
                etapa4.muertos
            ],

            [
                "Nacimiento",
                "Huevos no eclosionados",
                etapa4.noEclosionados
            ],

            [
                "Nacimiento",
                "Observaciones",
                etapa4.observaciones
            ]

        );

    }


    /* =====================================================
       CREAR ARCHIVO EXCEL
    ===================================================== */

    const libro =
        XLSX.utils.book_new();


    const hojaGeneral =
        XLSX.utils.aoa_to_sheet(
            datosGenerales
        );


    XLSX.utils.book_append_sheet(

        libro,

        hojaGeneral,

        "Datos generales"

    );


    const hojaEtapas =
        XLSX.utils.aoa_to_sheet(
            datosEtapas
        );


    XLSX.utils.book_append_sheet(

        libro,

        hojaEtapas,

        "Trazabilidad"

    );


    const nombreArchivo =

        "INDEX_" +

        limpiarNombreArchivo(
            lote.nombre
        ) +

        "_" +

        lote.fecha +

        ".xlsx";


    XLSX.writeFile(

        libro,

        nombreArchivo

    );

}


/* =========================================================
   LIMPIAR NOMBRE DEL ARCHIVO
========================================================= */

function limpiarNombreArchivo(nombre) {

    return nombre

        .replace(
            /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]/g,
            "_"
        )

        .replace(
            /_+/g,
            "_"
        );

}


/* =========================================================
   FORMATEAR FECHA
========================================================= */

function formatearFecha(fecha) {

    if (!fecha) {

        return "";

    }


    const partes =
        fecha.split("-");


    if (
        partes.length !== 3
    ) {

        return fecha;

    }


    return (

        partes[2] +

        "/" +

        partes[1] +

        "/" +

        partes[0]

    );

}


/* =========================================================
   INICIAR APLICACIÓN
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    function() {

        mostrarLotes();

    }

);