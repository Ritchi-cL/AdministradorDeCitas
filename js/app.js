// Selectores

const pacienteInput = document.querySelector("#paciente");
const propietarioInput = document.querySelector("#propietario");
const emailInput = document.querySelector("#email");
const fechaInput = document.querySelector("#fecha");
const sintomasInput = document.querySelector("#sintomas");

const formulario = document.querySelector("#formulario-cita");
const formularioInput = document.querySelector("#formulario-cita input[type='submit']");
const contenedorCitas = document.querySelector("#citas");

// Objeto de cita

const citaObj = {
    id: generarId(),
    paciente: "",
    propietario: "",
    email: "",
    fecha: "",
    sintomas: ""
}

pacienteInput.addEventListener("change", datosDeCita);
propietarioInput.addEventListener("change", datosDeCita);
emailInput.addEventListener("change", datosDeCita);
fechaInput.addEventListener("change", datosDeCita);
sintomasInput.addEventListener("change", datosDeCita);

formulario.addEventListener("submit", submitDeCita);

let editando = false;


// Clases

class Notificacion {

    // Constructor de la clase, al momento de instanciar el objeto debo entregarle 02 parámetros
    constructor ({texto, tipo}){
        this.texto = texto,
        this.tipo = tipo,
        this.mostrarAlerta();
    }

    // Método para mostrar la alerta

    mostrarAlerta() {

        // Crear la notificación en un div
        const alerta = document.createElement("div");
        alerta.classList.add("text-center", "w-full", "p-3", "text-white", "my-5", "alert",
        "uppercase", "font-bold", "text-sm");

        /*
            Eliminar alertas duplicadas
            ? = encadenamiento opcional
            Con el encadenamiento opcional evaluamos "si existe"
        */ 
        const alertaPrevia = document.querySelector(".alert");
        alertaPrevia?.remove();

        /*
            Evaluar si el tipo es de "error" (similar a un if), si es un "error" entonces se le agrega una clase
            Para visualizar el error, en caso contrario, si no es del tipo "error" se le agrega una clase de tipo "éxito"
        */
        this.tipo === "error" ? alerta.classList.add("bg-red-500") : alerta.classList.add("bg-green-500");

        // Agregar el mensaje de error al div
        alerta.textContent = this.texto;

        /*
            Insertar en el DOM
            Se toma de referencia al "formulario-cita"
            Luego con parentElement se va al elemento padre que es el div

            Con insertBefore se inserta "alerta" antes del "formulario"
        */
        formulario.parentElement.insertBefore(alerta, formulario);

        // Quitar alerta después de 05 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    
    }
}

class AdminCitas {

    constructor() {
        this.citas = []
        console.log(this.citas);
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
        this.mostrarCitas();
    }

    editar(citaActualizada) {
        // Se genera un arreglo nuevo que se le asigna a "this.citas"
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
        this.mostrarCitas();
    }

    eliminar(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
        this.mostrarCitas();
    }

    mostrarCitas() {

        // Limpiar el HTML
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);   
        }

        // Evaluar si existen citas
        if (this.citas.length === 0) {
            contenedorCitas.innerHTML = "<p class='text-xl mt-5 mb-10 text-center'>No hay Pacientes registrados</p>";
            return;
        }

        // Generar las citas
        this.citas.forEach(cita => {
            const divCita = document.createElement('div');
            divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10' ,'rounded-xl', 'p-3');

            const paciente = document.createElement('p');
            paciente.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;

            const propietario = document.createElement('p');
            propietario.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;

            const email = document.createElement('p');
            email.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;

            const fecha = document.createElement('p');
            fecha.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;

            const sintomas = document.createElement('p');
            sintomas.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;

            // Botones para eliminar y editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEditar.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            btnEditar.onclick = () => cargarEdicion(cita);

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            btnEliminar.onclick = () => this.eliminar(cita.id);

            const contenedorBotones = document.createElement("div");
            contenedorBotones.classList.add("flex", "justify-between", "mt-10");
            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);

            // Agregar al HTML
            divCita.appendChild(paciente);
            divCita.appendChild(propietario);
            divCita.appendChild(email);
            divCita.appendChild(fecha);
            divCita.appendChild(sintomas);
            divCita.appendChild(contenedorBotones);
            contenedorCitas.appendChild(divCita);
        });
    }

}

/*
    Función para inyectarle al objeto el valor de los nombres de las etiquetas HTML.
    Funciona solo si el objeto tiene el mismo nombre de las etiquetas HTML.
*/
function datosDeCita(event) {
    citaObj[event.target.name] = event.target.value;
}

// Se crea una instancia de AdminCitas
const citas = new AdminCitas();

function submitDeCita(event) {
    event.preventDefault();

    /*
        1° Forma para validar cada uno de los campos ingresados
        
        const {paciente, propietario, email, fecha, sintomas} = citaObj;

        if (paciente.trim() === "" || propietario.trim() === "" || email.trim() === "" || fecha.trim() === "" || sintomas.trim() === "") {
            console.log("Alguno de los campos está vacío");
            return;
        }
    */

    /*
        2° Forma para validar cada uno de los campos ingresados
    */

    if (Object.values(citaObj).some(valor => valor.trim() === "")) {

        new Notificacion({
            texto: "Todos los campos son obligatorio",
            tipo: "error"
        });
        return;
    }

    if (editando) {
        citas.editar({...citaObj});
        new Notificacion({
            texto: "Guardado correctamente",
            tipo: "exito"
        });
    } else {
        citas.agregarCita({...citaObj});
        new Notificacion({
            texto: "Paciente registrado",
            tipo: "exito"
        });
    }

    formulario.reset();
    reiniciarObjetoCitas();
    formularioInput.value = "Registrar Paciente";
    editando = false;
}

function reiniciarObjetoCitas() {

    /*
        Forma clásica de reiniciar el objeto
        citaObj.id = generarId();
        citaObj.paciente = "";
        citaObj.propietario = "";
        citaObj.email = "";
        citaObj.fecha = "";
        citaObj.sintomas = "";
    */

    // Reiniciar el objeto
    Object.assign(citaObj, {
        id: generarId(),
        paciente: "",
        propietario: "",
        email: "",
        fecha: "",
        sintomas: ""
    });
    
}

function generarId() {
    return Math.random().toString(36).substring(2) + Date.now();
}

function cargarEdicion(cita) {
    Object.assign(citaObj, cita);

    pacienteInput.value = cita.paciente;
    propietarioInput.value = cita.propietario;
    emailInput.value = cita.email;
    fechaInput.value = cita.fecha;
    sintomasInput.value = cita.sintomas;

    editando = true;

    formularioInput.value = "Guardar cambios";
}