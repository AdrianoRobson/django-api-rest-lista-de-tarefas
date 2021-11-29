var lst_tarefa = []

var lst_db = []

var id_ult_edit = -1

var status_checked = false

var text_ult_edit = ''  

$(document).ready(function(){    
    
    SlickLoader.setText('Processando','Aguarde...'); 
    
    send(2) 
     
   // send2()

    $(".btn").click(function () {  
        
        console.log('icone: ', $(".btn i").attr("class"))
        
        if(ehBotaoPadrao()){ 
            
            console.log('criar editar nota')

            tarefas(campoDigitaNota(), idUltimaNota(), botaoFechar())
        }
        else if(ehBotaoSalvar()){

            if($("#anotacao_tarefa").val().trim().length > 0){
                
                console.log('envia para servidor') 
                
                var nota = $("#anotacao_tarefa").val().trim()

                if (id_ult_edit == -1){
                    
                    //var nota = $("#anotacao_tarefa").val().trim()

                    $("#linha"+idUltimaNota()).remove() 
                    
                    tarefas(nota, idUltimaNota())   

                    clickEventNotas()
                    checkEventNotas()

                    botaoPadrao()

                    // CRIA NOTA
                    send3(nota,2)

                    editReset()

                }
                else if(id_ult_edit != -1){  

                    console.log('edit envia server: ', nota)

                    removeInput(id_ult_edit, nota, status_checked) 

                    // ATUALIZA NOTA
                    send4(nota, 2, lst_db[id_ult_edit], status_checked)  

                    editReset()

                    botaoPadrao()

                    checkEventNotas() 
                }
                
            } 
             
        }        
    });
     
});

function editReset(){

    id_ult_edit = -1
    text_ult_edit = ''
    status_checked = false

}

function ehBotaoPadrao(){
    
    if($(".btn i").attr("class").includes('fa-edit')){
        
        return true

    }

    return false    
}


function ehBotaoSalvar(){
    
    if($(".btn i").attr("class").includes('fa-check')){
        
        return true

    }

    return false    
}

function idUltimaNota(){ 
         
    return lst_db.length

}

function extraiNumero(text){
    return text.replace(/[^0-9]/g, '') 
}

function mostrarHome(){ 
   $("#tarefa_lista").hide();
   $("#home").show() 
}  


function mostrarTarefa(){
    $("#tarefa_lista").show();
    $("#home").hide() 
}

function campoDigitaNota(){
        
    form = '<input type="email" class="form-control" id="anotacao_tarefa" placeholder="Tarefa de no máximo 50 caracteres">'     
    
    return form
}

function check(id){
   ret = '           <input class="custom-control-input" id="customCheck'+id+'" type="checkbox">'+ 
    '           <label class="cursor-pointer custom-control-label" for="customCheck'+id+'"></label>'

    return ret
}

function botaoFechar(){  
    return '<i class="fas fa-times fa-2x" id="fechar"></i>'       
}


function tarefas(tarefa_texto, id, elemento=check(id)){ 

    $('#tarefa_lista').append('<li class="list-group-item rounded-0" id="linha'+id+'">'+    
    '    <div class="row">'+         
    '      <div class="col-10 list-group-item-action" id="textoId'+id+'" >'+ 
    '        <div id="nota'+id+'"> '+tarefa_texto+' </div>'+
    '      </div>'+    
    '      <div class="col-2">'+ 
    '        <div class="custom-control custom-checkbox" id="checkId'+id+'">'+
                elemento+
    '        </div>'+
    '      </div>'+    
    '    </div>'+   
    '</li>')

    if (elemento.startsWith("<i class")){

        $("#fechar").click(function () {   
 
            botaoPadrao()

             $("#linha"+idUltimaNota()).remove()  

        });        

        botaoSalvar()  
    } 

    

}

function botaoExcluir(id){

    $("#fechar").click(function () {    

        // EXCLUIR UMA NOTA
        send5(lst_db[id]) 

        location.reload()

    });

    botaoSalvar()
}

function botaoPadrao(){
    $(".btn i").remove()             
    $(".btn").append('<i class="fas fa-edit fa-2x" id="icon"></i>')
}

function botaoSalvar(){
    $(".btn i").remove()
    $(".btn").append('<i class="fas fa-check fa-2x"></i>')
}

function carregaTarefa(data){

    mostrarTarefa()

    $("#tarefa_lista a").remove(); 

    if(Array.isArray((data))){

        console.log('é array')

        for(i=0; i<data.length; i++){
                
            console.log('datas: ',data[i].tarefa_texto)

            lst_db.push(data[i].id)
    
            tarefas(data[i].tarefa_texto, i)            
            
            $("#customCheck"+i).prop( "checked", data[i].status );
    
        }   
    }
    else{
        console.log('___data: ', data) 
    } 

    clickEventNotas()  
    checkEventNotas()
}


 

function clickEventNotas(){

    lst_tarefa = []

    lst_tarefa = document.querySelectorAll('.list-group-item-action')

    for(let i = 0; i < lst_tarefa.length; i++){  
        
        $("#textoId"+i).unbind();

        $("#textoId"+i).mousedown(function (e) {   
              
            console.log('ID: ',    lst_tarefa[i].id)

            if ($("#anotacao_tarefa").is(":visible") && id_ult_edit==-1){  

                return
            }

            if($(this).text().trim().length == 0){
                
                console.log('entro')

                return
            } 

            let nota = $(this).text().trim()      

            if( id_ult_edit != -1){
                
                console.log('EDIT ATIVADO: ', id_ult_edit )  

                removeInput(id_ult_edit, text_ult_edit, status_checked)
            }

            if(nota)
            {
                adicionaIput(i, nota, statuCheckBox(i)) 

                botaoSalvar()
            }
 
             
        }); 
    
    } 
}




