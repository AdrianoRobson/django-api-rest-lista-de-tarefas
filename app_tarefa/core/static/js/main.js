var lst_tarefa = []

$(document).ready(function(){    
    
    SlickLoader.setText('Processando','Aguarde...'); 
    
    //send()

    lst_tarefa = document.querySelectorAll('#home a')
    
    for(let i = 0; i< lst_tarefa.length; i++){        

        $("#"+lst_tarefa[i].id).click(function () {  
             
            console.log(lst_tarefa[i].id)

        });    

    } 

    $(".btn").click(function () { 

    }); 
    
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

function send(tarefa_id='') { 

    SlickLoader.enable();

    $.ajax({

        url: 'http://127.0.0.1:8000/lista/',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        error: function(jqxhr, settings, thrownError) {
            
            console.log('Houve um erro! '); 

            SlickLoader.disable(); 

            mostrarHome()  
 
        },
        success: function (data) { 

            mostrarTarefa() 

            for(i=0; i<data.length; i++){
                
                console.log('data: ',data[i].titulo)

                $('#home').append('<a href="#" class="list-group-item list-group-item-action" id="'+data[i].id+'">'+data[i].titulo+'</a>')

            }

            SlickLoader.disable();   

            mostrarTarefa() 

        }, 
    });
}