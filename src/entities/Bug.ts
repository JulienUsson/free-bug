import Phaser from "phaser-ce"

class Bug extends Phaser.Sprite {
    public cible?: number

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, "bug")
    }
}

export default Bug