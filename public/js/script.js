let user_playlists = [];

let variable1 = document.getElementById("variable1").innerHTML;
let variable2 = document.getElementById("variable2").innerHTML;
/*let playlists = variable1;
let savedTracks = variable2;*/
let playlists = JSON.parse(variable1);
let savedTracks = JSON.parse(variable2);
console.log(playlists);
console.log(savedTracks);

let treatedData;
let analisedDataTable;

let view = "playlist";
let detail = "global";

let propriedadeX;
let propriedadeY;
let song_title;
let author;
let genre;
let popularity;
let duration;
//console.log(view);
//console.log(detail);

let selected;
let selection = [];
//let save_selection;
let selected_genres = [];
let genres_list = ['rock', 'country', 'funk', 'indie', 'rb', 'jazz', 'classical', 'pop', 'all'];
let genres = {
  rock: {
    name: 'rock',
    color: '#28AE57'
  },
  country: {
    name: 'country',
    color: '#9E64F7'
  },
  funk: {
    name: 'funk',
    color: '#0BCFC9'
  },
  indie: {
    name: 'indie',
    color: '#0D9BF2'
  },
  rb: {
    name: 'rb',
    color: '#F2BB0D'
  },
  jazz: {
    name: 'jazz',
    color: '#C1C1C1'
  },
  classical: {
    name: 'classical',
    color: '#F993BF'
  },
  pop: {
    name: 'pop',
    color: '#E1650C'
  }
};

let svg1;

let xVariable = document.getElementById("xVariable");
let yVariable = document.getElementById("yVariable");
let year_tracks = countGenres();

//abrir e fechar dropdown esquerda
let seta_dropdown = document.getElementById("seta_dropdown");
let div_song = document.getElementsByClassName("div_song")[0];

seta_dropdown.addEventListener("click", dropdownClick);

function dropdownClick() {
  document.getElementsByClassName("dropdown_global")[0].classList.toggle("dropdown_global_open");
}

