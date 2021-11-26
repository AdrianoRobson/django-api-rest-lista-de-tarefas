var lst_tarefa = []
var id_tarefa = 0

$(document).ready(function(){    
    
    SlickLoader.setText('Processando','Aguarde...'); 
    
    send(1) 

    $(".btn").click(function () {  

        tarefas(campoDigitaNota(), (document.querySelectorAll('.list-group-item-action').length)+1)
    });
     
});


function mostrarHome(){ 
   $("#tarefa_lista").hide();
   $("#home").show() 
}  


function mostrarTarefa(){
    $("#tarefa_lista").show();
    $("#home").hide() 
}

function campoDigitaNota(){
        
    form = '<input type="email" class="form-control" id="anotacao_tarefa" placeholder="Tarefa de máximo 50 caracteres">'     
    
    return form
}

function tarefas(tarefa_texto, id){ 

    $('#tarefa_lista').append('<li class="list-group-item rounded-0">'+    
    '    <div class="row">'+         
    '      <div class="col-10 list-group-item-action" id="textoId'+id+'" >'+ 
    '        <div> '+tarefa_texto+' </div>'+
    '      </div>'+    
    '      <div class="col-2">'+ 
    '        <div class="custom-control custom-checkbox">'+
    '           <input class="custom-control-input" id="customCheck'+id+'" type="checkbox">'+ 
    '           <label class="cursor-pointer custom-control-label" for="customCheck'+id+'"></label>'+
    '        </div>'+
    '      </div>'+    
    '    </div>'+   
    '</li>')

}

function carregaTarefa(data){

    mostrarTarefa()

    $("#tarefa_lista a").remove(); 

    for(i=0; i<data.length; i++){
                
        console.log('datas: ',data[i].tarefa_texto)

        tarefas(data[i].tarefa_texto, data[i].id)   

    }   

    lst_tarefa = document.querySelectorAll('.list-group-item-action')

    for(let i = 0; i< lst_tarefa.length; i++){ 
        
        console.log('lsit: ',i)

        $("#"+lst_tarefa[i].id).click(function () {  
        
            console.log(lst_tarefa[i].id)

        });
    
    }

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

function send(tarefa_id='') { 

    SlickLoader.enable();

    $.ajax({

        url: 'http://127.0.0.1:8000/lista/'+tarefa_id,
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