var lst_tarefa = []

var lst_db = []

var id_ult_edit = -1

var status_checked = false

var text_ult_edit = ''

var identificador = 0

var id_lista_storage = 0

var status_code = 0



$(document).ready(function () {

    SlickLoader.setText('Aguarde', 'carregando...');


    carregaStorage()

    carregaListaTarefa()

    $('#home_lista').click(function (e) {

        setListLocalStorage(0, 0)

        location.reload()

    })
 

    $("#btn_edit_save").click(function () {

        if (!usuario_logado()) {
            return
        }



        if (ehBotaoPadrao()) {



            tarefas(campoDigitaNota(), idUltimaNota(), botaoFechar())
        }
        else if (ehBotaoSalvar()) {

            if ($("#anotacao_tarefa").is(":visible") &&
                $("#anotacao_tarefa").val().trim().length > 0) {



                var nota = $("#anotacao_tarefa").val().trim()

                if (id_ult_edit == -1) {

                    if (identificador != 0) {

                        $("#linha" + idUltimaNota()).remove()

                        tarefas(nota, idUltimaNota())

                        clickEventNotas()

                        checkEventNotas()

                        botaoPadrao()

                        // CRIA NOTA
                        cria_nota(nota, id_lista_storage)

                        editReset()

                    }
                    else {

                        $("#linha" + idUltimaNota()).remove()

                        tarefas(nota, idUltimaNota(), botaoEditarLista(idUltimaNota()))

                        clickEventNotas()

                        clickEventEditarLista()

                        botaoPadrao()

                        // CRIA lista
                        criaLista(nota)

                        editReset()
                    }




                }
                else if (id_ult_edit != -1) {



                    if (identificador != 0) {

                        removeInput(id_ult_edit, nota, status_checked)

                        // ATUALIZA NOTA
                        atualiza_nota(nota, id_lista_storage, lst_db[id_ult_edit], status_checked)

                        editReset()

                        botaoPadrao()

                        checkEventNotas()

                    }
                    else {

                        removeInput(id_ult_edit, nota, status_checked)

                        // ATUALIZA LISTA
                        atualizaLista(nota, lst_db[id_ult_edit])

                        editReset()

                        botaoPadrao()

                        checkEventNotas()

                    }


                }

            }

        }
        
 

    });

    $(".slick-loader").click(function (e) {


        if ($("#anotacao_tarefa").is(":visible")) {

            var nota = $("#anotacao_tarefa").val().trim()

            if (id_ult_edit != -1) {

                if (identificador != 0) {
                    removeInput(id_ult_edit, nota, status_checked)
                    editReset()
                    botaoPadrao()
                    checkEventNotas()
                }
                else {
                    removeInput(id_ult_edit, nota, status_checked)
                    editReset()
                    botaoPadrao()
                    checkEventNotas()
                }

            }

        }





    })

});


// ************ USER LOGIN ***************


function limpaCamposFormulario() {

    $("#nome").val('')
    //$("#email").val('')
    $("#senha").val('')
    $("#senha2").val('')
    $("#nomeLogin").val('')
    $("#senhalogin").val('')

}

function info_erro_server(error_msg) {
    $('#error_server').empty()
    $("#alert").unbind();

    $('#error_server').append(
        '<div class="alert alert-warning alert-dismissible fade show" role="alert">' +
        '<strong>Desculpe, houve um erro</strong><br>' + error_msg + '.' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '  <span aria-hidden="true">&times;</span>' +
        '</button>' +
        '</div>'
    )

    $('.alert').click(function (e) {
        location.reload()
    });
 
}

