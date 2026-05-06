function hide(item, index) {
  item.hide();
}

function show(item, index) {
  if (item.isShown) {
    item.show();
  }
}

function showIfNotEmpty(item, index) {
  if (item.name != "") {
    item.show();
  }
}

let selectedItem;
let editing = false;
let thingEdited;

function showOptions() {
  if (activesShown) {
        button_attack.hide();
        button_abilities.hide();
        button_defend.hide();
        button_actives.forEach(showIfNotEmpty);
        button_return.show();
      } else {
        button_attack.show();
        button_abilities.show();
        button_defend.show();
        button_actives.forEach(hide);
        button_return.hide();
      }
}
function draw() {
  imageMode(CORNER);
  background(220);
  scene.show();
  // bb.show();

  for (let i = 0; i < party.length; i++) {
    if (party[i].combatStats.HP > 0) {
      party[i].imageComp.show();
    } else {
      party[i].imageComp.gray();
    }
  }
  for (let i = 0; i < troop.length; i++) {
    if (troop[i].combatStats.HP > 0) {
      troop[i].imageComp.show();
    } else {
      troop[i].imageComp.gray();
    }
  }

  if (play_mode) {
    if (currentPhaseTic === 2) {
      if (activeActor.constructor.name === "PartyMember") {
        announcer.show();
        activeActor.imageComp.isActive = true;
      }
      showOptions();
      button_back.hide();
      partyTargets.forEach(hide);
      troopTargets.forEach(hide);
      button_stop_playtest.show();
      
    }
    if (currentPhaseTic === 3) {
      announcer.show();
      button_attack.hide();
      button_abilities.hide();
      button_defend.hide();
      button_actives.forEach(hide);
      button_return.hide();
      push();
      noStroke();
      fill(0, 0, 0, 150);
      rect(0, 0, canvas.width, canvas.height);
      pop();

      button_back.show();
      partyTargets.forEach(show);
      troopTargets.forEach(show);
      button_stop_playtest.hide();
    }
    if (currentPhaseTic === 4) {
      button_attack.hide();
      button_abilities.hide();
      button_defend.hide();
      button_actives.forEach(hide);
      button_return.hide();
      button_back.hide();
      partyTargets.forEach(hide);
      troopTargets.forEach(hide);
      if (animTime < animLimit) {
        for(let particle of activeAnim.particleHolder){
          particle.display();
        }
        animTime += 1;
      } else {
        activeAnim.stop();
        animTime = 0;
      }
      announcer.show(); 
      button_stop_playtest.hide();
    }
    if (currentPhaseTic === 5) {
      announcer.show();
      if (damageTime < damageLimit) {
        for (let indicator of damageIndicators) {
          indicator.show();
        }
        damageTime += 1;
      } else {
        for (let indicator of damageIndicators) {
          indicator.hide();
        }
        damageIndicators = [];
        checkAndGo();
      }
    }
    if (currentPhaseTic === 6) {
      button_stop_playtest.show();
    }
  }
  else {
    for (let i = 0; i < players.length; i++) {
      healthbars[i].hide();
    }
    if (windowState === "edit") {
      makeUIElements("show");
      partyStats.hide();
      button_playtest.hide();
      for (let button of button_add_enemy) {
        button.hide();
      }
      button_stop_playtest.hide();
      button_attack.hide();
      button_abilities.hide();
      button_defend.hide();
      button_actives.forEach(hide);
      button_return.hide();
      button_back.hide();
      announcer.show();
      button_switch_image.show();
      button_switch_ui_left.show();
      button_switch_ui_right.show();
    }

    if (windowState === "idle") {
      partyStats.hide();
      button_playtest.show();
      for (let button of button_add_enemy) {
        button.show();
      }
      button_stop_playtest.hide();
      button_attack.hide();
      announcer.content = "Try clicking on any of the entities here or click on Playtest!";
      announcer.show();
      button_switch_image.hide();
      button_switch_ui_left.hide();
      button_switch_ui_right.hide();
    }
  }

  if (play_mode) {
    partyStats.show();
    if (currentPhaseTic >= 1) {
      for (let i = 0; i < players.length; i++) {
      healthbars[i].show();
    }
    }
  }

  for (let notif of notifs) {
    notif.show();
  }
    notifs = notifs.filter(
      function(notif) {
        return notif.isShown;
      }
    );
}

