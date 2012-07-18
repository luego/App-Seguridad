Ext.ns('app.viajes');

app.viajes = app.viajes || {};

function Viajes () {

	this.get_panel = function() {
	    // create the Data Store
	    var store = Ext.create('Ext.data.Store', {
	    	autoLoad : true,
	    	fields: [
	        			{ name : 'id', type : 'int' },
	        			{ name :'ruta', type : 'string' },
	        			{ name :'fecha', type : 'string' },
	        			{ name :'nombre_escolta', type : 'string' },
	        			{ name :'hora_salida', type : 'string' },
	        			{ name :'hora_llegada', type : 'string' }
	        		],
	        pageSize: 50,
	        proxy: {
	            // load using script tags for cross domain, if the data in on the same domain as
	            // this page, an HttpProxy would be better
	            type: 'ajax',
	            url: 'api/viaje/obtenerViajes',
	            reader: {
	                root: 'data',
	                totalProperty: 'total'
	            },
	        }
	    });

	    var grid = Ext.create('Ext.grid.Panel', {
	        layout : 'anchor',
	        title: 'ExtJS.com - Browse',
	        store: store,
	        loadMask: true,
	        viewConfig: {
	            trackOver: true,
	            stripeRows: true
	        },
	        // grid columns
	        columns:[
		        {
		            text: "Ruta",
		            dataIndex: 'ruta',
		            flex: 1,
		            sortable: false
		        },
		        {
		            text: "Escolta",
		            dataIndex: 'nombre_escolta',
		            flex: 1,
		            sortable: false
		        },
		        {
		            text: "Fecha",
		            dataIndex: 'fecha',
		            width: 100,
		            sortable: true
		        },{
		            text: "Hora salida",
		            dataIndex: 'hora_salida',
		            width: 70,
		            align: 'right',
		            sortable: true
		        },{
		            text: "Hora llegada",
		            dataIndex: 'hora_llegada',
		            width: 150,
		            sortable: true
		        },
		        {
	                xtype: 'actioncolumn',
	                width: 30,
	                align: 'center',
	                items: [{
	                    style: {
	                        cursor: 'hand'
	                    },
	                    icon: app.iconos.copy,
	                    handler: function (grid, rowIndex, colIndex) {
	                    	var rec = grid.getStore().getAt(rowIndex);
	                    	if (app.LOADED.indexOf(rec.get('ruta')) < 0) {
			                    app.LOADED.push(rec.get('ruta'));
			                    //app.ids_tabs[rec.get('ruta')] = rec.get('ruta');
			                    incluir_javascript('ui/reporte_viaje_interfaz.js');
	                        	var panel = app.reporte_viaje.get_panel(rec.get('id'));
	                        	panel.setTitle(rec.get('ruta'));
	                        	var panel_central = Ext.getCmp('panel_central');
	                        	panel_central.add(panel);
	                        	panel_central.setActiveTab(panel);

	                        	app.ids_tabs[rec.get('ruta') + rec.get('id')] = panel_central.getActiveTab().id;
			                } else {
			                    Ext.getCmp('panel_central').setActiveTab(app.ids_tabs[rec.get('ruta') + rec.get('id')]);
			                }
	                    }
	                }]
	            }
	        ],
	        // paging bar on the bottom
	        bbar: Ext.create('Ext.PagingToolbar', {
	            store: store,
	            displayInfo: true,
	            displayMsg: 'Mostrando {0} - {1} de {2}',
	            emptyMsg: "No hay datos"
	        })
	    });

	    // trigger the data store load
	   	//store.loadPage(1);

	   	var panel = Ext.create('Ext.form.Panel', {
            title: 'Viajes',
            closable: true,
            margin : '0 0 0 0',
            layout : 'fit',
           	items : [grid],
           	listeners : {
           		 beforeclose: function () {
                    //este metodo es necesario para poder abrir la pantalla nuevamente
                    app.Array.remove(app.LOADED, 'viajes');
                    app.viajes = null;
                }
           	}
        });

	   	return panel;
	};
}	


app.viajes.get_panel = function(){
	var obj = new Viajes();
	return obj.get_panel();
};