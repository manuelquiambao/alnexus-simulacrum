function floorZero(number) {
    // for when you don't want a value to roll into the negatives...
    if (number <= 0) {
        number = 0;
    }
    return number;
}

function randomWithin(min, max) {
    // for when you want a random floating value within a range... (max exclusive!)
    return Math.random() * (max - min) + min;
}

function truncate(val, decimal) {
    // for when you don't want float values to have too many insignificant zeroes...
    // (there is some kind of dysfunction with this when it gets to 10 [and possibly any non-zero digit that does not end in 0])
  let val_string = str(val);
  val_string = val_string.slice(0, val_string.indexOf(".") + 1 + decimal);
  return Number(val_string);
}

function getSinusoidalValue(x, sincos, amplitude, period, originX, originY, floorValues) {
    // for when you wanna get sinusoidal functions!
  let A = abs(amplitude);
  let B = (2*PI)/period;
  let C = originX;
  let D = originY;
  
  let result;
  if (sincos === "sin") {
    result = (A*(sin(B*(x-C)))) + D;
  }
  
  if (sincos === "cos") {
    result = (A*(cos(B*(x-C)))) + D;
  }

  if (floorValues) {
    result = Math.floor(result);
  }
  // console.log(result);
  return result;
  
  // tips:
  // amplitude + originY is the max value; amplitude - originY is the min value
  // period is the gap between max values; if period = frameCount, then period is how long the pulse happens before it loops
  // cos starts at 0; sin starts at the middle of the max values AND min values
  
}

function getDelta(x1, x2, y1, y2) {
    // for when you want the rise over run of something...
  return (y2 - y1) / (x2 - x1);
}

let conditions = [];
let weapons = [];
let armors = [];
let basicAttack;
let basicDefend;
let actives = [];
let passives = [];
let natures = [];
let roles = [];
let characters = [];
let monsters = [];
let party = [];
let troop = [];
let players = [];

let field_vars;
let holder_damage = 0;
let play_mode = false;
let ui_mode;
let ui_list; let ui_min; let ui_max;

let allVisComps = [];
let canvas;
let scene;
let bb;
let allies = [];


// wait variables
let animations = [];
let activeAnim;
let animTime = 0;
let animLimit = 0;
let damageTime = 0;
let damageLimit = 0;
let endTime = 0;
let endLimit = 0;

let ui;
let selectedActor;
let description;
let descriptionTitle;
let uiStateTitle;
let uiShowWeapons = [];
let uiShowArmors = [];
let uiShowActives = [];
let uiShowPassives = [];
let uiShowRankings = [];
let uiShowStats = [];
let uiChangeRankings = [];
let uiSymbolStats = [];
let uiShowRoles = [];
let uiShowNatures = [];
let partyStats;
let uiFetchEnemyStats = [];

let uiBoon1;
let uiBoon2;
let uiBane1;
let uiBoonX;

let announcer;

let button_playtest;
let button_stop_playtest;
let button_attack;
let button_abilities;
let button_defend;
let button_actives = [];
let button_switch_ui_left;
let button_switch_ui_right;
let button_change_image;
let scaling;
let windowState;
let uiState;

let healthbars = [];
let party_spiritbars = [];
let statTints;

let activesShown = false;

let partyTargets = [];
let troopTargets = [];

let divLog;

function isTargetted(afflicted) { let bool = false; for (let i = 0; i < actionTargets.length; i++) { if (afflicted === actionTargets[i]) { bool = true; } } return bool; }

function isActor(afflicted) { let bool = false; if (afflicted === activeActor) { bool = true; } return bool; }

function isDefending(afflicted) { let bool = false; if (afflicted === activeActor && registeredAction.command.name === "Defend") { bool = true; } return bool; }

function isAttacking(afflicted) { let bool = false; if (afflicted === activeActor && registeredAction.command.name === "Attack") { bool = true; } return bool; }

function castsSpell(afflicted) { let bool = false; if (afflicted === activeActor && registeredAction.command.type === "spell") { bool = true; } return bool; }

function centeredText(content, x, y, w, h) {
    textAlign(CENTER, CENTER);
    text(content, x * scaling + (w * scaling / 2), y * scaling + (h * scaling / 2));
}

function centeredTextBounded(content, x, y, w, h) {
    textAlign(CENTER, CENTER);
    text(content, x * scaling , y * scaling, w * scaling, h * scaling);
}

function leftCenteredText(content, x, y, w, h) {
    textAlign(LEFT, CENTER);
    text(content, x * scaling + (w * scaling / 16), y * scaling + (h * scaling / 2));
}

function rightCenteredText(content, x, y, w, h) {
    textAlign(RIGHT, CENTER);
    text(content, x * scaling + (w * scaling / 16), y * scaling + (h * scaling / 2));
}

function leftTopText(content, x, y, w, h) {
    textAlign(LEFT, TOP);
    text(content, x * scaling + (w * scaling / 16), y * scaling + (h * scaling / 16), (14 * w * scaling / 16), (14 * h * scaling / 16));
}

function rightTopText(content, x, y, w, h) {
    textAlign(RIGHT, TOP);
    text(content, x * scaling + (w * scaling / 16), y * scaling + (h * scaling / 16), (14 * w * scaling / 16), (14 * h * scaling / 16));
}

class HealthBar {
    constructor(player) {
        this.player = player;
        this.positiontype = "relative";
        this.parent = player;
        this.w = player.scaleX * 0.8;
        this.h = 0.3;
        this.x = player.posX + ui.x + (player.scaleX * 0.1);
        this.y = player.posY + (player.scaleY - 0.5)  + ui.y;
        this.isShown = false;
    }

    show() {
        let maxWidth = this.w;
        let minWidth = this.w * (this.player.combatStats.HP/this.player.baseStats.HP)

        if (this.player.constructor.name === "TroopMember" && this.player.combatStats.HP <= 0) {
            this.isShown = false;
        } else {
            push();
        strokeWeight(2);
        fill('black')
        rect(this.x*scaling, this.y*scaling, maxWidth*scaling, this.h*scaling,10);
        pop();

        push();
        noStroke();
        fill('green')
        rect(this.x*scaling, this.y*scaling, minWidth*scaling, this.h*scaling,10);
        pop();

        this.isShown = true;
        }
    }

     hide() {
        this.isShown = false;
    }
}

class SpiritBar {
    constructor(player) {
        this.player = player;
        this.positiontype = "relative";
        this.parent = player;
        this.w = player.scaleX * 0.5;
        this.h = 0.1;
        this.x = player.posX + (player.scaleX * 0.25) + ui.x;
        this.y = player.posY + (player.scaleY - 0.2)  + ui.y;
        this.isShown = false;
    }

    show() {
        let maxWidth = this.w;
        let minWidth = this.w * (this.player.combatStats.SP/this.player.baseStats.SP)
        push();
        strokeWeight(2);
        fill('black')
        rect(this.x*scaling, this.y*scaling, maxWidth*scaling, this.h*scaling,10);
        pop();

        push();
        noStroke();
        fill('blue')
        rect(this.x*scaling, this.y*scaling, minWidth*scaling, this.h*scaling,10);
        pop();

        this.isShown = true;
    }

     hide() {
        this.isShown = false;
    }
}

class PartyStats {
    constructor(party) {
        this.party = party;
        this.positiontype = "absolute";
        this.w = 9;
        this.h = 3;
        this.x = 2;
        this.y = 14;

        this.isShown = false;
        }
    
        show() {
            push();
            fill('midnightblue');
            rect(this.x*scaling, this.y*scaling, this.w*scaling, this.h*scaling);
            pop();
            this.isShown = true;

            push();
                textFont(Diary_of_an_8bit_mage);
                for (let i = 0; i < this.party.length; i++) {
                    if (activeActor.name === this.party[i].name) {
                    fill('cyan');
                } else {
                    fill('white');
                }
                    textSize(40 * scaling / 100);
                leftCenteredText(this.party[i].name, this.x, this.y + ((this.h/3)*i), this.w/3, this.h/3);
                    textSize(48 * scaling / 100);
                // leftCenteredText("HP", this.x  + (this.w * (2.25/9)), this.y + ((this.h/3)*i), this.w/9, this.h/3);
                rightCenteredText(this.party[i].combatStats.HP, this.x  + (this.w * (3.7/9)), this.y + ((this.h/3)*i), this.w/9, this.h/3);
                leftCenteredText("/", this.x  + (this.w * (3.75/9)), this.y + ((this.h/3)*i), this.w/9, this.h/3);
                rightCenteredText(this.party[i].baseStats.HP, this.x  + (this.w * (5/9)), this.y + ((this.h/3)*i), this.w/9, this.h/3);
                // leftCenteredText("SP", this.x  + (this.w * (6/9)), this.y + ((this.h/3)*i), this.w/9, this.h/3);
                rightCenteredText(this.party[i].combatStats.SP, this.x  + (this.w * (7.2/9)), this.y + ((this.h/3)*i), this.w/9, this.h/3);
                leftCenteredText("/", this.x  + (this.w * (7.25/9)), this.y + ((this.h/3)*i), this.w/9, this.h/3);
                rightCenteredText(this.party[i].baseStats.SP, this.x  + (this.w * (8.5/9)), this.y + ((this.h/3)*i), this.w/9, this.h/3);
                }
            pop();
        }

        hide() {
            this.isShown = false;
        }
}

class DamageIndicator {
    constructor(content, target) {
        this.content = str(content);
        this.target = target;

        this.textSize = 90;
        this.x = this.target.posX + ui.x;
        this.y = this.target.posY + ui.y;
        this.yD = -0.01;
        this.bbx = null; 

        this.isShown = false;
        this.a1 = 255;
        this.a2 = 200;
    }

    show() {
        if (damageTime < damageLimit) {
            let aD1 = 255/damageLimit;
            let aD2 = 200/damageLimit;
            push();
                textSize(this.textSize * scaling / 100);
                this.bbx = Diary_of_an_8bit_mage.textBounds(this.content, this.x, this.y); // we don't need this box's position, we just need its width and height!
                this.x = this.target.posX + ui.x + (this.target.scaleX / 2) - ((this.bbx.w / scaling) / 2);
                this.y = this.target.posY + ui.y + (this.target.scaleY - (this.bbx.h / scaling));
                this.y += this.yD * damageTime;
                fill(0,0,0,this.a2);
                centeredText(this.content, this.x + 0.08, this.y - ((this.bbx.h / scaling) * 1.5), (this.bbx.w / scaling), (this.bbx.h / scaling));
                strokeWeight(5 * scaling / 100);
                stroke(0,0,0,this.a1);
                fill(255,255,255,this.a1);
                centeredText(this.content, this.x, this.y - ((this.bbx.h / scaling) * 1.5), (this.bbx.w / scaling), (this.bbx.h / scaling));
            pop();
            this.a1 -= aD1;
            this.a2 -= aD2;
            this.a1 = Math.floor(this.a1);
            this.a2 = Math.floor(this.a2);
            this.isShown = true;
        }
    }

    hide() {
        this.isShown = false;
    }
}
class TextboxComp {
    constructor(content, state, x, y, w, h, desc) {
        this.content = content;
        this.state = state;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.desc = desc;

        if (this.state === "announcer") {
            this.positiontype = "absolute";
        }
        if (this.state === "description" || this.state === "ui-title" || this.state === "ui-heading" || this.state === "ui-dependent" || this.state === "ui-equip" || this.state === "ui-learn" || this.state === "stat") {
            this.positiontype = "relative";
            if (this.state === "description" || this.state === "ui-title" || this.state === "ui-heading" || this.state === "ui-dependent" || this.state === "ui-equip" || this.state === "ui-learn"|| this.state === "stat") {
                this.parent = ui;
            }
        }

        if (this.positiontype === 'absolute') {
            this.x += 0;
            this.y += 0;
        } else {
            if (this.positiontype === 'relative') {
                this.x += this.parent.x;
                this.y += this.parent.y;
            }
        }
        this.isShown = false;
        this.equipped = false; // only used for ui-equip and ui-learn textboxes!
    }
    show() {
        if (this.isHovered() && this.desc != null && this.desc != "") {
            announcer.content = this.desc;
        }
        push();
        noStroke();
        if (this.state === "ui-title" || this.state === "ui-heading" || this.state === "stat" || this.state === "announcer") {
            fill('midnightblue');
        }
        if (this.state === "ui-dependent") {
            fill('dodgerblue');
        }
        if (this.state === "ui-equip" || this.state === "ui-learn") {
            if (this.equipped) {
                fill('dodgerblue');
            } else {
                fill('grey');
            }
        }
        rect(this.x * scaling, this.y * scaling, this.w * scaling, this.h * scaling);
        pop();
        this.isShown = true;

        if (this.state === "description") {
            this.content = selectedItem.desc;
        }
        if (this.content != "" && this.content != null) {

            if (this.state === "description") {
                push();
                textFont(Diary_of_an_8bit_mage);
                textSize(32 * scaling / 100);
                fill('black');
                leftTopText(this.content, this.x, this.y, this.w, this.h);
                pop();

            } else {
                 push();
                if (this.state === "stat") {
                    textFont(Diary_of_an_8bit_mage);
                } else {
                    textFont(Diary_of_an_8bit_mage);
                }
                if (this.state === "ui-equip" || this.state === "ui-learn") {
                    textSize(36 * scaling / 100);
                    fill('white');
                    centeredTextBounded(this.content, this.x, this.y, this.w, this.h);
                } else {
                    textSize(48 * scaling / 100);
                    fill('white');
                    centeredText(this.content, this.x, this.y, this.w, this.h);
                }
            }
        }
    }
    hide() {
        this.isShown = false;
    }

