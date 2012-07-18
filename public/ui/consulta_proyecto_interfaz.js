app.consulta_proyecto = {};

Ext.getCmp('panel_izquierda').collapse(Ext.Component.DIRECTION_LEFT,true);

app.consulta_proyecto.nombre_campos = {

};

app.consulta_proyecto.store_cargar_combo = function (url, fields, root, options) {
    this.url = url || 'Fussion.svc/ObtenerMercados';
    this.options = options || {};
    this.fields = fields;
    this.root = root;
    this.store = new Ext.data.JsonStore({
        url: this.url,
        root: root,
        idProperty: 'Codigo',
        fields: this.fields,
        listeners: {
            exception: function (proxy, type, action, options, response, arg) {
                alert(proxy + " - " + type + " - " + action + " - " + options + " - " + response + " - " + arg);
            }
        }
    });

    this.init = function (emergente) {
        var emergen = emergente || false;
        var store = this.store;
        var root2 = this.root;
        var urlServicio = this.url;
        if (emergen) {
            var myMask = new Ext.LoadMask(Ext.getBody(), { msg: "Cargando recursos..." });
            myMask.show();
        }

        Ext.Ajax.request({
            url: urlServicio,
            method: 'POST',
            timeout:90000,
            params: Ext.encode(this.options),
            headers: { "Content-Type": "application/json" },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                //valido para que funcione en ie :(
                if (data != null) {
                    if(data.ObtenerlistaClientesResult){
                       if (data.ObtenerlistaClientesResult.datos != null) {
                            store.loadData(data.ObtenerlistaClientesResult.datos );
                            store.fireEvent("load");
                        }else{
                           store.loadData(data[root2]);
                            store.fireEvent("load"); 
                        } 
                    }
                    
                }
                if (emergen) {
                    myMask.hide();
                }
            },
            failure: function (response) {
                Ext.Msg.alert(fussion.UI.titulos.error, fussion.UI.mensajes.error);
                if (emergen) {
                    myMask.hide();
                }
            }
        });
    }
}

app.consulta_proyecto.url = {
    consultar           : 'Service.svc/ObtenerTodosProyectosPorCampos',
    eliminar            : 'Service.svc/EliminarProyecto',
    descriptor_cliente  : 'Service.svc/ObtenerListaClientes',
};

app.consulta_proyecto.titulos = {
    interfaz: 'Consulta Proyecto'
};

app.consulta_proyecto.crear_paginacion_grilla= function(conf) {
    var ttbar_busqueda_avanzada = new app.PagingAjaxRequestPostToolBar.createTbar(app.consulta_proyecto.url.consultar, '', '', 30, conf.store, 1, 'POST','ObtenerTodosProyectosPorCamposResult');
    return ttbar_busqueda_avanzada;
}

app.consulta_proyecto.refrescar=function(){
    app.consulta_proyecto.tbar_busqueda_avanzada.tbar.inicializar();
}

app.consulta_proyecto.get_cliente = function () {
    //creo el combo y le anexo su store
    var cliente = Ext.create('Ext.form.ComboBox', {
        store: app.consulta_proyecto.store_Clientes.store,
        id: 'consulta_proyecto_cliente',
        name: 'clientes',
        queryMode: 'local',
        forceSelection: true,
        displayField: 'Nombre',
        emptyText: 'Cliente...',
        valueField: 'Codigo',
        listeners: {
            select: function (combo, record, index) {
                var id = cliente.getValue();
                app.consulta_proyecto.consulta_basica_ejecutar();
            }
        }
    });


    return cliente;
};

app.consulta_proyecto.get_cliente_final = function () {
    //creo el combo y le anexo su store
    var cliente_final = Ext.create('Ext.form.ComboBox', {
        store: app.consulta_proyecto.store_Clientes_final.store,
        name: 'cliente_finales',
        queryMode: 'local',
        forceSelection: true,
        displayField: 'Nombre',
        valueField: 'Codigo',
        emptyText: 'Cliente Final...',
        listeners: {
            select: function (combo, record, index) {
                var id = cliente.getValue();
                app.consulta_proyecto.consulta_basica_ejecutar();
            }
        } 
    });

    return cliente_final;
};