function loginFormularioDinamico(login) {

    $('#login-form').empty();
    $("#login_usuario").unbind();
    $("#registra_usuario").unbind();
    $("#logout_usuario").unbind();
    $(".message a").unbind();

    $('#info_registra_error').empty()

    

    if (login) {
        $('#login-form').append(
            '<form class="login-form">' +
            '<input type="search" maxlength="50" id="nomeLogin" placeholder="Nome" value="usuario@test" autocomplete="false"/>' +
            '<input type="password" maxlength="6" id="senhalogin" value="12345" placeholder="Senha"/>' +
            '<span class="error text-danger" id="info_login_error"></span>' +
            '<button type="submit" id="login_usuario">login</button>' +
            '<p class="message">Não é cadastrado? <a href="#">Criar uma conta</a></p>' +
            '</form>'
        )
    }
    else {
        $('#login-form').append(
            '<form class="login-form">' +
            '<button id="logout_usuario">logout</button>' +
            '<p class="message"><a href="#">Crie uma conta</a></p>' +
            '</form>'
        )
    }


    $("#nomeLogin").keyup(function(e){   
    
        $(this).val($(this).val().toLowerCase().trim());  
        txt = $(this).val()   
    
        if(txt.match(/[^a-z0-9@#$]/)){ 
            $('#info_login_error').text('Caracteres válidos para o nome de usuário @ # $') 
        } 
       
        txt = txt.replace(/[^a-z0-9@#$]/g,'')
      
        $(this).val(txt) 
    });


    $("#senhalogin").keyup(function(e){   
       
        if($(this).val().includes(" ")){
            $('#info_login_error').text('Senha não pode ter espaço!')
        }
    
        $(this).val($(this).val().toLowerCase().trim());  
        txt = $(this).val()  
        $(this).val(txt) 
    });



  


    $('#registra_usuario').click(function (e) {

        $('#info_registra_error').empty()

        let nome = $("#nome").val().trim()

        // Email não estará em uso por enquanto
        let email = "" //$("#email").val("").trim()

        let senha = $("#senha").val().trim()
        let senha2 = $("#senha2").val().trim()

        console.log('senha.length: ', senha.length)

        if (nome == '') {
            $('#info_registra_error').text('* Digite um nome')
        }
        /*else if (email==''){
            $('#info_registra_error').text('* Digite um email válido') 
        }*/
        else if (senha == '') {
            $('#info_registra_error').text('* Digite uma senha')
        }
        else if (senha2 == '') {
            $('#info_registra_error').text('* Confirme a senha')
        }
        else if(senha.length<4){  
            $('#info_registra_error').text('* Tamanho mínimo para senha é de 4 caracteres e o máximo 6')  
        } 
        else if(senha.length>6){
            $('#info_registra_error').text('* Senha não deve ser maior que 6 caracteres!') 
        } 
        else if ((senha && senha2) && (senha2 != senha)) {
            $('#info_registra_error').text('* Segunda senha não corresponde com a primeira')
        } 
       
        else if (((senha && senha2) && (senha == senha2)) && nome /*&& email*/) { 

            if (nome.trim().split(" ").length > 1) {
                //nome = nome.split(" ")[0]
                $('#info_registra_error').text('* Nome de usuário não pode ter espaço Ex: mara@julia')
                return
            }

            registra_usario(nome.toLowerCase(), email, senha)

        }

        e.preventDefault()

    })

    $('#login_usuario').click(function (e) {

        $('#info_login_error').empty()

        let nome = $("#nomeLogin").val().trim()
        let senha = $("#senhalogin").val().trim()



        if ((nome && senha)) {
            login_usario(nome, senha)
        }
        else if (nome == '') {
            $('#info_login_error').text('* digite o nome de usuário')
        }
        else if (senha == '') {
            $('#info_login_error').text('* digite a senha')
        }

        e.preventDefault()

    })


    $('#logout_usuario').click(function (e) {



        logout_usario()

    })


    $('.message a').click(function () {
        $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
    });

}


// ***************************************

function carregaStorage() {


    if (JSON.parse(getLocalStorage('lista'))) {

        identificador = JSON.parse(getLocalStorage('lista')).identificador

        id_lista_storage = JSON.parse(getLocalStorage('lista')).id_lista
    }

    nomeUsuario()


}

function nomeUsuario() {


    if (JSON.parse(getLocalStorage('token'))) {

        $('#titulo_tarefa').text('Olá ' + JSON.parse(getLocalStorage('token')).user_name)

        loginFormularioDinamico(false)

    }
    else {
        loginFormularioDinamico(true)
    }
}

function carregaListaTarefa() {

    if (!usuario_logado()) {
        return
    }



    if (identificador == 0) {
        server_listas()
    }
    else {

        carrega_notas_server(id_lista_storage)
    }
}

function editReset() {

    id_ult_edit = -1
    text_ult_edit = ''
    status_checked = false

}

function ehBotaoPadrao() {

    if ($("#btn_edit_save i").attr("class").includes('fa-edit')) {

        return true

    }

    return false
}


function ehBotaoSalvar() {

    if ($("#btn_edit_save i").attr("class").includes('fa-check')) {

        return true

    }

    return false
}

function idUltimaNota() {

    return lst_db.length

}

function extraiNumero(text) {
    return text.replace(/[^0-9]/g, '')
}

function campoDigitaNota() {

    form = '<input type="text" class="form-control" id="anotacao_tarefa"  maxlength="30" placeholder="30 caracteres no máximo" autocomplete="off">'
    
      
    return form
}

function check(id) {
    ret = '           <input class="custom-control-input" id="customCheck' + id + '" type="checkbox">' +
        '           <label class="cursor-pointer custom-control-label" for="customCheck' + id + '"></label>'

    return ret
}

function botaoFechar() {
    return '<i class="fas fa-times fa-2x" id="fechar"></i>'
}

function botaoEditarLista(id) {

    return '<i class="fas fa-pen-square fa-2x" id="editarLista' + id + '"></i>'
}


function tarefas(tarefa_texto, id, elemento = check(id)) {

    if (identificador != 0) { 
        

        $('#tarefa_lista').append('<li class="list-group-item rounded-0" id="linha' + id + '">' +
            '    <div class="row">' +
            '      <div class="col-10 list-group-item-action" id="textoId' + id + '" >' +
            '        <div id="nota' + id + '"> ' + tarefa_texto + ' </div>' +
            '      </div>' +
            '      <div class="col-2">' +
            '        <div class="custom-control custom-checkbox" id="checkId' + id + '">' +
            elemento +
            '        </div>' +
            '      </div>' +
            '    </div>' +
            '</li>')

        if (elemento.startsWith("<i class")) {

            $("#fechar").click(function () {

                botaoPadrao()

                $("#linha" + idUltimaNota()).remove()

            });

            botaoSalvar()
        }

    }
    else {
         

        $('#tarefa_lista').append(
            '<li class="list-group-item rounded-0" id="linha' + id + '">' +

            '    <div class="row">' +
            '      <div class="col-10 list-group-item-action" id="textoId' + id + '" >' +
            '        <div id="nota' + id + '"> ' + tarefa_texto + ' </div>' +
            '      </div>' +
            '      <div class="col-2">' +
            '        <div class="custom-control  custom-checkbox" id="checkId' + id + '">' +
            elemento +
            '        </div>' +
            '      </div>' +
            '    </div>' +
            '</li>'
        )

        //  



        if (elemento.startsWith('<i class="fas fa-times fa-2x"')) {


            $("#fechar").click(function () {

                botaoPadrao()

                $("#linha" + idUltimaNota()).remove()

            });



            botaoSalvar()
        }

    }





}

function botaoExcluir(id) {

    $("#fechar").click(function () {

        if (identificador != 0) {
            // EXCLUIR UMA NOTA
            excluir_nota(lst_db[id])
        }
        else {
            // EXLCLUI LISTA
            deletaLista(lst_db[id])
        }


        location.reload()

    });

    botaoSalvar()
}

function botaoPadrao() {
    $("#btn_edit_save i").remove()
    $("#btn_edit_save").append('<i class="fas fa-edit fa-2x" id="icon"></i>')
}

function botaoSalvar() {
    $("#btn_edit_save i").remove()
    $("#btn_edit_save").append('<i class="fas fa-check fa-2x"></i>')
}

function carregaTarefa(data) {

    lst_db = []

    $("#tarefa_lista li").remove();

    if (Array.isArray((data))) {



        for (i = 0; i < data.length; i++) {

            if (identificador != 0) {



                lst_db.push(data[i].id)

                tarefas(data[i].tarefa_texto, i)

                $("#customCheck" + i).prop("checked", data[i].status);
            }
            else {



                lst_db.push(data[i].id)

                tarefas(data[i].titulo, i, botaoEditarLista(i))

            }

        }
    }
    else {

    }

    clickEventNotas()

    if (identificador != 0) {
        checkEventNotas()
    }
    else {
        clickEventEditarLista()
    }

}




function clickEventNotas() {

    lst_tarefa = []

    lst_tarefa = document.querySelectorAll('.list-group-item-action')

    for (let i = 0; i < lst_tarefa.length; i++) {

        $("#textoId" + i).unbind();

        $("#textoId" + i).mousedown(function (e) {


            if (identificador != 0) {





                if ($("#anotacao_tarefa").is(":visible") && id_ult_edit == -1) {



                    $("#anotacao_tarefa").css('border-color', 'red');

                    return
                }

                if ($(this).text().trim().length == 0) {




                    return
                }

                let nota = $(this).text().trim()

                if (id_ult_edit != -1) {



                    removeInput(id_ult_edit, text_ult_edit, status_checked)
                }

                if (nota) {
                    adicionaIput(i, nota, statuCheckBox(i))

                    botaoSalvar()
                }
            }
            else {

                if ($("#anotacao_tarefa").is(":visible") && id_ult_edit == -1) {

                    $("#anotacao_tarefa").css('border-color', 'red');

                    return
                }

                if ($(this).text().trim().length == 0) {



                    return
                }

                setListTitleLocalStorage($('#nota' + i).text())

                carrega_notas_server(lst_db[i])

                identificador = 1


            }

        });

    }
}



function clickEventEditarLista() {

    lst = document.querySelectorAll('.list-group-item-action')

    for (let i = 0; i < lst.length; i++) {

        $("#editarLista" + i).unbind();

        $("#editarLista" + i).click(function (e) {



            if ($("#anotacao_tarefa").is(":visible") && id_ult_edit == -1) {

                return
            }

            if ($("#nota" + i).text().trim().length == 0) {



                return
            }

            let nota = $("#nota" + i).text().trim()

            if (id_ult_edit != -1) {



                removeInput(id_ult_edit, text_ult_edit)
            }

            if (nota) {
                adicionaIput(i, nota, statuCheckBox(i))

                botaoSalvar()
            }



        });

    }
}




function checkEventNotas() {

    lst = document.querySelectorAll('.list-group-item-action')

    for (let i = 0; i < lst.length; i++) {

        $("#customCheck" + i).unbind();

        $("#customCheck" + i).change(function (e) {

            server_atualiza_nota_parcial(statuCheckBox(i), id_lista_storage, lst_db[i])

            e.preventDefault()

        });

    }
}


function statuCheckBox(id) {

    let check = $("#customCheck" + id).is(":checked") ? true : false;



    return check

}





function removeInput(id, texto_nota, status = false) {

    $("#textoId" + id).empty()

    $("#textoId" + id).append('<div id="nota' + id + '"> ' + texto_nota + ' </div>')

    $("#checkId" + id).empty()

    if (identificador != 0) {

        $("#checkId" + id).append(check(id))

        $("#customCheck" + id).prop("checked", status);
    }
    else {

        $("#checkId" + id).append(botaoEditarLista(id))

        clickEventEditarLista()

    }

}

function adicionaIput(id, nota, status = false) {

    $("#textoId" + id).empty()

    $("#textoId" + id).append(campoDigitaNota())

    $("#anotacao_tarefa").val(nota)

    text_ult_edit = nota

    id_ult_edit = id

    status_checked = status

    $("#checkId" + id_ult_edit).empty()

    $("#checkId" + id_ult_edit).append(botaoFechar())

    botaoExcluir(id)

}


function registroLogou(token, nome) {

    setTokenLocalStorage(token, nome)

    setListLocalStorage(0, 0)

    nomeUsuario()

    $('#exampleModalCenter').modal('hide')

    limpaCamposFormulario()

    location.reload()

}



function status_code_request(status_code, error_msg = '', thrownError = '') {

    SlickLoader.disable();

    if (status_code == 401) {
        clearLocalStorage()
        usuario_logado(true)
    }
    else if (error_msg) {
        info_erro_server(error_msg)
    }
    else if (thrownError) {
        info_erro_server(thrownError)
    }
    else {
        info_erro_server('Verifique sua conexão com a internet!')
    }
}

function eh_json(obj_str) {
    try {
        JSON.parse(obj_str)
        return true
    }
    catch (err) {

    }

    return false
}




function logout_usario() {

    status_code = 0

    if (!usuario_logado()) {
        return
    }

    loadingInfo("Aguarde...", "Deslogando usuário!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/logout/',
        type: 'POST',
        dataType: 'json',
        headers: { "Authorization": "Token " + JSON.parse(getLocalStorage('token')).token },
        contentType: 'application/json',
        error: function (jqxhr, settings, thrownError) {



            status_code = jqxhr.status
        },
        success: function (data) {


        },
        complete: function (data) {

            clearLocalStorage()

            SlickLoader.disable();

            location.reload()



        }
    });


}



function login_usario(user, pass) {

    status_code = 0

    loadingInfo("Aguarde...", "Logando usuário!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/login/',
        type: 'POST',
        data: JSON.stringify({ "username": user, "password": pass }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (jqxhr, settings, thrownError) {

            $('#info_login_error').empty()



            if (jqxhr.responseText && eh_json(jqxhr.responseText)) {

                response = jQuery.parseJSON(jqxhr.responseText)

                if (response['erro']) {

                    $.map(response['erro'], function (val, key) {



                        $('#info_login_error').append('* ' + val + '<br>')

                    });
                }
            }
            else if (thrownError) {

                $('#info_login_error').append('* Descupe, houve um erro!<br>')
                $('#info_login_error').append('* Erro: ' + jqxhr.status + ' ' + thrownError)

            }
            else {

                $('#info_login_error').append('* Erro de conexão! ')
            }


            status_code = jqxhr.status

        },
        success: function (data) {





            if (data['token'] && data['user']['username']) {

                registroLogou(data['token'], data['user']['username'])

            }


        },
        complete: function (data) {

            SlickLoader.disable();

        }
    });
}



function registra_usario(user, email, pass) {

    status_code = 0

    loadingInfo("Aguarde...", "Registrando usuário!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/register/',
        type: 'POST',
        data: JSON.stringify({ "username": user, "email": email, "password": pass }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (jqxhr, settings, thrownError) {




            if (jqxhr.responseText && eh_json(jqxhr.responseText)) {

                response = jQuery.parseJSON(jqxhr.responseText)

                if (response['erro']) {

                    $('#info_registra_error').empty()

                    if (Array.isArray((response['erro']))) {
                        $.map(response['erro'], function (val, key) {



                            $('#info_registra_error').append('* ' + val + '<br>')

                        });
                    }
                    else {
                        $('#info_registra_error').append('* ' + response['erro'])
                    }

                }
            }
            else if (thrownError) {

                $('#info_registra_error').empty()
                $('#info_registra_error').append('* Descupe, houve um erro!<br>')
                $('#info_registra_error').append('* Erro: ' + jqxhr.status + ' ' + thrownError)

            }
            else {
                $('#info_registra_error').empty()
                $('#info_registra_error').append('* Erro de conexão! ')
            }



            status_code = jqxhr.status
        },
        success: function (data) {






            if (data['token'] && data['user']['username']) {

                registroLogou(data['token'], data['user']['username'])
            }

        },
        complete: function (data) {

            SlickLoader.disable();

        }
    });
}


function loadingInfo(info1, info2) {
    SlickLoader.setText(info1, info2);
    SlickLoader.enable();
}

function criaLista(titulo) {

    if (!usuario_logado()) {
        return
    }

    status_code = 0

    loadingInfo('Aguarde...', "Salvando lista!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/lista/',
        type: 'POST',
        data: JSON.stringify({ "titulo": titulo }),
        dataType: 'json',
        headers: { "Authorization": "Token " + JSON.parse(getLocalStorage('token')).token },
        contentType: 'application/json',
        error: function (jqxhr, settings, thrownError) {



            status_code = jqxhr.status

            status_code_request(jqxhr.status, jqxhr.responseTex, thrownError)
        },
        success: function (data) {



            lst_db.push(data.id)

        },
        complete: function (data) {

            SlickLoader.disable();

        }
    });
}


function cria_nota(nota, lista_id) {

    if (!usuario_logado()) {
        return
    }

    status_code = 0

    loadingInfo('Aguarde...', "Salvando nota!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/nota/' + lista_id + '/',
        type: 'POST',
        data: JSON.stringify({ "tarefa_texto": nota }),
        dataType: 'json',
        headers: { "Authorization": "Token " + JSON.parse(getLocalStorage('token')).token },
        contentType: 'application/json',
        error: function (jqxhr, settings, thrownError) {



            status_code = jqxhr.status

            status_code_request(jqxhr.status, jqxhr.responseTex, thrownError)
        },
        success: function (data) {



            lst_db.push(data.id)

        },
        complete: function (data) {

            SlickLoader.disable();

        }
    });
}



function atualizaLista(titulo, lista_id) {

    if (!usuario_logado()) {
        return
    }

    status_code = 0

    loadingInfo('Aguarde...', "Atualizando lista!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/lista/' + lista_id + '/',
        type: 'PUT',
        data: JSON.stringify({ "titulo": titulo }),
        dataType: 'json',
        headers: { "Authorization": "Token " + JSON.parse(getLocalStorage('token')).token },
        contentType: 'application/json',
        error: function (jqxhr, settings, thrownError) {



            status_code = jqxhr.status

            status_code_request(jqxhr.status, jqxhr.responseTex, thrownError)
        },
        success: function (data) {



        },
        complete: function (data) {

            SlickLoader.disable();

        }
    });
}




