const chalk = require('chalk');
const error = chalk.redBright;
const ok = chalk.greenBright;
const { MAX_COORDINATE,
    checkInputdata,
    correctMarsValues,
    correctRobotPosition,
    correctRobotInstructions,
    writeData
} = require('./helpers');
const Mars = require('./models/mars');
const Robot = require('./models/robot');

//Main function of the app.
const main = (from, data = '') => {

    //Check if input data provided is correct. If so, divide it into mars data and robots data. On the other hand, return an error message. 
    const inputData = checkInputdata(from, data);
    if (inputData.includes('ERROR')) {
        console.log(error(inputData));
        return inputData;
    }
    const marsData = inputData[0].replace(/ /g, '').split('');
    const robotsData = inputData.slice(1);

    //Check if mars data is correct. If so, create a new Mars model with it. On the other hand, return an error message.
    let marsDataInt;
    if (correctMarsValues(marsData)) {
        marsDataInt = marsData.map(value => parseInt(value));
    } else {
        const err = `ERROR: Incorrect values for Mars creation. Please provide two integers between 1 and ${MAX_COORDINATE}`;
        console.log(error(err));
        return err;
    }
    const mars = new Mars(marsDataInt);

    //Check if robot data is made up of position-move pairs, else, return an error message.
    if (robotsData.length % 2 !== 0) {
        const err = `ERROR: Incorrect values for robots creation. Data should have 2 lines per robot, one for position and one for instructions.`;
        console.log(error(err));
        return err;
    }

    //Get pairs of position-move data one by one and process each robot with it. 
    do {
        //Getting robot position and robot move instructions
        let robotPos = robotsData[0].replace(/ /g, '').toUpperCase();
        let robotInstructions = robotsData[1].replace(/ /g, '').toUpperCase();

        //Check if robot position is correct. If so, add a new correct robot to Mars, else, add a new incorrect positioned robot.
        if (correctRobotPosition(robotPos, mars)) {
            mars.addRobot(new Robot(robotPos.charAt(0), robotPos.charAt(1), robotPos.charAt(2), robotInstructions), 'OK');
        } else {
            mars.addRobot(new Robot('0', '0', 'N', robotInstructions), 'NOT OK');
        }

        //Get the robot to move and check if robot moving instructions are correct. If so, move robot and update it position and state, else, set robot state as incorrect robot instructions. 
        const robotToMove = mars.getTotalRobots().slice(-1)[0];
        if (!correctRobotInstructions(robotToMove.getInstructions())) {
            robotToMove.setState(`${robotToMove.getCordX()} ${robotToMove.getCordY()} ${robotToMove.getDirection()}. Robot not moved, incorrect robot intructions.`);
        } else if (!robotToMove.getState().includes('ERROR')) {
            mars.moveRobot(robotToMove);
        }

        robotsData.splice(0, 2);
    } while (robotsData.length > 0);

    //Get the output of the function from the state of all of the robots.
    let output = '';
    mars.getTotalRobots().forEach((robot, index) => {
        output += robot.getState();
        if (index < mars.getTotalRobots().length - 1) {
            output += '\n';
        }
    });

    //If it was a local execution, output data on CLI and /output/output.txt file
    if (from === 'LOCAL') {
        console.log(ok(output));
        writeData(output);
    }

    return output;
}

module.exports = main;