//---------------------------------FUNÇÃO PARA USAR DADOS GUARDADOS---------------------------------
async function useData() {
  svg1 = d3.select("#Graph1").append("svg")
    .attr("width", "100%")
    .style("min-height", "75vh")
    .style("background-color", "none");

  svg2 = d3.select("#svg_global_year").append("svg")
    .attr("width", "40vw")
    .style("min-height", "75vh")
    .style("background-color", "black");

  function drawGraph(options, svg, svg2) {
    let detailed_div = document.getElementById("Graph1");
    let global_div = document.getElementById("div_global_year");

    let titulo_global = document.getElementsByClassName("titulo_global")[0];
    if (options.selected !== "") {
      titulo_global.innerText = options.selected;
    } else {
      titulo_global.innerText = "Playlist Name";
    }

    if (options.property1 !== "") {
      propriedadeX = options.property1;
    }
    if (options.property2 !== "") {
      propriedadeY = options.property2;
    }

    desenharPopPropriedade(propriedadeX, propriedadeY);
    let legenda_global = document.querySelector(".legenda_global");
    if (propriedadeX === "") {
      legenda_global.innerText = "Tracks' " + propriedadeY;
    } else if (propriedadeY === "") {
      legenda_global.innerText = "Tracks' " + propriedadeX;
    } else {
      legenda_global.innerText = "Tracks' " + propriedadeX + " and " + propriedadeY;
    }


    //global_div.style.display = "none";
    //detailed_div.style.display = "block";

    let centerX = 0;
    let centerY = 0;
    let group1 = svg.append("g");
    //circulos_disco
    for (let i = 0; i < 11; i++) {
      group1.append("circle")
        .attr("r", 50 + i * 16)
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("stroke", i === 0 || i === 10 ||
          (options.property2 === "valence" && i === 5) ||
          (options.property2 === "liveness" && i === 8) ?
          "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.2)")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    }
    //linhas separadoras radiais e legendas
    let raio1 = 50;
    let raio2 = 210;
    for (let i = 0; i < 10; i++) {
      let ang = Math.PI + (Math.PI / 5) * i;
      let x1 = centerX + raio1 * Math.cos(ang);
      let y1 = centerY + raio1 * Math.sin(ang);
      let x2 = centerX + raio2 * Math.cos(ang);
      let y2 = centerY + raio2 * Math.sin(ang);
      group1.append("line")
        .attr("r", 50 + i * 16)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "rgba(255, 255, 255, 0.2)")
        .attr("stroke-width", 2)
        .attr("fill", "none");

      let raio3 = 225;
      let x3 = centerX + raio3 * Math.cos(ang);
      let y3 = centerY + raio3 * Math.sin(ang);
      let text_x1 = centerX - 10;
      let text_y1 = centerY - (50 + i * 16) - 4;
      let text_x2 = centerX - 10;
      let text_y2 = centerY + 50 + (i + 1) * 16 - 4;

      if (options.property1 === "popularity") {
        group1.append("text")
          .attr("x", i === 0 ? x3 - 30 : x3 - 10)
          .attr("y", y3 + 5)
          .attr("fill", "white")
          .attr("font-size", "10pt")
          .text(i === 0 ? "100/0" : i * 10);
        group1.append("text")
          .attr("x", text_x1)
          .attr("y", text_y1)
          .attr("fill", "white")
          .attr("font-size", "10pt")
          .text((i * 0.1).toFixed(1));
        group1.append("text")
          .attr("x", text_x2)
          .attr("y", text_y2)
          .attr("fill", "white")
          .attr("font-size", "10pt")
          .text((i * 0.1).toFixed(1));
      } else if (options.property2 === "popularity") {
        group1.append("text")
          .attr("x", x3 - 10)
          .attr("y", y3 + 5)
          .attr("fill", "white")
          .attr("font-size", "10pt")
          .text(i === 0 ? "1/0" : (i * 0.1).toFixed(1));
        group1.append("text")
          .attr("x", text_x1)
          .attr("y", text_y1)
          .attr("fill", "white")
          .attr("font-size", "10pt")
          .text(i * 10);
        group1.append("text")
          .attr("x", text_x2)
          .attr("y", text_y2)
          .attr("fill", "white")
          .attr("font-size", "10pt")
          .text(i * 10);
      } else {
        group1.append("text")
          .attr("x", x3 - 10)
          .attr("y", y3 + 5)
          .attr("fill", "white")
          .attr("font-size", "10pt")
          .text(i === 0 ? "1/0" : (i * 0.1).toFixed(1));
        group1.append("text")
          .attr("x", text_x1)
          .attr("y", text_y1)
          .attr("fill", "white")
          .attr("font-size", "10pt")
          .text((i * 0.1).toFixed(1));
        group1.append("text")
          .attr("x", text_x2)
          .attr("y", text_y2)
          .attr("fill", "white")
          .attr("font-size", "10pt")
          .text((i * 0.1).toFixed(1));
      }
    }
    /*let texts = document.querySelectorAll("#Graph1 text");
    texts.forEach((text) => {
      const bbox = text.getBBox();
      //console.log(bbox);
      const {
        width,
        height
      } = bbox;
      //console.log("Before:", text.style.transform);
      let offsetX = (-width / 2).toFixed(1);
      //console.log(offsetX);
      let offsetY = (-height / 2).toFixed(1);
      //console.log(offsetY);
      //console.log(text.style);
      //text.transform = "translate(calc(" + offsetX + "), calc(" + offsetY + "))";
      //text.transform = "translate(50,50)";
      //console.log("After:", text.transform);
    });*/

    let x_scale;
    if (options.property1 === "popularity") {
      x_scale = d3.scaleLinear()
        .domain([0, 100])
        .range([Math.PI, -1 * Math.PI]);
    } else {
      x_scale = d3.scaleLinear()
        .domain([0, 1])
        .range([Math.PI, 3 * Math.PI]);
    }

    let y_scale;
    if (options.property2 === "popularity") {
      y_scale = d3.scaleLinear()
        .domain([0, 100])
        .range([50, 210]);
    } else {
      y_scale = d3.scaleLinear()
        .domain([0, 1])
        .range([50, 210]);
    }

    let n_tracks;
    let selected_playlist;
    if (view === "playlist") {
      playlists.forEach(playlist => {
        if (playlist.name === options.selected) {
          n_tracks = playlist.tracks.length;
        }
      });
      console.log("playlist");
      selected_playlist = playlists.filter(playlist => playlist.name === options.selected)[0];
    } else if (view === "year") {
      //console.log(options.selected);
      selected_playlist = year_tracks[options.selected];
      console.log(selected_playlist);
    }

    let group2 = svg.append("g");
    selected_playlist.tracks.forEach((track, i) => {
      let cx = centerX + y_scale(track[options.property2]) * Math.cos(x_scale(track[options.property1]));
      let cy = centerY + y_scale(track[options.property2]) * Math.sin(x_scale(track[options.property1]));
      //console.log("Ângulo:", x_scale(track[options.property1]));
      //console.log("Energia:", track[options.property1]);
      if (selected_genres.includes(track.artists[0].genre) || selected_genres[0] === 'all') {
        group2.append("circle")
          .attr("r", 5)
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("stroke", "none")
          .attr("fill", genres[track.artists[0].genre].color);
      }
    });

    let all_circles = document.querySelectorAll("#Graph1>svg>g:nth-child(2)>circle");
    for (let j = 0; j < all_circles.length; j++) {
      all_circles[j].addEventListener("mouseover", function() {
        console.log(selected_playlist);
        song_title = selected_playlist.tracks[j].name;
        author = selected_playlist.tracks[j].artists[0].name;
        genre = selected_playlist.tracks[j].artists[0].genre;
        popularity = selected_playlist.tracks[j].popularity;
        duration = selected_playlist.tracks[j].duration / 1000 + " segundos";

        desenharPopSong(song_title, author, genre, popularity, duration);

        div_song.classList.toggle("openOrCloseSong");
      });
      all_circles[j].addEventListener("mouseout", function() {
        div_song.innerHTML = "";
        div_song.classList.toggle("openOrCloseSong");
      });
    }


    //global_div.style.display = "block";
    //detailed_div.style.display = "none";
    //criação de um arco
    /*var arcGenerator = d3.arc()
      .innerRadius(20) //angulo do círculo de dentro (branco)
      //.outerRadius(60) //angulo de fora, "altura"
      .padAngle(.05)
      .padRadius(100)
      .cornerRadius(0);


    const numeroGeneros = 8;
    const ang = 2 * Math.PI / numeroGeneros;


    let genres_global = {
      pop: 0,
      rock: 0,
      funk: 0
    };


    //GET GÉNEROS DE MÚSICAS PLAYLISTS
    playlists.forEach(function (playlist, k) {
        playlist.tracks.forEach(function (track, i) {
            track.artists.forEach(function (artist, j) {
                genres[artist.genre]++;
            })
        })
    });

    console.log(genres);

    //somar propriedades todas do objeto genres
    let somaGeneros = 0;
    for (const key in genres) {
      somaGeneros += genres[key];
    }
    console.log(somaGeneros);

    //fazer percentagem relativa
    let percentagemRGeneros = 0;
    for (const key in genres) {
      percentagemRGeneros = genres[key] / somaGeneros;
    }
    console.log(percentagemRGeneros);


    //GET ANOS TRACKS

    const anos = {};


    var arcData = [{
        startAngle: 0,
        endAngle: ang,
        outerRadius: 60
      },
      {
        startAngle: ang,
        endAngle: 2 * ang,
        outerRadius: 80
      },
      {
        startAngle: 2 * ang,
        endAngle: 3 * ang,
        outerRadius: 100
      },
      {
        startAngle: 3 * ang,
        endAngle: 4 * ang,
        outerRadius: 120
      },
      {
        startAngle: 4 * ang,
        endAngle: 5 * ang,
        outerRadius: 140
      },
      {
        startAngle: 5 * ang,
        endAngle: 6 * ang,
        outerRadius: 160
      },
      {
        startAngle: 6 * ang,
        endAngle: 7 * ang,
        outerRadius: 180
      },
      {
        startAngle: 7 * ang,
        endAngle: 8 * ang,
        outerRadius: 200
      }
    ];

    // Create a path element and set its d attribute
    let group3 = svg2.append("g");
    group3.selectAll('path')
      .data(arcData)
      .join('path')
      .attr('d', arcGenerator)
      .attr('fill', function(d, i) {
        if (i === 0) {
          return ('#9E64F7')
        }
        if (i === 1) {
          return ('#0D9BF2')
        }
        if (i === 2) {
          return ('#0BCFC9')
        }
        if (i === 3) {
          return ('#F993BF')
        }
        if (i === 4) {
          return ('#E1650C')
        }
        if (i === 5) {
          return ('#C1C1C1')
        }
        if (i === 6) {
          return ('#28AE57')
        }
        if (i === 7) {
          return ('#F2BB0D')
        } else {
          return ('black')
        }
      });*/
  }

  if (view === "playlist") {
    desenharPainelEsquerdo(playlists, "p");
  } else if (view === "year") {
    desenharPainelEsquerdo(year_tracks, "y");
  }


  //verificação dos anos ou playlists selecionadas
  let checkboxes = document.getElementsByClassName("checkbox_option");

  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].onchange = function() {
      updateSelection();
      desenharMiniaturas();
      //console.log(checkboxes[i].value);
    }
  }

  function updateSelection() {
    selection = [];
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        selection.push(checkboxes[i].value);
        //console.log("First:", selection);
      } else {
        selection.splice(i, 1);
        //console.log("Second:", selection);
      }
    }
    //save_selection = selection;
  }

  function desenharMiniaturas() {
    //console.log(selection);
    let texto_miniaturas = [];
    let miniaturas = document.getElementsByClassName("miniatura");
    for (let i = 0; i < miniaturas.length; i++) {
      let titulo_miniatura = document.querySelectorAll(".miniatura>p")[i];
      let imagem_miniatura = document.querySelectorAll(".miniatura>img")[i];
      if (i < selection.length) {
        titulo_miniatura.innerText = selection[i];
        imagem_miniatura.style.display = "inline-block";
      } else {
        titulo_miniatura.innerText = "";
        imagem_miniatura.style.display = "none";
      }
      texto_miniaturas.push(titulo_miniatura.innerText);

    }
    for (let i = 0; i < miniaturas.length; i++) {
      miniaturas[i].addEventListener("click", function() {
        let titulo_miniatura = document.querySelectorAll(".miniatura>p");
        let imagem_miniatura = document.querySelectorAll(".miniatura>span");
        if (titulo_miniatura[i].innerText === texto_miniaturas[i]) {
          //TODO: ver porque é que isto nao passa o selecionado
          selected = titulo_miniatura[i].innerText;
          //console.log(selected);
          onInputChange();
        }
      });
    }
  }

  //opções necessárias para desenhar o gráfico
  let options = {
    view: view,
    detailed: "playlist",
    selected: selected,
    selected_genres: selected_genres,
    //selected: selected,
    list_of_years_or_playlists: selection,
    property1: xVariable.value,
    property2: yVariable.value,
  };

  //desenho do gráfico
  drawGraph(options, svg1, svg2);
}