function atualiza_nota(nota, lista_id, nota_id, status = false) {

    if (!usuario_logado()) {
        return
    }

    status_code = 0

    loadingInfo('Aguarde...', "Atualizando nota!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/nota/' + nota_id + '/',
        type: 'PUT',
        data: JSON.stringify({ "tarefa_texto": nota, "status": status }),
        dataType: 'json',
        headers: { "Authorization": "Token " + JSON.parse(getLocalStorage('token')).token },
        contentType: 'application/json',
        error: function (jqxhr, settings, thrownError) {



            status_code = jqxhr.status

            status_code_request(jqxhr.status, jqxhr.responseTex, thrownError)
        },
        success: function (data) {



        },
        complete: function (data) {

            SlickLoader.disable();

        }
    });
}




function server_atualiza_nota_parcial(status, lista_id, nota_id) {

    if (!usuario_logado()) {
        return
    }

    status_code = 0

    loadingInfo('Aguarde...', "Atualizando check!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/nota/' + nota_id + '/',
        type: 'PATCH',
        data: JSON.stringify({ "status": status }),
        dataType: 'json',
        headers: { "Authorization": "Token " + JSON.parse(getLocalStorage('token')).token },
        contentType: 'application/json',
        error: function (jqxhr, settings, thrownError) {



            status_code = jqxhr.status

            status_code_request(jqxhr.status, jqxhr.responseTex, thrownError)
        },
        success: function (data) {




        },
        complete: function (data) {

            SlickLoader.disable();

        }
    });
}



