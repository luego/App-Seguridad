
Ext.ns('app.usuarios');

app.usuarios = app.usuarios || {};

function Usuario () {

	this.get_panel = function() {
		
		Ext.tip.QuickTipManager.init();

		Ext.define('Person', {
		    extend: 'Ext.data.Model',
		    fields: [
						{ name	: '_id', type: 'string'}, 
						{ name	: 'nombre_empresa', type: 'string'},
						{ name	: 'ciudad', type: 'string'},
						{ name	: 'usuario', type: 'string'},
						{ name	: 'clave',type: 'string'},
						{ name	: 'contacto',type: 'string'}
					],
			validations: [
							{type	: 'presence',  field: 'nombre_empresa'},
							{type	: 'length',  field: 'nombre_empresa' , min : 4},
							{type	: 'presence',  field: 'ciudad'},
							{type	: 'presence',  field: 'usuario'},
							{type	: 'presence',  field: 'clave'},
							{type	: 'presence',  field: 'contacto'}
					    ]
		});

		var store = Ext.create('Ext.data.Store', {
	        autoLoad: true,
	        autoSync: true,
	        model: 'Person',
	        proxy: {
	            type: 'rest',
	            url: '/api/clientes',
	            reader: {
	                type: 'json',
	                root: 'data'
	            },
	            writer: {
	                type: 'json'
	            }
	        },
	        listeners: {
	            write: function(store, operation){
	                var record = operation.getRecords()[0],
	                    name = Ext.String.capitalize(operation.action),
	                    verb;
	                    
	                    
	                if (name == 'Destroy') {
	                    record = operation.records[0];
	                    verb = 'Destroyed';
	                } else {
	                    verb = name + 'd';
	                }
	                //Ext.example.msg(name, Ext.String.format("{0} user: {1}", verb, record.getId()));
	                
	            }
	        }
	    });
	    
	var rowEditing = Ext.create('Ext.grid.plugin.RowEditing');
    
	    var grid = Ext.create('Ext.grid.Panel', {
	        //renderTo: document.body,
	        plugins: [rowEditing],
	        width: 400,
	        height: 300,
	        frame: true,
	        title: 'Users',
	        store: store,
	        iconCls: 'icon-user',
	        columns: [
						{
				            text: 'ID',
				            width: 40,
				            sortable: true,
				            dataIndex: '_id'
				        },
				        {
							text: 'Nombre Empresa',
				            flex: 1,
				            sortable: true,
				            dataIndex: 'nombre_empresa',
				            field: {
				                xtype: 'textfield'
				            }
				        },
				        {
				            text: 'Ciudad',
				            flex: 1,
				            sortable: true,
				            dataIndex: 'ciudad',
				            field: {
				                xtype: 'textfield'
				            }
				        }, 
				        {
				            header: 'Usuario',
				            width: 80,
				            sortable: true,
				            dataIndex: 'usuario',
				            field: {
				                xtype: 'textfield'
				            }
				        },
				        {
				            text: 'Clave',
				            width: 80,
				            sortable: true,
				            dataIndex: 'clave',
				            field: {
				                xtype: 'textfield'
				            }
				        },
				        {
				            text: 'Contacto',
				            width: 80,
				            sortable: true,
				            dataIndex: 'contacto',
				            field: {
				                xtype: 'textfield'
				            }
				        }
	        ],
	        dockedItems: [{
	            xtype: 'toolbar',
	            items: [{
	                text: 'Add',
	                iconCls: 'icon-add',
	                handler: function(){
	                    // empty record
	                    store.insert(0, new Person());
	                    rowEditing.startEdit(0, 0);
	                }
	            }, '-', {
	                itemId: 'delete',
	                text: 'Delete',
	                iconCls: 'icon-delete',
	                disabled: true,
	                handler: function(){
	                    var selection = grid.getView().getSelectionModel().getSelection()[0];
	                    if (selection) {
	                        store.remove(selection);
	                    }
	                }
	            }]
	        }]
	    });
	    grid.getSelectionModel().on('selectionchange', function(selModel, selections){
	        grid.down('#delete').setDisabled(selections.length === 0);
	    });

		var panel = Ext.create('Ext.form.Panel', {
			title		: 'Usuarios',
			closable	: true,
            margin		: '0 0 0 0',
            layout		: 'fit',
			items		: [grid],
			listeners	: {
							beforeclose : function () {
										app.Array.remove(app.LOADED, 'reporte_viaje');
										app.reporte_viaje = null;	
										}
							}
        });

        return panel;
	};
}

app.usuarios.get_panel = function(){
	var obj = new Usuario();
	return obj.get_panel();
};