// Angular
import { Injectable } from '@angular/core';

// App
import { LevelInfo } from './level-info';

// Service for level mapping and experience handling
@Injectable()
export class LevelService {
    public levelInfo: LevelInfo[] = [
        { level: 1, experienceNeeded: 0, rank: 'Pebble', badge: 'pebble.png', rankUp: false },
        { level: 2, experienceNeeded: 300, rank: 'Pebble', badge: 'pebble.png', rankUp: false }, // 5 min - 5 min increment onward
        { level: 3, experienceNeeded: 600, rank: 'Pebble', badge: 'pebble.png', rankUp: false }, // 10 min
        { level: 4, experienceNeeded: 900, rank: 'Pebble', badge: 'pebble.png', rankUp: false }, // 15 min

        { level: 5, experienceNeeded: 1200, rank: 'Coal', badge: 'coal.png', rankUp: true }, // 20 min - 10 min increment onward
        { level: 6, experienceNeeded: 1800, rank: 'Coal', badge: 'coal.png', rankUp: false }, // 30 min
        { level: 7, experienceNeeded: 2400, rank: 'Coal', badge: 'coal.png', rankUp: false }, // 40 min
        { level: 8, experienceNeeded: 3000, rank: 'Coal', badge: 'coal.png', rankUp: false }, // 50 min
        { level: 9, experienceNeeded: 3600, rank: 'Coal', badge: 'coal.png', rankUp: false }, // 60 min

        { level: 10, experienceNeeded: 4200, rank: 'Bronze', badge: 'bronze.png', rankUp: true }, // 70 min - 20 min increment onward
        { level: 11, experienceNeeded: 5400, rank: 'Bronze', badge: 'bronze.png', rankUp: false }, // 90 min
        { level: 12, experienceNeeded: 6600, rank: 'Bronze', badge: 'bronze.png', rankUp: false }, // 110 min
        { level: 13, experienceNeeded: 7800, rank: 'Bronze', badge: 'bronze.png', rankUp: false }, // 130 min
        { level: 14, experienceNeeded: 9000, rank: 'Bronze', badge: 'bronze.png', rankUp: false }, // 150 min
        { level: 15, experienceNeeded: 10200, rank: 'Bronze', badge: 'bronze.png', rankUp: false }, // 170 min 
        { level: 16, experienceNeeded: 11400, rank: 'Bronze', badge: 'bronze.png', rankUp: false }, // 190 min
        { level: 17, experienceNeeded: 12600, rank: 'Bronze', badge: 'bronze.png', rankUp: false }, // 210 min
        { level: 18, experienceNeeded: 13800, rank: 'Bronze', badge: 'bronze.png', rankUp: false }, // 230 min
        { level: 19, experienceNeeded: 15000, rank: 'Bronze', badge: 'bronze.png', rankUp: false }, // 250 min

        { level: 20, experienceNeeded: 16200, rank: 'Silver', badge: 'silver.png', rankUp: true }, // 270 min - 30min increment onward
        { level: 21, experienceNeeded: 18000, rank: 'Silver', badge: 'silver.png', rankUp: false }, // 300 min
        { level: 22, experienceNeeded: 19800, rank: 'Silver', badge: 'silver.png', rankUp: false }, // 330 min
        { level: 23, experienceNeeded: 21600, rank: 'Silver', badge: 'silver.png', rankUp: false }, // 360 min
        { level: 24, experienceNeeded: 23400, rank: 'Silver', badge: 'silver.png', rankUp: false }, // 390 min
        { level: 25, experienceNeeded: 25200, rank: 'Silver', badge: 'silver.png', rankUp: false }, // 420 min
        { level: 26, experienceNeeded: 27000, rank: 'Silver', badge: 'silver.png', rankUp: false }, // 450 min
        { level: 27, experienceNeeded: 28800, rank: 'Silver', badge: 'silver.png', rankUp: false }, // 480 min
        { level: 28, experienceNeeded: 30600, rank: 'Silver', badge: 'silver.png', rankUp: false }, // 510 min
        { level: 29, experienceNeeded: 32400, rank: 'Silver', badge: 'silver.png', rankUp: false }, // 540 min

        { level: 30, experienceNeeded: 34200, rank: 'Gold', badge: 'gold.png', rankUp: true }, // 570 min - 40min increment onward
        { level: 31, experienceNeeded: 36600, rank: 'Gold', badge: 'gold.png', rankUp: false }, // 610 min
        { level: 32, experienceNeeded: 39000, rank: 'Gold', badge: 'gold.png', rankUp: false }, // 650 min
        { level: 33, experienceNeeded: 41400, rank: 'Gold', badge: 'gold.png', rankUp: false }, // 690 min
        { level: 34, experienceNeeded: 43800, rank: 'Gold', badge: 'gold.png', rankUp: false }, // 730 min
        { level: 35, experienceNeeded: 46200, rank: 'Gold', badge: 'gold.png', rankUp: false }, // 770 min
        { level: 36, experienceNeeded: 48600, rank: 'Gold', badge: 'gold.png', rankUp: false }, // 810 min
        { level: 37, experienceNeeded: 51000, rank: 'Gold', badge: 'gold.png', rankUp: false }, // 850 min
        { level: 38, experienceNeeded: 53400, rank: 'Gold', badge: 'gold.png', rankUp: false }, // 890 min
        { level: 39, experienceNeeded: 55800, rank: 'Gold', badge: 'gold.png', rankUp: false }, // 930 min

        { level: 40, experienceNeeded: 57600, rank: 'Platinum', badge: 'platinum.png', rankUp: true }, // 960 min - 60min increment onward
        { level: 41, experienceNeeded: 61200, rank: 'Platinum', badge: 'platinum.png', rankUp: false }, // 1020 min
        { level: 42, experienceNeeded: 64800, rank: 'Platinum', badge: 'platinum.png', rankUp: false }, // 1080 min
        { level: 43, experienceNeeded: 68400, rank: 'Platinum', badge: 'platinum.png', rankUp: false }, // 1140 min
        { level: 44, experienceNeeded: 72000, rank: 'Platinum', badge: 'platinum.png', rankUp: false }, // 1200 min
        { level: 45, experienceNeeded: 75600, rank: 'Platinum', badge: 'platinum.png', rankUp: false }, // 1260 min
        { level: 46, experienceNeeded: 79200, rank: 'Platinum', badge: 'platinum.png', rankUp: false }, // 1320 min
        { level: 47, experienceNeeded: 82800, rank: 'Platinum', badge: 'platinum.png', rankUp: false }, // 1380 min
        { level: 48, experienceNeeded: 86400, rank: 'Platinum', badge: 'platinum.png', rankUp: false }, // 1440 min
        { level: 49, experienceNeeded: 90000, rank: 'Platinum', badge: 'platinum.png', rankUp: false }, // 1500 min

        { level: 50, experienceNeeded: 93600, rank: 'Sapphire', badge: 'sapphire.png', rankUp: true }, // 1560 min - 80min increment onward
        { level: 51, experienceNeeded: 98400, rank: 'Sapphire', badge: 'sapphire.png', rankUp: false }, // 1640 min
        { level: 52, experienceNeeded: 103200, rank: 'Sapphire', badge: 'sapphire.png', rankUp: false }, // 1720 min
        { level: 53, experienceNeeded: 108000, rank: 'Sapphire', badge: 'sapphire.png', rankUp: false }, // 1800 min
        { level: 54, experienceNeeded: 112800, rank: 'Sapphire', badge: 'sapphire.png', rankUp: false }, // 1880 min
        { level: 55, experienceNeeded: 117600, rank: 'Sapphire', badge: 'sapphire.png', rankUp: false }, // 1960 min
        { level: 56, experienceNeeded: 122400, rank: 'Sapphire', badge: 'sapphire.png', rankUp: false }, // 2040 min
        { level: 57, experienceNeeded: 126000, rank: 'Sapphire', badge: 'sapphire.png', rankUp: false }, // 2100 min
        { level: 58, experienceNeeded: 130800, rank: 'Sapphire', badge: 'sapphire.png', rankUp: false }, // 2180 min
        { level: 59, experienceNeeded: 135600, rank: 'Sapphire', badge: 'sapphire.png', rankUp: false }, // 2260 min

        { level: 60, experienceNeeded: 140400, rank: 'Emerald', badge: 'emerald.png', rankUp: true }, // 2340 min - 100 min increment onward
        { level: 61, experienceNeeded: 146400, rank: 'Emerald', badge: 'emerald.png', rankUp: false }, // 2440 min
        { level: 62, experienceNeeded: 152400, rank: 'Emerald', badge: 'emerald.png', rankUp: false }, // 2540 min
        { level: 63, experienceNeeded: 158400, rank: 'Emerald', badge: 'emerald.png', rankUp: false }, // 2640 min
        { level: 64, experienceNeeded: 164400, rank: 'Emerald', badge: 'emerald.png', rankUp: false }, // 2740 min
        { level: 65, experienceNeeded: 170400, rank: 'Emerald', badge: 'emerald.png', rankUp: false }, // 2840 min
        { level: 66, experienceNeeded: 176400, rank: 'Emerald', badge: 'emerald.png', rankUp: false }, // 2940 min
        { level: 67, experienceNeeded: 182400, rank: 'Emerald', badge: 'emerald.png', rankUp: false }, // 3040 min
        { level: 68, experienceNeeded: 188400, rank: 'Emerald', badge: 'emerald.png', rankUp: false }, // 3140 min
        { level: 69, experienceNeeded: 194400, rank: 'Emerald', badge: 'emerald.png', rankUp: false }, // 3240 min

        { level: 70, experienceNeeded: 200400, rank: 'Amethyst', badge: 'amethyst.png', rankUp: true }, // 3340 min - 120 min increment onward
        { level: 71, experienceNeeded: 207600, rank: 'Amethyst', badge: 'amethyst.png', rankUp: false }, // 3460 min
        { level: 72, experienceNeeded: 214800, rank: 'Amethyst', badge: 'amethyst.png', rankUp: false }, // 3580 min
        { level: 73, experienceNeeded: 222000, rank: 'Amethyst', badge: 'amethyst.png', rankUp: false }, // 3700 min
        { level: 74, experienceNeeded: 229200, rank: 'Amethyst', badge: 'amethyst.png', rankUp: false }, // 3820 min
        { level: 75, experienceNeeded: 236400, rank: 'Amethyst', badge: 'amethyst.png', rankUp: false }, // 3940 min
        { level: 76, experienceNeeded: 243600, rank: 'Amethyst', badge: 'amethyst.png', rankUp: false }, // 4060 min
        { level: 77, experienceNeeded: 250800, rank: 'Amethyst', badge: 'amethyst.png', rankUp: false }, // 4180 min
        { level: 78, experienceNeeded: 258000, rank: 'Amethyst', badge: 'amethyst.png', rankUp: false }, // 4300 min
        { level: 79, experienceNeeded: 265200, rank: 'Amethyst', badge: 'amethyst.png', rankUp: false }, // 4420 min

        { level: 80, experienceNeeded: 272400, rank: 'Ruby', badge: 'ruby.png', rankUp: true }, // 4540 min - 240 min increment onward
        { level: 81, experienceNeeded: 286800, rank: 'Ruby', badge: 'ruby.png', rankUp: false }, // 4780 min
        { level: 82, experienceNeeded: 301200, rank: 'Ruby', badge: 'ruby.png', rankUp: false }, // 5020 min
        { level: 83, experienceNeeded: 315600, rank: 'Ruby', badge: 'ruby.png', rankUp: false }, // 5260 min
        { level: 84, experienceNeeded: 330000, rank: 'Ruby', badge: 'ruby.png', rankUp: false }, // 5500 min
        { level: 85, experienceNeeded: 344400, rank: 'Ruby', badge: 'ruby.png', rankUp: false }, // 5740 min - 480 min increment onward
        { level: 86, experienceNeeded: 373200, rank: 'Ruby', badge: 'ruby.png', rankUp: false }, // 6220 min
        { level: 87, experienceNeeded: 402000, rank: 'Ruby', badge: 'ruby.png', rankUp: false }, // 6700 min
        { level: 88, experienceNeeded: 430800, rank: 'Ruby', badge: 'ruby.png', rankUp: false }, // 7180 min
        { level: 89, experienceNeeded: 459600, rank: 'Ruby', badge: 'ruby.png', rankUp: false }, // 7660 min

        { level: 90, experienceNeeded: 488400, rank: 'Diamond', badge: 'diamond.png', rankUp: true }, // 8140 min - 960 min increments onward 
        { level: 91, experienceNeeded: 546000, rank: 'Diamond', badge: 'diamond.png', rankUp: false }, // 9100 min
        { level: 92, experienceNeeded: 603600, rank: 'Diamond', badge: 'diamond.png', rankUp: false }, // 10060 min
        { level: 93, experienceNeeded: 661200, rank: 'Diamond', badge: 'diamond.png', rankUp: false }, // 11020 min
        { level: 94, experienceNeeded: 718800, rank: 'Diamond', badge: 'diamond.png', rankUp: false }, // 11980 min
        { level: 95, experienceNeeded: 776400, rank: 'Diamond', badge: 'diamond.png', rankUp: false }, // 12940 min - 1920 min increments onward
        { level: 96, experienceNeeded: 891600, rank: 'Diamond', badge: 'diamond.png', rankUp: false }, // 14860 min 
        { level: 97, experienceNeeded: 1006800, rank: 'Diamond', badge: 'diamond.png', rankUp: false }, // 16780 min 
        { level: 98, experienceNeeded: 1122000, rank: 'Diamond', badge: 'diamond.png', rankUp: false }, // 18700 min 
        { level: 99, experienceNeeded: 1237200, rank: 'Diamond', badge: 'diamond.png', rankUp: false }, // 20620 min - 3840 min onward

        { level: 100, experienceNeeded: 1467600, rank: 'Prismatic', badge: 'prismatic.png', rankUp: true }, // 24460 min - 407 hr to soft cap

        // 13045 hr to max level
        { level: 101, experienceNeeded: 2935200, rank: 'Prismatic', badge: 'prismatic.png', rankUp: false },
        { level: 102, experienceNeeded: 5870400, rank: 'Prismatic', badge: 'prismatic.png', rankUp: false },
        { level: 103, experienceNeeded: 11740800, rank: 'Prismatic', badge: 'prismatic.png', rankUp: false },
        { level: 104, experienceNeeded: 23481600, rank: 'Prismatic', badge: 'prismatic.png', rankUp: false },
        { level: 105, experienceNeeded: 46963200, rank: 'Prismatic', badge: 'prismatic.png', rankUp: false }
    ];