app.consulta_proyecto.get_form_nombre = function () {
    var nombre = Ext.create('Ext.form.field.Text',{
        xtype: 'textfield',
        emptyText: 'Nombre...',
        name: 'nombre',
        enableKeyEvents: true,
        fieldStyle : {
            'text-transform': 'uppercase'
        },
        listeners: {
        keydown: function (t, e) {
                if (e.getKey() == 13) {
                    var id = nombre.getValue();
                    app.consulta_proyecto.consulta_basica_ejecutar();
                }
            }   
        }
    });
    return nombre;
};

app.consulta_proyecto.consulta_basica_ejecutar=function(){
    var valor_cliente = app.consulta_proyecto.campo_cliente.getValue();
    var valor_cliente_final = app.consulta_proyecto.campo_cliente_final.getValue();
    var nombre = app.consulta_proyecto.campo_nombre.getValue();

           if(valor_cliente=="" || valor_cliente==null){
                valor_cliente=0;
           }
           if(valor_cliente_final=="" || valor_cliente_final==null){
                valor_cliente_final=0;
           }
       app.consulta_proyecto.tbar_busqueda_avanzada.tbar.options['campos']=[{'key':'cliente','value':valor_cliente},
                                                                                {'key':'cliente_final','value':valor_cliente_final},
                                                                                {'key':'nombre','value':nombre}];
       app.consulta_proyecto.tbar_busqueda_avanzada.tbar.inicializar();
};

//esta funcion limpia la consulta
app.consulta_proyecto.consulta_basica_limpiar=function(){

    app.consulta_proyecto.campo_cliente.setValue([]);
    app.consulta_proyecto.campo_cliente_final.setValue([]);
    app.consulta_proyecto.campo_nombre.setValue([]);      
    app.consulta_proyecto.tbar_busqueda_avanzada.tbar.options['campos']=null;
    app.consulta_proyecto.tbar_busqueda_avanzada.tbar.inicializar();
}

app.consulta_proyecto.basicas=function(){

    var cliente = app.consulta_proyecto.get_cliente();
    app.consulta_proyecto.campo_cliente=cliente;
    var cliente_final=app.consulta_proyecto.get_cliente_final();
    app.consulta_proyecto.campo_cliente_final=cliente_final;
    var nombre=app.consulta_proyecto.get_form_nombre();
    app.consulta_proyecto.campo_nombre=nombre;
    var menu = Ext.create('Ext.menu.Menu', {
                                                style: {
                                                            overflow: 'visible'     // For the Combo popup
                                                        },
                                                items: [nombre,cliente,cliente_final]
                                            });
    
    var item = {
                    text:'Filtrar',
                    iconCls: 'bmenu',  // <-- icon
                    menu: menu  // assign menu by instance
                };

    return item;

}

