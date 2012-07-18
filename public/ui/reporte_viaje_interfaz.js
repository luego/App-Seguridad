Ext.ns('app.reporte_viaje');

app.reporte_viaje = app.reporte_viaje || {};
app.reporte_viaje.fileref = null;

function ReporteViaje (codigo) {
	this.cont = 0;

	var iconovideo = new Image();
	iconovideo.src = "images/icono_video.jpg";

	function resize(which,nueva_ancho) {
		var elem = document.getElementById(which);
		if (elem === undefined || elem == null) return false;
		var ancho=elem.width;
		var altura=elem.height;
		var ancho_nuevo = nueva_ancho;
		var altura_nueva;

		if(ancho > nueva_ancho){
			ancho_nuevo  = ancho_nuevo;
		    altura_nueva = Math.floor(altura*(ancho_nuevo/ancho)); 
		}else{
			altura_nueva = altura;
		}

		elem.width=ancho_nuevo;
		elem.height=altura_nueva;
	}

	var me = this;
	// create the Data Store
	this.store = Ext.create('Ext.data.Store', {
			fields: [
						{ name : 'nombre_escolta', type : 'string' },
						{ name : 'id_escolta', type : 'int'},
						{ name : 'id_registro_viajes', type : 'int'},
						{ name : 'descripcion', type : 'string' },
						{ name : 'rutaFoto', type : 'string'},
						{ name : 'fecha', type : 'string' },
						{ name : 'hora', type : 'string' },
						{ name : 'latitude', type : 'string' },
						{ name : 'longitude', type : 'string' },
						{ name : 'altitude', type : 'string' },
						{ name : 'tipo', type : 'int' }
					]
	    });

	this.refrescar = function () {
		Ext.Ajax.request ({
		                url:        'api/viaje/obtenerRegistroViaje',
		                method:     'POST',
		                timeout:    200000,
		                params:     {'codigo': codigo },
		                success:    function (response) {
		                                var data = Ext.decode(response.responseText);
										// trigger the data store load
										me.store.removeAll();
										for (var i = 0; i < data.data.length; i++) {
											var row = {
														nombre_escolta		: data.data[i].nombre_escolta,
														id_escolta			: data.data[i].id_escolta,
														descripcion			: data.data[i].descripcion,
														id_registro_viajes	: data.data[i].id_registro_viajes,
														rutaFoto			: data.data[i].rutaFoto,
														fecha				: data.data[i].fecha,
														hora				: data.data[i].hora,
														latitude			: data.data[i].latitude,
														longitude			: data.data[i].longitude,
														altitude			: data.data[i].altitude,
														tipo				: data.data[i].tipo
													};
											me.store.add(row);
										}			
		                            },
		                failure:    function (response) {
		                                Ext.Msg.alert(fussion.UI.titulos.error, fussion.UI.mensajes.error);
		                                myMask.hide();
		                            }
		             });
	};

	this.eliminarRegistro = function(codigo){
		Ext.Ajax.request ({
		                url:        'api/viaje/eliminarRegistro',
		                method:     'POST',
		                timeout:    200000,
		                params:     {'codigo': codigo },
		                success:    function (response) {
		                                var data = Ext.decode(response.responseText);
										if (!data.success) {

										}			
		                            },
		                failure:    function (response) {
		                                Ext.Msg.alert(fussion.UI.titulos.error, fussion.UI.mensajes.error);
		                                myMask.hide();
		                            }
		             });
	};
	
	this.refrescar();

	this.get_panel = function() {
		
		Ext.tip.QuickTipManager.init();

		var tbar = Ext.create('Ext.toolbar.Toolbar', {
                                items: [
                                            {
												text : 'Refrescar',
												handler : function(){
												me.refrescar();
                                            	}
                                            }
                                        ]
                            });

	    var grid = Ext.create('Ext.grid.Panel', {
	        layout :'anchor',
	        store: me.store,
	        loadMask: true,
	        autoScroll: true,
	        viewConfig: {
	            trackOver: true,
	            stripeRows: true
	        },
	        selModel: {
	                    selType: 'rowmodel'
	                	},
	        tbar:tbar,
	        columns:
			        [
				        {
				            text: "Hora / Fecha",
				            dataIndex: 'hora',
				            width: 150,
				            sortable: true,
				            renderer: function (value, metaData, record, row, col, store, gridView) {
									    return record.get('hora') + " / " + record.get('fecha');
									}
				        },{
				        	text: "Descripcion",
				            dataIndex: 'descripcion',
				            flex: 1
				        },{
			                xtype: 'actioncolumn',
			                width: 30,
			                align: 'center',
			                items: [{
			                    style: {
			                        cursor: 'hand'
			                    },
			                    icon: app.iconos.copy,
			                    tooltip: 'Ver Detalle',
			                    handler: function (grid, rowIndex, colIndex) {
			                    	var nombreImagen = "";
			                    	var cadenaArch 	= "";
			                        var rec 		= grid.getStore().getAt(rowIndex);
			                        var latlng 		= new google.maps.LatLng(rec.get('latitude'), rec.get('longitude'));
									var myOptions 	= {
														zoom 		: 8,
														center 		: latlng,
														mapTypeId 	: google.maps.MapTypeId.ROADMAP
													  };
									if (rec.get('tipo') == 1) {
										nombreImagen = 'imagenDom' + me.cont;
										cadenaArch ='<center><img id="'+ nombreImagen +'" src="' + rec.get('rutaFoto') +'" width="300" height="400" /></center>';
									}else if(rec.get('tipo') == 2){
										//cadenaArch = '<video width="320" height="240" controls="controls" autoplay="autoplay"> <source src="' + rec.get('rutaFoto') +'" type="video/mp4" /> </video>';
										//cadenaArch = '<embed src="' + rec.get('rutaFoto') +'" width="400" height="300" autoplay="true" controller="true" loop="false" scale="tofit">';
										cadenaArch = '<br /><br /><br /><br /><br /><center><p align="center"><a class="link-video" href="'+ rec.get('rutaFoto') +'">Click para ver el video del '+ rec.get('nombre_escolta') +'</a></p></center>';
									}
			                        var panel_detalle = Ext.create('Ext.form.Panel', {
							            layout 		: 'column',
							            margin 		: '0 0 0 0',
							            defaults 	: { anchor: '100%', layout:'anchor',padding:'5 5 5 5',margin:5  },
							           	items  		: [
							           					{
                                                            xtype:          'fieldcontainer',
                                                            border:         true,
                                                            columnWidth:    0.5,
                                                            html : 			cadenaArch
                                                        },
                                                        {
                                                            xtype:          'fieldcontainer',
                                                            border:         true,
                                                            columnWidth:    0.5,
                                                            html: 			'<div id="map_canvas" style="width: 400px; height: 420px"></div>'
                                                        }
							           				 ]
							        });

			                        var win = Ext.create('Ext.window.Window', {
							                            title:'Detalle',
							                            layout:'fit',
							                            stateful: false,
							                            width:850,
							                            height:550,
							                            closable: true,
							                            draggable : true,
							                            resizable: false,
							                            plane: true,
							                            border: false,
							                            items: [panel_detalle],
							                            listeners : {
							                            	afterrender : function(){
							                            		if (rec.get('tipo') == 1) {
							                            			resize(nombreImagen,400);
							                            			me.cont++;
							                            		}

							                            		var mapObj 	= document.getElementById("map_canvas");
																var map 	= new google.maps.Map(mapObj, myOptions);
																var marker 	= new google.maps.Marker({
																										position: latlng,
																										map: map,
																										title: rec.get('nombre_escolta')
																									});
							                            	}
							                            },
							                            buttons:[
									                            	{
						                                            	text : 'Cerrar',
						                                            	handler : function(){
						                                            		win.close();
						                                            	}
						                                            }
							                            		]
							                        });
			                        win.show();
			                    }
			                }]
			            },
			            {
			                xtype: 'actioncolumn',		                
			                width: 30,
			                align: 'center',
			                items: [
				                		{
						                    style: {
						                        cursor: 'hand'
						                    },
						                    icon: app.iconos.eliminar,
						                    tooltip: 'Eliminar',
						                    handler: function (grid, rowIndex, colIndex) {
						                    	var rec = grid.getStore().getAt(rowIndex);
						                    	me.eliminarRegistro(rec.get('id_registro_viajes'));
						                    	grid.getStore().remove(rec);
						                    }
						                }
						            ]
						}
			        ]
	        
	    });

		var panel = Ext.create('Ext.form.Panel', {
            title 		: 'Reporte',
            closable 	: true,
            margin 		: '0 0 0 0',
            layout 		: 'fit',
           	items  		: [grid],
           	listeners 	: {
           		 			beforeclose : function () {
			                    			app.Array.remove(app.LOADED, 'reporte_viaje');
			                    			app.reporte_viaje = null;		                    			
										}
							}
        });

        return panel;
	};
}	

app.reporte_viaje.get_panel = function(codigo){
	var obj = new ReporteViaje(codigo);
	return obj.get_panel();
};