let switch1 = document.querySelector("#switch_years_playlist .switch");
let switch2 = document.querySelector("#switch_global_detailed .switch");

switch1.addEventListener("click", function() {
  if (view === "playlist") {
    view = "year";
    //console.log("year");
  } else if (view === "year" || view === undefined) {
    view = "playlist";
    //console.log("playlist");
  }
  onInputChange();
});
switch2.addEventListener("click", function() {
  if (detail === "global" || view === undefined) {
    detail = "detailed";
    //console.log("detailed");
  } else if (detail === "detailed") {
    detail = "global";
    //console.log("global");
  }
  onInputChange();
});

useData();

selecionarGeneros();
selecionarMiniatura();

xVariable.onchange = onInputChange;
yVariable.onchange = onInputChange;

function selecionarMiniatura() {
  let miniaturas = document.getElementsByClassName("miniatura");
  for (let i = 0; i < miniaturas.length; i++) {
    if (!miniaturas[i].classList.contains("selected_genre_option")) {
      for (let j = 0; j < miniaturas.length; j++) {
        if (miniaturas[j].classList.contains("selected_genre_option")) {
          miniaturas[j].classList.remove("selected_genre_option");
        }
      }
      miniaturas[i].classList.add("selected_genre_option");
    }
  }
  onInputChange();
}