    constructor() { }

    public getLevelInfo(experience: number): LevelInfo {
        for (let i = 0; i < this.levelInfo.length; i++) {
            // max level condition
            if (i + 1 > this.levelInfo.length) {
                const levelInfo = Object.assign({}, this.levelInfo[i]); // copy or else it will modify the original array
                levelInfo.experienceNeeded = 46963200;

                return levelInfo;
            }

            if (experience < this.levelInfo[i + 1].experienceNeeded) {
                const levelInfo = Object.assign({}, this.levelInfo[i]); // copy or else it will modify the original array
                levelInfo.experienceNeeded = this.levelInfo[i + 1].experienceNeeded; // get exp needed for next level


                return levelInfo;
            }
        }
    }

    public checkIfLevelUp(newExpValue: number, userLevelInfo: LevelInfo): LevelInfo {
        for (let i = 0; i < this.levelInfo.length; i++) {
            // future case: make sure array doesn't break
            if (i + 1 > this.levelInfo.length) {
                return null;
            }

            // no level up
            if (newExpValue < userLevelInfo.experienceNeeded) {
                return null;
            }

            // level up detected
            if (newExpValue >= userLevelInfo.experienceNeeded && newExpValue < this.levelInfo[i + 1].experienceNeeded) {
                return this.levelInfo[i + 1];
            }
        }
    }

