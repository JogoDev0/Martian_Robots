const Robot = require('../models/robot');

describe('Robot tests', () => {

    test('Should create a robot', () => {
        const robot = new Robot('1', '1', 'E', 'RFRFRFRF');
        expect(robot).not.toBeNull();
        expect(robot).toEqual({
            cordX: 1,
            cordY: 1,
            direction: 'E',
            instructions: 'RFRFRFRF',
            state: '',
            lost: false
        });
        robot.setState('Positioned');
        expect(robot.getState()).toBe('Positioned');
        robot.setLost(true);
        expect(robot.getLost()).toBe(true);
    })
})