function deletaLista(lista_id) {

    if (!usuario_logado()) {
        return
    }

    status_code = 0

    loadingInfo('Aguarde...', "Deletando lista!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/lista/' + lista_id + '/',
        type: 'DELETE',
        dataType: 'json',
        headers: { "Authorization": "Token " + JSON.parse(getLocalStorage('token')).token },
        contentType: 'application/json',
        error: function (jqxhr, settings, thrownError) {



            status_code = jqxhr.status

            status_code_request(jqxhr.status, jqxhr.responseTex, thrownError)
        },
        success: function (data) {



        },
        complete: function (data) {

            SlickLoader.disable();

        }


    });
}



function excluir_nota(nota_id) {

    if (!usuario_logado()) {
        return
    }

    status_code = 0

    loadingInfo("Aguarde...", "Excluindo nota!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/nota/' + nota_id + '/',
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        headers: { "Authorization": "Token " + JSON.parse(getLocalStorage('token')).token },
        error: function (jqxhr, settings, thrownError) {



            status_code = jqxhr.status

            status_code_request(jqxhr.status, jqxhr.responseTex, thrownError)
        },
        success: function (data) {



        },
        complete: function (data) {

            SlickLoader.disable();

        }
    });
}


function usuario_logado(forcado = false) {

    if (!JSON.parse(getLocalStorage('token')) || forcado) {

        $('#exampleModalCenter').modal('show')

        loginFormularioDinamico(true)

        return false
    }

    return true
}