//seleção dos géneros
function selecionarGeneros() {
  let genre_options = document.getElementsByClassName("genre_option");
  for (let i = 0; i < genre_options.length; i++) {
    genre_options[i].addEventListener("click", function() {
      if (i !== genre_options.length - 1) {
        if (!genre_options[i].classList.contains("selected_genre_option")) {
          selected_genres.push(genres_list[i]);
          let index = selected_genres.findIndex(function(elm) {
            return elm === genres_list[genre_options.length - 1];
          });
          if (index !== -1) {
            selected_genres.splice(index, 1);
          }
        } else {
          let index = selected_genres.findIndex(function(elm) {
            return elm === genres_list[i];
          });
          if (index !== -1) {
            selected_genres.splice(index, 1);
          }
        }
        genre_options[i].classList.toggle("selected_genre_option");
        if (genre_options[genre_options.length - 1].classList.contains("selected_genre_option")) {
          genre_options[genre_options.length - 1].classList.remove("selected_genre_option");
        }
      } else {
        if (!genre_options[i].classList.contains("selected_genre_option")) {
          selected_genres = [];
          selected_genres.push(genres_list[i]);
          for (let j = 0; j < genre_options.length; j++) {
            if (genre_options[j].classList.contains("selected_genre_option")) {
              genre_options[j].classList.remove("selected_genre_option");
            }
          }
        } else {
          selected_genres = [];
        }
        genre_options[i].classList.toggle("selected_genre_option");
      }
      console.log(selected_genres);
      onInputChange();
    });
  }
}

