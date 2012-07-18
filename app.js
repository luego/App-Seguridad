/**
 * Module dependencies.
 */
var express  = require('express');
var routes   = require('./routes');
var http     = require('http');
var mongoose = require('mongoose');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

//DataBase
//mongoose.connect('mongodb://localhost/seguridad_database');
mongoose.connect('mongodb://nodejitsu:026f16b0d08e6067a4d18d098b6945e3@flame.mongohq.com:27062/nodejitsudb23221494153');

//Schemas
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Cliente = new Schema({  
    nombre_empresa : { type: String, required: true },  
    ciudad         : { type: String },  
    usuario        : { type: String, unique: true },
    clave          : { type: String, unique: true },
    contacto       : { type: String }
});

var Conductor = new Schema({  
    nombre           : { type: String },
    apellido         : { type: String },
    cedula           : { type: Number },
    lugar_nacimiento : { type: String },
    fecha_nacimiento : { type: String },
    telefono         : { type: String },
    direccion        : { type: String }
});

var Escolta = new Schema({  
    nombre           : { type: String},
    apellido         : { type: String},
    cedula           : { type: String},
    lugar_nacimiento : { type: String},
    fecha_nacimiento : { type: String},
    telefono         : { type: Number},
    direccion        : { type: String},
    usuario          : { type: String},
    clave            : { type: String},
    tipo             : { type: Number}
});


var Mula = new Schema({ 
    id_conductor : { type: ObjectId, ref: 'Conductor' },
    placa        : { type : String},
    descripcion  : { type : String}
});

var Viaje = new Schema({
    id_escolta   : { type: ObjectId, ref: 'Escolta' },
    id_mula      : { type: ObjectId, ref: 'Mula' },
    ruta         : { type : String},
    fecha        : { type : String},
    hora_salida  : { type : String},
    hora_llegada : { type : String},
    estado       : { type : String}
});

var RegistroViajes = new Schema({  
    id_viaje           : { type: ObjectId, ref: 'Viaje' },
    id_escolta         : { type: ObjectId, ref: 'Escolta' },
    rutaFoto           : { type : String},
    fecha              : { type : String},
    hora               : { type : String},
    latitude           : { type : String},
    longitude          : { type : String},
    altitude           : { type : String}
});

//Models
var ClienteModel        = mongoose.model('Cliente', Cliente);
var ConductorModel      = mongoose.model('Conductor', Conductor);
var EscoltaModel        = mongoose.model('Escolta', Escolta);
var MulaModel           = mongoose.model('Mula', Mula);
var ViajeModel          = mongoose.model('Viaje', Viaje);
var RegistroViajesModel = mongoose.model('RegistroViajes', RegistroViajes);

//Routes
app.get('/', routes.index);

app.get('/api/clientes',function (req, res){
    return ClienteModel.find(function (err, clientes) {
        if (!err) {
            console.log(clientes);
            return res.send({success : true, data : clientes});
        } else {
            return console.log(err);
        }
    });
});

app.post('/api/clientes',function (req, res){
    var cliente;
    console.log("POST: ");
    console.log(req.body);

    cliente = new ClienteModel({
        nombre_empresa : req.body.nombre_empresa,
        ciudad         : req.body.ciudad,
        usuario        : req.body.usuario,
        clave          : req.body.clave,
        contacto       : req.body.contacto
    });
    var isError;
    cliente.save(function (err,p) {
        if (!err) {
            isError = false;
            console.log('created');
        } else {
            isError = true;
            return console.log(err);
        }
    });
    return res.send({ success: isError, data: cliente });
});


app.get('/api/clientes/:id', function (req, res){
    return ClienteModel.findById(req.params.id, function (err, cliente) {
        if (!err) {
            return res.send(cliente);
        } else {
            return console.log(err);
        }
    });
});


app.put('/api/clientes', function (req, res){
    return ClienteModel.findById(req.body._id, function (err, cliente) {
        
        cliente.nombre_empresa = req.body.nombre_empresa;
        cliente.ciudad         = req.body.ciudad;
        cliente.usuario        = req.body.usuario;
        cliente.clave          = req.body.clave;
        cliente.contacto       = req.body.contacto;

        return cliente.save(function (err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            return res.send({ success: !err, data: cliente });
        });
    });
});

app.delete('/api/clientes', function (req, res){
    return ClienteModel.findById(req.body._id, function (err, cliente) {
        return cliente.remove(function (err) {
            if (!err) {
                console.log("removed");
                return res.send('');
            } else {
                console.log(err);
            }
        });
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
