const main = require('../index');

describe('Index tests', () => {
    test('Should get correct output data', () => {
        const result = main('TEST', '5 3\n1 1 E\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFLFLFL');
        expect(result).not.toBeNull();
        expect(result).toBe('1 1 E\n3 3 N LOST\n2 3 S');
    })
})