class Item {
  constructor(name, max, spriteURL, pos, size) {
    this.name = name;// название предмета
    this.max = max;// максимальное количество на слот
    this.spriteURL = spriteURL;// ссылка на спрайт карту
    this.pos = pos;// позиция на спрайт-карте
    this.size = size;// размеры на спрайт-карте
  }
}

class Food extends Item {
  constructor(name, max, spriteURL, pos, size, addHP, timeReduction) {
    super(name, max, spriteURL, pos, size);
    this.addHP = addHP;// количество HP которое прибавляет этот экземпляр еды
    this.timeReduction = timeReduction;
    this.remainingTimeReduction = 0;
  }

  use(player) {
    this.remainingTimeReduction = this.timeReduction;
    player.addHP(this.addHP);
  }
}

class Weapon extends Item {
  constructor(name, max, spriteURL, pos, size, damage, timeReduction) {
    super(name, max, spriteURL, pos, size);
    this.damage = damage;// количество HP которое отнимает данный экземпляр оружия
    this.timeReduction = timeReduction;// время удара
  }
}