    fetch(content, desc) {
        this.content = content;
        this.desc = desc;
    }

    isHovered() {
        if (mouseX > this.x * scaling && mouseX < (this.x + this.w) * scaling &&
            mouseY > this.y * scaling && mouseY < (this.y + this.h) * scaling) {
            if (this.priority > 0) {
                cursor(HAND);
            } else {
                cursor(ARROW);
            }
            return true;
        }
        else {
            return false;
        }
    }
}

class ButtonComp {
    constructor(name, state, symbol, desc, func, x, y, w, h) {
        this.name = name;
        this.state = state;
        this.symbol = symbol; // an image;
        this.desc = desc;
        this.func = func;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        if (this.state === "idle-hotkey" || this.state === "edit-hotkey" || this.state === "playtest-hotkey" || this.state === "ui-edit") {
            this.positiontype = "relative";
            this.priority = 5;
            if (this.state === "idle-hotkey" || this.state === "edit-hotkey" || this.state === "playtest-hotkey") {
                this.parent = scene;
            }
            if (this.state === "ui-edit") {
                this.parent = ui;
            }
        }
        if (this.positiontype === 'absolute') {
            this.x += 0;
            this.y += 0;
        } else {
            if (this.positiontype === 'relative') {
                this.x += this.parent.x;
                this.y += this.parent.y;
            }
        }
        this.isShown = false;
        this.isActive = false;
        allVisComps.push(this);
    }
    show() {
        if (this.isHovered() && this.desc != null && this.desc != "") {
            announcer.content = this.desc;
        }
        push();
        if (this.isActive) {
            fill('skyblue');
        } else {
            fill(50);
        }
        strokeWeight(4 * scaling / 100);
        if (this.isHovered()) {
            stroke('skyblue');
        } else {
            stroke(200);
        }

        if (this.isActive) {
            stroke('blue')
        }
        rect(this.x * scaling, this.y * scaling, this.w * scaling, this.h * scaling);
        pop();
        if (this.symbol === null) {
            push();
            textFont(Diary_of_an_8bit_mage);
            textSize(48 * scaling / 100);
            if (this.isHovered()) {
            fill('skyblue');
            } else {
            fill('white');
            }
            
            if (this.isActive) {
                fill('blue')
            }
            centeredText(this.name, this.x, this.y, this.w, this.h);
            pop();
        } else {
            image(this.symbol.pic, this.x * scaling, this.y * scaling, this.w * scaling, this.h * scaling)
        }
        this.isShown = true;
    }
    hide() {
        this.isShown = false;
    }
    isHovered() {
        if (mouseX > this.x * scaling && mouseX < (this.x + this.w) * scaling &&
            mouseY > this.y * scaling && mouseY < (this.y + this.h) * scaling) {
            if (this.priority > 0) {
                cursor(HAND);
            } else {
                cursor(ARROW);
            }
            return true;
        }
        else {
            return false;
        }
    }
}

class TextInputComp {
    constructor(content, maxLength, state, x, y, w, h) {
        this.content = content;
        this.maxLength = maxLength;
        this.state = state;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        if (this.state === "ui-dependent" || this.state === "stat") {
            this.positiontype = "relative";
            this.parent = ui;
            this.priority = 4;
        }

        if (this.positiontype === 'absolute') {
            this.x += 0;
            this.y += 0;
        } else {
            if (this.positiontype === 'relative') {
                this.x += this.parent.x;
                this.y += this.parent.y;
            }
        }

        this.isActive = false;
        this.tempValue = "";
        this.isShown = false;

        allVisComps.push(this);
    }
    show() {
        push();
        noStroke();
        if (this.isActive) {
            fill('paleturquoise');
        } else {
            if (this.isHovered()) {
                fill('white');
            } else {
                fill('skyblue');
            }
        }
        rect(this.x * scaling, this.y * scaling, this.w * scaling, this.h * scaling);
        pop();
        let bbx;
        if (this.content != null) {
            push();
            textSize(48 * scaling / 100);
             if (this.state === "stat") {
                bbx = Diary_of_an_8bit_mage.textBounds(this.content, this.x * scaling + (this.w * scaling / 16), this.y * scaling + (this.h * scaling / 2));
            } else {
                bbx = Diary_of_an_8bit_mage.textBounds(this.content, this.x * scaling + (this.w * scaling / 16), this.y * scaling + (this.h * scaling / 2));
                bbx.x += bbx.w/2;
            }
            pop();
        }
        if (this.content != "" && this.content != null) {
            push();
            if (this.state === "stat") {
                textFont(Diary_of_an_8bit_mage);

            } else {
                textFont(Diary_of_an_8bit_mage);
            }
            textSize(48 * scaling / 100);
            fill('black');
            leftCenteredText(this.content, this.x, this.y, this.w, this.h);
            
            pop();
        }

        if (this.isActive) {
            push();
            noStroke();
            let a = sin(0.2 * frameCount) * 255;
            fill(0, 0, 0, a);
            rect(bbx.x + bbx.w + (0.05 * scaling), bbx.y - (bbx.h / 2), 0.1 * scaling, bbx.h*2);
            pop();
        }
        this.isShown = true;
    }

    hide() {
        this.isShown = false;
    }

    isHovered() {
        if (mouseX > this.x * scaling && mouseX < (this.x + this.w) * scaling &&
            mouseY > this.y * scaling && mouseY < (this.y + this.h) * scaling) {
            if (this.priority > 0) {
                cursor(HAND);
            } else {
                cursor(ARROW);
            }
            return true;
        }
        else {
            return false;
        }
    }

    fetch(content) {
        this.content = content;
    }

    give() {
        if (this.state === "stat") {
            return int(this.content);
        } else {
            return this.content;
        }
    }
}
class ImageComp {
    constructor(source, state, x, y, w, h) {
        this.source = source;
        this.state = state;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        if (this.state === "scene" || this.state === "bb" || this.state === "ui" || this.state == null) {
            this.positiontype = "absolute";
        }
        if (this.state === "enemy" || this.state === "ally" || this.state === "selected" || this.state === "ui-symbol") {
            this.positiontype = "relative";
            if (this.state === "enemy" || this.state === "ally") {
                this.parent = bb;
            }
            else {
                if (this.state === "selected" || this.state === "ui-symbol") {
                    this.parent = ui;
                }
            }

        }

        if (this.state === "bb") {
            this.priority = -1;
        }
        if (this.state === "scene" || this.state === "ui-symbol") {
            this.priority = 0;
        }
        if (this.state === "enemy" || this.state === "ally") {
            this.priority = 1;
        }
        if (this.state === "ui") {
            this.priority = 2;
        }
        if (this.state === "selected") {
            this.priority = 3;
        }

        if (this.positiontype === 'absolute') {
            this.x += 0;
            this.y += 0;
        } else {
            if (this.positiontype === 'relative') {
                this.x += this.parent.x;
                this.y += this.parent.y;
            }
        }

        this.isShown = false;
        this.isEnabled = true;
        this.isActive = false;
        allVisComps.push(this);
    }

    show() {
        if (this.state === "ally") {
            // show shadows
            push();
            noStroke();
            fill(0, 0, 0, 50);
            ellipse((this.x + (this.w / 2)) * scaling, (this.y + (8 * this.h / 8)) * scaling, this.w * scaling, (this.h / 8) * scaling);
            pop();
        }

        if (this.isHovered() && this.isEnabled) {
            if (this.state === "enemy" || this.state === "ally") {
                image(this.source.halo,
                    this.x * scaling, this.y * scaling,
                    this.w * scaling, this.h * scaling);
            }
        }
        if (this.isActive) {
            if (this.state === "enemy" || this.state === "ally") {
                push();
                let val = getSinusoidalValue(frameCount, "cos", 255/2, 120, 0, 255/2, false);
                tint(0,0,255,val);
                image(this.source.activeGlow,
                    this.x * scaling, this.y * scaling,
                    this.w * scaling, this.h * scaling);
                pop();
            }

        }
        image(this.source.pic,
            this.x * scaling, this.y * scaling,
            this.w * scaling, this.h * scaling);
        this.isShown = true;
    }

    gray() {
        image(this.source.gray,
            this.x * scaling, this.y * scaling,
            this.w * scaling, this.h * scaling);
        this.isShown = true;
    }

    hide() {
        this.isShown = false;
    }

    isHovered() {
        if (mouseX > this.x * scaling && mouseX < (this.x + this.w) * scaling &&
            mouseY > this.y * scaling && mouseY < (this.y + this.h) * scaling) {
            if (this.priority > 0) {
                cursor(HAND);
            } else {
                cursor(ARROW);
            }
            return true;
        }
        else {
            return false;
        }
    }
}

class TargetComp {
    constructor(target, func) {
        this.target = target;
        this.source = this.target.imageComp.source;
        this.positiontype = this.target.imageComp.positionType;
        this.parent = this.target.imageComp.parent;
        this.priority = 5;

        this.state = "targettable";
        this.x = this.target.imageComp.x;
        this.y = this.target.imageComp.y;
        this.w = this.target.imageComp.w;
        this.h = this.target.imageComp.h;

        this.func = func;
        this.isShown = false;
    }
    show() {
        if (this.target.combatStats.HP > 0) {
            if (this.isHovered()) {
                image(this.source.halo,
                this.x * scaling, this.y * scaling,
                this.w * scaling, this.h * scaling);
            }
            image(this.source.pic,
                this.x * scaling, this.y * scaling,
                this.w * scaling, this.h * scaling);
            this.isShown = true;
        } else {
            this.isShown = false;
        }
    }

    hide() {
        this.isShown = false;
    }

    isHovered() {
        if (mouseX > this.x * scaling && mouseX < (this.x + this.w) * scaling &&
            mouseY > this.y * scaling && mouseY < (this.y + this.h) * scaling) {
            if (this.priority > 0) {
                cursor(HAND);
            } else {
                cursor(ARROW);
            }
            return true;
        }
        else {
            return false;
        }
    }
}

// stat sliders will be implemented in v3

class StatSlider {
    constructor(low, hi, gap, x, y, w, stat, knobType, knobSize, filledUp) {
        this.low = low;
        this.hi = hi;
        this.gap = gap;

        this.x = x; this.y = y;
        this.positiontype = "relative";
        this.parent = ui; // change this to ui after!
        this.x += this.parent.x; this.y += this.parent.y;
        
        this.w = w;
        this.h = 0.2;
      
        this.stat = stat;
      
        this.knobType = knobType;
        this.filledUp = filledUp;
      
        if (filledUp) {
          this.fillColor = statTints[this.stat];
        }
      
        this.priority = 4;
        
        this.isShown = false;

        this.value = 1;
        this.knobSize = knobSize;
        if (this.knobType === "none") {
          this.knobSize = 0;
        }

        if (this.knobType === "ellipse") {
          this.knobW = this.h * this.knobSize;
          this.knobH = this.h * this.knobSize;
        } else {
          this.knobW = 0.2;
          this.knobH = this.h * this.knobSize;
        }
      
        this.knobX = this.getKnobPosition(this.value);
        this.knobY = (this.y - (this.h * 1.5));

        allVisComps.push(this);
    }
    
    getKnobPosition(value) {
      return ((this.x + ((value - 1) * (this.w / (this.hi - this.gap)))) - this.h * (this.knobW / 2));
    }
  
    show() {
        push();
        rectMode(CORNER);
        strokeWeight(5 * scaling / 100);
        stroke('darkkhaki');
        fill('midnightblue');
        rect(this.x * scaling, (this.y - (this.h / 2)) * scaling, this.w * scaling, this.h * scaling);
        pop();
        
        if (this.filledUp) {
          push();
          noStroke();
          fill(this.fillColor);
          rect(this.x * scaling, (this.y - (this.h / 2)) * scaling, this.w * (this.value / this.hi) * scaling, this.h * scaling);
          pop();
        }
      
        if (this.knobType != "none") {
          push();
          ellipseMode(CORNER);
          if (this.isHovered()) {
              stroke('gold');
          } else {
              stroke('black');
          }
          fill('darkkhaki');
          if (this.knobType === "ellipse") {
            ellipse(this.knobX * scaling, this.knobY * scaling, this.knobW * scaling, this.knobH * scaling);
          } else {
            if (this.knobType === "rect") {
              rect(this.knobX * scaling, this.knobY * scaling, this.knobW * scaling, this.knobH * scaling);
            }
          }
          pop();
        }
        this.isShown = true;
    }

    hide() {
        this.isShown = false;
    }

    isHovered() {
        if (mouseX > this.knobX * scaling && mouseX < (this.knobX + this.knobW) * scaling &&
            mouseY > this.knobY * scaling && mouseY < (this.knobY + this.knobH) * scaling) {
            if (this.priority > 0) {
                cursor(HAND);
            } else {
                cursor(ARROW);
            }
            return true;
        }
        else {
            return false;
        }
    }

