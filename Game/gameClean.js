// Materials
var type = new Array(3);
type[0] = [[0, "Pine"], [1, "Maple"], [2, "White Oak"], [3, "Bloodwood"], [9, "Ironbark"]];
type[1] = [[2, "Copper"], [3, "Bronze"], [4, "Iron"], [5, "Steel"], [10, "Titanium"]];
type[2] = [[5, "Bone"], [6, "Moonstone"], [7, "Emerald"], [8, "Ruby"], [11, "Diamond"]];

// Blade, Mace, Spear - [base dmg, base crit, base crit mult]
var form = [[1.00, 0.055, 2.0], [1.05, 0.01, 1.5], [0.95, 0.075, 2.5]]

// Random names for weapons
var nameW = new Array(3);
nameW[0] = ["Longsword", "Sabre", "Falchion"];
nameW[1] = ["Mace", "Maul", "Hammer"];
nameW[2] = ["Spear", "Glaive", "Lance"];

// Prefixes and suffixes for weapons and armor names
var prefixes = [[0, ""], [0.02, "Ancient "], [0.01, "Breaker's "], [0, ""], [0.01, "Brutal "], [0.01, "Swift "], [0.02, "Singing "], [0, ""], [0.01, "Knight's "], [0, ""], [0, ""]]; // affects crit chance
var suffixes = [[0, ""], [0.2, " of the Abyss"], [0.1, " of the Guardian"], [0, ""], [0.15, " of the Wanderer"], [0, ""], [0, ""], [0, ""], [0, ""]]; // affects crit multiplier

// Common, Rare, Epic | Legendary is #e87722
var rarity = [[1.00, "#101010"], [1.05, "#1da1f3"], [1.10, "#aa01da"]]

