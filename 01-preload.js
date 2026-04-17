let loaded_scenes = [];
let loaded_bb = [];
let loaded_allies = [];
let loaded_enemies = [];
let loaded_ui = [];
let loaded_header = [];
let loaded_footer = [];
let loaded_role_symbols = [];
let loaded_stat_symbols = [];
let loaded_particles = [];
let loaded_return;
let loaded_left;
let loaded_right;
let loaded_down;
let loaded_up;

let Smorgasbord;
let Boomer_Tantrum;
let Tincture;
let Yetimology;
let Diary_of_an_8bit_mage;
class Source {
  constructor() {
    this.pic = null;
    this.halo = null;
  }
}

function preload() {
  // load image sources
  loaded_scenes[0] = new Source();
  loaded_scenes[1] = new Source();
  loaded_scenes[0].pic = loadImage("img/bg_base.png");
  loaded_scenes[1].pic = loadImage("img/bg_01.png");
  
  loaded_bb[0] = new Source();
  loaded_bb[0].pic = loadImage("img/bb_00.png");
  
  for (let i = 0; i <= 3; i++) {
    loaded_allies[i] = new Source();
    if (i < 10) {
      loaded_allies[i].pic = loadImage("img/a0"+i+".png");
      loaded_allies[i].halo = loadImage("img/a0"+i+"h.png");
      loaded_allies[i].activeGlow = loadImage("img/a0"+i+"h.png");
      loaded_allies[i].gray = loadImage("img/a0"+i+".png");
      loaded_allies[i].gray.filter(GRAY);
      loaded_allies[i].name = "a0"+i+".png";
    }
  }
  
  for (let i = 0; i <= 5; i++) {
    loaded_enemies[i] = new Source();
    if (i < 10) {
      loaded_enemies[i].pic = loadImage("img/es0"+i+".png");
      loaded_enemies[i].halo = loadImage("img/es0"+i+"h.png");
      loaded_enemies[i].activeGlow = loadImage("img/es0"+i+"h.png");
      loaded_enemies[i].gray = loadImage("img/es0"+i+".png");
      loaded_enemies[i].gray.filter(GRAY);
      loaded_enemies[i].name = "es0"+i+".png";
    }
  }
  
  for (let i = 0; i <= 3; i++) {
    loaded_role_symbols[i] = new Source();
    if (i < 10) {
      loaded_role_symbols[i].pic = loadImage("img/sr0"+i+".png");
    }
  }

  for (let i = 0; i <= 7; i++) {
    loaded_stat_symbols[i] = new Source();
    if (i < 10) {
      loaded_stat_symbols[i].pic = loadImage("img/ss0"+i+".png");
    }
  }
  
  loaded_left = new Source();
  loaded_left.pic = loadImage("img/sd-l.png");
  loaded_right = new Source();
  loaded_right.pic = loadImage("img/sd-r.png");
  loaded_down = new Source();
  loaded_down.pic = loadImage("img/sd-d.png");
  loaded_up = new Source();
  loaded_up.pic = loadImage("img/sd-u.png");
  
  loaded_ui[0] = new Source();
  loaded_ui[0].pic = loadImage("img/ui_01.png");

  loaded_particles[0] = new Source();
  loaded_particles[0].pic = loadImage("img/p0.png");

  loaded_return = new Source(); loaded_return.pic = loadImage("img/s-return.png");
  
  // load fonts
  Smorgasbord = loadFont("fonts/Smorgasbord.otf");
  Boomer_Tantrum = loadFont("fonts/Boomer Tantrum.otf");
  Tincture = loadFont("fonts/Tincture.otf");
  Yetimology = loadFont("fonts/Yetimology.otf");
  Diary_of_an_8bit_mage = loadFont("fonts/Diary of an 8-bit mage.otf");
}