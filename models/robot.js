module.exports = class Robot {
    constructor(cordX, cordY, direction, instructions) {
        this.cordX = parseInt(cordX);
        this.cordY = parseInt(cordY);
        this.direction = direction;
        this.instructions = instructions;
        this.state = '';
        this.lost = false;
    }

    getCordX() {
        return this.cordX;
    }

    setCordX(value) {
        this.cordX = value;
    }

    getCordY() {
        return this.cordY;
    }

    setCordY(value) {
        this.cordY = value;
    }

    getDirection() {
        return this.direction;
    }

    setDirection(value) {
        this.direction = value;
    }

    getInstructions() {
        return this.instructions;
    }

    setInstructions(value) {
        this.instructions = value;
    }

    getState() {
        return this.state;
    }

    setState(value) {
        this.state = value;
    }

    getLost() {
        return this.lost;
    }

    setLost(value) {
        this.lost = value;
    }
}