const fs = require('fs');
const INPUT_DATA = `${__dirname}/input/input.txt`;
const OUTPUT_DATA = `${__dirname}/output/output.txt`;
const ORIENTATION = ['N', 'E', 'S', 'W'];
const INSTRUCTIONS = ['F', 'L', 'R'];
const MAX_COORDINATE = 50;
const MAX_INSTRUCTIONS = 100;

//Function to check if input data has corerct values to run the application.
const checkInputdata = (from, data) => {

    let inputData = '';
    data = data.trim();
    //If we get a LOCAL call and pass no data, we try to read data from /input/input.txt file. If we can´t an error message is returned.
    if (data === '' && from === 'LOCAL') {
        try {
            inputData = fs.readFileSync(INPUT_DATA, 'utf8').split(/\r\n|\r|\n/);
        } catch (err) {
            return `ERROR: Can not open input file ${INPUT_DATA}`
        }
        //If we get another kind of call (WEB or TEST), we try to split the data in lines.
    } else {
        inputData = data.split(/\r\n|\r|\n/);
    }
    //If we get less than 3 lines of data (the minimun for Mars and a robot creation), an error message is returned.
    if (inputData.length < 3) {
        return `ERROR: Incorrect input data. Please correct data and try again`
    }
    return inputData;
}

//Check if data is correct for Mars creation. Data is correct if we get two integers between 0 and 50.
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

//Check if data is correct for positioning a robot. Data is correct if we get two integers, between o and Mars width and height respectively, and a correct orientation (N, E, S or W).
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

//Check if moving robot instructions are correct. They are correct if are L, R or F.
const correctRobotInstructions = (line) => {

    moves = line.split('');
    for (const move of moves) {
        if (INSTRUCTIONS.indexOf(move) === -1) {
            return false;
        }
    }
    return true;
}

//Function to calculate next robot position. According to the position the robot is facing, when the robot advance, one has to be added or subtracted to one of the robots coordinates.
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

//Function to write output data to the file /output/output.txt
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