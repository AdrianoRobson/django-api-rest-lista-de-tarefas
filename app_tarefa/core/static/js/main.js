var lst_tarefa = []

var id_ult_edit = 0
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

                if (id_ult_edit == 0){
                    
                    //var nota = $("#anotacao_tarefa").val().trim()

                    $("#linha"+idUltimaNota()).remove() 
                    
                    tarefas(nota, idUltimaNota())   

                    clickEventNotas()

                    botaoPadrao()

                    // CRIA NOTA
                    send3(nota,2)

                }
                else if(id_ult_edit > 0){  

                    console.log('edit envia server: ', nota)

                    removeInput(id_ult_edit, nota) 

                    // ATUALIZA NOTA
                    send4(nota, 2, id_ult_edit)  

                    editReset()

                    botaoPadrao()

                }
                
            } 
             
        }        
    });
     
});

function editReset(){

    id_ult_edit = 0
    text_ult_edit = ''

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

     if (lst_tarefa) {
         
        return parseInt((lst_tarefa[lst_tarefa.length-1].id).replace(/[^0-9]/g, ''))+1;

     } 

    return 0
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
 
        botaoPadrao()

        $("#linha"+id).remove()
        
        // EXCLUIR UMA NOTA
        send5(id)
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

    for(i=0; i<data.length; i++){
                
        console.log('datas: ',data[i].tarefa_texto)

        tarefas(data[i].tarefa_texto, data[i].id)   

    }   

    clickEventNotas() 

    //console.log('ULTIMO ELMENTO: ', (lst_tarefa[lst_tarefa.length-1].id).replace(/[^0-9]/g, ''))

}


function clickEventNotas(){

    lst_tarefa = document.querySelectorAll('.list-group-item-action')

    for(let i = 0; i< lst_tarefa.length; i++){ 
        
       

        $("#"+lst_tarefa[i].id).mousedown(function (e) {   
 
             
            console.log('ID: ',    $(this).text().trim().length)

            if($(this).text().trim().length == 0){
                
                console.log('entro')

                return
            } 

            let nota = $(this).text()      

            if( id_ult_edit > 0){
                
                console.log('EDIT ATIVADO: ', id_ult_edit ) 

                /*$("#textoId"+id_ult_edit).empty()

                $("#textoId"+id_ult_edit).append('<div id="nota'+id_ult_edit+'"> '+text_ult_edit+' </div>') 

                $("#checkId"+id_ult_edit).empty()

                $("#checkId"+id_ult_edit).append(check(id_ult_edit))*/

                removeInput(id_ult_edit, text_ult_edit)
            }

            if(nota)
            {
                adicionaIput(extraiNumero(lst_tarefa[i].id), nota)

                /*$(this).empty()
                
                $(this).append(campoDigitaNota())

                $("#anotacao_tarefa").val(nota)

                text_ult_edit = nota

                id_ult_edit = extraiNumero(lst_tarefa[i].id)

                $("#checkId"+id_ult_edit).empty()

                $("#checkId"+id_ult_edit).append(botaoFechar())*/


                botaoSalvar()
            }

           // e.preventDefault();
             
        });
    
    } 
}

function removeInput(id, texto_nota){

    $("#textoId"+id).empty()

    $("#textoId"+id).append('<div id="nota'+id+'"> '+texto_nota+' </div>') 

    $("#checkId"+id).empty()

    $("#checkId"+id).append(check(id))
}

function adicionaIput(id, nota){

    $("#textoId"+id).empty()
                
    $("#textoId"+id).append(campoDigitaNota())

    $("#anotacao_tarefa").val(nota)

    text_ult_edit = nota

    id_ult_edit = id

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

        }, 
    });
}
 

function send4(nota, lista_id, nota_id) {    

    $.ajax({ 
          
        url: 'http://127.0.0.1:8000/api/nota/'+nota_id+'/',
        type: 'PUT',
        data: JSON.stringify({"lista_id": lista_id, "tarefa_texto": nota}),
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
        contentType: 'application/json',
        error: function(jqxhr, settings, thrownError) {
            
            console.log('Houve um erro! '); 

            SlickLoader.disable(); 

            mostrarHome()  
 
        },
        success: function (data) { 
            
            if(tarefa_id){
                carregaTarefa(data)
            }            
            else{ 
                carregaLista(data)
            } 

            SlickLoader.disable();    

        }, 
    });
}







 
