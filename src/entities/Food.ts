import Phaser from "phaser-ce"

class Food extends Phaser.Sprite {
    public n: number

    constructor(game: Phaser.Game, x: number, y: number, n: number) {
        super(game, x, y, "food")
        this.n = n
    }
}

export default Food