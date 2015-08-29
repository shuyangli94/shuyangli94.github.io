// Materials
var type = new Array(3);
type[0] = [[0, "Pine"], [1, "Maple"], [2, "White Oak"], [3, "Bloodwood"], [9, "Ironbark"]];
type[1] = [[2, "Copper"], [3, "Bronze"], [4, "Iron"], [5, "Steel"], [10, "Titanium"]];
type[2] = [[5, "Bone"], [6, "Moonstone"], [7, "Emerald"], [8, "Ruby"], [11, "Diamond"]];

var form = [[1.00, 0.055, 2.0], [1.05, 0.01, 1.5], [0.95, 0.075, 2.5]] // Blade, Mace, Spear - [base dmg, base crit, base crit mult]

// Random names for weapons
var nameW = new Array(3);
nameW[0] = ["Longsword", "Sabre", "Falchion"];
nameW[1] = ["Mace", "Maul", "Hammer"];
nameW[2] = ["Spear", "Glaive", "Lance"];

var prefixes = [[0, ""], [0.02, "Ancient "], [0.01, "Breaker's "], [0, ""], [0.01, "Brutal "], [0.01, "Swift "], [0.02, "Singing "], [0, ""], [0.01, "Knight's "], [0, ""], [0, ""]]; // affects crit chance
var suffixes = [[0, ""], [0.2, " of the Abyss"], [0.1, " of the Guardian"], [0, ""], [0.15, " of the Wanderer"], [0, ""], [0, ""], [0, ""], [0, ""]]; // affects crit multiplier

var rarity = [[1.00, "#101010"], [1.05, "#1da1f3"], [1.10, "#aa01da"]] // Common, Rare, Epic | Legendary is #e87722

var Weapon = function(iLvl, iMat, iTier, iForm, iName, iRarity, iEnchanted) {
  var lvl = Number(iLvl);
  wtier = Number(iTier);
  if (wtier == 5 && lvl < 75) { // Tier 5 available at level 75
    wtier = 4;
  }
  var dE = type[iMat][(wtier-1)][0];
  var bM = 1.03;
  var base = 1+Math.floor(((lvl+3)*lvl - (lvl+3)*Math.cos(lvl+3)) * Math.pow(bM, dE));
  var prefix = Math.floor(Math.random()*prefixes.length);
  var suffix = Math.floor(Math.random()*suffixes.length);
  base = Math.floor(base * form[iForm][0] * rarity[iRarity][0]);

  this.baseDamage = base;
  this.critP = form[iForm][1] + prefixes[prefix][0];
  this.critM = form[iForm][2] + suffixes[suffix][0];
  this.phys = 1.00;
  this.mag = 0.00;
  this.level = Number(iLvl);
  this.tier = wtier;
  this.material = type[iMat][(wtier-1)][1];
  this.rarity = iRarity;
  this.iName = "";
  if (iEnchanted == 1) {
    this.phys = 0.80;
    this.mag = 0.20;
    this.iName = "Enchanted ";
  }
  this.iName = prefixes[prefix][1] + this.iName + type[iMat][(wtier-1)][1] + " " + nameW[iForm][iName] + suffixes[suffix][1];
}

var formA = [[1.25, 0.10], [0.75, 0.75], [0.25, 1.5]] // Heavy, Light, Magic - [phys resistance, mag resistance]

// Random names for weapons
var nameA = new Array(3);
nameA[0] = ["Plate", "Hauberk", "Cuirass"];
nameA[1] = ["Mail", "Jerkin", "Tunic"];
nameA[2] = ["Robe", "Vestments", "Raiment"];