function server_listas() {

    if (!usuario_logado()) {
        return
    }

    status_code = 0

    loadingInfo("Aguarde...", "Carregando listas!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/lista/',
        type: 'GET',
        dataType: 'json',
        headers: { "Authorization": "Token " + JSON.parse(getLocalStorage('token')).token },
        contentType: "application/json;charset=utf-8",
        success: function (data) {



            carregaTarefa(data)

        },
        error: function (jqxhr, settings, thrownError) {



            status_code = jqxhr.status

            status_code_request(jqxhr.status, jqxhr.responseTex, thrownError)
        },
        complete: function (data) {

            SlickLoader.disable();

        }

    });
}



function carrega_notas_server(lista_id) {

    if (!usuario_logado()) {
        return
    }

    status_code = 0

    loadingInfo("Aguarde...", "Carregando notas!")

    $.ajax({

        url: 'http://127.0.0.1:8000/api/notas/' + lista_id,
        type: 'GET',
        dataType: 'json',
        headers: { "Authorization": "Token " + JSON.parse(getLocalStorage('token')).token },
        contentType: "application/json;charset=utf-8",
        success: function (data) {



            carregaTarefa(data)

            setListLocalStorage(1, lista_id)

            carregaStorage()

            if (JSON.parse(getLocalStorage('titulo'))) {

                $('#titulo_tarefa').text(JSON.parse(getLocalStorage('titulo')).titulo)

            }



        },
        error: function (jqxhr, settings, thrownError) {



            status_code = jqxhr.status

            status_code_request(jqxhr.status, jqxhr.responseTex, thrownError)

        },
        complete: function (data) {

            SlickLoader.disable();

        }

    });
}