function makeUIElements(doThis) {
  ui[doThis]();
  selectedActor[doThis]();
  description[doThis]();
  descriptionTitle[doThis]();
  uiStateTitle[doThis]();
  uiPartyName[doThis]();
  uiPartyLevel[doThis]();
  uiFetchName[doThis]();
  uiFetchLevel[doThis]();
  uiChangeLevel[doThis]();
  if (selectedItem.constructor.name === "TroopMember") {
    for (let i = 0; i < 8; i++) {
        uiSymbolStats[i][doThis]();
        uiFetchEnemyStats[i][doThis]();
    }
  }
  if (selectedItem.constructor.name === "PartyMember") {
    uiPartyRole[doThis]();
    uiPartyNature[doThis]();
    uiFetchRole[doThis]();
    uiFetchNature[doThis]();

    if (ui_mode === "equip") {
      uiRoleLevel[doThis]();
      symbolWeapon[doThis]();
      symbolArmor[doThis]();
      symbolActive[doThis]();
      symbolPassive[doThis]();
      for (let i = 0; i < 5; i++) {
        uiShowWeapons[i][doThis]();
        uiShowArmors[i][doThis]();
        uiShowActives[i][doThis]();
        uiShowPassives[i][doThis]();
      }

      for (let i = 0; i < 8; i++) {
        uiShowStats[i].hide();
        uiSymbolStats[i].hide();
        uiChangeRankings[i].hide();
      }

      for (let i = 0; i < uiShowRoles.length; i++) {
        uiShowRoles[i].hide();
      }

      for (let i = 0; i < uiShowNatures.length; i++) {
        uiShowNatures[i].hide();
      }

    } else {
      if (ui_mode === "stats") {
        uiRoleLevel.hide();
        symbolWeapon.hide();
        symbolArmor.hide();
        symbolActive.hide();
        symbolPassive.hide();
        for (let i = 0; i < 5; i++) {
          uiShowWeapons[i].hide();
          uiShowArmors[i].hide();
          uiShowActives[i].hide();
          uiShowPassives[i].hide();
        }

        for (let i = 0; i < 8; i++) {
          uiShowStats[i][doThis]();
          uiSymbolStats[i][doThis]();
          uiChangeRankings[i][doThis]();
        }

        for (let i = 0; i < uiShowRoles.length; i++) {
          uiShowRoles[i].hide();
        }

        for (let i = 0; i < uiShowNatures.length; i++) {
          uiShowNatures[i].hide();
        }
      } else {
        if (ui_mode === "role") {
          uiRoleLevel.hide();
          symbolWeapon.hide();
          symbolArmor.hide();
          symbolActive.hide();
          symbolPassive.hide();
          for (let i = 0; i < 5; i++) {
            uiShowWeapons[i].hide();
            uiShowArmors[i].hide();
            uiShowActives[i].hide();
            uiShowPassives[i].hide();
          }

          for (let i = 0; i < 8; i++) {
            uiShowStats[i].hide();
            uiSymbolStats[i].hide();
            uiChangeRankings[i].hide();
          }
          for (let i = 0; i < uiShowRoles.length; i++) {
            uiShowRoles[i][doThis]();
          }

          for (let i = 0; i < uiShowNatures.length; i++) {
            uiShowNatures[i].hide();
          }
        } else {
          if (ui_mode === "nature") {
            uiRoleLevel.hide();
            symbolWeapon.hide();
            symbolArmor.hide();
            symbolActive.hide();
            symbolPassive.hide();
            for (let i = 0; i < 5; i++) {
              uiShowWeapons[i].hide();
              uiShowArmors[i].hide();
              uiShowActives[i].hide();
              uiShowPassives[i].hide();
            }

            for (let i = 0; i < 8; i++) {
              uiShowStats[i].hide();
              uiSymbolStats[i].hide();
              uiChangeRankings[i].hide();
            }

            for (let i = 0; i < uiShowRoles.length; i++) {
              uiShowRoles[i].hide();
            }
            for (let i = 0; i < uiShowNatures.length; i++) {
              uiShowNatures[i][doThis]();
            }
          }
        }
      }
    }
  }
}

let firstPress = 0;
let clickedItem;

function determineClickedItem() {
  let priorities = [];
  let highestPriority = 0;
  let hoveredItems = [];
  for (let i = 0; i < allVisComps.length; i++) {
    if (allVisComps[i].isHovered() && allVisComps[i].isShown) {
      hoveredItems.push(allVisComps[i]);
      priorities.push(allVisComps[i].priority);
    }
  }
  highestPriority = Math.max(...priorities);

  let item;
  for (let i = 0; i < hoveredItems.length; i++) {
    if (hoveredItems[i].priority === highestPriority) {
      item = hoveredItems[i];
    }
  }
  console.log(item);
  return item;
}

