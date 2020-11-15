const { ORIENTATION, MAX_INSTRUCTIONS, calculateNextPosition } = require("../helpers");

module.exports = class Mars {
    constructor(data) {
        this.width = data[0];
        this.height = data[1];
        this.scents = [];
        this.totalRobots = [];
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    addRobot(robot, check) {
        robot.setState((check === 'OK') ? `Robot positioned.` : `ERROR: This robot could not be positioned, incorrect position arguments.`);
        this.totalRobots.push(robot);
    }

    getTotalRobots() {
        return this.totalRobots;
    }

    getScents() {
        return this.scents;
    }

    moveRobot(robot) {
        const instructions = (robot.getInstructions().length > MAX_INSTRUCTIONS) ? robot.getInstructions().slice(0, MAX_INSTRUCTIONS).split('') : robot.getInstructions().split('');
        for (const instruction of instructions) {

            if (instruction === 'L' || instruction === 'R') {
                const facing = robot.getDirection();
                robot.setDirection(this.robotTurn(facing, instruction));
            }
            else if (instruction === 'F') {
                const currentPosition = {
                    cordX: robot.getCordX(),
                    cordY: robot.getCordY()
                }

                const nextPosition = calculateNextPosition(robot);

                if (this.positionScented(currentPosition) && this.robotLost(nextPosition)) {
                    continue;
                }
                else if (this.robotLost(nextPosition)) {
                    robot.setLost(true);
                    this.getScents().push(currentPosition);
                    break;
                }
                else {
                    robot.setCordX(nextPosition.cordX);
                    robot.setCordY(nextPosition.cordY);
                }
            }
        }
        robot.setState(`${robot.getCordX()} ${robot.getCordY()} ${robot.getDirection()}`);
        if (robot.getLost()) {
            robot.setState(robot.getState() + ' LOST');
        }
    }

    robotTurn(facing, direction) {
        const indexOrientation = ORIENTATION.indexOf(facing);
        let newOrientation;
        switch (direction) {
            case 'L':
                newOrientation = (facing === 'N') ? 'W' : ORIENTATION[indexOrientation - 1];
                break;
            case 'R':
                newOrientation = (facing === 'W') ? 'N' : ORIENTATION[indexOrientation + 1];
                break;
        }
        return newOrientation;
    }

    positionScented = (cords) => {
        for (const scent of this.scents) {
            if (scent.cordX === cords.cordX && scent.cordY === cords.cordY) {
                return true;
            }
        }
        return false;
    };

    robotLost = (cords) => {
        if (cords.cordX < 0 || cords.cordX > this.width || cords.cordY < 0 || cords.cordY > this.height) {
            return true;
        }
        return false;
    }
}