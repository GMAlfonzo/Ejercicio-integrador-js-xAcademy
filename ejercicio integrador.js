/*​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
​
*/


// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock ?? 10; // Si no me definen stock, pongo 10 por default
    }       
}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        
        try {
        // Busco el producto en la "base de datos"
        const producto = await findProductBySku(sku);
        if(cantidad === undefined || cantidad <= 0){
            console.log(`Verifique si la cantidad de ${producto.nombre} es correcta.`);    
        }
        else{
            console.log("Producto encontrado", producto);
        }

        // Verificar si el producto ya está en el carrito
        const productoEnCarrito = this.productos.find(p => p.sku === sku);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            // Crear un producto nuevo
            const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
            this.productos.push(nuevoProducto);
            console.log(`Agregando ${cantidad} ${sku}`);
        }
        // Actualizar el precio total del carrito
        this.precioTotal = this.precioTotal + (producto.precio * cantidad);

        // Agregar la categoría si no se encuentra en la lista
        if (!this.categorias.includes(producto.categoria)) {
            this.categorias.push(producto.categoria);
        }

        } catch (error) {
            console.log(error)
        }
    }

    //Creamos la funcion para eliminar un producto.
    eliminarProducto(sku, cantidad){
        
        return new Promise((resolve, reject) => {
            setTimeout(()=> {
                //Verifica si el producto existe, elimina la cantidad y actualiza el monto total.
                let productoExiste = this.productos.find(producto => producto.sku === sku)
                if (productoExiste) {
                    if (productoExiste.cantidad > cantidad) {
                        productoExiste.cantidad -= cantidad;
                        this.precioTotal -= (productoExiste.precio * cantidad);              
                        resolve(`Se ha eliminado la cantidad de ${cantidad} ${sku} con exito.`)
                } else if (productoExiste.cantidad <= cantidad) { //Elimina el producto del carrito y actualiza el monto total.
                        let productoCategoria = this.productos.filter(producto => producto.categoria === productoExiste.categoria);
                    if(productoCategoria.length === 1){
                        let indexCategoria = this.categorias.indexOf(productoExiste.categoria);
                        this.categorias.splice(indexCategoria, 1);
                }              
                let indexProducto = this.productos.indexOf(productoExiste);
                this.productos.splice(indexProducto, 1);               
                let precioTotal = this.precioTotal - (productoExiste.precio * cantidad);
                this.precioTotal = (precioTotal < 0) ? 0 : precioTotal;
                resolve(`Se ha eliminado  el producto ${sku} del carrito correctamente.`)
            }
        } else {
            reject(`El producto con el sku: ${sku} no existe en el carrito`);
        }
            }, 1500);          
        });  
    }   
}    

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Producto ${sku} no valido`);
            }
        }, 1500);
    });
}
console.log(productosDelSuper);
const carrito = new Carrito();
carrito.agregarProducto('XX92LKI', 4);
carrito.agregarProducto('FN312PPE', 8);
carrito.agregarProducto('FN312PPR', 4);
console.log(`Productos en el carrito:`);
console.log(carrito.productos);
carrito.eliminarProducto('FN312PPE', 8)
.then(msg => console.log(msg))
.catch(err => console.log(err));
carrito.eliminarProducto('FN312PPr', 8)
.then(msg => console.log(msg))
.catch(err => console.log(err));
carrito.eliminarProducto('XX92LKI', 2)
.then(msg => console.log(msg))
.catch(err => console.log(err));


