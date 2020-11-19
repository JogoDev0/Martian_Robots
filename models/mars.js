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
        //Limit moves to 100, as is the max instructions number. Then processing one by one.
        const instructions = (robot.getInstructions().length > MAX_INSTRUCTIONS) ? robot.getInstructions().slice(0, MAX_INSTRUCTIONS).split('') : robot.getInstructions().split('');
        for (const instruction of instructions) {

            //When the robot gets an L or a R, it should turn 90 degress left or right respectively.
            if (instruction === 'L' || instruction === 'R') {
                const facing = robot.getDirection();
                robot.setDirection(this.robotTurn(facing, instruction));
            }
            //When the robot gets an F, it moves forward one grid point in the direction of the current orientation and maintains the same orientation.
            else if (instruction === 'F') {
                //Get current robot position
                const currentPosition = {
                    cordX: robot.getCordX(),
                    cordY: robot.getCordY()
                }
                //calculate what will be next robot position
                const nextPosition = calculateNextPosition(robot);
                //If current robot position is marked as scented and robot will be lost with the next movement, it should skip the movement
                if (this.positionScented(currentPosition) && this.robotLost(nextPosition)) {
                    continue;
                }
                //If robot will be lost with the next movement (but current position not scented), robot is marked as lost, current position is added to scented ones and all the rest movements are skipped
                else if (this.robotLost(nextPosition)) {
                    robot.setLost(true);
                    this.getScents().push(currentPosition);
                    break;
                }
                //In any other case, robot get the new position.
                else {
                    robot.setCordX(nextPosition.cordX);
                    robot.setCordY(nextPosition.cordY);
                }
            }
        }
        //When all the movements are processed, robot state is set.
        robot.setState(`${robot.getCordX()} ${robot.getCordY()} ${robot.getDirection()}`);
        if (robot.getLost()) {
            robot.setState(robot.getState() + ' LOST');
        }
    }

    //The new direction is calculated by going clockwise through the positions of ORIENTATION array if turn direction is R or unclokwise if it´s L.
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

    //A position is scented if it´s inside the array of scented positions.
    positionScented = (cords) => {
        for (const scent of this.scents) {
            if (scent.cordX === cords.cordX && scent.cordY === cords.cordY) {
                return true;
            }
        }
        return false;
    };

    //A robot get lost if it´s X cordinate is lower than 0 or higher than Mars width, or it´s Y cordinate is lower than 0 or higher than Mars height.
    robotLost = (cords) => {
        if (cords.cordX < 0 || cords.cordX > this.width || cords.cordY < 0 || cords.cordY > this.height) {
            return true;
        }
        return false;
    }
}