function onInputChange() {
  let checkboxes = document.getElementById("Checkboxes");
  checkboxes.remove();
  svg1.remove();
  useData();
};

let playlist_genres = {
  pop: 0,
  rock: 0,
  funk: 0,
  jazz: 0,
  classical: 0,
  rb: 0,
  indie: 0,
  country: 0
};

function countGenres() {
  let year_tracks = {};

  savedTracks.forEach(function(track, i) {
    let track_date = new Date(track.saved_date);
    //console.log(track_date);
    let year = track_date.getFullYear();
    //console.log(year);
    if (!year_tracks.hasOwnProperty(year)) {
      year_tracks[year] = {
        tracks: []
      };
      year_tracks[year].tracks.push(track);
    } else {
      year_tracks[year].tracks.push(track);
    }
  });

  for (let property in year_tracks) {
    year_tracks[property].genres = {
      pop: 0,
      rock: 0,
      funk: 0,
      jazz: 0,
      classical: 0,
      rb: 0,
      indie: 0,
      country: 0
    };
    year_tracks[property].tracks.forEach(function(track, i) {
      track.artists.forEach(function(artist, j) {
        year_tracks[property].genres[artist.genre]++;
      });
    });
  }
  //console.log(year_tracks['2015'].tracks.length);
  //console.log(year_tracks);

  return year_tracks;
}

function desenharPainelEsquerdo(year_tracks, type) {
  let dropdown_form = document.querySelector(".dropdown_global>form");

  let div_checkboxes = document.createElement("div");
  div_checkboxes.id = "Checkboxes";

  let properties = Object.keys(year_tracks);
  properties.forEach((property, i) => {
    let div_input = document.createElement("div");
    div_input.classList.add("block");

    let input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("checkbox_option");
    input.id = "Checkbox" + i;
    input.name = "checkbox" + i;
    input.value = type === "y" ? property : year_tracks[i].name;

    let label = document.createElement("label");
    label.for = input.id;
    label.innerText = type === "y" ? property : year_tracks[i].name;

    let line_break = document.createElement("br");

    div_input.appendChild(input);
    div_input.appendChild(label);
    div_input.appendChild(line_break);
    div_checkboxes.appendChild(div_input);
  });
  dropdown_form.appendChild(div_checkboxes);
}