function checkEventNotas(){
  
    lst = document.querySelectorAll('.list-group-item-action')

    for(let i = 0; i < lst.length; i++){   

        $("#customCheck"+i).unbind(); 

        $("#customCheck"+i).change(function (e){ 

            send04(statuCheckBox(i), 2, lst_db[i])  

            e.preventDefault() 

        });
    
    } 
}


function statuCheckBox(id){

    let check = $("#customCheck"+id).is(":checked") ? true : false;

    console.log(' ________________________STATUS CHECKBOX: ', check)

    return check

}





function removeInput(id, texto_nota, status=false){

    $("#textoId"+id).empty()

    $("#textoId"+id).append('<div id="nota'+id+'"> '+texto_nota+' </div>') 

    $("#checkId"+id).empty()

    $("#checkId"+id).append(check(id))

    $("#customCheck"+id).prop("checked", status);  
}

function adicionaIput(id, nota, status=false){

    $("#textoId"+id).empty()
                
    $("#textoId"+id).append(campoDigitaNota())

    $("#anotacao_tarefa").val(nota)

    text_ult_edit = nota

    id_ult_edit = id

    status_checked = status

    $("#checkId"+id_ult_edit).empty()

    $("#checkId"+id_ult_edit).append(botaoFechar())

    botaoExcluir(id)

}
 

function carregaLista(data){

    mostrarHome()

    $("#home a").remove(); 

    for(i=0; i<data.length; i++){
                
        console.log('data: ',data[i].titulo)

        $('#home').append('<a href="#" class="list-group-item list-group-item-action" id="'+data[i].id+'">'+data[i].titulo+'</a>')
          
    }   

    lst_lista = document.querySelectorAll('#home a')

    for(let i = 0; i< lst_lista.length; i++){        

        $("#"+lst_lista[i].id).click(function () {  
        
            console.log(lst_lista[i].id)

            send(lst_lista[i].id)

        });
    
    }
}





function send3(nota, lista_id) {    

    $.ajax({ 
          
        url: 'http://127.0.0.1:8000/api/nota/',
        type: 'POST',
        data: JSON.stringify({"lista_id": lista_id, "tarefa_texto": nota}),
        dataType: 'json',
        contentType: 'application/json',
        error: function(jqxhr, settings, thrownError) {
            
            console.log('Houve um erro! ');   
        },
        success: function (data) { 
            
            console.log('DATA RETORNO: ', data)  

            lst_db.push(data.id)

        }, 
    });
}
 

function send4(nota, lista_id, nota_id, status=false) {    

    $.ajax({ 
          
        url: 'http://127.0.0.1:8000/api/nota/'+nota_id+'/',
        type: 'PUT',
        data: JSON.stringify({"lista_id": lista_id, "tarefa_texto": nota, "status": status}),
        dataType: 'json',
        contentType: 'application/json',
        error: function(jqxhr, settings, thrownError) {
            
            console.log('Houve um erro! ');   
        },
        success: function (data) { 
            
            console.log('DATA RETORNO: ', data)  

        }, 
    });
}




function send04(status, lista_id, nota_id) {    

    $.ajax({  
        
        url: 'http://127.0.0.1:8000/api/nota/'+nota_id+'/',
        type: 'PATCH',
        data: JSON.stringify({"lista_id": lista_id, "status": status}),
        dataType: 'json',
        contentType: 'application/json',
        error: function(jqxhr, settings, thrownError) {
            
            console.log('Houve um erro! ');   
        },
        success: function (data) { 
            
            console.log('DATA RETORNO: ', data)  

        }, 
    });
}





function send5(nota_id) {    

    $.ajax({ 
          
        url: 'http://127.0.0.1:8000/api/nota/'+nota_id+'/',
        type: 'DELETE', 
        dataType: 'json',
        contentType: 'application/json',
        error: function(jqxhr, settings, thrownError) {
            
            console.log('Houve um erro! ');   
        },
        success: function (data) { 
            
            console.log('DATA RETORNO: ', data)  

        }, 
    });
}


function send2() {  

    SlickLoader.enable();

    $.ajax({

        //url: 'http://127.0.0.1:8000/cria/tarefa/', POST JSON.stringify({"tarefa_texto": "SOU UM PROGRAMADOR MUITO FODA"}),
        url: 'http://127.0.0.1:8000/api/notas/1/',
        type: 'GET',
        //data: JSON.stringify({"tarefa_texto": "SOU UM PROGRAMADOR MUITO FODA"}),
        dataType: 'json',
        contentType: 'application/json',
        error: function(jqxhr, settings, thrownError) {
            
            console.log('Houve um erro! '); 

            SlickLoader.disable(); 

            mostrarHome()  
 
        },
        success: function (data) { 
            
            console.log('DATA RETORNO: ', data)
            
            SlickLoader.disable();    

        }, 
    });
}



function send(tarefa_id='') { 

    SlickLoader.enable();

    $.ajax({

        url: 'http://127.0.0.1:8000/api/notas/'+tarefa_id,
        type: 'GET', 
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function (data) { 

            console.log('DATA: ',typeof( data))
            
            if(tarefa_id){
                carregaTarefa(data)
            }            
            else{ 
                carregaLista(data)
            } 

            SlickLoader.disable();    

        }, 
        error: function(jqxhr, settings, thrownError) {
            
            console.log('Houve um erro! '); 

            SlickLoader.disable(); 

            mostrarHome()  
 
        },
     
    });
}







 
