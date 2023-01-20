/**
 *
 *   Variáveis Globais
 *
 */
let dataJson;
let webservice = "cervejarias.json";
let cervejarias = document.getElementById("cervejarias");
let cervejas = document.getElementById("cervejas");

let btnVoltar = document.getElementById("btnVoltar");
let title_cervejaria = document.getElementById("title_cervejaria");
let btInstall = document.getElementById("btInstall");
let celular_compra = "31997222874";
let nome_cervejaria;

/**
 *
 *   Funções principais
 *
 */

// leitura dos dados
function loadData() {
  let ajax = new XMLHttpRequest();

  ajax.open("GET", webservice, true);
  ajax.send();

  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      dataJson = JSON.parse(this.responseText);
      printCervejarias();
    } else {
      dataJson = "{}";
    }
    console.log(dataJson);
  };
}

loadData();

// monta o card de cervejas
function printCervejarias() {
  ativarCervejaria();

  let html = "";

  if (dataJson.length > 0) {
    html = alert('<i class="fa-solid fa-beer-mug-empty"></i> Cervejarias', "alert alert-secondary");
    let card = "";

    html += '<div class="row">';
    dataJson.forEach((item) => {
      html += criarCardCervejaria(item.id, item.name, item.address);
    });
    html += "</div>";
  } else {
    html = alert('<i class="fa-solid fa-beer-mug-empty"></i> Não existe cervejarias', "alert alert-danger");
  }

  cervejarias.innerHTML = html;
}

// monta o card de cervejarias
function printCervejas(id) {
  ativarCerveja();

  let html = alert('<i class="fa-solid fa-circle-info"></i> Informações da Cervejaria', "alert alert-secondary");
  html += criarCardCerveja(id);
  cervejas.innerHTML = html;
}

/**
 * config do cache do PWA
 */

const CACHE_DINAMICO = "wikicerva_dinamico";

let cacheDinamico = function () {
  if ("caches" in window) {
    let ARQUIVOS_DINAMICOS = [webservice];

    caches.delete(CACHE_DINAMICO).then(function () {
      if (dataJson.length > 0) {
        for (let i = 0; i < dataJson.length; i++) {
          if (ARQUIVOS_DINAMICOS.indexOf(dataJson[i].image) == -1) {
            ARQUIVOS_DINAMICOS.push(dataJson[i].image);
          }

          for (let j = 0; j < dataJson[i].beers.length; j++) {
            if (ARQUIVOS_DINAMICOS.indexOf(dataJson[i].beers[j].image) == -1) {
              ARQUIVOS_DINAMICOS.push(dataJson[i].beers[j].image);
            }
          }
        }

        caches.open(CACHE_DINAMICO).then(function (cache) {
          cache.addAll(ARQUIVOS_DINAMICOS).then(function () {
            console.log("Cache dinâmico realizado com sucesso!");
          });
        });
      }
    });
  }
};

/**
 *
 * Botão de Instalação
 *
 */

let janelaInstalacao = null;

window.addEventListener("beforeinstallprompt", gravarJanela);

function gravarJanela(evt) {
  janelaInstalacao = evt;
}

let inicializarInstalacao = function () {
  setTimeout(function () {
    if (janelaInstalacao != null) {
      btInstall.removeAttribute("hidden");
    }
  }, 500);

  btInstall.addEventListener("click", function () {
    btInstall.setAttribute("hidden", true);
    btInstall.hidden = true;

    janelaInstalacao.prompt();

    janelaInstalacao.userChoice.then((choice) => {
      if (choice.outcome === "accepted") {
        console.log("Usuário instalou o app!");
      } else {
        console.log("Usuário NÃO instalou o app!");
        btInstall.hidden = false;
        btInstall.removeAttribute("hidden");
      }
    });
  });
};

/**
 *
 *   Funções do template
 *
 */
function criarCardCervejaria(id, titulo, descricao) {
  return `<div class="col-md-3 col-12">
                <div class="card my-2 text-center">
                    <img src="./webroot/images/cerveja.jpg" class="card-img-top" />
                    <div class="card-body">
                        <h5 class="card-title">${titulo}</h5>
                        <p class="card-text">${descricao}</p>
                        <a href="#" class="btn btn-danger" onclick="printCervejas(${id})" style="width: 100%;"><i class="fa-regular fa-beer-mug-empty"></i> Visualizar</a>
                    </div>
                </div>
            </div>`;
}

function criarCardCerveja(id) {
  let dados = dataJson.filter(function (data) {
    return data.id == id;
  });

  return `<div class="row">
                <div class="col-12">
                    <div class="card mb-3">
                        <div class="card-header text-center">${dados[0].name}</div>
                        <img src="./webroot/images/cerveja2.jpg" class="card-img-top" />
                        <div class="card-body">
                            <p class="card-text">${dados[0].bio}</p>
                        </div>
                        <div class="card-footer bg-transparent">
                            <a href="#" class="btn btn-primary" style="width: 100%;" onclick="printCervejarias()"><i class="fa-solid fa-arrow-left"></i> Voltar</a>
                        </div>
                    </div>
                </div>
            </div>`;
}

function ativarCervejaria() {
  cervejas.style.display = "none";
  cervejarias.style.display = "block";
}

function ativarCerveja() {
  cervejas.style.display = "block";
  cervejarias.style.display = "none";
}

function alert(texto, classe = "alert alert-primary") {
  return '<div class="' + classe + '" role="alert">' + texto + "</div>";
}