//----------------------------------Informação da música----------------------------------
function desenharPopSong(song_title, author, genre, popularity, duration) {
  let containerPopSong = document.querySelector(".div_song");

  let songTitle = document.createElement("p");
  songTitle.innerText = song_title;
  songTitle.id = "song_title";

  let songAuthor = document.createElement("p");
  songAuthor.innerText = author;
  songAuthor.id = "author";

  let songGenre = document.createElement("p");
  songGenre.innerText = genre;
  songGenre.id = "genre";

  let songPopularity = document.createElement("p");
  songPopularity.innerText = "Popularidade: " + popularity;
  songPopularity.id = "popularity";

  let songDuration = document.createElement("p");
  songDuration.innerText = duration;
  songDuration.id = "duration";

  containerPopSong.appendChild(songTitle);
  containerPopSong.appendChild(songAuthor);
  containerPopSong.appendChild(songGenre);
  containerPopSong.appendChild(songPopularity);
  containerPopSong.appendChild(songDuration);
}

document.addEventListener("mousemove", handleMouseMove);

function handleMouseMove(e) {

  //div_song.style.transform = `translate(${e.clientX},${e.clientY})`;
  let x = e.pageX - 150;
  let y = e.pageY;
  div_song.style.left = x + 'px';
  div_song.style.top = y + 'px';
}


//----------------------------------Informação das variáveis----------------------------------

function desenharPopPropriedade(propriedadeX, propriedadeY) {
  document.getElementsByClassName("div_info")[0].innerHTML = "";
  let propriedades = [propriedadeX, propriedadeY];
  let containerPopPropriedade = document.querySelector(".div_info");

  let title = document.createElement("h3");
  title.innerText = "Information";
  title.id = "title_info";

  let propX = document.createElement("p");
  propX.innerText = propriedades[0][0].toUpperCase() + propriedades[0].substr(1);

  let propY = document.createElement("p");
  propY.innerText = propriedades[1][0].toUpperCase() + propriedades[1].substr(1);
  let descricao = [document.createElement("p"), document.createElement("p")];
  descricao[0].class = "descricao_info";
  descricao[1].class = "descricao_info";

  //FAZER FOR PARA AS DUAS PROPRIEDADES QUE PODEM APARECER (X e Y)
  for (let i = 0; i < propriedades.length; i++) {
    if (propriedades[i] === "liveness") {
      descricao[i].innerText = "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live. Values between 0 and 1.";
    }
    if (propriedades[i] === "acousticness") {
      descricao[i].innerText = "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.";
    }
    if (propriedades[i] === "danceability") {
      descricao[i].innerText = "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.";
    }
    if (propriedades[i] === "energy") {
      descricao[i].innerText = "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.";
    }
    if (propriedades[i] === "valence") {
      descricao[i].innerText = "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).";
    }
    if (propriedades[i] === "popularity") {
      descricao[i].innerText = "The popularity of the artist. The value will be between 0 and 100, with 100 being the most popular. The artist's popularity is calculated from the popularity of all the artist's tracks.";
    }
  }

  containerPopPropriedade.appendChild(title);
  containerPopPropriedade.appendChild(propX);
  containerPopPropriedade.appendChild(descricao[0]);
  containerPopPropriedade.appendChild(propY);
  containerPopPropriedade.appendChild(descricao[1]);
}

let info_track = document.getElementById("info_track");
info_track.addEventListener("click", tooglePopPropriedade);

function tooglePopPropriedade() {
  document.getElementsByClassName("div_info")[0].classList.toggle("openOrClose");
}

let info_about = document.getElementById("info_about");
info_about.addEventListener("click", function(){
  document.getElementsByClassName("div_info_about")[0].classList.toggle("openDivAbout");
});




/*function desenharGraficoGeral() {

}*/
