class Tile {
    constructor(a, b) {
        this.value = 0;
        this.pos = {
            y : a,
            x : b
        };
        this.select = $("#cell-" + this.pos.y + "-" + this.pos.x);
    }

    clear() {
        this.value = 0;
    }
}