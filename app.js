var express = require('express');
var mysql = require('mysql');
var cors = require('cors');

//Constructor de express para acceder a todos los metodos
var app = express();

//UTILIZAR JSON EN LA APP
app.use(express.json());

//UTILIZAR CORS
app.use(cors());

//MYSQL parametros de conexion
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'articulosdb'
})

//Probamos la conexion
connection.connect(function(error){
    if(error){
        throw error;
    }

    else {
        console.log("Conexion exitosa a la base de datos!");
    }

})


//Rutas
app.get('/', function(req, res){
    res.send('Ruta INICIO');
})

//Mostrar todos los articulos
app.get('/api/articulos', (req,res)=>{
    connection.query('SELECT * FROM articulos', (error, filas)=>{
        if(error){
            throw error;
        }

        else{
            //envia la repuesta FILAS
            res.send(filas);
        }
    })


});

//Mostrar un articulo (por id)
app.get('/api/articulos/:id', (req,res)=>{
    connection.query('SELECT * FROM articulos WHERE id=?',[req.params.id], (error, fila)=>{
        if(error){
            throw error;
        }

        else{
            //envia la repuesta FILA
            res.send(fila);

           //Traer resultado especifico
            //res.send(fila[0].descripcion);
        }
    })

});

//CREAR ARTICULOS
app.post('/api/articulos',(req,res)=>{
    
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
    //console.log(data.descripcion);
    
    //Validar si existe valor en la BD.
    let validarArticulo = data.descripcion;

    let consulta = "SELECT descripcion FROM articulos WHERE descripcion=" +validarArticulo;
    //console.log("esta es la consulta de validacion:" + consulta);



    let sql= "INSERT INTO articulos SET ?";
    
    connection.query(sql, data, function(error,results){

        if(error){
            throw error;
        }

        else{
          
            res.send(results);
            console.log('Articulo guardado');
           
        }

    });
})
//EDITAR ARTICULO
app.put('/api/articulos/:id', (req,res)=>{

    let id= req.params.id;
    let descripcion= req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;

    let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";

    //Colocar ID al final del arreglo
    connection.query(sql,[descripcion,precio,stock,id],function(error,results){

        if(error){
            throw error;
        }

        else{
          
            res.send(results);
           
        }
    })

});

//ELIMINAR ARTICULO (id)
app.delete('/api/articulos/:id',(req, res)=>{
    connection.query("DELETE FROM articulos WHERE id =?", [req.params.id],function(error, filas){

        if(error){
            throw error;
        }

        else{
          
            res.send(filas);
            console.log('Articulo eliminado');
           
        }
    })
});

//PUERTO 7000 (Variable de entorno)
const puerto = process.env.PUERTO || 3000;

app.listen(puerto, function(){
    console.log("Server running on port:" +puerto);
});