    getNotches() {
        let array = [];
        for (let i = 0; i <= this.hi - this.gap; i++) { // for every possible value...
            array.push(this.getKnobPosition(i));
        }
        return array;
    }

    fetchStatValue() {
        this.value = truncate(selectedItem.rankings[this.stat], 1) * 10;
        this.updateKnob(this.value);
    }

    updateKnob(val) {
        this.knobX = this.getKnobPosition(val);
    }
    give() {
        return this.value;
    }
}


class LevelSlider {
    constructor(low, hi, gap, x, y, w) {
        this.low = low;
        this.hi = hi;
        this.gap = gap;

        this.x = x; this.y = y;
        this.positiontype = "relative";
        this.parent = ui;
        this.x += this.parent.x; this.y += this.parent.y;
        this.w = w;
        this.h = 0.2;
        this.priority = 4;
        this.isShown = false;

        this.value = 1;

        this.knobX = ((this.x + ((this.value - 1) * (this.w / 4))) - this.h * 1.5);
        this.knobY = (this.y - (this.h * 1.5));
        this.knobW = this.h * 3;
        this.knobH = this.h * 3;

        allVisComps.push(this);
    }

    show() {
        push();
        rectMode(CORNER);
        strokeWeight(5 * scaling / 100);
        stroke('darkkhaki');
        fill('midnightblue');
        rect(this.x * scaling, (this.y - (this.h / 2)) * scaling, this.w * scaling, this.h * scaling);
        pop();

        push();
        ellipseMode(CORNER);
        if (this.isHovered()) {
            stroke('gold');
        } else {
            stroke('black');
        }
        fill('darkkhaki');
        // 4 = max level (5) - 1.
        ellipse(this.knobX * scaling, this.knobY * scaling, this.knobW * scaling, this.knobH * scaling);
        pop();
        this.isShown = true;
    }

    hide() {
        this.isShown = false;
    }

    isHovered() {
        if (mouseX > this.knobX * scaling && mouseX < (this.knobX + this.knobW) * scaling &&
            mouseY > this.knobY * scaling && mouseY < (this.knobY + this.knobH) * scaling) {
            if (this.priority > 0) {
                cursor(HAND);
            } else {
                cursor(ARROW);
            }
            return true;
        }
        else {
            return false;
        }
    }

    getNotches() {
        let array = [];
        for (let i = 0; i <= this.hi - this.gap; i++) { // for every possible value...
            array.push(((this.x + (i * (this.w / 4))) - this.h * 1.5));
        }
        return array;
    }

    fetch(value) {
        this.value = value;
        this.updateKnob(this.value);
    }

    updateKnob(val) {
        this.knobX = ((this.x + ((val - 1) * (this.w / 4))) - this.h * 1.5);
    }
    give() {
        return this.value;
    }
}
class Condition {
    constructor(name, type, activationTic, activationBool, activationChance, applicationType,
        effect, valueModded, valueFunction, baseStatModifier, valueModifier, duration, releaseFunction,
        onsetDialog, activationDialog, releaseDialog, desc) {

        this.name = name;
        this.type = type;
        this.activationTic = activationTic;
        this.activationBool = activationBool;
        this.activationChance = activationChance;
        this.applicationType = applicationType;
        this.effect = effect;
        this.valueModded = valueModded;
        this.valueFunction = valueFunction;
        this.baseStatModifier = baseStatModifier;
        this.valueModifier = valueModifier;
        this.duration = duration;
        this.releaseFunction = releaseFunction;

        this.onsetDialog = onsetDialog;
        this.activationDialog = activationDialog;
        this.releaseDialog = releaseDialog;

        this.desc = desc;
    }

    multiply(value, percent) {
        let result = value * percent;
        result = Math.floor(result);
        return result;
    }

    equals(value, value2) {
        let result = value * value2;
        result = Math.floor(result);
        return result;
    }

    subtractFromBase(value, percent, base) {
        let subtrahend = Math.floor(base * percent);
        let result = value - subtrahend;
        result = Math.floor(result);
        return result;
    }

    getBackBase(base) {
        return base;
    }
}

class inBattleFX extends Condition {
    constructor(condition, roundApplied) {
        super(condition);
        this.name = condition.name;
        this.type = condition.type;
        this.effect = condition.effect;
        this.onsetDialog = condition.onsetDialog;
        this.activationTic = condition.activationTic;
        this.activationBool = condition.activationBool;
        this.activationChance = condition.activationChance;
        this.applicationType = condition.applicationType;
        this.activationDialog = condition.activationDialog;
        this.valueModded = condition.valueModded;
        this.valueFunction = condition.valueFunction;
        this.baseStatModifier = condition.baseStatModifier;
        this.valueModifier = condition.valueModifier;
        this.duration = condition.duration;
        this.releaseFunction = condition.releaseFunction;
        this.releaseDialog = condition.releaseDialog;

        this.roundApplied = roundApplied;
        this.roundReleased = this.roundApplied + this.duration;
    }
}

function dealFX(action, actor, target) {
    if (action.inflictedCond != null) {
        if (Math.random() <= action.inflictedChance) {
            let fx = new inBattleFX(action.inflictedCond, totalRounds);
            let fxTarget;
            if (action.inflictedTarget === "self") {
                fxTarget = actor;
            } else {
                if (action.inflictedTarget === "target") {
                    fxTarget = target;
                }
            }
            fxTarget.inBattleFX.push(fx);
            if (fx.onsetDialog != null) {
                console.log(fxTarget.name + fx.onsetDialog);
                divLog.html('<p>' +fxTarget.name + fx.onsetDialog + '</p>', true)
            }
        }
    }
}
// used for certain one-time activation 
function isFirstTimeApplied(fx, rounds) {
    if (fx.roundApplied === rounds) {
        return true;
    } else {
        return false;
    }
}
// the thorniest technical function i have to do ever, this function will activate in-battle effects.
// EVERY in-battle effect. oml.
function activateInBattleFx(player, tic) {
    for (let i = 0; i < player.inBattleFX.length; i++) {
        let thisFX = player.inBattleFX[i];
        if (thisFX.activationTic === tic) { // if this effect's activation tic is up...
            let fxType = thisFX.type;

            if (thisFX.activationBool === true || thisFX.activationBool(player) === true) { // and the additional condtions say true...

                if (thisFX.applicationType === "instant" && isFirstTimeApplied(thisFX, totalRounds) || thisFX.applicationType === "recurring") { // and is the first time applied, if the effect is instant...

                    if (Math.random() <= thisFX.activationChance) { // and chance says yes...

                        console.log("[Effect] " + player.name + "'s " + thisFX.name + " activated!"); // activate the effect!
                        divLog.html('<p>' +"[Effect] " + player.name + "'s " + thisFX.name + " activated!" + '</p>', true)

                        if (thisFX.valueFunction != null && thisFX.valueModded != null) {
                            let valChanged = thisFX.valueModded;
                            let valBasis = thisFX.baseStatModifier;
                            // console.log(thisFX.valueFunction);

                            if (thisFX.activationDialog != null) {
                                // console.log(player.name + thisFX.activationDialog);
                                divLog.html('<p>' +player.name + thisFX.activationDialog + '</p>', true)
                                
                            }
                            // if the value modded uses base stats, go here
                            if (fxType === "base-stat-dependent") {
                                if (thisFX.valueFunction === "subtractFromBase") {
                                    let subtrahend = Math.floor(player.baseStats[valBasis] * thisFX.valueModifier); // this function is hard-coded for poison
                                    if (thisFX.valueModded === "HP") {
                                        let damage = subtrahend;
                                        dealDamage(damage, player, thisFX, true);
                                    } else {
                                        player.combatStats[valChanged] = thisFX[thisFX.valueFunction](player.combatStats[valBasis], thisFX.valueModifier, player.baseStats[valBasis]);
                                    }
                                } else {
                                    player.combatStats[valChanged] = thisFX[thisFX.valueFunction](player.baseStats[valBasis], thisFX.valueModifier);
                                }
                            }

                            if (fxType === "combat-stat-dependent") {
                                player.combatStats[valChanged] = thisFX[thisFX.valueFunction](player.combatStats[valBasis], thisFX.valueModifier);
                            }

                            if (fxType === "level-dependent") {
                                player.combatStats[valChanged] = thisFX[thisFX.valueFunction](player.level, thisFX.valueModifier);
                            }
                            // if the value modded is a field variable (outside of the player), affect the field variable
                            if (fxType === "field-dependent") {
                                if (valChanged === "damage") {
                                    field_vars[valChanged] = thisFX[thisFX.valueFunction](field_vars[valChanged], thisFX.valueModifier);
                                }
                            }

                        } else {
                            if (fxType === "skip") {
                                skipAction(player, thisFX);
                            }
                            if (fxType === "healing") {
                                healDamage(player, thisFX);
                            }
                        }
                    }
                }
            }
        }
    }
}

function healDamage(player, fx) {
    let heal = activeActor.combatStats.MAG * fx.valueModifier;
    heal = Math.floor(heal);

    player.combatStats.HP += heal;
    if (player.combatStats.HP >= player.baseStats.HP) {
        player.combatStats.HP = player.baseStats.HP;
    }

    console.log(player.name + " is healed with " + heal + "HP!");
    divLog.html('<p>' + player.name + " is healed with " + heal + "HP!" + '</p>', true);
    console.log(player.name + "'s HP = " + player.combatStats.HP + "/" + player.baseStats.HP);
    divLog.html('<p>' + player.name + "'s HP = " + player.combatStats.HP + "/" + player.baseStats.HP + '</p>', true);

    player.inBattleFX = activeActor.inBattleFX.filter(removeHeal);
    function removeHeal(fx) {
        return fx.name != "Lesser Heal" && fx.name != "Greater Heal";
    }
    if (fx.releaseDialog != null) {
        console.log(player.name + fx.releaseDialog);
    }
}

function releaseFX(players) {
    for (let i = 0; i < players.length; i++) {
        let fxTarget = players[i];
        for (let j = 0; j < fxTarget.inBattleFX.length; j++) {
            let fx = fxTarget.inBattleFX[j];
            if (fx.roundReleased === totalRounds) {
                if (fx.releaseFunction != null) {
                    if (fx.releaseFunction === "getBackBase") {
                        fxTarget.combatStats[fx.valueModded] = fx[fx.releaseFunction](players[i].baseStats[fx.valueModded]);
                    }
                    if (fx.releaseFunction === "getBackTemp") {
                        fxTarget.combatStats[fx.valueModded] = fx[fx.releaseFunction];
                    }
                }
                if (fx.releaseDialog != null) {
                    console.log(fxTarget.name + fx.releaseDialog);
                    divLog.html('<p>' + fxTarget.name + fx.releaseDialog + '</p>', true);
                }
                players[i].inBattleFX[j] = null;
            }
        }
        let refreshedFX = [];
        for (let j = 0; j < players[i].inBattleFX.length; j++) {
            let fx = fxTarget.inBattleFX[j];
            if (fx != null) {
                refreshedFX.push(players[i].inBattleFX[j]);
            }
        }
        players[i].inBattleFX = refreshedFX;
    }
}

class Weapon {
    constructor(name, desc, phys, mag) {
        this.name = name;
        this.desc = desc;
        this.phys = phys;
        this.mag = mag;
    }
}

class Armor {
    constructor(name, desc, phys, mag) {
        this.name = name;
        this.desc = desc;
        this.phys = phys;
        this.mag = mag;
    }
}

class Attack {
    constructor() {
        this.name = "Attack";
        this.desc = "A normal attack using its equipped weapon.";
        this.type = "attack";
        this.spCost = 0;
        this.damageMult = 1.0;
        this.targettables = "foe";
        this.inflictedCond = null;
        this.inflictedTarget = null;
    }
}

class Defend {
    constructor() {
        this.name = "Defend";
        this.desc = "Brace for damage, halving incoming damage.";
        this.type = "defend";
        this.spCost = 0;
        this.damageMult = 0.0;
        this.targettables = "self";
        this.inflictedCond = defending;
        this.inflictedTarget = "self";
        this.inflictedChance = 1.0;
    }
}

class Active {
    constructor(name, desc, type, spCost, damageMult, targettables, inflictedCond, inflictedTarget, inflictedChance) {
        this.name = name;
        this.desc = desc;
        this.type = type;
        this.spCost = spCost;
        this.damageMult = damageMult;
        this.targettables = targettables;
        this.inflictedCond = inflictedCond;
        this.inflictedTarget = inflictedTarget;
        this.inflictedChance = inflictedChance;
    }
}

class Passive {
    constructor(name, desc, activationTic, activationBool, inflictedCond, inflictedTarget, inflictedChance) {
        this.name = name;
        this.desc = desc;
        this.activationTic = activationTic; // int indicating when it activates
        this.activationBool = activationBool;
        this.inflictedCond = inflictedCond;
        this.inflictedTarget = inflictedTarget;
        this.inflictedChance = inflictedChance;
    }
}