let notches;
let buffer;
let newLevel = 0;
let latestValue = 0;

let draggedEdit = false;

function mousePressed() {
  clickedItem = determineClickedItem();
  if (clickedItem.constructor.name === "LevelSlider" || clickedItem.constructor.name === "StatSlider") {
    notches = clickedItem.getNotches();
    buffer = clickedItem.knobW;
  }
  if (clickedItem.constructor.name === "ButtonComp") {
    clickedItem.isActive = true;
  }
}

function mouseDragged() {
  if (clickedItem.constructor.name === "LevelSlider") {
    draggedEdit = true;
    for (let i = 0; i < notches.length; i++) { // for every notch in the slider...
      if (mouseX > notches[i] * scaling && mouseX < (notches[i] + buffer) * scaling) { // check if the mouse hovers on it, and if it does...
        let newValue = i + 1; // get new value
        uiChangeLevel.value = newValue; // attach it to the slider
        uiChangeLevel.updateKnob(newValue); // update where the slider's knob is
        uiRoleLevel.value = newValue;
        uiRoleLevel.updateKnob(newValue);
        uiFetchLevel.content = str(newValue); // update the text for the slider
        activateEquippedThings(newValue);
        showStats();
        newLevel = newValue; // 
      }
    }
  } else {
    if (clickedItem.constructor.name === "StatSlider") {
      draggedEdit = true;
      for (let i = 0; i < notches.length; i++) {
        if (mouseX > notches[i] * scaling && mouseX < (notches[i] + buffer) * scaling) {
          let newValue = i;
          newValue += 1;
          clickedItem.value = newValue;
          clickedItem.updateKnob(newValue);
          
          latestValue = newValue;
          let demo = truncate(latestValue/10, 1)
          if (latestValue === 100) {
           demo = 10.0; // a band-aid fix for the truncate function misbehaving on a flat 10
          }

          let stat = clickedItem.stat;
          let id;
          if (stat === "HP") {id = 0;} if (stat === "SP") {id = 1;}
          if (stat === "STR") {id = 2;} if (stat === "DEF") {id = 3;}
          if (stat === "MAG") {id = 4;} if (stat === "MDF") {id = 5;}
          if (stat === "SPD") {id = 6;} if (stat === "DEX") {id = 7;}
          showStats();
          uiShowStats[id].content = str(selectedItem.zipStatDemo(demo, stat));
        }
      }
    }
  }
}

function activateEquippedThings(lvl) {
  for (let i = 0; i < 5; i++) {
    if (i + 1 === lvl) {
      uiShowWeapons[i].equipped = true;
      uiShowArmors[i].equipped = true;
    } else {
      uiShowWeapons[i].equipped = false;
      uiShowArmors[i].equipped = false;
    }
    if (i + 1 <= lvl) {
      if (uiShowActives[i].content != "") {
        uiShowActives[i].equipped = true;
      } else {
        uiShowActives[i].equipped = false;
      }
      if (uiShowPassives[i].content != "") {
        uiShowPassives[i].equipped = true;
      } else {
        uiShowPassives[i].equipped = false;
      }
    } else {
      uiShowActives[i].equipped = false;
      uiShowPassives[i].equipped = false;
    }
  }
}

function showStats() {
  for (let i = 0; i < 8; i++) {
    if (i === 0) {stat = "HP";} if (i === 1) {stat = "SP";}
    if (i === 2) {stat = "STR";} if (i === 3) {stat = "DEF";}
    if (i === 4) {stat = "MAG";} if (i === 5) {stat = "MDF";}
    if (i === 6) {stat = "SPD";} if (i === 7) {stat = "DEX";}
    uiShowStats[i].content = str(selectedItem.baseStats[stat]);
  }
}

function mouseReleased() {
  if (clickedItem.constructor.name === "LevelSlider") {
    selectedItem.level = newLevel;
    if (selectedItem.constructor.name === "PartyMember") {
      selectedItem.updateStatsAndEquipment();
      activateEquippedThings(selectedItem.level);
      showStats();
    }
  } else {
    if (clickedItem.constructor.name === "StatSlider") {
      selectedItem.rankings[clickedItem.stat] = truncate(latestValue/10, 1);
    if (latestValue === 100) {
      selectedItem.rankings[clickedItem.stat] = 10.0; // a band-aid fix for the truncate function misbehaving on a flat 10
    }
    selectedItem.updateStatsAndEquipment();
    showStats();
    latestValue = 0;
    }
    else {
      if (clickedItem.constructor.name === "ButtonComp") {
        clickedItem.isActive = false;
      }
    }
  }
}

