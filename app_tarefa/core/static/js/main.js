var lst_tarefa = []

$(document).ready(function(){    
    
    SlickLoader.setText('Processando','Aguarde...'); 
    
    send()

   /* lst_tarefa = document.querySelectorAll('#home a')
    
    for(let i = 0; i< lst_tarefa.length; i++){        

        $("#"+lst_tarefa[i].id).click(function () {  
             
            console.log(lst_tarefa[i].id)

        });    

    } */

    $(".btn").click(function () { 

    });
    
    //$('#home').append('<a href="#" class="list-group-item list-group-item-action" id="'+1+'">'+2+'</a>')

    
    //$(".alert").alert() 
});


function mostrarHome(){
    $("#tarefa_lista").hide();
    $("#home").show() 
}

function mostrarTarefa(){
    $("#tarefa_lista").show();
    $("#home").hide()
}

function carregaListaTarefa(data){

    $("#home a").remove(); 

    for(i=0; i<data.length; i++){
                
        console.log('data: ',data[i].titulo)

        $('#home').append('<a href="#" class="list-group-item list-group-item-action" id="'+data[i].id+'">'+data[i].titulo+'</a>')
          
    }   

    lst_tarefa = document.querySelectorAll('#home a')

    for(let i = 0; i< lst_tarefa.length; i++){        

        $("#"+lst_tarefa[i].id).click(function () {  
        
            console.log(lst_tarefa[i].id)

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
 
            carregaListaTarefa(data)

            SlickLoader.disable();    

        }, 
    });
}