/*$("#nome").keyup(function(e){

    $(this).val($(this).val().toLowerCase().trim()); 
  
    space = $(this).val().split(" ")  

    if(space.length>0){
        console.log('tem espaço -----')
    }
 
});*/

$("#nome").keyup(function(e){   

    $(this).val($(this).val().toLowerCase().trim());  
    txt = $(this).val()   

    if(txt.match(/[^a-z0-9@#$]/)){ 
        $('#info_registra_error').text('Caracteres válidos para o nome de usuário @ # $')
    } 
   
    txt = txt.replace(/[^a-z0-9@#$]/g,'')
  
    $(this).val(txt) 
});

$("#senha, #senha2").keyup(function(e){
    
    if($(this).val().includes(" ")){
        $('#info_registra_error').text('Senha não pode ter espaço!')
    }

    $(this).val($(this).val().toLowerCase().trim());  
    txt = $(this).val()  
    $(this).val(txt) 
});


 




function setTokenLocalStorage(token, user_name = '') {
    window.localStorage.setItem('token', JSON.stringify({ 'token': token, 'user_name': user_name }))
}

function setListLocalStorage(identificador, id_lista, titulo = '') {
    window.localStorage.setItem('lista', JSON.stringify({ identificador: identificador, id_lista: id_lista }))
}

function setListTitleLocalStorage(lista_titulo) {

    if (lista_titulo.length > 20) {
        lista_titulo = lista_titulo.substring(0, 20) + '...'
    }

    window.localStorage.setItem('titulo', JSON.stringify({ titulo: lista_titulo }))
}


function getLocalStorage(key) {
    return window.localStorage.getItem(key);
}

function removeItemLocalStorage(key) {
    localStorage.removeItem(key)
}

function clearLocalStorage() {
    localStorage.clear()

}






