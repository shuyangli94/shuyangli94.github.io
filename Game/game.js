var type = new Array(3);
type[0] = [[0, "Pine"], [1, "Maple"], [2, "White Oak"], [3, "Bloodwood"], [9, "Ironbark"]];
type[1] = [[2, "Copper"], [3, "Bronze"], [4, "Iron"], [5, "Steel"], [10, "Titanium"]];
type[2] = [[5, "Bone"], [6, "Moonstone"], [7, "Emerald"], [8, "Ruby"], [11, "Diamond"]];

var level = 1;
var material = 0;
var tier = 1;

var baseMultiplier = 1.03;
var dmgExponent = 0;
var wpnMat = "Pine";

var nameS = new Array(3);
nameS[0] = ["Longsword", "Sabre", "Falchion"];
nameS[1] = ["Mace", "Maul", "Hammer"];
nameS[2] = ["Spear", "Glaive", "Lance"];

var prefixes = [[0, ""], [0.02, "Ancient "], [0.01, "Breaker's "], [0, ""], [0.01, "Brutal "], [0.01, "Swift "], [0.02, "Singing "], [0, ""], [0.01, "Knight's "], [0, ""], [0, ""]]; // affects crit chance
var suffixes = [[0, ""], [0.2, " of the Abyss"], [0.1, " of the Guardian"], [0, ""], [0.15, " of the Wanderer"], [0, ""], [0, ""], [0, ""], [0, ""]]; // affects crit multiplier

var form = [[1.00, 0.055, 2.0], [1.05, 0.01, 1.5], [0.95, 0.075, 2.5]] // Blade, Mace, Spear - [base dmg, base crit, base crit mult]

var rarity = [[1.00, "#101010"], [1.05, "#1da1f3"], [1.10, "#aa01da"]] // Common, Rare, Epic | Legendary is #e87722

var Weapon = function(iLvl, iMat, iTier, iForm, iName, iRarity, iEnchanted) {
  var dE = type[Number(iMat)][(Number(iTier)-1)][0];
  var bM = 1.03;
  var base = 1 + Math.floor(((Number(iLvl)+3)*Number(iLvl) - (Number(iLvl)+3)*Math.cos(Number(iLvl)+3)) * Math.pow(bM, dE));
  var prefix = Math.floor(Math.random()*prefixes.length);
  var suffix = Math.floor(Math.random()*suffixes.length);
  base = Math.floor(base * form[iForm][0] * rarity[iRarity][0]);

  this.baseDamage = base;
  this.critP = form[iForm][1] + prefixes[prefix][0];
  this.critM = form[iForm][2] + suffixes[suffix][0];
  this.phys = 1.00;
  this.mag = 0.00;
  this.iName = "";
  if (iEnchanted == 1) {
    this.phys = 0.80;
    this.mag = 0.20;
    this.iName = "Enchanted ";
  }
  this.iName = prefixes[prefix][1] + this.iName + type[Number(iMat)][(Number(iTier)-1)][1] + " " + nameS[iForm][iName] + suffixes[suffix][1];
}