// Weapon - Level, Tier, Material, Rarity, Base Damage, Crit %, Crit Multiplier, Physical %, Magical %, name
var Weapon = function(iLvl, iMat, iTier, iForm, iName, iRarity, iEnchanted) {
  var lvl = Number(iLvl);
  if (lvl > 100) {
    lvl = 100;
  } else if (lvl < 1) {
    lvl = 1;
  }
  wtier = Number(iTier);
  if (wtier == 5 && lvl < 75) { // Tier 5 available at level 75
    wtier = 4;
  }
  var dE = type[iMat][(wtier-1)][0];
  var bM = 1.03;
  var base = 25*lvl+Math.floor(((lvl+3)*lvl - (lvl+3)*Math.cos(lvl+3)) * Math.pow(bM, dE));
  var prefix = Math.floor(Math.random()*prefixes.length);
  var suffix = Math.floor(Math.random()*suffixes.length);
  if (lvl < 10) { // Prefixes appear after level 10
    prefix = 0;
  }
  if (lvl < 25) { // Suffixes appear after level 25
    suffix = 0;
  }
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

// Heavy, Light, Magic - [phys resistance, mag resistance] (For Armor)
var formA = [[1.25, 0.10], [0.75, 0.75], [0.25, 1.5]];

// Random names for weapons
var nameA = new Array(3);
nameA[0] = ["Plate", "Hauberk", "Cuirass"];
nameA[1] = ["Mail", "Jerkin", "Tunic"];
nameA[2] = ["Robe", "Vestments", "Raiment"];

// Armor - Level, Tier, Material, Rarity, Physical resist, Magical resist, name
var Armor = function(iLvl, iMat, iTier, iForm, iName, iRarity, iEnchanted) {
  var lvl = Number(iLvl);
  if (lvl > 100) {
    lvl = 100;
  } else if (lvl < 1) {
    lvl = 1;
  }
  atier = Number(iTier);
  if (atier == 5 && lvl < 75) { // Tier 5 available at level 75
    atier = 4;
  }
  var dE = type[iMat][(atier-1)][0];
  var bM = 1.03;
  var base = ((0.05 + 0.39/(1 + Math.exp(-0.08*(lvl-50)))) * Math.pow(bM, dE));
  var prefix = Math.floor(Math.random()*prefixes.length);
  var suffix = Math.floor(Math.random()*suffixes.length);
  if (lvl < 10) { // Prefixes appear after level 10
    prefix = 0;
  }
  if (lvl < 25) { // Suffixes appear after level 25
    suffix = 0;
  }
  base = base * rarity[iRarity][0];

  this.pResist = base * formA[iForm][0] * (1 + prefixes[prefix][0]);
  this.mResist = base * formA[iForm][1] * (1 + suffixes[suffix][0]);
  this.iName = "";
  this.level = Number(iLvl);
  this.tier = atier;
  this.material = type[iMat][(atier-1)][1];
  this.rarity = iRarity;
  if (Number(iEnchanted) == 1) {
    this.mResist += 0.05;
    this.iName = "Enchanted ";
  }
  this.iName = prefixes[prefix][1] + this.iName + type[iMat][(atier-1)][1] + " " + nameA[iForm][iName] + suffixes[suffix][1];
}

// For members - naming for each member, size determines membership number (obsolete?)
var size = 1;
var nameM = new Array(4);
nameM[0] = ["Petros", "Anne", "Dale"];
nameM[1] = ["Tybalt", "Margaret", "Rowan"];
nameM[2] = ["Frederick", "Anastasia", "Florence"];
nameM[3] = ["Ulric", "Mary", "Gwynedd"];

// Party member - Level, HP, which member, are they active, name, weapon, armor
var Member = function() {
  var randF = Math.floor(Math.random()*3);
  var randN = Math.floor(Math.random()*3);
  this.level = 1;
  this.hp = Math.floor(4*1*(1+4)-7*1*Math.cos(1/2))+100;
  this.number = size;
  this.active = 0;
  this.mName = nameM[size-1][randN];
  this.weapon = new Weapon(1, 0, 1, randF, randN, 0, 0);
  this.armor = new Armor(1, 0, 1, randF, randN, 0, 0);
  size = size + 1;
}

// Update stats window and equips for a single member
function updateMember(member) {
  if (Number(member.active) == 0) {
    return;
  }
  HP += member.hp;
  var nbr = String(member.number);
  var wpn = member.weapon;
  var arm = member.armor;

  document.getElementById(String('p' + nbr + 'N')).innerHTML = member.mName;
  document.getElementById(String('p' + nbr + 'w')).style.borderColor = rarity[Number(wpn.rarity)][1];
  document.getElementById(String('p' + nbr + 'w')).style.color = "#000000";
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
  document.getElementById(String('p' + nbr + 'a')).style.borderColor = rarity[Number(arm.rarity)][1];
  document.getElementById(String('p' + nbr + 'a')).style.color = "#000000";
  document.getElementById(String('p' + nbr + 'aN')).innerHTML = arm.iName;
  document.getElementById(String('p' + nbr + 'aN')).style.color = rarity[arm.rarity][1];
  document.getElementById(String('p' + nbr + 'aL')).innerHTML = arm.level;
  document.getElementById(String('p' + nbr + 'aT')).innerHTML = arm.tier;
  document.getElementById(String('p' + nbr + 'aM')).innerHTML = arm.material;
  document.getElementById(String('p' + nbr + 'aPR')).innerHTML = (100 * arm.pResist).toFixed(2);
  document.getElementById(String('p' + nbr + 'aMR')).innerHTML = (100 * arm.mResist).toFixed(2);
}

// Sets up members
var members = new Array(4);
members[0] = new Member();
members[1] = new Member();
members[2] = new Member();
members[3] = new Member();

var currHP = 0;
var HP = 0;
var pR = 0; // Party physical resistance = weighted average of resistances by level
var mR = 0; // Party magical resistance = weighted average of resistances by level

// Updates all members
function updateMembers() {
  HP = 0;
  updateMember(members[0]);
  updateMember(members[1]);
  updateMember(members[2]);
  updateMember(members[3]);
  currHP = HP;
  document.getElementById('pcurrHP').innerHTML = currHP;
  document.getElementById('pHPbar').value = currHP;
  document.getElementById('pmaxHP').innerHTML = HP;
  document.getElementById('pHPbar').max = HP;
  pR = 0;
  mR = 0;
  var totalLevels = 0;
  if (Number(members[0].active) == 1) {
    pR += members[0].level * members[0].armor.pResist;
    mR += members[0].level * members[0].armor.mResist;
    totalLevels += members[0].level;
  }
  if (Number(members[1].active) == 1) {
    pR += members[1].level * members[1].armor.pResist;
    mR += members[1].level * members[1].armor.mResist;
    totalLevels += members[1].level;
  }
  if (Number(members[2].active) == 1) {
    pR += members[2].level * members[2].armor.pResist;
    mR += members[2].level * members[2].armor.mResist;
    totalLevels += members[2].level;
  }
  if (Number(members[3].active) == 1) {
    pR += members[3].level * members[3].armor.pResist;
    mR += members[3].level * members[3].armor.mResist;
    totalLevels += members[3].level;
  }
  pR /= totalLevels;
  mR /= totalLevels;
  document.getElementById('pPR').innerHTML = (100 * pR).toFixed(2);
  document.getElementById('pMR').innerHTML = (100 * mR).toFixed(2);
}

var act = 0;
var levelLimit = -5;
function addMember() {
  members[act].active = 1;
  act++;
  levelLimit += 10;
  if (LEVEL < levelLimit) {
    document.getElementById("recruit").disabled = true;
  }
  updateMembers();
}

function recruitMember() {
  if (act == 4) {
    return;
  }
  if (LEVEL < levelLimit) {
    document.getElementById("recruit").disabled = true;
    return;
  }
  addMember();
}

// INDEX TIERS: [tier]
var monsterTier = [0.2, 0.8, 0.9, 1.0, 1.6] // Base damage and resistance modifiers

// INDEX TYPES: [type]
var monsterTypes = [[1.0, 0.3, 0.1], [0.8, 0.15, 0.15], [0.5, 0.1, 0.35]] // Beast, Human, Demon [% of damage as Physical, pResist, mResist]

// INDEX NAMES: [type][nameIndex]
var monsterStems14 = new Array(3) // Different possible names [Tiers 1-4] - if tier 1, append "s" to end
monsterStems14[0] = ["Rock Beast", "Spider", "Eagle", "Bear"] // Beast
monsterStems14[1] = ["Templar", "Knight", "Bandit", "Guard"] // Human
monsterStems14[2] = ["Imp", "Ghost", "Ogre", "Ghoul"] // Demon

var monsterStems5 = new Array(3) // Different possible names [Tier 5]
monsterStems5[0] = ["Dragon", "Colossus", "Wyrm", "Golem"] // Beast
monsterStems5[1] = ["Tetrarch", "Emperor", "Hipparch", "Praetor"] // Human
monsterStems5[2] = ["Seraph", "Lord of the Abyss", "Nightmare", "Archfiend"] // Demon

// INDEX RANKS: [tier][rankIndex]
var monsterRanks = new Array(5)
monsterRanks[0] = [[2.0, "A Few"], [3.0, "Group of"], [5.0, "Band of"], [6.0, "Warband of"], [9.0, "Horde of"]]; // Tier 1
monsterRanks[1] = [[0.8, "Bloated"], [0.9, "Sleepy"], [1.0, "Angry"], [1.1, "Cunning"], [1.2, "Elder"]]; // Tier 2
monsterRanks[2] = [[0.8, "Bloated"], [0.9, "Sleepy"], [1.0, "Angry"], [1.1, "Cunning"], [1.2, "Elder"]]; // Tier 3
monsterRanks[3] = [[0.8, "Bloated"], [0.9, "Sleepy"], [1.0, "Angry"], [1.1, "Cunning"], [1.2, "Elder"]]; // Tier 4
monsterRanks[4] = [[1.0, "Ancient"], [1.0, "Merciless"], [1.0, "Ruthless"], [1.0, "Brutal"], [2.0, "Immortal"]]; // Tier 5

// JOKE MOBS
var jokesPrefix = ["An Unwelcome", "A Curiously", "A Surprisingly", "A Mysteriously", "An Ugly, ", "A Ridiculously"] // 6
var jokesMiddle = ["Malicious", "Malignant", "Benign", "Vivid", "Tasty", "Smelly", "Hypnotic", "Arousing"] // 8
var jokesBase = ["Daydream", "Dream", "Hallucination", "Hangover", "Cloud", "Weather Pattern", "Metaphor", "Simile", "Adverb"] // 9

// Monster
var Monster = function(mLevel, mTier) {
  var lvl = Number(mLevel);
  if (lvl < 1) {
    lvl = 1;
  }
  var tr = Number(mTier);
  var baseHP = Math.floor(4*lvl*(lvl+5)-6*lvl*Math.cos(lvl/2))+20;
  var baseDmg = 1 + 2*Math.floor(((lvl+4)*lvl - (lvl+4)*Math.cos(lvl+3)));
  var rType = Math.floor(Math.random()*3);
  var rName = Math.floor(Math.random()*4);
  var rRank = Math.floor(Math.random()*5);

  this.maxHP = Math.floor(baseHP * monsterRanks[tr-1][rRank][0] * monsterTier[tr-1]);
  this.HP = Math.floor(baseHP * monsterRanks[tr-1][rRank][0] * monsterTier[tr-1]);
  this.damage = Math.floor(baseDmg * monsterRanks[tr-1][rRank][0] * monsterTier[tr-1]);
  this.phys = monsterTypes[rType][0];
  this.mag = 1.0 - monsterTypes[rType][0];
  this.PR = monsterTypes[rType][1] * monsterTier[tr-1];
  this.MR = monsterTypes[rType][2] * monsterTier[tr-1];
  this.level = lvl;
  this.gold = Math.floor(Math.pow(1.35, lvl));
  this.tier = tr;
  var randd = Math.random();
  if (tr == 5) {
    this.mName = monsterRanks[tr-1][rRank][1] + " " + monsterStems5[rType][rName];
  } else {
    if (randd < 0.7) {
      this.mName = monsterRanks[tr-1][rRank][1] + " " + monsterStems14[rType][rName];
      if (tr == 1) {
        this.mName += "s";
      }
    } else {
      this.mName = jokesPrefix[Math.floor(Math.random()*6)] + " " + jokesMiddle[Math.floor(Math.random()*8)] + " " + jokesBase[Math.floor(Math.random()*9)];
    }
  }
}

var LEVEL = 1;
document.getElementById("pLvl").innerHTML = LEVEL;
var EXPERIENCE = 0;
document.getElementById("pExp").innerHTML = EXPERIENCE;
var EXPREQ = 5;
document.getElementById("expR").innerHTML = EXPREQ;
var GOLD = 0;
var SKILLPOINTS = 0;
var enemy;

if (EXPERIENCE < 1) {
  document.getElementById("flee").disabled = true;
}
if (EXPERIENCE < EXPREQ) {
  document.getElementById("challenge").disabled = true;
}

// Creates a monster (normal tiers 1-4)
function createMob() {
  var rand = Math.random();
  var tear = 1;
  if (rand < 0.5) {
    tear = 1;
  } else if (rand < 0.8) {
    tear = 2;
  } else if (rand < 0.95) {
    tear = 3;
  } else {
    tear = 4;
  }
  enemy = new Monster(LEVEL, tear);
  updateMob();
}

// Creates a monster (tier 5, challenge)
function createBoss() {
  enemy = new Monster(LEVEL, 5);
  updateMob();
}

// Update displays for mob
function updateMob() {
  if (enemy.tier == 5) {
    document.getElementById("eName").style.color = "#aa01da";
  } else {
    document.getElementById("eName").style.color = "#000000";
  }
  document.getElementById("eName").innerHTML = enemy.mName;
  document.getElementById("eBase").innerHTML = enemy.damage;
  document.getElementById("eHPbar").value = enemy.HP;
  document.getElementById("ecurrHP").innerHTML = enemy.HP;
  document.getElementById("eHPbar").max = enemy.maxHP;
  document.getElementById("emaxHP").innerHTML = enemy.maxHP;
  document.getElementById("ePR").innerHTML = (100 * enemy.PR).toFixed(2);
  document.getElementById("eMR").innerHTML = (100 * enemy.MR).toFixed(2);
}

addMember();
createMob();

var fightID;

// Normal fight (Tier 1-4 monster)
function fight() {
  currHP = HP;
  document.getElementById('pcurrHP').innerHTML = currHP;
  document.getElementById('pHPbar').value = currHP;

  if (enemy.HP == 0) { // If you've defeated the mob, you fight a new one
    createMob();
  }

  document.getElementById("fight").disabled = true;
  if (EXPERIENCE > 0) {
    document.getElementById("flee").disabled = false;
  }
  document.getElementById("challenge").disabled = true;
  document.getElementById("recruit").disabled = true;

  fightID = setInterval(resolveRound, 500)
}

// Flee a fight
function flee() {
  if (EXPERIENCE <= 0) {
    return;
  }
  EXPERIENCE--;
  document.getElementById("flee").disabled = true;
  document.getElementById("fight").disabled = false;
  document.getElementById("pExp").innerHTML = EXPERIENCE;
  clearInterval(fightID);
  var oldname = enemy.mName;
  createMob();
  updateMembers();
  logCombat("You fled from " + oldname + " and bandaged up, only to run into " + enemy.mName + ". What rotten luck!")
}

// Single round of fighting
function resolveRound() {
  var combatMsg = "";

  // PARTY GOES FIRST
  // Calculate party damage
  var partyP = Math.floor((pDamage(members[0], true) + pDamage(members[1], true) + pDamage(members[2], true) + pDamage(members[3], true)) * (1 - enemy.PR));
  var partyM = Math.floor((pDamage(members[0], false) + pDamage(members[1], false) + pDamage(members[2], false) + pDamage(members[3], false)) * (1 - enemy.MR));
  if (enemy.HP <= (partyP + partyM)) { // If the hit killed the monster
    enemy.HP = 0;
    updateMob();
    EXPERIENCE++;
    if (EXPERIENCE > EXPREQ) {
      EXPERIENCE = EXPREQ;
    }
    document.getElementById("pExp").innerHTML = EXPERIENCE;
    if (LEVEL > levelLimit) {
      document.getElementById("recruit").disabled = false;
    }
    document.getElementById("fight").disabled = false;
    if (EXPERIENCE == EXPREQ) {
      document.getElementById("challenge").disabled = false;
    }
    document.getElementById("flee").disabled = true;
    clearInterval(fightID);
    logCombat("You dealt " + (partyP + partyM) + " damage to and defeated " + enemy.mName + ". You gained 1 XP and " + enemy.gold + " gold!");
    if (Math.random() < 0.999999) { // FIXME TOO MUCH LOOT AAAAAAHHHHHH
      if (enemy.tier > 2) {
        loot();
      }
    }
    return; // Return something?
  } else { // Reduce monster HP and move on to mosnter turn
    enemy.HP -= (partyP + partyM);
    updateMob();
    combatMsg += "You dealt " + (partyP + partyM) + " damage to " + enemy.mName + ".";
  }

  // ENEMY'S TURN
  var enemyP = Math.floor(mDamage(true) * (1 - pR));
  var enemyM = Math.floor(mDamage(false) * (1 - mR));
  if (currHP <= (enemyP + enemyM)) {
    currHP = 0;
    clearInterval(fightID);
    document.getElementById('pcurrHP').innerHTML = currHP;
    document.getElementById('pHPbar').value = currHP;
    EXPERIENCE--;
    if (EXPERIENCE < 0) {
      EXPERIENCE = 0;
    }
    document.getElementById("pExp").innerHTML = EXPERIENCE;
    if (LEVEL > levelLimit) {
      document.getElementById("recruit").disabled = false;
    }
    document.getElementById("fight").disabled = false;
    if (EXPERIENCE == EXPREQ) {
      document.getElementById("challenge").disabled = false;
    }
    combatMsg += " You were defeated by " + enemy.mName + ". How embarrassing! You've lost 1 XP."
    logCombat(combatMsg)
    document.getElementById("flee").disabled = true;
    return;
  } else {
    currHP -= (enemyP + enemyM);
    document.getElementById('pcurrHP').innerHTML = currHP;
    document.getElementById('pHPbar').value = currHP;
    combatMsg += " You took " + (enemyP + enemyM) + " damage."
    logCombat(combatMsg);
  }
}

// Log combat messages (move everything up one step)
function logCombat(message) {
  document.getElementById("combat7").innerHTML = document.getElementById("combat6").innerHTML;
  document.getElementById("combat6").innerHTML = document.getElementById("combat5").innerHTML;
  document.getElementById("combat5").innerHTML = document.getElementById("combat4").innerHTML;
  document.getElementById("combat4").innerHTML = document.getElementById("combat3").innerHTML;
  document.getElementById("combat3").innerHTML = document.getElementById("combat2").innerHTML;
  document.getElementById("combat2").innerHTML = document.getElementById("combat1").innerHTML;
  document.getElementById("combat1").innerHTML = document.getElementById("combat0").innerHTML;
  document.getElementById("combat0").innerHTML = message;
}

// Damage by one member of the party, takes in member and whether physical (true/false)
function pDamage(member, physical) {
  if (member.active == 0) {
    return 0;
  }
  var baseD = member.weapon.baseDamage;
  if (Math.random() < member.weapon.critP) {
    baseD *= member.weapon.critM;
  }
  if (physical) {
    return (baseD * member.weapon.phys);
  } else {
    return (baseD * member.weapon.mag);
  }
}

// Damage by monster, takes in whether physical (true/false)
function mDamage(physical) {
  var baseD = enemy.damage;
  if (physical) {
    return (baseD * enemy.phys);
  } else {
    return (baseD * enemy.mag);
  }
}

// Levelup!
function levelup() {
  LEVEL++;
  document.getElementById("pLvl").innerHTML = LEVEL;
  if (members[0].active == 1) {
    members[0].level++;
    var plvl = members[0].level;
    members[0].hp = Math.floor(4*plvl*(plvl+4)-7*plvl*Math.cos(plvl/2))+100;
  }
  if (members[1].active == 1) {
    members[1].level++;
    var plvl = members[1].level;
    members[1].hp = Math.floor(4*plvl*(plvl+4)-7*plvl*Math.cos(plvl/2))+100;
  }
  if (members[2].active == 1) {
    members[2].level++;
    var plvl = members[2].level;
    members[2].hp = Math.floor(4*plvl*(plvl+4)-7*plvl*Math.cos(plvl/2))+100;
  }
  if (members[3].active == 1) {
    members[3].level++;
    var plvl = members[3].level;
    members[3].hp = Math.floor(4*plvl*(plvl+4)-7*plvl*Math.cos(plvl/2))+100;
  }
  if (LEVEL >= levelLimit && act < 4) {
    document.getElementById("recruit").disabled = false;
  } else {
    document.getElementById("recruit").disabled = true;
  }
  updateMembers();
  EXPERIENCE = 0;
  EXPREQ = Math.floor((EXPREQ + 5)*Math.pow(1.1, Math.floor(LEVEL/3)));
  document.getElementById("pExp").innerHTML = EXPERIENCE;
  document.getElementById("expR").innerHTML = EXPREQ;
  document.getElementById("flee").disabled = true;
  document.getElementById("challenge").disabled = true;
}

// Challenge boss to levelup
function challenge() {
  currHP = HP;
  document.getElementById('pcurrHP').innerHTML = currHP;
  document.getElementById('pHPbar').value = currHP;

  createBoss();

  document.getElementById("fight").disabled = true;
  document.getElementById("flee").disabled = true;
  document.getElementById("challenge").disabled = true;
  document.getElementById("recruit").disabled = true;

  fightID = setInterval(resolveBossRound, 500)
}

// Single round of fighting Boss
function resolveBossRound() {
  var combatMsg = "";

  // PARTY GOES FIRST
  // Calculate party damage
  var partyP = Math.floor((pDamage(members[0], true) + pDamage(members[1], true) + pDamage(members[2], true) + pDamage(members[3], true)) * (1 - enemy.PR));
  var partyM = Math.floor((pDamage(members[0], false) + pDamage(members[1], false) + pDamage(members[2], false) + pDamage(members[3], false)) * (1 - enemy.MR));
  if (enemy.HP <= (partyP + partyM)) { // If the hit killed the monster
    enemy.HP = 0;
    updateMob();
    levelup();
    document.getElementById("fight").disabled = false;
    clearInterval(fightID);
    logCombat("You dealt " + (partyP + partyM) + " damage to and defeated " + enemy.mName + ". You gained a level and " + enemy.gold + " gold!");
    loot();
    return; // Return something?
  } else { // Reduce monster HP and move on to mosnter turn
    enemy.HP -= (partyP + partyM);
    updateMob();
    combatMsg += "You dealt " + (partyP + partyM) + " damage to " + enemy.mName + ".";
  }

  // ENEMY'S TURN
  var enemyP = Math.floor(mDamage(true) * (1 - pR));
  var enemyM = Math.floor(mDamage(false) * (1 - mR));
  if (currHP <= (enemyP + enemyM)) {
    currHP = 0;
    clearInterval(fightID);
    document.getElementById('pcurrHP').innerHTML = currHP;
    document.getElementById('pHPbar').value = currHP;
    EXPERIENCE--;
    if (EXPERIENCE < 0) {
      EXPERIENCE = 0;
    }
    document.getElementById("pExp").innerHTML = EXPERIENCE;
    if (LEVEL > levelLimit) {
      document.getElementById("recruit").disabled = false;
    }
    document.getElementById("fight").disabled = false;
    combatMsg += " You were defeated by " + enemy.mName + ". How embarrassing! You've lost 1 XP."
    logCombat(combatMsg)
    document.getElementById("flee").disabled = true;
    createMob();
    return;
  } else {
    currHP -= (enemyP + enemyM);
    document.getElementById('pcurrHP').innerHTML = currHP;
    document.getElementById('pHPbar').value = currHP;
    combatMsg += " You took " + (enemyP + enemyM) + " damage."
    logCombat(combatMsg);
  }
}

// LOOTS!
var levelupWeapon = 0;
var levelupAllWeapon = 0;
var levelupArmor = 0;
var levelupAllArmor = 0;
document.getElementById("LW1").innerHTML = levelupWeapon;
if (levelupWeapon > 0) {
  document.getElementById("levelweapon1").disabled = false;
}
document.getElementById("LWa").innerHTML = levelupAllWeapon;
if (levelupAllWeapon > 0) {
  document.getElementById("levelweaponall").disabled = false;
}
document.getElementById("LA1").innerHTML = levelupArmor;
if (levelupArmor > 0) {
  document.getElementById("levelarmor1").disabled = false;
}
document.getElementById("LAa").innerHTML = levelupAllArmor;
if (levelupAllArmor > 0) {
  document.getElementById("levelarmorall").disabled = false;
}

function loot() {
  if (enemy.tier == 5) {
    var rr = Math.random()
    if (rr < 0.1) {
      levelupAllWeapon++;
      logCombat("You found a sword pendant carved from fine silver!")
    } else if (rr < 0.2) {
      levelupAllArmor++;
      logCombat("You found a shard of something hard, sharp, and still quite warm.")
    } else if (rr < 0.6) {
      levelupWeapon++;
      logCombat("You found a small soapstone statuette of a sword on the ground.")
    } else {
      levelupArmor++;
      logCombat("A half-buried small glowing crystal caught your eye.");
    }
  } else {
    var rr = Math.random()
    if (rr < 0.5) {
      levelupWeapon++;
      logCombat("You found a small soapstone statuette of a sword!");
    } else {
      levelupArmor++;
      logCombat("You found a small glowing crystal!");
    }
  }
  document.getElementById("LW1").innerHTML = levelupWeapon;
  if (levelupWeapon > 0) {
    document.getElementById("levelweapon1").disabled = false;
  }
  document.getElementById("LWa").innerHTML = levelupAllWeapon;
  if (levelupAllWeapon > 0) {
    document.getElementById("levelweaponall").disabled = false;
  }
  document.getElementById("LA1").innerHTML = levelupArmor;
  if (levelupArmor > 0) {
    document.getElementById("levelarmor1").disabled = false;
  }
  document.getElementById("LAa").innerHTML = levelupAllArmor;
  if (levelupAllArmor > 0) {
    document.getElementById("levelarmorall").disabled = false;
  }
}

// LEVEL UP AN ITEM (weapon is binary)
function levelitem(weapon, index) {
  var oldLevel = 0;
  if (weapon) {
    oldLevel = members[index].weapon.level;
  } else {
    oldLevel = members[index].armor.level;
  }
  var rr = Math.random();
  var tr = 0;
  // Tier
  if (rr < 0.05) {
    tr = 5;
  } else if (rr < 0.15) {
    tr = 4;
  } else if (rr < 0.35) {
    tr = 3;
  } else if (rr < 0.6) {
    tr = 2;
  } else {
    tr = 1;
  }

  var formR = Math.floor(Math.random()*3);
  var rarR = Math.floor(Math.random()*3);
  var matR = Math.floor(Math.random()*3);
  var namR = Math.floor(Math.random()*3);
  var eR = Math.floor(Math.random()*2);

  if (weapon) {
    members[index].weapon = new Weapon(oldLevel+1, matR, tr, formR, namR, rarR, eR);
  } else {
    members[index].armor = new Armor(oldLevel+1, matR, tr, formR, namR, rarR, eR);
  }
  updateMembers();
}

// RANDOMLY LEVEL UP A WEAPON
function levelweapon1() {
  levelupWeapon--;
  document.getElementById("LW1").innerHTML = levelupWeapon;
  if (levelupWeapon > 0) {
    document.getElementById("levelweapon1").disabled = false;
  }
  var randmember = Math.floor(Math.random()*act);
  levelitem(true, randmember);
}

// RANDOMLY LEVEL UP AN ARMOR
function levelarmor1() {
  levelupArmor--;
  document.getElementById("LA1").innerHTML = levelupArmor;
  if (levelupArmor > 0) {
    document.getElementById("levelarmor1").disabled = false;
  }
  var randmember = Math.floor(Math.random()*act);
  levelitem(false, randmember);
}

// LEVEL UP ALL WEAPONS
function levelweaponall() {
  levelupAllWeapon--;
  document.getElementById("LWa").innerHTML = levelupAllWeapon;
  if (levelupAllWeapon > 0) {
    document.getElementById("levelweaponall").disabled = false;
  }
  if (members[0].active == 1) {
    levelitem(true, 0);
  }
  if (members[1].active == 1) {
    levelitem(true, 1);
  }
  if (members[2].active == 1) {
    levelitem(true, 2);
  }
  if (members[3].active == 1) {
    levelitem(true, 3);
  }
}

// LEVEL UP ALL ARMORS
function levelarmorall() {
  levelupAllArmor--;
  document.getElementById("LAa").innerHTML = levelupAllArmor;
  if (levelupAllArmor > 0) {
    document.getElementById("levelarmorall").disabled = false;
  }
  if (members[0].active == 1) {
    levelitem(false, 0);
  }
  if (members[1].active == 1) {
    levelitem(false, 1);
  }
  if (members[2].active == 1) {
    levelitem(false, 2);
  }
  if (members[3].active == 1) {
    levelitem(false, 3);
  }
}