Ext.onReady(function(){
                        Ext.tip.QuickTipManager.init();
  
                        var login = new Ext.FormPanel({ 
                            layout:'anchor',
                            labelWidth:80,
                            url:'api/user/login', 
                            frame:true, 
                            defaultType:'textfield',
                            monitorValid:true,
                            items:[{ 
                                    fieldLabel:'Usuario', 
                                    id:'usuario', 
                                    name:'usuario', 
                                    allowBlank:false 
                                },{ 
                                    fieldLabel:'Clave', 
                                    id:'clave',
                                    name:'clave',
                                    inputType:'password', 
                                    allowBlank:false 
                                },
                                {
                                    fieldLabel:'Tipo', 
                                    id:'tipo', 
                                    name:'tipo',
                                    hidden:true,
                                    allowBlank:true,
                                    value : 0
                                }],
                          // All the magic happens after the user clicks the button     
                            buttons:[{ 
                                    text:'Login',
                                    //formBind: true,  
                                    // Function that fires when user clicks the button 
                                    handler:function(){ 
                                        login.getForm().submit({ 
                                            method:'POST', 
                                            waitTitle:'Autenticando...', 
                                            waitMsg:'Enviando datos...',
                                            success:function(form , action){ 
                                                if (action.response.responseText != "") {
                                                    var res = Ext.decode(action.response.responseText);
                                                    if (res.success === "true") {
                                                       Ext.Msg.alert('Status', 'Acceso Exitoso!', function(btn, text){
                                                            if (btn == 'ok'){
                                                                var redirect = 'main.php'; 
                                                                window.location = redirect;
                                                            }
                                                        }); 
                                                    }else{
                                                        Ext.Msg.alert('Error', 'Usuario y/o Clave incorrectos');
                                                    }
                                                };
                                                
                                            },                    
                                            failure:function(form, action){ 
                                                if (action.response.responseText != "") {
                                                    var res = Ext.decode(action.response.responseText);
                                                    if (res) {
                                                        if (res.success === true) {
                                                            var redirect = 'main.php'; 
                                                            window.location = redirect;
                                                        }else{
                                                            Ext.Msg.alert('Error', 'Usuario y/o Clave incorrectos');
                                                        }
                                                    };
                                                };
                                                login.getForm().reset(); 
                                            } 
                                        }); 
                                    } 
                                }] 
                        });
                     
                     
                        // This just creates a window to wrap the login form. 
                        // The login object is passed to the items collection.       
                        var win = Ext.create('Ext.window.Window', {
                            title:'Iniciar Sessión',
                            layout:'fit',
                            width:300,
                            height:150,
                            closable: false,
                            draggable : false,
                            resizable: false,
                            plane: true,
                            border: false,
                            items: [login]
                        });
                        win.show();
            });