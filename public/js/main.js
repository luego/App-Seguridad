 //metodo para que corra en versiones de IE menores a la version 8,para la version 9 sigue el estandar
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    }
}

var app = {};

app.Array = {
    remove : function(arreglo,elemento){
    var encontrado=-1;
    for(var contador=0; contador < arreglo.length; contador++)
    {
        if( arreglo[contador] == elemento) {
            encontrado = contador;
            break;
        }
    }
    arreglo.splice(encontrado, 1);
    return encontrado;
}
};

app.ids_tabs = {};

app.LOADED = [];

app.iconos = {
                copy      : 'images/copy.gif',
                eliminar  : 'images/delete.png'
            };

var cargar_interfaz = function (el) {
    var modulo = el.id;
    incluir_javascript('ui/' + modulo + "_interfaz.js");
    var interfaz = app[modulo.toLowerCase()]; 
    var panel = interfaz.get_panel();
    var panel_id = el.id;
    Ext.getCmp('panel_central').add(panel);
    Ext.getCmp('panel_central').setActiveTab(panel);
    app.ids_tabs[modulo] = Ext.getCmp('panel_central').getActiveTab().id
};

var incluir_javascript = function(url) {
  $.ajax({
            url:        url,
            async:      false,
            dataType:   "script"                                                           
          });
};

function getGeolocation (argument) {
    // body...
}

Ext.onReady(function(){

        var fileref=document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.setAttribute("src",
            "http://maps.googleapis.com/maps/api/js?sensor=true&callback=" +
            "getGeolocation");
            document.getElementsByTagName("head")[0].
            appendChild(fileref);

        Ext.tip.QuickTipManager.init();

        var tabs = Ext.createWidget('tabpanel', {
            id : 'panel_central',
            layout : 'anchor',
            anchor:'100%',
            activeTab: 0,
            /*items: [{
                title: 'Bienvenido',
                html : '<center><img src="images/imagen.jpg"</center>',
                closable: false
            }]*/
            items:[]
        });

        var contentPanel = {
             id: 'content-panel',
             region: 'center', // this is what makes this panel into a region within the containing layout
             layout: 'card',
             margins: '2 5 5 0',
             activeItem: 0,
             border: false,
             items: [tabs]
        };
         
        var store = Ext.create('Ext.data.TreeStore', {
            root: {
                expanded: true
            },
            proxy: {
                type: 'ajax',
                url: 'tree-data.json'
            }
        });
        
        // Go ahead and create the TreePanel now so that we can use it below
         var treePanel = Ext.create('Ext.tree.Panel', {
            id: 'tree-panel',
            title: 'Menu Principal',
            region:'north',
            split: true,
            height: 360,
            minSize: 150,
            rootVisible: false,
            autoScroll: true,
            store: store
        });

        treePanel.on('itemclick', function(View, record, item, index, e, options) {
            if (record.get('leaf')) {
                if (app.LOADED.indexOf(record.data.id.toLowerCase()) < 0) {
                    app.LOADED.push(record.data.id.toLowerCase());
                    cargar_interfaz(record.data);
                } else {
                    Ext.getCmp('panel_central').setActiveTab(app.ids_tabs[record.data.id]);
                }
            }
        });
        
        // This is the Details panel that contains the description for each example layout.
        var detailsPanel = {
            id: 'details-panel',
            title: 'Details',
            region: 'center',
            bodyStyle: 'padding-bottom:15px;background:#eee;',
            autoScroll: true,
            html: '<p class="details-info">Detalle</p>'
        };
     
        // Finally, build the main layout once all the pieces are ready.  This is also a good
        // example of putting together a full-screen BorderLayout within a Viewport.
        Ext.create('Ext.Viewport', {
            layout: 'border',
            title: 'Seguridad',
            id:'principal',
            items: [{
                xtype: 'box',
                id: 'header',
                region: 'north',
                html: '<h1> </h1>',
                height: 30
            },{
                layout: 'border',
                id: 'layout-browser',
                region:'west',
                border: false,
                split:true,
                margins: '2 0 5 5',
                width: 275,
                minSize: 100,
                maxSize: 500,
                items: [treePanel, detailsPanel]
            }, 
                contentPanel
            ],
            renderTo: Ext.getBody()
        });
});