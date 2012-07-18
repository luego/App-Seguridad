//valido el app
var app = app || {};
//valido mi espacio de nombres
app.PagingAjaxRequestPostToolBar = app.PagingAjaxRequestPostToolBar || {};
//creo la funcion para ajax customisable
app.PagingAjaxRequestPostToolBar.custom = function custom(conf) {
    var consulta = '';
    var flag = true;
    for (var opcion in conf.options) {
        if (flag) {
            consulta = opcion + "=" + conf.options[opcion];
        }
        else {
            consulta = consulta + " or " + opcion + "=" + conf.options[opcion];
        }
        flag = false;
    }
    /// alert(consulta);
    var params = Ext.encode({
        'query': consulta
    });
    //inicializo mi mascara cargando recursos
    //app.myMask.show();
    Ext.Ajax.request({
        url: conf.url,
        timeout: 50000,
        method: conf.method,
        params: params,
        headers: {
            "Content-Type": "application/json"
        },
        success: function (response) {
            var data = Ext.decode(response.responseText);
            //conf.store.proxy = new Ext.data.MemoryProxy(data);
            conf.store.loadData(data);
            //oculto mi mascara
            //app.myMask.hide();
        },
        failure: function() {
            //oculto mi mascara
            //app.myMask.hide();
            Ext.Msg.alert(cgss.UI.titulos.error, cgss.UI.mensajes.error);	
        }
    });
}
//creo la funcion que me hara el paginado
app.PagingAjaxRequestPostToolBar.AjaxPostRequest = function AjaxPostRequest(conf, respuesta) {
    var params = conf.options;
    if (conf.method == 'POST') {
        params = Ext.encode(conf.options)
    }
    if(typeof app.mensaje_de_espera!="undefined"){
        app.mensaje_de_espera.show();
    }
    Ext.Ajax.request({
        url: conf.url,
        timeout:50000,
        method: conf.method,
        params: params,
        headers: {
            "Content-Type": "application/json"
        },
        success: function (response) {
            var data = Ext.decode(response.responseText);
            data=data[conf.root];

            if (data.success) {
                try {
                    
                    conf.store.loadData(data.datos);

                    if (typeof app.mensaje_de_espera != "undefined") {
                        app.mensaje_de_espera.hide();
                    }
                    
                    var total_page = 0;
                    if (data.total % conf.pageSize > 0) {
                        total_page = ((data.total - (data.total % conf.pageSize)) / conf.pageSize);
                        total_page++;
                    }
                    else {
                        total_page = data.total / conf.pageSize;
                    }
                    if (total_page == 0) {
                        conf.afterTextItem.setText('de ' + 1);
                    }
                    else {
                        conf.afterTextItem.setText('de ' + total_page);
                    }
                    conf.inputItem.setValue(conf.activePage);
                    if (conf.activePage == 1) {
                        if (data.total > 0) {
                            conf.next.setDisabled(false);;
                            conf.last.setDisabled(false);
                            if (conf.activePage == total_page) {
                                conf.next.setDisabled(true);
                                conf.last.setDisabled(true);
                            }
                        }
                    }
                    else {
                        conf.first.setDisabled(false);
                        conf.prev.setDisabled(false);
                        conf.next.setDisabled(false);
                        conf.last.setDisabled(false);
                        if (conf.activePage == total_page) {
                            conf.next.setDisabled(true);
                            conf.last.setDisabled(true);
                        }
                    }
                    respuesta['total_pages'] = total_page;
                    conf.refresh.setDisabled(false);
                    conf.displayItem.setText(data.total + ' registros');
                    conf.inputItem.setDisabled(false);
                }
                catch (e) {
                    alert(e + 'error');
                    if (typeof app.mensaje_de_espera != "undefined") {
                        app.mensaje_de_espera.hide();
                    }
                }
            }
            else {
                Ext.Msg.show({
                    title: 'Error',
                    msg: data.message,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
                if (typeof app.mensaje_de_espera != "undefined") {
                    app.mensaje_de_espera.hide();
                }
            }
        },
        failure: function () {
            Ext.Msg.alert(fussion.UI.titulos.error, fussion.UI.mensajes.error);	
        }
    });
}
//creo mi bbar de paginado
app.PagingAjaxRequestPostToolBar.component = function (conf) {
    this.url = conf.url;
    this.options = conf.options;
    this.total = conf.total;
    this.root=conf.root;
    this.pageSize = conf.pageSize;
    this.store = conf.store;
    this.activePage = conf.activePage;
    this.method = conf.method;
    this.response = {};
    this.charType = {};
    this.campo_1 = {};
    this.campo_2 = {};
    this.chart_container = {};
    this.campo_1_tipo = {};
    this.campo_2_tipo = {};
    this.chart_title = {};
    this.inicializar = function () {
        this.moveFirst();
    }
    this.moveFirst = function () {
        this.activePage = 1;
        this.options['start'] = (this.activePage - 1) * this.pageSize;
        this.options['limit'] = this.pageSize;
        this.changeActivePage();
    }
    this.movePrevious = function () {
        this.activePage--;
        this.changeActivePage();
    }
    this.moveNext = function () {
        this.activePage++;
        this.changeActivePage();
    }
    this.moveLast = function () {
        this.activePage = this.response['total_pages'];
        this.changeActivePage();
    };
    this.doRefresh = function () {
        try {
            this.changeActivePage();
        }
        catch (e) {
            alert('error' + e);
        }
    }
    this.changeActivePage = function () {
        this.next.setDisabled(true);
        this.last.setDisabled(true);
        this.first.setDisabled(true);
        this.prev.setDisabled(true);
        this.refresh.setDisabled(true);
        this.inputItem.setDisabled(true);
        this.options['start'] = (this.activePage - 1) * this.pageSize;
        this.options['limit'] = this.pageSize;
        app.PagingAjaxRequestPostToolBar.AjaxPostRequest({
            'options': this.options,
            'store': this.store,
            'url': this.url,
            'activePage': this.activePage,
            'pageSize': this.pageSize,
            'first': this.first,
            'prev': this.prev,
            'next': this.next,
            'last': this.last,
            'refresh': this.refresh,
            'afterTextItem': this.afterTextItem,
            'inputItem': this.inputItem,
            'method': this.method,
            'displayItem': this.displayItem,
            'chart': this.charType,
            'campo_1': this.campo_1,
            'campo_2': this.campo_2,
            'chart_container': this.chart_container,
            'campo_1_tipo': this.campo_1_tipo,
            'campo_2_tipo': this.campo_2_tipo,
            'chart_title': this.chart_title,
            'root':this.root
        }, this.response);
    }

    this.goToPage = function () {
        if (this.inputItem.getValue() > 0 && this.inputItem.getValue() < this.response['total_pages'] + 1) {
            this.activePage = this.inputItem.getValue();
            this.options['start'] = (this.activePage - 1) * this.pageSize, this.options['limit'] = this.pageSize
            this.changeActivePage();
        }
        else {
            this.inputItem.setValue(this.activePage);
        }
    }

    this.first = Ext.create('Ext.Button',{
        iconCls: 'x-tbar-page-first',
        handler: this.moveFirst,
        scope: this
    });
    this.prev = Ext.create('Ext.Button',{
        iconCls: 'x-tbar-page-prev',
        handler: this.movePrevious,
        scope: this
    });

    this.inputItem = Ext.create('Ext.form.field.Number',{
        cls: 'x-tbar-page-number',
        allowDecimals: false,
        allowNegative: false,
        enableKeyEvents: true,
        selectOnFocus: true,
        width:60,
        submitValue: false,
        listeners: {
            scope: this,
            'keydown': function (field, e) {
                if (e.getKey() == e.RETURN) {
                    this.goToPage();
                }
            }
        }
    });

    this.afterTextItem = Ext.create('Ext.toolbar.TextItem',{});

    this.next =Ext.create('Ext.Button',{
        iconCls: 'x-tbar-page-next',
        handler: this.moveNext,
        scope: this
    });

    this.last =Ext.create('Ext.Button',{
        iconCls: 'x-tbar-page-last',
        handler: this.moveLast,
        scope: this
    });

    this.refresh = Ext.create('Ext.Button',{
        iconCls: 'x-tbar-loading',
        handler: this.doRefresh,
        scope: this
    });
    
    this.displayItem =Ext.create('Ext.toolbar.TextItem',{});

    this.bar = Ext.create('Ext.toolbar.Toolbar',{
        items: [
        this.first, this.prev, this.inputItem, this.afterTextItem, this.next, this.last, this.refresh, this.displayItem]
    });
}
//falta el panel para el cargando
//esta funcion me permite crear mi objecto
app.PagingAjaxRequestPostToolBar.createTbar = function (url, query, total, pageSize, store, activePage, method,root) {
    this.url = url;
    this.query = query;
    this.total = total;
    this.pageSize = pageSize;
    this.store = store;
    this.root = root;
    this.activePage = activePage;
    this.method = method;
    this.tbar = new app.PagingAjaxRequestPostToolBar.component({
        'url': this.url,
        'options': {},
        'total': this.total,
        'pageSize': this.pageSize,
        'store': this.store,
        'activePage': this.activePage,
        'method': this.method,
        'root':this.root
    });
}