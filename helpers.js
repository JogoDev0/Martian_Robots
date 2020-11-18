const fs = require('fs');
const os = require('os');
const INPUT_DATA = `${__dirname}/input/input.txt`;
const OUTPUT_DATA = `${__dirname}/output/output.txt`;
const ORIENTATION = ['N', 'E', 'S', 'W'];
const INSTRUCTIONS = ['F', 'L', 'R'];
const MAX_COORDINATE = 50;
const MAX_INSTRUCTIONS = 100;

const checkInputdata = (from, data) => {
    let inputData = '';
    if (data === '') {
        try {
            inputData = fs.readFileSync(INPUT_DATA, 'utf8').split(os.EOL);
        } catch (err) {
            throw new Error(`ERROR: Can not open input file ${INPUT_DATA}`);
        }
    } else {
        inputData = data.split(/\r\n|\r|\n/);
    }
    if (inputData.length < 3) {
        throw new Error(`ERROR: Incorrect input data. Please correct data and try again`);
    }
    return inputData;
}

const correctMarsValues = (values) => {
    if (values.length != 2) {
        return false;
    }
    for (const value of values) {
        if (isNaN(value) || !Number.isInteger(Number(value)) || value <= 0 || value > MAX_COORDINATE) {
            return false;
        }
    }
    return true;
}

const correctRobotPosition = (line, mars) => {

    line = line.split('');

    if (line.length != 3) {
        return false;
    }
    if (!Number.isInteger(Number(line[0])) || line[0] < 0 || line[0] > mars.getWidth()) {
        return false;
    }
    if (!Number.isInteger(Number(line[1])) || line[1] < 0 || line[1] > mars.getHeight()) {
        return false;
    }
    if (ORIENTATION.indexOf(line[2]) === -1) {
        return false;
    }
    return true;
}
const correctRobotInstructions = (line) => {

    moves = line.split('');
    for (const move of moves) {
        if (INSTRUCTIONS.indexOf(move) === -1) {
            return false;
        }
    }
    return true;
}

const calculateNextPosition = (robot) => {
    const facing = robot.getDirection();
    let cordX = robot.getCordX();
    let cordY = robot.getCordY();
    switch (facing) {
        case 'N':
            cordY += 1;
            break;
        case 'E':
            cordX += 1;
            break;
        case 'S':
            cordY -= 1;
            break;
        case 'W':
            cordX -= 1;
            break;
    }
    return { cordX, cordY };
}

const writeData = (data) => {
    const writeStream = fs.createWriteStream(OUTPUT_DATA);
    writeStream.write(data);
    writeStream.end();
}

module.exports = {
    INPUT_DATA,
    OUTPUT_DATA,
    ORIENTATION,
    INSTRUCTIONS,
    MAX_COORDINATE,
    MAX_INSTRUCTIONS,
    checkInputdata,
    correctMarsValues,
    correctRobotPosition,
    correctRobotInstructions,
    calculateNextPosition,
    writeData
}