function generate() {
  var randform = Math.floor(Math.random()*3); // Blade, Mace, Spear
  var randname = Math.floor(Math.random()*3);
  var randrarity = Math.floor(Math.random()*3); // Common, Rare, Epic
  var randench = Math.floor(Math.random()*2); // 1 = enchanted, 0 = not

  var newWep = new Weapon(level, material, tier, randform, randname, randrarity, randench);

  document.getElementById("dmg").innerHTML = newWep.baseDamage;
  document.getElementById("nam").style.color = rarity[randrarity][1]
  document.getElementById("nam").innerHTML = newWep.iName;
  document.getElementById("crit").innerHTML = Math.floor(newWep.critP * 100);
  document.getElementById("critM").innerHTML = newWep.critM;
  document.getElementById("phy").innerHTML = Math.floor(newWep.phys * 100);
  document.getElementById("mag").innerHTML = Math.floor(newWep.mag * 100);

  var randform = Math.floor(Math.random()*3); // Blade, Mace, Spear
  var randname = Math.floor(Math.random()*3);
  var randrarity = Math.floor(Math.random()*3); // Common, Rare, Epic
  var randench = Math.floor(Math.random()*2); // 1 = enchanted, 0 = not

  var newWep = new Weapon(level, material, tier, randform, randname, randrarity, randench);

  document.getElementById("dmg2").innerHTML = newWep.baseDamage;
  document.getElementById("nam2").style.color = rarity[randrarity][1]
  document.getElementById("nam2").innerHTML = newWep.iName;
  document.getElementById("crit2").innerHTML = Math.floor(newWep.critP * 100);
  document.getElementById("critM2").innerHTML = newWep.critM;
  document.getElementById("phy2").innerHTML = Math.floor(newWep.phys * 100);
  document.getElementById("mag2").innerHTML = Math.floor(newWep.mag * 100);

  var randform = Math.floor(Math.random()*3); // Blade, Mace, Spear
  var randname = Math.floor(Math.random()*3);
  var randrarity = Math.floor(Math.random()*3); // Common, Rare, Epic
  var randench = Math.floor(Math.random()*2); // 1 = enchanted, 0 = not

  var newWep = new Weapon(level, material, tier, randform, randname, randrarity, randench);

  document.getElementById("dmg3").innerHTML = newWep.baseDamage;
  document.getElementById("nam3").style.color = rarity[randrarity][1]
  document.getElementById("nam3").innerHTML = newWep.iName;
  document.getElementById("crit3").innerHTML = Math.floor(newWep.critP * 100);
  document.getElementById("critM3").innerHTML = newWep.critM;
  document.getElementById("phy3").innerHTML = Math.floor(newWep.phys * 100);
  document.getElementById("mag3").innerHTML = Math.floor(newWep.mag * 100);

  var randform = Math.floor(Math.random()*3); // Blade, Mace, Spear
  var randname = Math.floor(Math.random()*3);
  var randrarity = Math.floor(Math.random()*3); // Common, Rare, Epic
  var randench = Math.floor(Math.random()*2); // 1 = enchanted, 0 = not

  var newWep = new Weapon(level, material, tier, randform, randname, randrarity, randench);

  document.getElementById("dmg4").innerHTML = newWep.baseDamage;
  document.getElementById("nam4").style.color = rarity[randrarity][1]
  document.getElementById("nam4").innerHTML = newWep.iName;
  document.getElementById("crit4").innerHTML = Math.floor(newWep.critP * 100);
  document.getElementById("critM4").innerHTML = newWep.critM;
  document.getElementById("phy4").innerHTML = Math.floor(newWep.phys * 100);
  document.getElementById("mag4").innerHTML = Math.floor(newWep.mag * 100);
}

function genRand() {
  level = Math.floor(1 + Math.random()*100);
  material = Math.floor(Math.random()*3);
  tier = Math.floor(1 + Math.random()*5);


  updateBase();
  document.getElementById("mat").innerHTML = wpnMat;
  document.getElementById("lvl").innerHTML = level;
  document.getElementById("tier").innerHTML = tier;
  document.getElementById("mat2").innerHTML = wpnMat;
  document.getElementById("lvl2").innerHTML = level;
  document.getElementById("tier2").innerHTML = tier;
  document.getElementById("mat3").innerHTML = wpnMat;
  document.getElementById("lvl3").innerHTML = level;
  document.getElementById("tier3").innerHTML = tier;
  document.getElementById("mat4").innerHTML = wpnMat;
  document.getElementById("lvl4").innerHTML = level;
  document.getElementById("tier4").innerHTML = tier;
  generate();
}

function updateBase() {
  dmgExponent = type[material][(tier-1)][0];
  wpnMat = type[material][(tier-1)][1];
  document.getElementById("mat").innerHTML = wpnMat;
  // alert("Material: " + wpnMat)
}

function lootLvl() {
  level = document.getElementById("lootLvl").value;

  if (level > 100) {
    level = 100;
  } else if (level < 1) {
    level = 1;
  }

  document.getElementById("lootLvl").value = level;
  document.getElementById("lvl").innerHTML = level;

  updateBase();
  // alert("Level selected: " + level)
}

function loottype() {
  material = document.getElementById("loottype").value;

  updateBase();
  // alert("Type selected: " + material)
}

function loottier() {
  tier = document.getElementById("loottier").value;

  if (tier > 5) {
    tier = 5;
  } else if (tier < 1) {
    tier = 1;
  }

  document.getElementById("loottier").value = tier;
  document.getElementById("tier").innerHTML = tier;

  updateBase();
  // alert("Tier selected: " + tier)
}