function activatePassives(player, tic) {

    if (player.learnedPassives != null) {

        for (let i = 0; i < player.learnedPassives.length; i++) {
            let thisPassive = player.learnedPassives[i];
            if (thisPassive.activationTic === tic) {
                if (thisPassive.activationBool === true || thisPassive.activationBool(player) === true) {
                    if (Math.random() <= thisPassive.inflictedChance) {
                        console.log("[Passive] " + player.name + "'s " + thisPassive.name + " activated!");

                        // for passives that give conditions to self...
                        if (thisPassive.inflictedTarget === "self") {
                            player.inBattleFX.push(new inBattleFX(thisPassive.inflictedCond, totalRounds));
                        }

                        // for passives that give conditions to their target foe... (passives that have this should have a tic of 4 or 5)
                        if (thisPassive.inflictedTarget === "target-foe") {
                            for (let i = 0; i < actionTargets.length; i++) {
                                if (actionTargets[i].constructor.name != player.constructor.name) { // if the target does not have the same constructor as the player, it is a foe
                                    actionTargets[i].inBattleFX.push(new inBattleFX(thisPassive.inflictedCond, totalRounds));
                                }
                            }
                        }

                        // for passives that give conditions to their target ally...
                        if (thisPassive.inflictedTarget === "target-ally") {
                            for (let i = 0; i < actionTargets.length; i++) {
                                if (actionTargets[i].constructor.name != player.constructor.name) { // if the target has the same constructor as the player, it is an ally
                                    actionTargets[i].inBattleFX.push(new inBattleFX(thisPassive.inflictedCond, totalRounds));
                                }
                            }
                        }

                        // for passives that give conditions to all allies... 
                        if (thisPassive.inflictedTarget === "all-allies") {
                            if (player.constructor.name === "PartyMember") {
                                for (let i = 0; i < party.length; i++) {
                                    party[i].inBattleFX.push(new inBattleFX(thisPassive.inflictedCond, totalRounds));
                                }
                            } else {
                                if (player.constructor.name === "TroopMember") {
                                    for (let i = 0; i < troop.length; i++) {
                                        troop[i].inBattleFX.push(new inBattleFX(thisPassive.inflictedCond, totalRounds));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

class Nature {
    constructor(name, boon, bane, desc) {
        this.name = name;
        this.boon = boon;
        this.bane = bane;
        this.desc = desc;
    }
}

class Role {
    constructor(name, desc, weapons, armors, actives, passives, boon) {
        this.name = name;
        this.desc = desc;
        this.weapons = weapons;
        this.armors = armors;
        this.actives = actives;
        this.passives = passives;
        this.boon = boon;
    }
}

class Character {
    constructor(name, desc, rankings, role, nature, imageSource, size) {
        this.name = name;
        this.desc = desc;
        this.rankings = rankings;
        this.role = role;
        this.nature = nature;
        this.imageSource = imageSource;
        this.size = size;
        this.rootStats =
            { HP: 20, SP: 5, STR: 5, DEF: 5, MAG: 5, MDF: 5, SPD: 5, DEX: 5 };
    }
}

class PartyMember extends Character {
    constructor(char, level, posX, posY) {
        super(char);
        this.name = char.name;
        this.desc = char.desc;
        this.rankings = char.rankings;
        this.role = char.role;
        this.nature = char.nature;
        this.imageSource = char.imageSource;
        this.rootStats = char.rootStats;

        this.level = level;
        this.equippedWeapon = this.equipAndLearn("weapons");
        this.equippedArmor = this.equipAndLearn("armors");
        this.learnedActives = this.equipAndLearn("actives");
        this.learnedPassives = this.equipAndLearn("passives");

        this.baseStats = this.getBaseStats();
        this.combatStats = this.baseStats;

        this.inBattleFX = [];

        this.posX = posX;
        this.posY = posY;
        this.size = char.size;
        if (this.size === "ally") {
            this.scaleX = 3;
            this.scaleY = 4;
        }
    }

    zipStat(stat, mult) {
        return Math.floor((this.rankings[stat] * this.level * mult) + this.rootStats[stat]);
    }

    zipStatDemo(ranking, stat) {
        if (stat === "HP") {
            return Math.floor((ranking * this.level * 6) + this.rootStats[stat]);
        } else {
            if (stat === "SP") {
                return Math.floor((ranking * this.level * 4) + this.rootStats[stat]);
            } else {
                return Math.floor((ranking * this.level * 2) + this.rootStats[stat]);
            }
        }
    }

    getBaseStats() {
        let stats;
        stats =
        {
            HP: this.zipStat("HP", 6), SP: this.zipStat("SP", 4),
            STR: this.zipStat("STR", 2), DEF: this.zipStat("DEF", 2),
            MAG: this.zipStat("MAG", 2), MDF: this.zipStat("MDF", 2),
            SPD: this.zipStat("SPD", 2), DEX: this.zipStat("DEX", 2)
        };

        stats[this.nature.boon] += Math.floor(stats[this.nature.boon] * 0.2);
        stats[this.nature.bane] -= Math.floor(stats[this.nature.bane] * 0.2);

        if (this.role.boon != null) {
            stats[this.role.boon] += Math.floor(stats[this.role.boon] * 0.2);
        }

        return stats;
    }

    equipAndLearn(array) {
        let available = this.role[array];
        let result = [];

        if (array === "weapons" || array === "armors") {
            result = available[this.level - 1];
        }
        else {
            if (array === "actives" || array === "passives") {
                for (let i = 0; i < this.level; i++) {
                    if (this.role[array][i] != null) {
                        result.push(this.role[array][i]);
                    }
                }
            }
        }

        return result;
    }

    updateStatsAndEquipment() {
        this.baseStats = this.getBaseStats();
        this.combatStats = this.baseStats;

        this.equippedWeapon = this.equipAndLearn("weapons");
        this.equippedArmor = this.equipAndLearn("armors");
        this.learnedActives = this.equipAndLearn("actives");
        this.learnedPassives = this.equipAndLearn("passives");
    }
}

class Monster {
    constructor(name, desc, stats, weapon, armor, passives, commands, imageSource, size) {
        this.name = name;
        this.desc = desc;
        this.stats = stats;
        this.weapon = weapon;
        this.armor = armor;
        this.passives = passives;
        this.commands = commands;
        this.imageSource = imageSource;
        this.size = size;
    }
}

class TroopMember extends Monster {
    constructor(mons, level, posX, posY) {
        super(mons);
        this.name = mons.name;
        this.desc = mons.desc;
        this.stats = mons.stats;
        this.weapon = mons.weapon;
        this.armor = mons.armor;
        this.passives = mons.passives;
        this.commands = mons.commands;
        this.imageSource = mons.imageSource;

        this.baseStats = this.stats;
        this.equippedWeapon = this.weapon;
        this.equippedArmor = this.armor;
        this.learnedPassives = this.passives;

        this.level = level;
        this.combatStats = this.baseStats;

        this.inBattleFX = [];

        this.posX = posX;
        this.posY = posY;
        this.size = mons.size;

        if (this.size === "small") {
            this.scaleX = 4; this.scaleY = 4;
        }
    }
}

class MoveFX {
  constructor(xChange, yChange) {
    this.xChange = xChange;
    this.yChange = yChange;
  }
}

class SizeFX {
  constructor(wBase, wTarget, hBase, hTarget) {
    this.wBase = wBase; this.wTarget = wTarget;
    this.hBase = hBase; this.hTarget = hTarget;
  }
}

class TintFX {
  constructor(rBase, rTarget, rRate, gBase, gTarget, gRate, bBase, bTarget, bRate, aBase, aTarget, aRate) {
    this.rBase = rBase; this.rTarget = rTarget; this.rRate = rRate;
    this.gBase = gBase; this.gTarget = gTarget; this.gRate = gRate;
    this.bBase = bBase; this.bTarget = bTarget; this.bRate = bRate;
    this.aBase = rBase; this.aTarget = aTarget; this.aRate = aRate;
  }
}

class ParticleAnimation {
  constructor(frames, particleSource, spawnType, moveFX, sizeFX, tintFX) {
    this.frames = frames;
    this.particleSource = particleSource;
    this.spawnType = spawnType;
    
    this.moveFX = moveFX;
    this.sizeFX = sizeFX;
    this.tintFX = tintFX;

  }
}

class AnimatedParticle {
  // (x,y) = circle's center at (x,y)
  // (w0,h0) = base width + height (for circle, w0 = h0)
  // (wD,hD) = change in width + height (for circle, wD = hD)
  // (a0,aD) = base opacity (255 = opaque) + rate of fade per frame
  // (r0,g0,b0) = base red, green, and blue values
  // (rD,gD,bD) = rate of red/green/blue change per frame
  // (t) = frames it needs to wait for when this particle goes
  // (d) = frames it has before disappearing
  constructor(src,x,y,xC,yC,w1,h1,w2,h2,r0,g0,b0,a0,r2,g2,b2,a2,rR,gR,bR,aR,t,d) {
    this.src = src;
    this.x = x; this.y = y;
    this.xC = xC; this.yC = yC;
    this.w1 = w1; this.h1 = h1;
    this.w2 = w2; this.h2 = h2;
    this.r0 = r0; this.g0 = g0; this.b0 = b0; this.a0 = a0;
    this.r2 = r2; this.g2 = g2; this.b2 = b2; this.a2 = a2;
    this.rR = rR; this.gR = gR; this.bR = bR; this.aR = aR;
    this.t = t;
    this.d = d;
    
    this.xD = xC/d;
    this.yD = yC/d;
    
    this.rD = getDelta(0, d / rR, r0, r2);
    this.gD = getDelta(0, d / gR, g0, g2);
    this.bD = getDelta(0, d / bR, b0, b2);
    this.aD = getDelta(0, d / aR, a0, a2);
    
    this.wD = getDelta(0, d, w1, w2);
    this.hD = getDelta(0, d, h1, h2);

    this.end = this.t + this.d;
  }
  
  display() {
    if (animTime < this.end && this.t <= animTime && this.a0 >= 0) {
      push();
      imageMode(CENTER);
      let a = this.a0;
      let r = this.r0; let g = this.g0; let b = this.b0;
      tint(r,g,b,a);
      noStroke();
      image(this.src.pic,this.x*scaling,this.y*scaling,this.w1*scaling,this.h1*scaling);
      this.change();
      pop();
    }
  }
  
  change() {
    this.x += this.xD; this.y += this.yD;
    this.w1 += this.wD; this.h1 += this.hD;
    this.r0 += this.rD; this.r0 = Math.floor(this.r0);
    this.g0 += this.gD; this.g0 = Math.floor(this.g0);
    this.b0 += this.bD; this.b0 = Math.floor(this.b0);
    this.a0 += this.aD; this.a0 = Math.floor(this.a0);
  }
}

class InCombatAnimation extends ParticleAnimation {
  constructor(anim,particleAmount,particleWidth,particleHeight,spawnGap,boundX,boundY,boundW,boundH,target) {
    super(anim);
    this.frames = anim.frames;
    this.particleSource = anim.particleSource;
    this.spawnType = anim.spawnType;
    this.spawnGap = anim.spawnGap;
    
    this.particleAmount = particleAmount;
    this.particleWidth = particleWidth;
    this.particleHeight = particleHeight;
    this.spawnGap = spawnGap;
    
    this.moveFX = anim.moveFX;
    this.sizeFX = anim.sizeFX;
    this.tintFX = anim.tintFX;
    
    this.boundX = boundX;
    this.boundY = boundY;
    this.boundW = boundW;
    this.boundH = boundH;

    this.target = target;
    
    this.particleHolder = [];
    this.animDuration = 0;
  }
  
  start() {
    this.animDuration = (this.particleAmount - 1) * this.spawnGap + this.frames;
    animLimit = this.animDuration;
    
    let xC; let yC;
    if (this.moveFX != null) {
      xC = this.moveFX.xChange;
      yC = this.moveFX.yChange;
    } else {
      xC = 0; yC = 0;
    }
    
    let wB; let wT; let hB; let hT;
    if (this.sizeFX != null) {
      wB = this.sizeFX.wBase; wT = this.sizeFX.wTarget;
      hB = this.sizeFX.hBase; hT = this.sizeFX.hTarget;
    } else {
      wB = 1; wT = 1; hB = 1; hT = 1;
    }
    
    // wB *= this.particleWidth; wT *= this.particleWidth;
    // hB *= this.particleHeight; hT *= this.particleHeight;
    
    let rB; let rT; let rR;
    let gB; let gT; let gR;
    let bB; let bT; let bR;
    let aB; let aT; let aR;
    
    if (this.tintFX != null) {
      rB = this.tintFX.rBase; rT = this.tintFX.rTarget; rR = this.tintFX.rRate;
      gB = this.tintFX.gBase; gT = this.tintFX.gTarget; gR = this.tintFX.gRate;
      bB = this.tintFX.bBase; bT = this.tintFX.bTarget; bR = this.tintFX.bRate;
      aB = this.tintFX.aBase; aT = this.tintFX.aTarget; aR = this.tintFX.aRate;
    } else {
      rB = 255; rT = 255; rR = 1;
      gB = 255; gT = 255; gR = 1;
      bB = 255; bT = 255; bR = 1;
      aB = 255; aT = 255; aR = 1;
    }
    for (let i = 0; i < this.particleAmount; i++) {
      let x = 0; let y = 0;
      if (this.spawnType === 'random') {
        x = random(this.boundX,(this.boundX+this.boundW));
        y = random(this.boundY,(this.boundY+this.boundH));
      }
      if (this.spawnType === 'center') {
        x = (this.boundX+(this.boundW/2));
        y = (this.boundY+(this.boundH/2));
      }
      this.particleHolder.push(
        new AnimatedParticle(
          this.particleSource,
          x, y, xC, yC,
          wB, hB, wT, hT,
          rB, gB, bB, aB,
          rT, gT, bT, aT,
          rR, gR, bR, aR,
          this.spawnGap * i, this.frames
        )
      );
    }
  }
  
  stop() {
    this.particleHolder = [];
    doActionTo(this.target);
  }
}

let balloonBig = new SizeFX(1,6,1,6);
let balloonHuge = new SizeFX(1,12,1,12);
let cinders = new TintFX(
  255,255,1,
  0,255,4,
  0,255,2,
  255,0,1
);

let ko = new Condition(
    "KO", "skip", 2, true, 1.0, "recurring",
    null, null, null, null, null, 1000, null,
    null, null, null,
    "Knocked out. Action is skipped for this turn."
);

let defending = new Condition(
    "Defending", "field-dependent", 4, isTargetted, 1.0, "recurring",
    null, "damage", "multiply", null, 0.5, 1, null,
    " braces for damage!", null, " gets out of its defending stance.",
    "Damage received by this player is halved for this turn."
);

let poisoned = new Condition(
    "Poisoned", "base-stat-dependent", 5, true, 1.0, "recurring",
    null, "HP", "subtractFromBase", "HP", 0.083, 8, null,
    " is poisoned!", " is hurting from the poison...", "'s poisoning is abated.",
    "Deals small damage for a certain amount of turns."
);

let stunned = new Condition(
    "Stunned", "skip", 2, true, 1.0, "instant",
    null, null, null, null, null, 2, null,
    " is stunned!", " couldn't move!", " can move again.",
    "Action is skipped for this turn."
);

let paralyzed = new Condition(
    "Paralyzed", "skip", 2, true, 0.2, "recurring",
    null, null, null, null, null, 4, null,
    " is paralyzed!", " is too rigid to move...", " is freed from paralysis.",
    "Action is skipped for this turn."
);

let openwounds = new Condition(
    "Open Wounds", "field-dependent", 4, isTargetted, 1.0, "recurring",
    null, "damage", "multiply", null, 1.5, 1, null,
    null, null, null,
    "Damage received by this player afterwards is boosted to 1.5x this turn."
);

let bloodthirst = new Condition(
    "Bloodthirst", "field-dependent", 4, isActor, 1.0, "recurring",
    null, "damage", "multiply", null, 1.25, 4, null,
    " grows bloodthirsty!", null, "'s bloodthirst settles down."
);

let heal1 = new Condition(
    "Lesser Heal", "healing", 5, true, 1.0, "instant",
    null, null, null, "MAG", 0.3, 1, null,
    null, null, null,
    "Healing through 30% of caster's MAG stat."
);

let heal2 = new Condition(
    "Greater Heal", "healing", 5, true, 1.0, "instant",
    null, null, null, "MAG", 0.7, 1, null,
    null, null, null,
    "Healing through 70% of caster's MAG stat."
);

conditions[0] = new Condition(
    "Base Condition", "special", 2, isActor, 1.0, "recurring",
    null, null, null, null, 1, null,
    " has the base condition.", "'s condition is unaffected.", "'s base condition is lifted.",
    "A base condition."
);

conditions[1] = new Condition(
    "STR Boost", "base-stat-dependent", 1, true, 1.0, "instant",
    null, "STR", "equals", "STR", 1.2, 99, "getBackBase",
    "'s strength is boosted!", null, "'s boost to its strength fades."
);

conditions[2] = new Condition(
    "DEF Boost", "base-stat-dependent", 1, true, 1.0, "instant",
    null, "DEF", "equals", "DEF", 1.2, 99, "getBackBase",
    "'s defense is boosted!", null, "'s boost to its defense fades."
);

conditions[3] = new Condition(
    "MAG Boost", "base-stat-dependent", 1, true, 1.0, "instant",
    null, "MAG", "equals", "MAG", 1.2, 99, "getBackBase",
    "'s magic is boosted!", null, "'s boost to its magic fades."
);

conditions[4] = new Condition(
    "MDF Boost", "base-stat-dependent", 1, true, 1.0, "instant",
    null, "MDF", "equals", "MDF", 1.2, 99, "getBackBase",
    "'s magic defense is boosted!", null, "'s boost to its magic defense fades."
);

conditions[5] = new Condition(
    "SPD Boost", "base-stat-dependent", 1, true, 1.0, "instant",
    null, "SPD", "equals", "SPD", 1.2, 99, "getBackBase",
    "'s speed is boosted!", null, "'s boost to its speed fades."
);

conditions[6] = new Condition(
    "DEX Boost", "base-stat-dependent", 1, true, 1.0, "instant",
    null, "DEX", "equals", "SPD", 1.2, 99, "getBackBase",
    "'s dexterity is boosted!", null, "'s boost to its dexterity fades."
);

conditions[7] = new Condition(
    "Expertise", "level-dependent", 1, true, 1.0, "instant",
    null, "SKL", "equals", null, 2, 99, "getBackBase",
    "'s skill doubled!", null, null
);

conditions[8] = new Condition(
    "STR UP for Next Action", "combat-stat-dependent", 1, true, 1.0, "instant",
    null, "STR", "multiply", "STR", 1.5, 2, "getBackBase",
    " perks up! Strength increased for the next turn.", null, null
);

conditions[9] = new Condition(
    "DEF UP for Next Action", "combat-stat-dependent", 1, true, 1.0, "instant",
    null, "DEF", "multiply", "DEF", 1.5, 2, "getBackBase",
    " perks up! Defense increased for the next turn.", null, null
);

conditions[10] = new Condition(
    "MAG UP for Next Action", "combat-stat-dependent", 1, true, 1.0, "instant",
    null, "MAG", "multiply", "MAG", 1.5, 2, "getBackBase",
    " perks up! Magic increased for the next turn.", null, null
);

conditions[11] = new Condition(
    "MDF UP for Next Action", "combat-stat-dependent", 1, true, 1.0, "instant",
    null, "MDF", "multiply", "MDF", 1.5, 2, "getBackBase",
    " perks up! Magic defense increased for the next turn.", null, null
);

conditions[12] = new Condition(
    "SPD UP for Next Action", "combat-stat-dependent", 1, true, 1.0, "instant",
    null, "SPD", "multiply", "SPD", 1.5, 2, "getBackBase",
    " perks up! Speed increased for the next turn.", null, null
);

conditions[12] = new Condition(
    "DEX UP for Next Action", "combat-stat-dependent", 1, true, 1.0, "instant",
    null, "DEX", "multiply", "DEX", 1.5, 2, "getBackBase",
    " perks up! Dexterity increased for the next turn.", null, null
);

let currentPhaseTic = 0;
let hasWon = false;

// 0 = start of combat
// 1 = start of a new round; rerolls turn order
// 2 - start of an actor's turn; decides on an action
// 3 - start of actor's target selection
// 4 - during an actor's action
// 5 - the end of an actor's turn
// 6 - end of combat

let totalRounds = 0;
let orderNo = 0;

let activeActor;
let registeredAction;
let actionTargets;

field_vars = {
    damage: 0
};

class BattleAction {
    constructor(command, actor) {
        this.command = command;
        this.actor = actor;
    }
}

function initialiseBattle() {
    play_mode = true;
    windowState = "battle";
    currentPhaseTic = 0;
    hasWon = false;
    totalRounds = 0;

    divLog.html("");
    divLog.html('<h2>Experiment in progress...</h2>');

    partyTargets = [];
    troopTargets = [];

    players = party.concat(troop);
    for (let i = 0; i < players.length; i++) {
        resetStats(players[i]);
        pushCombatStats(players[i]);
        console.log(players[i]);
        healthbars[i] = new HealthBar(players[i]);
        activatePassives(players[i], currentPhaseTic);
    }

    for (let i = 0; i < party.length; i++) {
        partyTargets[i] = new TargetComp(party[i]);
        party_spiritbars[i] = new SpiritBar(party[i]);
        allVisComps.push(partyTargets[i]);

        party[i].imageComp.isEnabled = false;
    }

    for (let i = 0; i < troop.length; i++) {
        troopTargets[i] = new TargetComp(troop[i]);
        allVisComps.push(troopTargets[i]);

        troop[i].imageComp.isEnabled = false;
    }
    startRound();
}

function playerSelectedTarget(player) {
    let target = [];
    target.push(player);
    return target;
}

function removeTargets(visComp) {
    return visComp.constructor.name != "TargetComp";
}
function stopBattle() {
    play_mode = false;
    windowState = "idle";
    currentPhaseTic = 0;
    hasWon = false;
    totalRounds = 0;

    players = [];

    for (let i = 0; i < party.length; i++) {
        resetStats(party[i]);
        party[i].imageComp.isEnabled = true;
        party[i].imageComp.isActive = false;
    }
    for (let i = 0; i < troop.length; i++) {
        resetStats(troop[i]);
        troop[i].imageComp.isEnabled = true;
        troop[i].imageComp.isActive = false;
    }

    allVisComps = allVisComps.filter(removeTargets);
    partyTargets = [];
    troopTargets = [];
    divLog.html('');
}
function resetStats(player) {
    // normally i would just do a combatstats = basestats here
    // but apparently just doing that makes them equal each other all the time, which would be a problem in battle
    // this is a compromise
    player.combatStats = {
        HP: player.baseStats.HP, SP: player.baseStats.SP,
        STR: player.baseStats.STR, DEF: player.baseStats.DEF,
        MAG: player.baseStats.MAG, MDF: player.baseStats.MDF,
        SPD: player.baseStats.SPD, DEX: player.baseStats.DEX
    };
    player.inBattleFX = [];
}

function pushCombatStats(player) {
    player.combatStats.SKL = player.level;
    player.combatStats.ACC = 100;
    player.combatStats.EVA = player.combatStats.DEX * 0.1;
}

function startRound() {
    currentPhaseTic = 1; // start of round
    totalRounds += 1;
    players = party.concat(troop);
    for (let i = 0; i < players.length; i++) {
        players[i].combatStats.SPD += Math.random() * players[i].combatStats.DEX * 0.25;
    }
    determineTurnOrder();

    declareRound();

    for (let i = 0; i < players.length; i++) {
        activateInBattleFx(players[i], currentPhaseTic);
        activatePassives(players[i], currentPhaseTic);
    }
    releaseFX(players);
    orderNo = 0;

    whoseTurn(orderNo);
}

function determineTurnOrder() {
    // order algorithm
    let ordered = false;
    while (!ordered) {
        let wrong = 0;
        for (let i = 0; i < players.length - 1; i++) {
            if (players[i].combatStats["SPD"] < players[i + 1].combatStats["SPD"]) {
                // if players going first have a slower speed OR have 0 HP and are knocked out, they're ordered wrong!
                wrong += 1;
                let placeholder;
                placeholder = players[i];
                players[i] = players[i + 1];
                players[i + 1] = placeholder;
            }
        }
        if (wrong === 0) {
            ordered = true;
        }
    }

    // how to shuffle the order of party/foe members that have the same speed...?

    let dis_turn = "Turn order: ";
    for (let i = 0; i < players.length; i++) {
        players[i].turnToken = i + 1;
        dis_turn += players[i].name + " (Turn token: " + players[i].turnToken + "), ";
    }
    console.log(dis_turn);
}

function declareRound() {
    divLog.html(`<h1>Round ${totalRounds}</h1>`, true);

    let queue = "Turn order: ";
    for (let i = 0; i < players.length; i++) {
        queue += players[i].name;
        if (i < players.length - 1) {
            queue += ", "
        }
    }
    divLog.html(`<p>${queue}</p>`, true);
}

function whoseTurn(num) {
    currentPhaseTic = 2;

    activeActor = players[num];
    activateInBattleFx(activeActor, currentPhaseTic); // active actor's effects that activate in 
    activatePassives(activeActor, currentPhaseTic); // activate passives of active actor here

    for (let i = 0; i < button_actives.length; i++) {
        button_actives[i].name = "";
        button_actives[i].desc = "";
    }

    if (activeActor.constructor.name === "PartyMember") {
        // set up available abilities here
        for (let i = 0; i < activeActor.learnedActives.length; i++) {
            button_actives[i].name = activeActor.learnedActives[i].name;
            button_actives[i].desc = "[" + activeActor.learnedActives[i].type + "]" + "[SP Cost: " + activeActor.learnedActives[i].spCost + "] " + activeActor.learnedActives[i].desc;
        }
        // show available actions here
        announcer.content = "What will " + activeActor.name + " do?";
        console.log("It is " + activeActor.name + "'s turn! What will you do?");
        console.log("Use getAction() for this.");
        console.log("Possible actions: attack, abilities, defend");
    } else {
        if (activeActor.constructor.name === "TroopMember") {
            console.log("It is " + activeActor.name + "'s turn!");
            let troop_action = activeActor.commands[totalRounds % activeActor.commands.length];
            if (troop_action.spCost <= activeActor.combatStats.SP) {
                registeredAction = new BattleAction(troop_action, activeActor);
            } else {
                registeredAction = new BattleAction(activeActor.commands[0], activeActor); // defaults to first turn attack if sp is low;
            }
            getActionTargets(registeredAction);
        }
    }
}

function goBack() {
    currentPhaseTic = 2;
    announcer.content = "What will " + activeActor.name + " do?";
    // console.log("It is " + activeActor.name + "'s turn! What will you do?");
    // console.log("Use getAction() for this.");
    // console.log("Possible actions: attack, abilities, defend");
}
// for combat buttons later on
function getAction(command) {
    if (command === "attack") {
        registeredAction = new BattleAction(basicAttack, activeActor);
        getActionTargets(registeredAction);
    }
    if (command === "abilities") {
        showAbilities(activeActor);
    }
    if (command === "defend") {
        registeredAction = new BattleAction(basicDefend, activeActor);
        getActionTargets(registeredAction);
    }
}

// show abilties
function showAbilities(actor) {
    let activesAsString = "";
    activesShown = true;
    for (let i = 0; i < actor.learnedActives.length; i++) {
        button_actives[i].name = actor.learnedActives[i].name;
        // button_actives[i].desc = "[[" + actor.learnedActives[i].type + "]] " + "[[SP Cost: " + actor.learnedActives[i].spCost + "]]" + actor.learnedActives[i].desc;
        button_actives[i].desc = `Type: ${actor.learnedActives[i].type} // SP Cost: ${actor.learnedActives[i].spCost} // ${actor.learnedActives[i].desc}`;
        activesAsString += actor.learnedActives[i].name + ", ";
    }
    console.log("Available abilities: " + activesAsString);
    console.log("Type useAbility() to activate a chosen ability.");
}

function hideAbilities() {
    activesShown = false;
}

// for ability buttons later on
function useAbility(activeChosen) {
    for (let i = 0; i < activeActor.learnedActives.length; i++) {
        if (activeChosen === activeActor.learnedActives[i].name) {
            registeredAction = new BattleAction(activeActor.learnedActives[i], activeActor);
            getActionTargets(registeredAction);
        }
    }
}

function getActionTargets(action) {
    currentPhaseTic = 3;
    actionTargets = [];
    if (action.command.targettables === "self") {
        actionTargets.push(action.actor);
        if (action.actor.constructor.name === "PartyMember") {
            for (let i = 0; i < partyTargets.length; i++) {
                if (action.actor.name === partyTargets[i].target.name) {
                    partyTargets[i].isShown = true;
                }
            }
        } else {
            if (action.actor.constructor.name === "TroopMember") {
                for (let i = 0; i < troopTargets.length; i++) {
                    if (action.actor.name === troopTargets[i].target.name) {
                        troopTargets[i].isShown = true;
                    }
                }
            }
        }
    } else {
        if (action.command.targettables === "ally") {
            if (action.actor.constructor.name === "PartyMember") {
                for (let i = 0; i < party.length; i++) {
                    actionTargets.push(party[i]);
                    partyTargets[i].isShown = true;
                }
            } else {
                if (action.actor.constructor.name === "TroopMember") {
                    for (let i = 0; i < troop.length; i++) {
                        actionTargets.push(troop[i]);
                        troopTargets[i].isShown = true;
                    }
                }
            }
        }
        else {
            if (action.command.targettables === "foe") {
                if (action.actor.constructor.name === "PartyMember") {
                    for (let i = 0; i < troop.length; i++) {
                        actionTargets.push(troop[i]);
                        troopTargets[i].isShown = true;
                    }
                } else {
                    if (action.actor.constructor.name === "TroopMember") {
                        for (let i = 0; i < party.length; i++) {
                            actionTargets.push(party[i]);
                            partyTargets[i].isShown = true;
                        }
                    }
                }
            }
        }
    }

    let targetsAsString = "";
    for (let i = 0; i < actionTargets.length; i++) {
        if (actionTargets[i].constructor.name === "PartyMember") {
            targetsAsString += "party[" + i + "], ";
        } else {
            if (actionTargets[i].constructor.name === "TroopMember") {
                targetsAsString += "troop[" + i + "], ";
            }
        }
    }

    if (activeActor.constructor.name === "PartyMember") {
        announcer.content = "Choose the target of " + action.command.name;
        console.log("Available targets: " + targetsAsString);
        console.log("Who will be the target of " + action.command.name + "?");
        console.log("Use doActionTo([target]) to select a target, or use goBack() to go back to action selection.");
    } else {
        if (activeActor.constructor.name === "TroopMember") {
            if (action.command.targettables === "self") {
                animateAction([actionTargets[0]],action);
            } else {
                if (action.command.targettables === "ally" || action.command.targettables === "foe") {
                    // it has to do an action to a randomized target
                    let target;
                    do {
                        target = actionTargets[Math.floor(randomWithin(0, actionTargets.length))];
                    }
                    while (target.inBattleFX.filter(checkForKO).length >= 1);
                    function checkForKO(fx) {
                        return fx.name === "KO";
                    }
                    animateAction([target],action);
                }
                else {
                    if (action.command.targettables === "all-allies" || action.command.targettables === "all-foes") {
                        let targets = [];
                        for (let i = 0; i < players.length; i++) {
                            if (players[i].constructor.name === "TroopMember") {
                                if (action.command.targettables === "all-allies") {
                                    targets.push(players[i]);
                                } else {
                                    if (players[i].constructor.name === "PartyMember") {
                                        if (action.command.targettables === "all-foes") {
                                            targets.push(players[i]);
                                        }
                                    }
                                }
                            }
                        }
                         animateAction(targets,action);
                    }
                }
            }
        }
    }
}

function animateAction(selected_target, action) {
    currentPhaseTic = 4;
    if (selected_target.length === 1) {
        if (registeredAction.command.type != "attack" && registeredAction.command.type != "defend") {
            announcer.content = `${activeActor.name} uses ${action.command.name}!`
        } else {
            if (registeredAction.command.type === "attack") {
                announcer.content = `${activeActor.name} attacks!`
            } else {
                announcer.content = `${activeActor.name} braces for damage!`
            }
        }
        // console.log(activeActor.name + " uses " + registeredAction.command.name + " on " + selected_target[0].name + "!");
        divLog.html('<p>' + activeActor.name + " uses " + registeredAction.command.name + " on " + selected_target[0].name + "!" + '</p>', true);
        activeAnim = new InCombatAnimation(animations[0],3,20,20,6,selected_target[0].posX+ui.x, selected_target[0].posY+ui.y, selected_target[0].scaleX, selected_target[0].scaleY, selected_target);
    }
    activeAnim.start();
}

function doActionTo(selected_target) { // selected_target is an array that can contain one or more players
    currentPhaseTic = 4;
    activeActor.imageComp.isActive = false;
    let showDamage = true;

    if (registeredAction.command.type != "attack" && registeredAction.command.type != "defend") {
        activeActor.combatStats.SP -= registeredAction.command.spCost;
        // console.log(activeActor.name + "'s SP = " + activeActor.combatStats.SP + "/" + activeActor.baseStats.SP);
        // divLog.html('<p>' + activeActor.name + "'s SP = " + activeActor.combatStats.SP + "/" + activeActor.baseStats.SP + '</p>', true);
    }

    let damage;
    if (selected_target.length === 1) {
        let acc = activeActor.combatStats.ACC;
        let eva = selected_target[0].combatStats.EVA;
        let hit_chance = acc - eva;
        if (Math.random() <= hit_chance || registeredAction == actives[9] || registeredAction == actives[10] || registeredAction.command.type === "defend") {
            damage = calculateRawDamage(activeActor, registeredAction, selected_target[0]);
            showDamage = flagToShowDamage(registeredAction);

            field_vars.damage = damage;
            activateInBattleFx(selected_target[0], currentPhaseTic); // reaction effects
            damage = field_vars.damage;
        } else {
            console.log("The attack missed!");
            divLog.html('<p>' + "The attack missed!" + "!" + '</p>', true);
        }
    
    actionAftermath(damage, selected_target[0], showDamage);
    } else {
        console.log(activeActor.name + " uses " + registeredAction.command.name + "!");
        // demonstration does not have actions that have multiple targets yet; will be updated in v3.
    }
}

function flagToShowDamage(action) {
    if (action.command.type === "defend" || action.command.type === "spell-mod" || action.command.type === "tech-mod") {
        return false;
    }
    else {
        return true;
    }
}

function actionAftermath(dmg, target, showDmg) {
    currentPhaseTic = 5;
    dealDamage(dmg, target, activeActor, showDmg);

    dealFX(registeredAction.command, activeActor, target); // deal the conditions attributed to the action
    activateInBattleFx(activeActor, currentPhaseTic); // actor aftermath effects
    activatePassives(activeActor, currentPhaseTic); // actor aftermath passives
}

function checkAndGo() {
    checkTheDead(party);
    checkTheDead(troop);

    goToNextActor();
}
function skipAction(player, fx) { // skipping actions can only happen through conditions like getting KO'd or stunned.
    currentPhaseTic = 4;

    if (fx.activationDialog != null) {
        console.log(player.name + fx.activationDialog);
        divLog.html('<p>' + player.name + fx.activationDialog + '</p>', true);
    }
    // stun guarantees one action is skipped, regardless on whether or not the afflicted moved before the round stun is applied
    // that's why its duration happens for 2 turns. however, its effect is instant and releases itself right after.
    // its release is here.
    if (fx.name === "Stunned") {
        activeActor.inBattleFX = activeActor.inBattleFX.filter(removeStun);
        function removeStun(fx) {
            return fx.name != "Stunned";
        }
        if (fx.releaseDialog != null) {
            console.log(player.name + fx.releaseDialog);
            divLog.html('<p>' + player.name + fx.releaseDialog + '</p>', true);
        }
    }
    currentPhaseTic = 5;
    activateInBattleFx(activeActor, currentPhaseTic); // actor aftermath effects
    activatePassives(activeActor, currentPhaseTic); // actor aftermath passives

    checkTheDead(party);
    checkTheDead(troop);

    goToNextActor();
}

function goToNextActor() {
  if (currentPhaseTic <= 5 && !hasWon) {
          orderNo += 1;
          if (orderNo >= players.length) {
              startRound();
          }
        else {
              whoseTurn(orderNo);
          }
        }
}

function calculateRawDamage(actor, action, target) { // target is a Player object
    let damage;

    let actor_stats = actor.combatStats;
    let actor_weapon = actor.equippedWeapon;
    let actor_armor = actor.equippedArmor;

    let target_stats = target.combatStats;
    let target_weapon = target.equippedWeapon;
    let target_armor = target.equippedArmor;

    if (action.command.type === "attack" || action.command.type === "technique") {
        damage = (actor_stats.STR - target_stats.DEF) * 2;
        damage += (actor_weapon.phys * actor_stats.SKL / 10) - (target_armor.phys / 10);
        // damage *= randomWithin(0.8,1.2);
        damage = floorZero(damage);
    }
    else {
        if (action.command.type === "spell") {
            damage = (actor_stats.MAG - target_stats.MDF) * 2;
            damage += (actor_weapon.mag * actor_stats.SKL / 10) - (target_armor.mag / 10);
            // damage *= randomWithin(0.8,1.2);
            damage = floorZero(damage);
        } else {
            if (action.command.type === "defend" || action.command.type === "spell-mod" || action.command.type === "tech-mod") {
                damage = 0;
            }
        }
    }

    damage *= action.command.damageMult;
    damage = Math.floor(damage);
    damage = floorZero(damage);
    return damage;
}

let damageIndicators = [];

function showDamage(dmg, target) {
    damageTime = 0;
    damageLimit = 75;
    damageIndicators.push(new DamageIndicator(dmg, target));
}

function dealDamage(dmg, target, source, show) {
    let statement = "";
    if (source.constructor.name === "inBattleFX") {
        statement += "[Effect] ";
    }
    statement += source.name + " deals " + dmg + " damage!";

    target.combatStats.HP = target.combatStats.HP - dmg;
    target.combatStats.HP = floorZero(target.combatStats.HP);

    if (show) {
        showDamage(dmg, target)
        divLog.html('<p>' + statement + '</p>', true);
        console.log(target.name + "'s HP = " + target.combatStats.HP);
    }

    if (target.combatStats.HP <= 0) {
        knockout(target, totalRounds);
    }
}

function knockout(player, round) {
    player.inBattleFX = [];
    player.inBattleFX.push(new inBattleFX(ko, round));
    if (player.constructor.name === "PartyMember") {
        for (let i = 0; i < party.length; i++) {
        }
    }
    console.log(player.name + " is defeated!");
    divLog.html('<p>' + player.name + " is defeated!" + '</p>', true);
}

function checkTheDead(team) {
    let dead = 0;
    for (let i = 0; i < team.length; i++) {
        if (team[i].combatStats.HP <= 0) {
            dead += 1;
        }
    }

    if (dead === team.length) {
        if (team === party) {
            hasWon = false;
            endBattle(hasWon);
        }
        if (team === troop) {
            hasWon = true;
            endBattle(hasWon);
        }
    }
}

function endBattle(win) {
    currentPhaseTic = 6;
    if (win) {
        console.log("Battle ended! The party was victorious!");
        divLog.html('<p>' + "The party was victorious!" + '</p>', true);
        console.log("Use initialiseBattle() to play again.");
    }
    else {
        console.log("Battle ended! The party was defeated... ");
        console.log("Use initialiseBattle() to play again.");
        divLog.html('<p>' + "The party was defeated..." + '</p>', true);
    }
}

function setup() {
    for (let ally of loaded_allies) {
        ally.gray.filter(GRAY);
    }

    for (let enemy of loaded_enemies) {
        enemy.gray.filter(GRAY);
        enemy.gray.filter(INVERT);
    }

    weapons[0] = new Weapon("Unarmed", "Bare fists that pummel the opponent.", 0, 0);

    weapons[1] = new Weapon("Simple Sword", "[PP: 10] [MP: 0] A sword without any embellishments.", 10, 0);
    weapons[2] = new Weapon("Simple Axe", "[PP: 12] [MP: 0] An axe with no embellishments.", 12, 0);
    weapons[3] = new Weapon("Simple Bow", "[PP: 15] [MP: 0] A bow with no embellishments.", 15, 0);
    weapons[4] = new Weapon("Simple Dagger", "[PP: 8] [MP: 0] A dagger with no embellishments.", 8, 0);
    weapons[5] = new Weapon("Simple Tome", "[PP: 4] [MP: 10] A tome with no embellishments.", 4, 10);
    weapons[6] = new Weapon("Simple Staff", "[PP: 8] [MP: 10] A staff with no embellishments.", 8, 10);

    weapons[7] = new Weapon("Silver Sword", "[PP: 20] [MP: 0] A sword with a silver sheen.", 20, 0);
    weapons[8] = new Weapon("Tomahawk", "[PP: 24] [MP: 0] A double-sided swinging axe.", 24, 0);
    weapons[9] = new Weapon("Silken Bow", "[PP: 30] [MP: 6] A bow with a smooth yet durable silken string.", 30, 6);
    weapons[10] = new Weapon("Cinquedea", "[PP: 18] [MP: 0] A wide triangular dagger.", 18, 0);
    weapons[11] = new Weapon("Bejeweled Tome", "[PP: 8] [MP: 20] A tome with glyphs and gems along its cover.", 8, 20);
    weapons[12] = new Weapon("Opal Staff", "[PP: 15] [MP: 20] A staff with an opal on its top.", 15, 20);

    weapons[13] = new Weapon("Vorpal Sword", "[PP: 30] [MP: 0] A sword emitting an otherworldly light.", 30, 0);
    weapons[14] = new Weapon("Allcleaver", "[PP: 24] [MP: 0] An axe with an edge so sharp it cuts through space.", 24, 0);
    weapons[15] = new Weapon("Oddysean Recurve", "[PP: 50] [MP: 0] A bow that requires high draw strength.", 50, 0);
    weapons[16] = new Weapon("Atropic Scalpel", "[PP: 28] [MP: 0] A small dagger said to cull those meant to die.", 28, 0);
    weapons[17] = new Weapon("Forbidden Tome", "[PP: 12] [MP: 35] A tome with powers sealed for all manner of reasons.", 12, 35);
    weapons[18] = new Weapon("Caduceus Staff", "[PP: 25] [MP: 30] A staff with two entwining snakes.", 25, 30);

    armors[0] = new Armor("Unshielded", "No armor placed on the person.", 0, 0);

    armors[1] = new Armor("Simple Armor", "Armor with no embellishments.", 15, 0);
    armors[2] = new Armor("Simple Clothes", "Clothes that offer free movement.", 5, 0);
    armors[3] = new Armor("Simple Robe", "A robe with no embellishments.", 5, 10);

    armors[4] = new Armor("Adamant Armor", "Armor that is tougher than most.", 25, 5);
    armors[5] = new Armor("Light Clothes", "Clothes that provide flexibility.", 10, 0);
    armors[6] = new Armor("Sorcerer Robe", "A robe adorned with glyphs along the hem.", 8, 20);

    armors[7] = new Armor("Valhallan Steel", "Armor akin to a valkyrie's battle gear.", 30, 0);
    armors[8] = new Armor("Windthread", "Clothes as flexible as the wind.", 20, 10);
    armors[9] = new Armor("Goddess's Veil", "A robe coming from a goddess herself.", 10, 30);

    basicAttack = new Attack();
    basicDefend = new Defend();

    actives[0] = new Active(
        "Normal Active", "A normal attack used an as active ability.",
        "technique", 0, 1.0,
        "foe", null, null, null);
    actives[1] = new Active(
        "Double Strike", "Attack twice in one action.",
        "technique", 10, 2.0,
        "foe", null, null, null);
    actives[2] = new Active(
        "Poison Strike", "Attack with a chance to poison.",
        "technique", 5, 1.0,
        "foe", poisoned, "target", 0.3);
    actives[3] = new Active(
        "Stunning Blow", "A heavy attack with a chance to stun.",
        "technique", 7, 1.0, "foe", stunned, "target", 0.3
    );
    actives[4] = new Active(
        "Tristrike", "Attack with three times the power.",
        "technique", 20, 3.0,
        "foe", null, null, null
    );
    actives[5] = new Active(
        "Bloodlet Pierce", "Has a chance to inflict wounds that aggravate damage afterward.",
        "technique", 12, 1.25,
        "foe", openwounds, "target", 0.7
    );
    actives[6] = new Active(
        "Mana Strike", "Attack with magic.",
        "spell", 5, 1.0,
        "foe", null, null, null
    );
    actives[7] = new Active(
        "Spell of Hurt", "A spell with a high chance of inflicting poison.",
        "spell", 6, 0.5,
        "foe", poisoned, "target", 0.6
    );
    actives[8] = new Active(
        "Spell of Holding", "A spell with a high chance of inflicting stun.",
        "spell-mod", 6, 0.0,
        "foe", stunned, "target", 0.7
    );
    actives[9] = new Active(
        "Spell of Lesser Healing", "A spell that heals an ally.",
        "spell-mod", 6, 0.0,
        "ally", heal1, "target", 1.0
    );
    actives[10] = new Active(
        "Spell of Greater Healing", "A spell that heals an ally.",
        "spell-mod", 6, 0.0,
        "ally", heal2, "target", 1.0
    );
    actives[11] = new Active(
        "Mana Flood", "An attack with a lot more mana.",
        "spell", 10, 2.0,
        "foe", null, null, null
    );

    passives[0] = new Passive(
        "Normal Passive", "A passive ability that triggers every round but does nothing.",
        1, true, conditions[0], "self", 1.0);
    passives[1] = new Passive(
        "Muscle Definition", "Upon entry in combat, strength is boosted by 1.2x.",
        0, true, conditions[1], "self", 1.0
    );
    passives[2] = new Passive(
        "Tough Skin", "Upon entry in combat, defense is boosted by 1.2x.",
        0, true, conditions[2], "self", 1.0
    );
    passives[3] = new Passive(
        "Wizened Mind", "Upon entry in combat, magic is boosted by 1.2x.",
        0, true, conditions[3], "self", 1.0
    );
    passives[4] = new Passive(
        "Sorcerer's Behest", "Upon entry in combat, magic defense is boosted by 1.2x.",
        0, true, conditions[4], "self", 1.0
    );
    passives[5] = new Passive(
        "Hastened", "Upon entry in combat, speed is boosted by 1.2x.",
        0, true, conditions[5], "self", 1.0
    );
    passives[6] = new Passive(
        "Quick Feet", "Upon entry in combat, dexterity is boosted by 1.2x.",
        0, true, conditions[6], "self", 1.0
    );
    passives[7] = new Passive(
        "Expertise", "Upon entry in combat, skill is doubled, boosting weapon damage.",
        0, true, conditions[7], "self", 1.0
    );
    passives[8] = new Passive(
        "Strength in Focus", "When defending, grants a temporary 1.5x boost to strength.",
        5, isDefending, conditions[8], "self", 1.0
    );
    passives[9] = new Passive(
        "Merciless Entry", "Upon entry in combat, gains a bloodthirst that boosts damage.",
        0, true, bloodthirst, "self", 1.0
    );
    passives[10] = new Passive(
        "Wisdom in Focus", "When defending, grants a temporary 1.5x boost to strength.",
        5, isDefending, conditions[10], "self", 1.0
    );

    natures[0] = new Nature("Neutral", "HP", "HP", "No change to stats.");
    natures[1] = new Nature("Reckless", "ATK", "DEF", "Increases ATK, lowers DEF.");
    natures[2] = new Nature("Stalwart", "DEF", "ATK", "Increases DEF, lowers ATK.");
    natures[3] = new Nature("Curious", "MAG", "MDF", "Increases MAG, lowers MDF.");
    natures[4] = new Nature("Wary", "MDF", "MAG", "Increases MDF, lowers MAG.");
    natures[5] = new Nature("Swift", "SPD", "ATK", "Increases SPD, lowers ATK.");
    natures[6] = new Nature("Fragile", "SPD", "DEF", "Increases SPD, lowers DEF.");

    roles[0] = new Role(
        "No Role", "A mere template of a role with bare necessities.",
        [weapons[0], weapons[0], weapons[0], weapons[0], weapons[0]],
        [armors[0], armors[0], armors[0], armors[0], armors[0]],
        [actives[0], null, null, null, null],
        [passives[0], null, null, null, null],
        null
    );
    roles[1] = new Role(
        "Warrior", "Clobbers opponents with swings at its weapon and tanks physical hits.",
        [weapons[1], weapons[1], weapons[7], weapons[7], weapons[13]],
        [armors[1], armors[1], armors[4], armors[4], armors[7]],
        [actives[1], null, null, actives[3], null],
        [null, passives[2], null, null, passives[7]],
        "DEF"
    );
    roles[2] = new Role(
        "Barbarian", "With reckless abandon, its offense has no peer.",
        [weapons[2], weapons[2], weapons[8], weapons[8], weapons[14]],
        [armors[2], armors[2], armors[5], armors[5], armors[1]],
        [actives[1], null, actives[3], null, actives[4]],
        [null, passives[1], null, null, passives[9]],
        "STR"

    );
    roles[3] = new Role(
        "Sniper", "Methodical with its bow, using its own swiftness and skill to cull opponents.",
        [weapons[3], weapons[3], weapons[9], weapons[9], weapons[15]],
        [armors[1], armors[1], armors[8], armors[8], armors[4]],
        [actives[1], actives[2], null, actives[5], null],
        [passives[8], null, null, null, passives[7]],
        "SPD"
    );

    roles[4] = new Role(
        "Rogue", "Fleet-footed and fast-acting, it can evade would-be fatal attacks.",
        [weapons[4], weapons[4], weapons[10], weapons[10], weapons[16]],
        [armors[2], armors[2], armors[5], armors[5], armors[8]],
        [actives[3], actives[2], actives[5], null, actives[7]],
        [null, null, null, passives[8], null],
        "DEX"
    );

    roles[5] = new Role(
        "Magus", "Depends on its spells to deal high damage against its opponent.",
        [weapons[5], weapons[5], weapons[11], weapons[11], weapons[17]],
        [armors[3], armors[3], armors[6], armors[6], armors[9]],
        [actives[6], actives[7], null, actives[8], actives[11]],
        [passives[3], null, null, null, null],
        "MAG"
    );

    roles[6] = new Role(
        "Cleric", "Uses its spells to support others, and can tank spells itself.",
        [weapons[6], weapons[6], weapons[12], weapons[12], weapons[18]],
        [armors[3], armors[3], armors[6], armors[6], armors[9]],
        [actives[9], actives[6], null, actives[10], null],
        [null, null, passives[4], passives[10], passives[3]],
        "MDF"
    );

    characters[0] = new Character(
        "Mundi", "The template of both mortal and god.",
        { HP: 5, SP: 5, STR: 5, DEF: 5, MAG: 5, MDF: 5, SPD: 5, DEX: 5 },
        roles[0], natures[0], loaded_allies[0], "ally"
    );

    characters[1] = new Character(
        "Erae", "A merciless Astral. Their power born from wrath and justice fuels their visage in this experiment.",
        { HP: 5.5, SP: 6, STR: 6, DEF: 6.5, MAG: 4, MDF: 4.5, SPD: 3, DEX: 2 },
        roles[1], natures[0], loaded_allies[1], "ally"
    );

    characters[2] = new Character(
        "Iota", "An Astral whose task is to surgically remove imperfections in the universe. Volunteered his visage and skills for this experiment.",
        { HP: 3.5, SP: 4, STR: 6, DEF: 2.5, MAG: 6, MDF: 3, SPD: 6, DEX: 6.5 },
        roles[3], natures[0], loaded_allies[2], "ally"
    );

    characters[3] = new Character(
        "Katharyn", "An Astral who views the world as her canvas. In her pursuit of helping others create, in dreams and reality, she gave this copy of her.",
        { HP: 4, SP: 7, STR: 3, DEF: 4.5, MAG: 6.5, MDF: 5, SPD: 4, DEX: 5.5 },
        roles[5], natures[0], loaded_allies[3], "ally"
    );

    monsters[0] = new Monster(
        "Mitochondroid", "An amorphous blob of autonomous clay.",
        { HP: 200, SP: 0, STR: 25, DEF: 13, MAG: 10, MDF: 10, SPD: 5, DEX: 3 },
        weapons[0], armors[0], null,
        [basicAttack], loaded_enemies[0], "small"
    );

    monsters[1] = new Monster(
        "Timewastrel", "A goblinoid that hoards sands of time.",
        { HP: 100, SP: 0, STR: 35, DEF: 15, MAG: 25, MDF: 8, SPD: 28, DEX: 15 },
        weapons[4], armors[5], [passives[6]],
        [basicAttack], loaded_enemies[1], "small"
    );

    monsters[2] = new Monster(
        "Floating Throne", "A living surveillance device for angels.",
        { HP: 300, SP: 20, STR: 25, DEF: 21, MAG: 35, MDF: 29, SPD: 13, DEX: 5 },
        weapons[1], armors[1], [passives[3]],
        [basicAttack, basicAttack, actives[6]], loaded_enemies[2], "small"
    );

    monsters[3] = new Monster(
        "Angelic Nephil", "A curious wayward angel.",
        { HP: 275, SP: 50, STR: 25, DEF: 13, MAG: 25, MDF: 45, SPD: 19, DEX: 15 },
        weapons[12], armors[6], [passives[6]],
        [basicAttack, actives[6], actives[9]], loaded_enemies[3], "small"
    );

    monsters[4] = new Monster(
        "Demonic Nephil", "A curious wayward demon.",
        { HP: 275, SP: 50, STR: 25, DEF: 45, MAG: 25, MDF: 13, SPD: 24, DEX: 10 },
        weapons[11], armors[6], [passives[6]],
        [basicAttack, actives[7], basicAttack, actives[5]], loaded_enemies[4], "small"
    );

    monsters[5] = new Monster(
        "Baksha", "A beast corrupted by the essence of dreams.",
        { HP: 375, SP: 30, STR: 36, DEF: 27, MAG: 31, MDF: 35, SPD: 17, DEX: 21 },
        weapons[12], armors[5], null,
        [basicAttack], loaded_enemies[5], "small"
    );

    statTints = {
    HP: color('green'), SP: color('blue'),
    STR: color('red'), DEF: color('yellow'),
    MAG: color('purple'), MDF: color('magenta'),
    SPD: color('cyan'), DEX: color('yellowgreen')
    };

    windowState = "idle";

    // the canvas is divided by 24x18 100-pixel blocks
    // as such, the x and y as well as w and h are all divided by 100
    if (windowWidth >= windowHeight) {
        scaling = (windowHeight / 1800) * 100;
    } else {
        scaling = (windowWidth / 2400) * 100;
    }
    canvas = createCanvas(24 * scaling, 18 * scaling);

    scene = new ImageComp(loaded_scenes[1], "scene", 0, 0, 24, 18);

    announcer = new TextboxComp("", "announcer", 2, 1, 20, 1);

    bb = new ImageComp(loaded_bb[0], "bb", 2, 2, 20, 12);
    for (let i = 0; i < 3; i++) {
        party[i] = new PartyMember(characters[i + 1], 3, 0, 0);

        party[i].posX = 17;
        party[i].posY = 0 + (4 * i);
        party[i].imageComp = new ImageComp(
            party[i].imageSource, "ally",
            party[i].posX, party[i].posY,
            party[i].scaleX, party[i].scaleY);
    }

    for (let i = 0; i < 6; i++) {
        troop[i] = new TroopMember(monsters[i], 2, 0, 0);
        troop[i].posX = (Math.floor(i / 3)) * 4;
        troop[i].posY = 0 + (4 * (i % 3));

        troop[i].imageComp = new ImageComp(
            troop[i].imageSource, "enemy",
            troop[i].posX, troop[i].posY,
            troop[i].scaleX, troop[i].scaleY);
    }

    ui_mode = "equip";

    ui = new ImageComp(loaded_ui[0], "ui", 2, 2, 20, 12);
    uiState = 1;
    selectedActor = new ImageComp(loaded_allies[0], "selected", 1, 1, 4, 4);
    description = new TextboxComp("", "description", 14, 2, 4, 4);
    descriptionTitle = new TextboxComp("Description", "ui-title", 15, 1, 3, 1);
    uiStateTitle = new TextboxComp("Equipment & Abilities", "ui-title", 6, 5, 7, 1);
    uiPartyName = new TextboxComp("Name", "ui-heading", 6, 1, 2, 1);
    uiPartyLevel = new TextboxComp("LVL", "ui-heading", 6, 2, 1, 1);
    uiPartyRole = new TextboxComp("Role", "ui-heading", 6, 3, 2, 1);
    uiPartyNature = new TextboxComp("Nature", "ui-heading", 6, 4, 2, 1);
    uiFetchName = new TextInputComp("", 20, "ui-dependent", 8, 1, 5, 1);
    uiFetchLevel = new TextboxComp("", "ui-dependent", 7, 2, 1, 1);
    uiChangeLevel = new LevelSlider(1, 5, 1, 8.5, 2.5, 4);
    uiRoleLevel = new LevelSlider(1, 5, 1, 6, 6.5, 12);

    uiFetchRole = new TextboxComp("", "ui-dependent", 8, 3, 5, 1);
    uiFetchNature = new TextboxComp("", "ui-dependent", 8, 4, 5, 1);

    symbolWeapon = new ImageComp(loaded_role_symbols[0], "ui-symbol", 2, 7, 1, 1);
    symbolArmor = new ImageComp(loaded_role_symbols[1], "ui-symbol", 2, 8, 1, 1);
    symbolActive = new ImageComp(loaded_role_symbols[2], "ui-symbol", 2, 9, 1, 1);
    symbolPassive = new ImageComp(loaded_role_symbols[3], "ui-symbol", 2, 10, 1, 1);
    for (let i = 0; i < 5; i++) {
        uiShowWeapons[i] = new TextboxComp("", "ui-equip", 3 + (3 * i), 7, 3, 1, "");
        uiShowArmors[i] = new TextboxComp("", "ui-equip", 3 + (3 * i), 8, 3, 1, "");
        uiShowActives[i] = new TextboxComp("", "ui-learn", 3 + (3 * i), 9, 3, 1, "");
        uiShowPassives[i] = new TextboxComp("", "ui-learn", 3 + (3 * i), 10, 3, 1, "");
    }
    
    for (let i = 0; i < 8; i++) {
        uiSymbolStats[i] = new ImageComp(loaded_stat_symbols[i], "ui-symbol", 3 + (Math.floor(i / 4) * 9), 7 + (1 * (i % 4)), 1, 1, "");
        uiShowStats[i] = new TextboxComp("", "stat", 8 + (Math.floor(i / 4) * 9), 7 + (1 * (i % 4)), 1, 1);
        uiFetchEnemyStats[i] = new TextInputComp("", 4, "stat", 4 + (Math.floor(i / 4) * 9), 7 + (1 * (i % 4)), 3, 1)
    }

    uiChangeRankings[0] = new StatSlider(0, 100, 1, 4, 7, 4, "HP", "rect", 3, true);
    uiChangeRankings[1] = new StatSlider(0, 100, 1, 4, 8, 4, "SP", "rect", 3, true);
    uiChangeRankings[2] = new StatSlider(0, 100, 1, 4, 9, 4, "STR", "rect", 3, true);
    uiChangeRankings[3] = new StatSlider(0, 100, 1, 4, 10, 4, "DEF", "rect", 3, true);
    uiChangeRankings[4] = new StatSlider(0, 100, 1, 13, 7, 4, "MAG", "rect", 3, true);
    uiChangeRankings[5] = new StatSlider(0, 100, 1, 13, 8, 4, "MDF", "rect", 3, true);
    uiChangeRankings[6] = new StatSlider(0, 100, 1, 13, 9, 4, "SPD", "rect", 3, true);
    uiChangeRankings[7] = new StatSlider(0, 100, 1, 13, 10, 4, "DEX", "rect", 3, true);
    // uiChangeRankings[0] = new StatSlider(0, 100, 1, 3, 7, 3);

    for (let i = 0; i < roles.length; i++) {
        uiShowRoles[i] = new ButtonComp(roles[i].name, "ui-edit", null, roles[i].desc, changeRole, 3 + (Math.floor(i / 4) * 5), 7 + ((i % 4) * 1), 4, 1);
    }

    for (let i = 0; i < natures.length; i++) {
        uiShowNatures[i] = new ButtonComp(natures[i].name, "ui-edit", null, natures[i].desc, changeNature, 3 + (Math.floor(i / 4) * 5), 7 + ((i % 4) * 1), 4, 1);
    }
    
    button_playtest = new ButtonComp("Playtest", "idle-hotkey", null, "Test out current configuration of party members and troop formation", initialiseBattle, 20, 15, 2, 2);
    button_stop_playtest = new ButtonComp("Stop Playtest", "playtest-hotkey", null, "Stop current playtest", stopBattle, 20, 15, 2, 2);
    button_attack = new ButtonComp("Attack", "playtest-hotkey", null, basicAttack.desc, getAction, 12, 14, 6, 1);
    button_abilities = new ButtonComp("Abilities", "playtest-hotkey", null, "Show abilities of the actor", getAction, 12, 15, 6, 1);
    for (let i = 0; i < 5; i++) {
        button_actives[i] = new ButtonComp("", "playtest-hotkey", null, "", useAbility, 12 + (Math.floor(i / 3) * 3), 14 + ((i % 3) * 1), 3, 1);
    }
    button_return = new ButtonComp("Back", "playtest-hotkey", null, "Back to main actions", hideAbilities, 15, 16, 3, 1);
    button_defend = new ButtonComp("Defend", "playtest-hotkey", null, basicDefend.desc, getAction, 12, 16, 6, 1);
    button_return = new ButtonComp("Back", "playtest-hotkey", null, "Back to main actions", hideAbilities, 15, 16, 3, 1);
    button_back = new ButtonComp("Back to Selection", "playtest-hotkey", null, "Back to main actions", goBack, 13, 15, 5, 1);

    partyStats = new PartyStats(party);

    divLog = createDiv();
    let vmin; if (windowWidth < windowHeight) { vmin = windowWidth / 100} else { vmin = windowHeight / 100};
    divLog.size(windowWidth - (24 * scaling) - (vmin * 6), windowHeight - (vmin * 6));
    divLog.position(24 * scaling, 0);
    divLog.id("log");

    button_switch_image = new ButtonComp("Switch Image", "ui-edit", null, "Switch to different sources", changeImage, 1, 5, 4, 1);

    ui_list = 0;
    ui_min = 0; ui_max = 3;
    // 0 = equip, 1 = stats, 2 = role, 3 = nature
    button_switch_ui_left = new ButtonComp("Switch Mode", "ui-edit", loaded_left, "Switch to different views", uiBack, 1, 8, 1, 1);
    button_switch_ui_right = new ButtonComp("Switch Mode", "ui-edit", loaded_right, "Switch to different views", uiForward, 18, 8, 1, 1);

    animations[0] = new ParticleAnimation(45,loaded_particles[0],"center",null,balloonBig,cinders);
    animTime = 0;
    animLimit = 0;
}

function uiForward() {
    ui_list = ui_list + 1;
    if (ui_list > ui_max) {ui_list = ui_min;}
    ui_mode = switchUIMode(ui_list);
}

function uiBack() {
    ui_list = ui_list - 1;
    if (ui_list < ui_min) {ui_list = ui_max;}
    ui_mode = switchUIMode(ui_list);
}

function switchUIMode(num) {
    if (num === 0) {uiStateTitle.content = "Equipment & Abilities"; return "equip"; }
        else {if (num === 1) {uiStateTitle.content = "Stat Spread"; return "stats";}
            else {if (num === 2) {uiStateTitle.content = "Change Roles"; return "role";}
                else { if (num === 3) { uiStateTitle.content = "Change Nature"; return "nature";}
            }
        }
    }
    console.log(num);
}

function changeRole(value) {
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === value) {
            selectedItem.role = roles[i];
            uiFetchRole.content = value;
            uiFetchRole.desc = roles[i].desc;
            selectedItem.updateStatsAndEquipment();
            showEquipped();
        }
    }
}

function changeImage() {
    let name = selectedItem.imageSource.name;
    let lim;
    let src_arr;
    let image_index;
    let side;
    let side_length;
    if (selectedItem.constructor.name === "PartyMember") {lim = loaded_allies.length; src_arr = loaded_allies; side = party; side_length = party.length;}
    else {if (selectedItem.constructor.name === "TroopMember") {lim = loaded_enemies.length; src_arr = loaded_enemies; side = troop; side_length = troop.length;} }
    for (let i = 0; i < lim; i++) {
        if (name === src_arr[i].name) {
            image_index = i;
        }
    }

    let new_index = image_index + 1;
    if (new_index >= lim) {
        new_index = 0;
    }

    for (let i = 0; i < side_length; i++) {
        if (selectedItem === side[i]) {
            side[i].imageComp.source = src_arr[new_index];
            selectedItem.imageSource = src_arr[new_index];
            selectedActor.source = selectedItem.imageSource;
        }
    }
}
function changeNature(value) {
    for (let i = 0; i < natures.length; i++) {
        if (natures[i].name === value) {
            selectedItem.nature = natures[i];
            uiFetchNature.content = value;
            uiFetchNature.desc = natures[i].desc;
            selectedItem.updateStatsAndEquipment();
            showEquipped();
        }
    }
}