function showEquipped() {
  for (let i = 0; i < 5; i++) {
          uiShowWeapons[i].content = selectedItem.role.weapons[i].name;
          uiShowWeapons[i].desc = selectedItem.role.weapons[i].desc;
          uiShowArmors[i].content = selectedItem.role.armors[i].name;
          uiShowArmors[i].desc = selectedItem.role.armors[i].desc;
          if (selectedItem.role.actives[i] != null) {
            uiShowActives[i].content = selectedItem.role.actives[i].name;
            uiShowActives[i].desc = selectedItem.role.actives[i].desc;
          }
          else {
            uiShowActives[i].content = "";
            uiShowActives[i].desc = "";
          }
          if (selectedItem.role.passives[i] != null) {
            uiShowPassives[i].content = selectedItem.role.passives[i].name;
            uiShowPassives[i].desc = selectedItem.role.passives[i].desc;
          }
          else {
            uiShowPassives[i].content = "";
            uiShowPassives[i].desc = "";
          }
        }
}

function mouseClicked() {
  clickedItem = determineClickedItem();

  if (!draggedEdit) {
    if (windowState === "edit" && clickedItem.state != "ui") {
      if (editing) {
        if (uiFetchName.isActive) {
          uiFetchName.isActive = false;
          selectedItem.name = uiFetchName.give();
        }
        for (let i = 0; i < 8; i++) {
          if (uiFetchEnemyStats[i].isActive) {
            let stat;
            if (i === 0) {stat = "HP";} if (i === 1) {stat = "SP";}
            if (i === 2) {stat = "STR";} if (i === 3) {stat = "DEF";}
            if (i === 4) {stat = "MAG";} if (i === 5) {stat = "MDF";}
            if (i === 6) {stat = "SPD";} if (i === 7) {stat = "DEX";}
            if (i === 0 && int(uiFetchEnemyStats[i].content) <= 0) {
              selectedItem.baseStats[stat] = 1;
            }
            uiFetchEnemyStats.isActive = false;
            selectedItem.baseStats[stat] = uiFetchEnemyStats.give();
          }
        }
        editing = false;
      } else {
        if (clickedItem.constructor.name === "TextInputComp") {
          editing = true;
          if (clickedItem === uiFetchName) {
            clickedItem.isActive = true;
            clickedItem.tempValue = clickedItem.content;
            thingEdited = "ally-name";
          } else {
            for (let i = 0; i < 8; i++) {
              if (clickedItem === uiFetchEnemyStats[i]) {
                for (let j = 0; j < 8; j++) {
                  if (uiFetchEnemyStats[i].isActive) {
                    let stat;
                    if (j === 0) {stat = "HP";} if (j === 1) {stat = "SP";}
                    if (j === 2) {stat = "STR";} if (j === 3) {stat = "DEF";}
                    if (j === 4) {stat = "MAG";} if (j === 5) {stat = "MDF";}
                    if (j === 6) {stat = "SPD";} if (j === 7) {stat = "DEX";}
                    if (j === 0 && int(uiFetchEnemyStats[i].content) <= 0) {
                    selectedItem.baseStats[stat] = 1;
                    }
                    uiFetchEnemyStats.isActive = false;
                    selectedItem.baseStats[stat] = uiFetchEnemyStats.give();
                    }
                  }
                clickedItem.isActive = true;
                clickedItem.tempValue = clickedItem.content;
                thingEdited = "stat";
              }
            }
          }
        }
        else {
          if (clickedItem.constructor.name === "ButtonComp" && clickedItem.isShown) { // if it's a button...
            if (!(clickedItem === button_switch_ui_left || clickedItem === button_switch_ui_right || clickedItem === button_switch_image)) { //...and it's not either of the switching buttons OR the switching image button...
              let value = clickedItem.name;
              clickedItem.func(value);
            }
          } else {
            windowState = "idle";
            makeUIElements("hide");
          }
        }
      }
    }

    // console.log(editing);


    if (windowState === "idle") {
      if (clickedItem.state === "enemy" || clickedItem.state === "ally") {
        selectedActor.source = clickedItem.source;
      uiSet(1);
      if (clickedItem.state === "ally") {
        console.log(clickedItem);
        for (let i = 0; i < party.length; i++) {
          if (party[i].imageComp === clickedItem) {
            selectedItem = party[i];
          }
        }

        uiFetchName.fetch(selectedItem.name, "");
        uiFetchLevel.fetch(str(selectedItem.level), "");
        uiChangeLevel.fetch(selectedItem.level, "");

        uiRoleLevel.fetch(selectedItem.level, "");
        uiFetchRole.fetch(selectedItem.role.name, selectedItem.role.desc);
        uiFetchNature.fetch(selectedItem.nature.name, selectedItem.nature.desc);

        showEquipped();
        activateEquippedThings(selectedItem.level);
        for (let i = 0; i < 8; i++) {
          uiChangeRankings[i].fetchStatValue();
        }
        showStats();
      }
      if (clickedItem.state === "enemy") {
        console.log(clickedItem);
        for (let i = 0; i < troop.length; i++) {
          if (troop[i].imageComp === clickedItem) {
            selectedItem = troop[i];
          }
        }
        uiFetchName.fetch(selectedItem.name, "");
        uiFetchLevel.fetch(str(selectedItem.level), "");
        uiChangeLevel.fetch(selectedItem.level, "");
        for (let i = 0; i < 8; i++) {
          if (i === 0) {stat = "HP";} if (i === 1) {stat = "SP";}
        if (i === 2) {stat = "STR";} if (i === 3) {stat = "DEF";}
        if (i === 4) {stat = "MAG";} if (i === 5) {stat = "MDF";}
        if (i === 6) {stat = "SPD";} if (i === 7) {stat = "DEX";}
        uiFetchEnemyStats[i].fetch(str(selectedItem.baseStats[stat]));
        }
      }
      windowState = "edit";
      }
      else {
        if (clickedItem.constructor.name === "ButtonComp") {
          for (let button of button_add_enemy) {
            if (clickedItem === button) {
              let value = button.name;
              button.func(value);
            }
          }
        }
      }
    }

    if (clickedItem.constructor.name === "ButtonComp") {
      if (clickedItem === button_attack) {
        clickedItem.func("attack");
      } else {
        if (clickedItem === button_abilities) {
          clickedItem.func("abilities");
        } else {
          if (clickedItem === button_defend) {
            clickedItem.func("defend");
          } else {
            let clickedactive = false;
            for (let i = 0; i < button_actives.length; i++) {
              if (clickedItem === button_actives[i]) {
                clickedItem.func(clickedItem.name);
              } else {
                clickedItem.func();
              }
            }

          }
        }
      }
    }
  }


  if (windowState === "battle" && play_mode === true && clickedItem.constructor.name === "TargetComp") {
    animateAction([clickedItem.target], registeredAction);
    
  }

  draggedEdit = false; // once the mouse is released, the drag-edit bool is removed
}