app.consulta_proyecto.linkRenderer=function(value, meta, record) {
    return Ext.String.format("<a class=\"fussion-cell-link\" onclick=\"app.consulta_proyecto.linkClick('{1}')\" href=\"javascript:;\">{0}</a>", value, record.data.Codigo);
}
app.consulta_proyecto.get_panel = function () {

    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

    var store = Ext.create('Ext.data.JsonStore', {
                                                    fields: [
                                                            'Codigo', 'Nombre', 'Localizacion', 'Cliente', 'ClienteFinal', 'Dibujos', 'Estado', 'FechaConfirmacion', 
                                                            {name : "FechaEntrega",convert: fussion.UI.parseFecha}, {name : "FechaLlegada",convert: fussion.UI.parseFecha},
                                                            "TiempoEmpleado","FechaCreacion"
                                                            ],
                                                    root: 'ObtenerTodosProyectosResult'
                                                });

    app.consulta_proyecto.store_Clientes = new app.consulta_proyecto.store_cargar_combo(app.consulta_proyecto.url.descriptor_cliente, [{
        name: "Codigo", type: "int"
    }, {
        name: "Nombre", type: "string"
    }], "ObtenerlistaClientesResult");

     app.consulta_proyecto.store_Clientes_final = new app.consulta_proyecto.store_cargar_combo(app.consulta_proyecto.url.descriptor_cliente, [{
        name: "Codigo", type: "int"
    }, {
        name: "Nombre", type: "string"
    }], "ObtenerlistaClientesResult");

    app.consulta_proyecto.store_Clientes.init();
    app.consulta_proyecto.store_Clientes_final.init();

    var filters = {
        ftype: 'filters',
        encode: false,
        local: true,
        filters: [
                    {
                        type: 'int',
                        dataIndex: 'Codigo'
                    },
                    {
                        type: 'string',
                        dataIndex: 'Nombre'
                    },
                    {
                        type: 'string',
                        dataIndex: 'Localizacion'
                    },

                    {
                        type: 'string',
                        dataIndex: 'Cliente'
                    },
                    {
                        type: 'string',
                        dataIndex: 'ClienteFinal'
                    },
                    {
                        type: 'boolean',
                        dataIndex: 'Dibujos'
                    },
                    {
                        type: 'string',
                        dataIndex: 'Estado'
                    },
                    {
                        type: 'date',
                        dataIndex: 'FechaEntrega'
                    },
                    {
                        type: 'date',
                        dataIndex: 'FechaLlegada'
                    },
                    {
                        type: 'int',
                        dataIndex: 'TiempoEmpleado'
                    }]
                };


    var columns = [
                        { header: 'Nombre', dataIndex: 'Nombre',flex: 1 ,renderer: app.consulta_proyecto.linkRenderer},
                        { header: 'Dirección de Despacho', dataIndex: 'Localizacion', flex: 1 },
					    { header: 'Cliente', dataIndex: 'Cliente' ,flex: 1 },
					    { header: 'Cliente Final', dataIndex: 'ClienteFinal', flex: 1 },
					    {   xtype: "booleancolumn",
                            align:"center",
                            header: 'Dibujo', 
                            dataIndex: 'Dibujos',
                            trueText: fussion.UI.format["true"],
                            falseText: fussion.UI.format["false"] 
                        },
                        {
                                    xtype: 'actioncolumn',
                                    width: 30,
                                    align : 'center',
                                    items: [{
                                        icon: fussion.UI.iconos.editar,
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.store.getAt(rowIndex);
                                            var codigo = 'editar_contacto'+ rec.data.Codigo;
                                            var titulo = rec.data.Nombre;
                                            if (app.LOADED.indexOf(codigo) < 0) {
                                                app.LOADED.push(codigo); 
                                               incluir_javascript('ui/nuevo_proyecto_interfaz.js');
                                                var objeto = new app.nuevo_proyecto.crear_paneles();
                                                var p = objeto.get_panel();
                                                //app.nuevo_proyecto.cargar_proyecto(rec.data.Codigo);
                                                objeto.cargar_proyecto(rec.data.Codigo);
                                                p.title=titulo;

                                                Ext.getCmp('panel_central').add(p);
                                                Ext.getCmp('panel_central').setActiveTab(p); 
                                                //app.ids_tabs[titulo.toLowerCase()] = Ext.getCmp('panel_central').getActiveTab().id    
                                                app.ids_tabs[codigo] =  Ext.getCmp('panel_central').getActiveTab().id;
                                                    
                                            } else {
                                                Ext.getCmp('panel_central').setActiveTab(app.ids_tabs[codigo]);
                                            }
                                        }
                                    }]
                                }
                ];

    app.consulta_proyecto.tbar_busqueda_avanzada = app.consulta_proyecto.crear_paginacion_grilla({ store: store });

    app.consulta_proyecto.linkClick = function (codigo) {
        if(codigo!=null){
            var index = grid.store.find('Codigo', codigo);
            var rec = grid.store.getAt(index);
            var titulo = 'detalle_proyecto' + rec.data.Nombre;
            var panel_central = Ext.getCmp('panel_central');
            if (app.LOADED.indexOf(titulo) < 0) {
                app.LOADED.push(titulo);
                incluir_javascript("ui/detalle_proyecto_interfaz.js");
                var w = app.detalle_proyecto.get_panel(rec);
                panel_central.add(w);
                panel_central.setActiveTab(w);
                app.ids_tabs[titulo] = panel_central.getActiveTab().id;
            } else {
                panel_central.setActiveTab(app.ids_tabs[titulo]);
            }
        }
    };
     var tbar = {
        xtype: 'toolbar',
        items: [ "-",
            { xtype: 'button', tooltip:'Agregar', icon: fussion.UI.iconos.add, handler: function () {
                incluir_javascript("ui/nuevo_proyecto_interfaz.js");
                var w = app.nuevo_proyecto.get_panel();
                Ext.getCmp('panel_central').add(w);
                Ext.getCmp('panel_central').setActiveTab(w);
            }
            },
             "-",
            { xtype: 'button', tooltip: 'Eliminar', icon: fussion.UI.iconos._delete,handler:function(){
                if(app.consulta_proyecto.codigo!=null){
                    Ext.Ajax.request({
                        url: app.consulta_proyecto.url.eliminar,
                        method: 'POST',
                        timeout : 90000,
                        headers: { "Content-Type": "application/json" },
                        params : Ext.encode({'Codigo':app.consulta_proyecto.codigo}),
                        success: function (response) {
                            var data = Ext.decode(response.responseText);            
                            var tabla =  Ext.decode(data.EliminarProyectoResult);
                            if (tabla != null) {
                                if(tabla.success){
                                    Ext.Msg.show({
                                         title:'Information',
                                         msg: tabla.message,
                                         buttons: Ext.Msg.OK,
                                         icon: Ext.Msg.INFO
                                    });
                                    app.consulta_proyecto.refrescar();
                                }else{
                                    Ext.Msg.alert(fussion.UI.titulos.error, tabla.message);
                                }
                            }           
                        },
                        failure: function (response) {
                            Ext.Msg.alert(fussion.UI.titulos.error, fussion.UI.mensajes.error);
                        }
                    });
                }
            } },
            "-",
            {
                xtype: 'button', tooltip: 'Refrescar', icon: fussion.UI.iconos.refrescar,
                    handler:function(){
                        app.consulta_proyecto_esw.refrescar(); 
                    }
            },
            "-",
            {
                xtype: 'button', tooltip: 'Consulta Avanzada', icon: fussion.UI.iconos.consultar
            },
            "-",
            app.consulta_proyecto.basicas(),
            "-",
            {xtype: 'button', tooltip: 'Limpiar Filtros', icon: fussion.UI.iconos.limpiar_filtro,
                handler:function(){
                    app.consulta_proyecto.consulta_basica_limpiar();
                }
            },
            "-",
            "->",
            {xtype: 'button', tooltip: 'Ayuda', icon: fussion.UI.iconos.ayuda}]
        };

    var grid = new Ext.grid.GridPanel({
                                            stateId     : 'stateGridConsultaProyecto',
                                            stateEvents : ['columnresize', 'columnmove', 'sortchange', 'show', 'hide'],
                                            border      : false,
                                            store       : store,
                                            tbar        : tbar,
                                            columns     : columns,
                                            loadMask    : true,
                                            features    : [filters],
                                            bbar        : app.consulta_proyecto.tbar_busqueda_avanzada.tbar.bar
                                        });

    app.consulta_proyecto.store=store;

     grid.on("itemclick", function(grid, record, item, index, e, eOpts){
        app.consulta_proyecto.codigo=record.data.Codigo;
        app.consulta_proyecto.nombre=record.data.Nombre;
    });
    //panel
    var panel = Ext.create('Ext.form.Panel',  {
        xtype: 'panel',
        border: 'false',
        layout: 'fit',
        region: 'center',
        frame: true,
        closable:true,
        title: app.consulta_proyecto.titulos.interfaz,
        items: [grid],
        listeners: {
            beforeclose: function () {
                fussion.UI.remove(app.LOADED, 'consulta_proyecto');
                app.consulta_proyecto = null;
                Ext.getCmp('panel_izquierda').expand(Ext.Component.DIRECTION_LEFT,true);
            },afterrender:function(){
                app.consulta_proyecto.tbar_busqueda_avanzada.tbar.msgWait = new Ext.LoadMask(panel.getEl(), { msg: "Cargando Recursos..." });
                app.consulta_proyecto.tbar_busqueda_avanzada.tbar.inicializar();
            }
        }
    });

    return panel;

};
