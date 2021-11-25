var lst_tarefa = []

$(document).ready(function(){    
    
    lst_tarefa = document.querySelectorAll('#home a')
    
    for(let i = 0; i< lst_tarefa.length; i++){        

        $("#"+lst_tarefa[i].id).click(function () {   

            console.log(lst_tarefa[i].id)

        });    

    }

    SlickLoader.setText('Processando','Aguarde...');   

    $(".btn").click(function () { 

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



function send(tarefa_id) { 

    SlickLoader.enable();

    $.ajax({

        url: 'http://localhost:8001/tarefa/'+tarefa_id,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        error: function(jqxhr, settings, thrownError) {
            
            console.log('Houve um erro! ' + thrownError); 

            SlickLoader.disable();

            mostrarHome() 

            $(".alert").alert()

            $("#msg").text("Houve um problema: "+thrownError) 

        },
        success: function (data) {
            
            console.log('DATA MSG: ',data.msg);

            SlickLoader.disable();

            data = JSON.stringify(data)

            console.log('DATA STRINGIFY: ',data);

            mostrarTarefa()

        },
        
        //data: JSON.stringify(person)
    });
}