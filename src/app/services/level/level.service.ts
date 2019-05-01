import { Injectable } from '@angular/core';

@Injectable()
export class LevelService {
    expNeededMap = {
        2: 60,
        3: 600,
        4: 3600,
        5: 7200
    };

    constructor() {}

    getExpNeeded(experience) {
        if (experience < 60) { // lvl 1
            return 60;
        }
        else if (experience < 600) { // lvl 2
            return 600;
        }
        else if (experience < 3600) { // lvl 3
            return 3600;
        }
        else if (experience < 7200) { // lvl 4
            return 7200;
        }
        else if (experience < 10800) { // lvl 5
            return 10800;
        }
    }

    getLevel(experience) {
        if (experience >= 0 && experience < 60) { // 0
            return 1;
        }
        else if (experience >= 60 && experience < 600) { // over 1 minute
            return 2;
        }
        else if (experience >= 600 && experience < 3600) { // over 10 minutes
            return 3;
        }
        else if (experience >= 3600 && experience < 7200) { // over 1 hour
            return 4;
        }
        else if (experience >= 7200 && experience < 10800) { // over 2 hours
            return 5;
        }
    }

    getRank(experience) {
        if (experience >= 0 && experience < 7200) { // level 1-5
            return 'Rookie';
        }
        if (experience >= 7200) { // level 5
            return 'Prater';

        }
    }

    checkIfLevelUp(experience, experienceNeeded) {
        if (experience > experienceNeeded) {
            return true;
        } else {
            return false;
        }
    }
}

