const {
    correctMarsValues,
    checkInputdata,
    correctRobotPosition,
    correctRobotInstructions,
    calculateNextPosition
} = require("../helpers");
const Mars = require('../models/mars');
const Robot = require('../models/robot');

const mars = new Mars([5, 3]);

describe('Helpers tests', () => {

    test('Should check correct input data', () => {
        const case1 = checkInputdata('TEST', '5 3\n1 1 E\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL');
        expect(case1).toEqual(["5 3", "1 1 E", "RFRFRFRF", "3 2 N", "FRRFLLFFRRFLL", "0 3 W", "LLFFFLFLFL"]);

        expect(() => {
            checkInputdata('TEST', '7 5');
        }).toThrow('ERROR: Incorrect input data. Please correct data and try again');
    })

    test('Should check Mars correct values', () => {
        const case1 = correctMarsValues(['5', '3']);
        expect(case1).toBe(true);

        const case2 = correctMarsValues(['75', '23']);
        expect(case2).toBe(false);

        const case3 = correctMarsValues(['F', 'x']);
        expect(case3).toBe(false);
    })

    test('Should check correct robot positioning', () => {
        const case1 = correctRobotPosition('11E', mars);
        expect(case1).toBe(true);

        const case2 = correctRobotPosition('Y', mars);
        expect(case2).toBe(false);

        const case3 = correctRobotPosition('98S', mars);
        expect(case3).toBe(false);

        const case4 = correctRobotPosition('11F', mars);
        expect(case4).toBe(false);
    })

    test('Should check robot correct instructions', () => {
        const case1 = correctRobotInstructions('RFRFRFRF');
        expect(case1).toBe(true);

        const case2 = correctRobotInstructions('LRFX');
        expect(case2).toBe(false);
    })

    test('Should calculate next robot position correctly', () => {
        const case1 = calculateNextPosition(new Robot('3', '2', 'N', 'F'));
        expect(case1).toEqual({ cordX: 3, cordY: 3 });

        const case2 = calculateNextPosition(new Robot('3', '2', 'E', 'F'));
        expect(case2).toEqual({ cordX: 4, cordY: 2 });

        const case3 = calculateNextPosition(new Robot('3', '2', 'S', 'F'));
        expect(case3).toEqual({ cordX: 3, cordY: 1 });

        const case4 = calculateNextPosition(new Robot('3', '2', 'W', 'F'));
        expect(case4).toEqual({ cordX: 2, cordY: 2 });
    })

})