
# django-api-rest-lista-de-tarefas
> Uma aplicação web 100% funcional e testada para organizar as tarefas diárias com opção de checkagem para as tarefas que foram completadas. 
Com essa aplicação é possível criar um usuário para fazer o login e criar, editar, excluir e atualizar as suas tarefa diárias. 

A vantagem dessa aplicação é o fato do usuário poder marcar como completa depois de realizar a tarefa. Isso é util para tarefas que devem seguir uma ordem cronológica ou uma forma de você saber o que você ja executou. Um exemplo disso é uma lista de compras de supermercado. Quando você vai ao supermercado e conta com uma lista que não tem a opção de checagem, acaba se perdendo no que comprou ou não em meio aos produtos no carrinho de compras.

O projeto foi desenvolvido seguindo o conceito Mobile First com foco inicial da arquitetura e desenvolvimento direcionado para dispositívos móveis.

A API web foi 100% testada seguindo o conceito de testes TDD (Test-Driven Development, ou Desenvolvimento Orientado a Testes). Para automatização dos teste foi utilizado a ferramenta Coverage para analizar o que testar. Para a criação automatizada de objetos foi utilizado a biblioteca model-mommy

Este é um projeto testado  projeto é o conjunto de 2 aplicões web(APP + API) desenvolvidas usando Django e Django REST framework com validação via token ao acesso à API usando django-rest-knox para agilizar o desenvolvimento e dar mais securança as requisições feitas à API. O banco de dados utilizado na API é Mysql 5.7


![](pag.png)

## Instalação de ferramentas para o ambiente de desenvolvimento

Este projeto é 100% Dockerizado. Para executar esse projeto você vai precisar ter docker instalado na sua máquina

#### Mac & Windows  
Instalar a ferramenta Docker Desktop - [Docker Desktop](https://www.docker.com/products/docker-desktop)  
 
 
#### Linux
Caso não tenha docker instalado na sua máquina, siga essa [documentação](https://docs.docker.com/engine/install/ubuntu/) do time do Docker para instalação no Linux

## Executar projeto

Tanto para Linux quanto para Mac & Windows você vai executar os seguintes comandos pelo terminal ou cmd dentro do diretório onde se encontra o arquivo _docker-compose.yaml_

Vamos executar o docker-compose para buildar e criar os 3 containers do serviços(db, web_api, web)

```sh
docker-compose up
```

Após a criação dos 3 containers, vamos derrubar esses containers com as teclas de atalho(CTRL + C) no terminal ou cmd e rodar novamente o docker-compse up pois a aplicação mysql pode quebrar no build de criaçao da imagem execução do container.

Agora precisamos criar as tabelas no banco de dados Mysql no container _api-tarefa_container_. Vamos abrir outro terminal ou cmd dentro do diretório do projeto onde se encontra o arquivo docker-compose.yaml e executar o seguinte comando

```sh
docker exec -it api-tarefa_container python manage.py migrate
```

Agora já podemos acessar nossa aplicação no navegador/Browser e fazer o registro de um usuários para poder logar e criar tarefas. 

Digite o seguinte endereço na url do navegador:
http://127.0.0.1:8001/

## Exemplo de uso

Alguns exemplos que motivariam as pessoas a
utilizarem seu projeto ou que demonstrasse
que este é últil para alguma coisa. Divida 
esta parte em partes menores e se possível 
coloque algum código ou prints de telas.

## Ambiente de Desenvolvimento

Descrever como instalar e preparar qualquer
dependência de desenvolvimento para que
seu projeto possa ser executado localmente
e pessoas possam contribuir com o mesmo.
Se possível forneça as informações para
diferentes plataformas, exemplo Windows,
Linux e Mac OS.

## Histórico de Atualizações

* 0.2.1
    * CHANGE: Atualização dos docs (o código não foi alterado)
* 0.2.0
    * CHANGE: Removida a função `setPadrãoXYZ()`
    * ADD: Adicionado a função `inicializar()`
* 0.1.1
    * FIX: Crash quando executava `escrever()` (Obrigado ao @Contribuidor)
* 0.1.0
    * O primeiro lançamento estável
    * CHANGE: Renomeado de `Projeto XYZ` para `Projeto ABC`
* 0.0.1
    * Projeto inicial


## Meta

Seu nome - [@SeuTwitter](https://twitter.com/seuTwitter) - seuemail@gmail.com

Distribuído sobre a licença. Veja `LICENÇA` para mais informações.

[https://github.com/seuusuaurio/seuprojeto](https://github.com/seusuario)
