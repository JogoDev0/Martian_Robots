const Mars = require('../models/mars');
const Robot = require('../models/robot');

const mars = new Mars([5, 3]);
const robot = new Robot('3', '2', 'N', 'FRRFLLFFRRFLL');

describe('Mars tests', () => {

    test('Should create a new Mars', () => {
        const mars2 = new Mars([15, 23]);
        expect(mars2).not.toBeNull();
        expect(mars2).toMatchObject({
            width: 15,
            height: 23,
            scents: [],
            totalRobots: []
        });
        expect(mars2.getWidth()).toBe(15);
        expect(mars2.getHeight()).toBe(23);
    })

    test('Should add a robot to Mars', () => {
        mars.addRobot(robot);
        expect(mars.getTotalRobots().length).toBe(1);
    })

    test('Should move the robot. In case robot get lost, should add LOST to state and add the position as scented. Any other robot robot should not be able to get lost from scented positions', () => {
        mars.moveRobot(robot);
        expect(robot.getState()).toBe('3 3 N LOST');
        expect(mars.getScents()).toEqual([
            {
                cordX: 3,
                cordY: 3
            }])
        expect(mars.positionScented({ cordX: 3, cordY: 3 })).toBe(true);
        expect(mars.getScents()).toEqual([{ cordX: 3, cordY: 3 }]);
        expect(robot.getLost()).toBe(true);
        const robot1 = new Robot('3', '3', 'N', 'FFFFF');

        mars.moveRobot(robot1);
        expect(robot1.getState()).toBe('3 3 N');
    })

    test('Should face towards the correct direction', () => {
        expect(mars.robotTurn('N', 'R')).toBe('E');
        expect(mars.robotTurn('E', 'R')).toBe('S');
        expect(mars.robotTurn('S', 'R')).toBe('W');
        expect(mars.robotTurn('W', 'R')).toBe('N');
        expect(mars.robotTurn('N', 'L')).toBe('W');
        expect(mars.robotTurn('W', 'L')).toBe('S');
        expect(mars.robotTurn('S', 'L')).toBe('E');
        expect(mars.robotTurn('E', 'L')).toBe('N');
    })
})