function keyPressed() {
  if (editing) {
    if (uiFetchName.isActive) {
      if (validLetterAndSpace(keyCode)) {
        uiFetchName.content += key;
      } else {
        if (keyCode === BACKSPACE) {
          if (uiFetchName.content.length > 0) {
            uiFetchName.content = uiFetchName.content.substring(0, uiFetchName.content.length - 1);
          }
        } else {
          if (keyCode === ENTER) {
            editing = false;
            uiFetchName.isActive = false;
            selectedItem.name = uiFetchName.give();
          }
        }
      }
    }
    else {

    
    for (let i = 0; i < 8; i++) {
      if (uiFetchEnemyStats[i].isActive) {
          if (validNumber(keyCode)) {
            uiFetchEnemyStats[i].content += key;
      } else {
        if (keyCode === BACKSPACE) {
          if (uiFetchEnemyStats[i].content.length > 0) {
            uiFetchEnemyStats[i].content = uiFetchEnemyStats[i].content.substring(0, uiFetchEnemyStats[i].content.length - 1);
          } else {
            uiFetchEnemyStats[i].content = "0";
          }
        } else {
          if (keyCode === ENTER) {
            editing = false;
            uiFetchEnemyStats[i].isActive = false;
            let stat;
            if (i === 0) {stat = "HP";} if (i === 1) {stat = "SP";}
            if (i === 2) {stat = "STR";} if (i === 3) {stat = "DEF";}
            if (i === 4) {stat = "MAG";} if (i === 5) {stat = "MDF";}
            if (i === 6) {stat = "SPD";} if (i === 7) {stat = "DEX";}
            selectedItem.baseStats[stat] = uiFetchEnemyStats[i].give();
          }
        }
      }

        }
      }
    }
  }
}

// returns keycode values within valid letters (A-Z, uppercase and lowercase)
function validLetter(val) {
  return val >= 65 && val <= 122;
}

function validLetterAndSpace(val) {
  return (val >= 65 && val <= 122) || val === 32;
}

// returns keycode values within valid numbers (0-9)
function validNumber(val) {
  return val >= 48 && val <= 57;
}