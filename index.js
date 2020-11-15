const fs = require('fs');
const os = require('os');
const { INPUT_DATA, OUTPUT_DATA, MAX_COORDINATE, correctMarsValues, correctRobotPosition, correctRobotInstructions } = require('./helpers');
const Mars = require('./models/mars');
const Robot = require('./models/robot');

const inputData = fs.readFileSync(INPUT_DATA, 'utf8').split(os.EOL);
const marsData = inputData[0].replace(/ /g, '').split('');
const robotsData = inputData.slice(1);

let marsDataInt;
if (correctMarsValues(marsData)) {
    marsDataInt = marsData.map(value => parseInt(value));
} else {
    throw new Error(`ERROR: Incorrect values for Mars creation. Please provide two integers between 1 and ${MAX_COORDINATE}`);
}
const mars = new Mars(marsDataInt);

if (robotsData.length % 2 !== 0) {
    throw new Error(`ERROR: Incorrect values for robots creation. Data should have 2 lines per robot, one for position and one for instructions. `);
}

do {
    let robotPos = robotsData[0].replace(/ /g, '').toUpperCase();
    let robotInstructions = robotsData[1].replace(/ /g, '').toUpperCase();

    if (correctRobotPosition(robotPos, mars)) {
        mars.addRobot(new Robot(robotPos.charAt(0), robotPos.charAt(1), robotPos.charAt(2), robotInstructions), 'OK');
    } else {
        mars.addRobot(new Robot('0', '0', 'N', robotInstructions), 'NOT OK');
    }

    const robotToMove = mars.getTotalRobots().slice(-1)[0];
    if (!correctRobotInstructions(robotToMove.getInstructions())) {
        robotToMove.setState(`${robotToMove.getCordX()} ${robotToMove.getCordY()} ${robotToMove.getDirection()}. Robot not moved, incorrect robot intructions.`);
    } else if (!robotToMove.getState().includes('ERROR')) {
        mars.moveRobot(robotToMove);
    }

    robotsData.splice(0, 2);
} while (robotsData.length > 0);

const writeStream = fs.createWriteStream(OUTPUT_DATA);
mars.getTotalRobots().forEach((robot, index) => {
    writeStream.write(robot.getState());
    if (index < mars.getTotalRobots().length - 1) {
        writeStream.write('\n');
    }
});
writeStream.end();