    public checkIfRankUp(newExpValue: number, userLevelInfo: LevelInfo): boolean {
        let isRankUp: boolean = false;

        for (let i = userLevelInfo.level - 1; i < this.levelInfo.length; i++) {
            // future case: make sure array doesn't break
            if (i + 1 > this.levelInfo.length || i + 2 > this.levelInfo.length) {
                return false;
            }

            if (newExpValue >= this.levelInfo[i + 1].experienceNeeded && newExpValue < this.levelInfo[i + 2].experienceNeeded) {
                if (this.levelInfo[i + 1].rankUp) {
                    isRankUp = true;

                    return isRankUp;
                } else {
                    return isRankUp;
                }
            } else if (this.levelInfo[i + 1].rankUp) {
                isRankUp = true;
            }
        }
    }

    public getCurExpBarValue(userLevelInfo: LevelInfo, curExp: number): number {
        for (let i = 0; i < this.levelInfo.length; i++) {
            if (userLevelInfo.level === 1) {
                return curExp;
            }

            if (userLevelInfo.level === 105) {
                return 0;
            }

            if (userLevelInfo.level === this.levelInfo[i].level) {
                let value = curExp - this.levelInfo[i].experienceNeeded;

                return value;
            }
        }
    }

    public getMaxExpBarValue(userLevelInfo: LevelInfo): number {
        for (let i = 0; i < this.levelInfo.length; i++) {
            if (userLevelInfo.level === 1) {
                return userLevelInfo.experienceNeeded;
            }

            if (userLevelInfo.level === 105) {
                return userLevelInfo[104].experienceNeeded;
            }

            if (userLevelInfo.level === this.levelInfo[i].level) {
                let value = userLevelInfo.experienceNeeded - this.levelInfo[i].experienceNeeded;
                return value;
            }
        }
    }
}