var Armor = function(iLvl, iMat, iTier, iForm, iName, iRarity, iEnchanted) {
  var lvl = Number(iLvl);
  atier = Number(iTier);
  if (atier == 5 && lvl < 75) { // Tier 5 available at level 75
    atier = 4;
  }
  var dE = type[iMat][(atier-1)][0];
  var bM = 1.03;
  var base = ((0.01 + 0.39/(1 + Math.exp(-0.08*(lvl-50)))) * Math.pow(bM, dE));
  var prefix = Math.floor(Math.random()*prefixes.length);
  var suffix = Math.floor(Math.random()*suffixes.length);
  base = base * rarity[iRarity][0];

  this.pResist = base * formA[iForm][0] * (1 + prefixes[prefix][0]);
  this.mResist = base * formA[iForm][1] * (1 + suffixes[suffix][0]);
  this.iName = "";
  this.level = Number(iLvl);
  this.tier = atier;
  this.material = type[iMat][(atier-1)][1];
  this.rarity = iRarity;
  if (Number(iEnchanted) == 1) {
    this.mResist = base * formA[iForm][1] + suffixes[suffix][0] + 0.05;
    this.iName = "Enchanted ";
  }
  this.iName = prefixes[prefix][1] + this.iName + type[iMat][(atier-1)][1] + " " + nameA[iForm][iName] + suffixes[suffix][1];
}

var size = 1;
var nameM = new Array(4);
nameM[0] = ["Petros", "Anne", "Dale"];
nameM[1] = ["Tybalt", "Margaret", "Rowan"];
nameM[2] = ["Frederick", "Anastasia", "Florence"];
nameM[3] = ["Ulric", "Mary", "Gwynedd"];

var Member = function() {
  var randF = Math.floor(Math.random()*3);
  var randN = Math.floor(Math.random()*3);
  this.level = 1;
  this.number = size;
  this.mName = nameM[size-1][randN];
  this.weapon = new Weapon(1, 0, 1, randF, randN, 0, 0);
  this.armor = new Armor(1, 0, 1, randF, randN, 0, 0);
  size = size + 1;
}

var mem1 = new Member();
var mem2 = new Member();
var mem3 = new Member();
var mem4 = new Member();

function updateMember(member) {
  var nbr = String(member.number);
  var wpn = member.weapon;
  var arm = member.armor;

  document.getElementById(String('p' + nbr + 'N')).innerHTML = member.mName;
  document.getElementById(String('p' + nbr + 'wN')).innerHTML = wpn.iName;
  document.getElementById(String('p' + nbr + 'wN')).style.color = rarity[Number(wpn.rarity)][1];
  document.getElementById(String('p' + nbr + 'wL')).innerHTML = wpn.level;
  document.getElementById(String('p' + nbr + 'wT')).innerHTML = wpn.tier;
  document.getElementById(String('p' + nbr + 'wM')).innerHTML = wpn.material;
  document.getElementById(String('p' + nbr + 'wD')).innerHTML = wpn.baseDamage;
  document.getElementById(String('p' + nbr + 'wCP')).innerHTML = Math.floor(100 * wpn.critP);
  document.getElementById(String('p' + nbr + 'wCM')).innerHTML = wpn.critM;
  document.getElementById(String('p' + nbr + 'wPD')).innerHTML = Math.floor(100 * wpn.phys);
  document.getElementById(String('p' + nbr + 'wMD')).innerHTML = Math.floor(100 * wpn.mag);
  document.getElementById(String('p' + nbr + 'aN')).innerHTML = arm.iName;
  document.getElementById(String('p' + nbr + 'aN')).style.color = rarity[arm.rarity][1];
  document.getElementById(String('p' + nbr + 'aL')).innerHTML = arm.level;
  document.getElementById(String('p' + nbr + 'aT')).innerHTML = arm.tier;
  document.getElementById(String('p' + nbr + 'aM')).innerHTML = arm.material;
  document.getElementById(String('p' + nbr + 'aPR')).innerHTML = (0.01 * Math.floor(10000 * arm.pResist)).toFixed(2);
  document.getElementById(String('p' + nbr + 'aMR')).innerHTML = (0.01 * Math.floor(10000 * arm.mResist)).toFixed(2);
}

updateMember(mem1);
updateMember(mem2);
updateMember(mem3);
updateMember(mem4);