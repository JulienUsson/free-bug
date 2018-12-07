import Phaser from "phaser-ce"

import bugAsset from "./assets/sprites/bug.png"
import foodAsset from "./assets/sprites/food.png"
import Bug from "./entities/Bug"
import Food from "./entities/Food"
import "./app.css"

const game: Phaser.Game = new Phaser.Game(800, 600, Phaser.AUTO, "", {preload, create, update})

let bugs: Phaser.Group
let foods: Phaser.Group

let score = 0
let nbFoods = 200
let nbBugs = 20

let bugSpeed = 50
let End = false
let bmd
let lsprite: Phaser.Sprite
let text: Phaser.Text

const r = 5;
const w = game.width / r;
const h = game.height / r ;
let rectangle = new Phaser.Rectangle(5, 5, w-5, h-10);
const point = new Phaser.Point()
let text2: string
let timer = 60 * Phaser.Timer.SECOND

function preload() {
    game.load.spritesheet("bug", bugAsset,48,48)
    game.load.image("food", foodAsset)
}

function create() {
    foods = game.add.group()
    bugs = game.add.group()

    foods.enableBody = true
    bugs.enableBody = true

    game.physics.enable(bugs, Phaser.Physics.ARCADE)

    createFood()
    createBugs()
    bugs.forEach(bugCible)

    game.input.onDown.add(bugKill)
    text2 = "- Sacrifice the bugs, the score is the size of the biggest bug = "
    const style = {font: "20px Arial", fill: "#ff0044", align: "left"}
    text = game.add.text(0, game.world.height - 30, text2 + score, style)
}

function createFood() {
    for (let i = 0; i < nbFoods; i++) {
        rectangle.random(point)
        point.floor()
        const food = new Food(game, point.x * 5, point.y * 5, i)
        foods.add(food)
        let s = 0.5
        food.scale.setTo(s, s)
        food.anchor.setTo(0.5, 0.5)
    }
}

function bugKill() {
    bugs.forEach((bug: Bug) => {
        if (Phaser.Rectangle.contains(bug.body, game.input.x, game.input.y)) {
            nbBugs--
            bug.destroy()
        }
    })
}

function createBugs() {
    for (let i = 0; i < nbBugs; i++) {
        rectangle.random(point)
        point.floor()
        const bug = new Bug(game, point.x * 5, point.y * 5)
        bugs.add(bug)
        bug.animations.add('run')
        bug.anchor.setTo(0.5, 0.5)
        bug.animations.play('run', 5, true)
    }
}

function bugCible(bug: Bug) {
    if (nbFoods > 0) {
        let n = Math.floor(Math.random() * nbFoods)
        bug.cible = (foods.getAt(n) as Food).n
    }
}

function collectFood(bug: Bug, food: Food) {
    let cible = food.n

    food.destroy()
    nbFoods--
    bug.health++
    bugs.forEach((b: Bug) => {
        if (b.cible == cible) {
            bugCible(b)
        }
    })
}

function Line(bug: Bug, food: Food) {
    if (lsprite) {
        lsprite.destroy()
    }
    bmd = game.add.bitmapData(game.width, game.height)

    bmd.ctx.beginPath()
    bmd.ctx.lineWidth = 4
    bmd.ctx.strokeStyle = 'white'
    bmd.ctx.setLineDash([2, 3])
    bmd.ctx.moveTo(bug.x, bug.y)
    bmd.ctx.lineTo(food.x, food.y)
    bmd.ctx.stroke()
    bmd.ctx.closePath()
    lsprite = game.add.sprite(0, 0, bmd)
}


function update() {
    let hasLine = false
    timer -= game.time.physicsElapsed * 1000
   let a = []
    if (lsprite) {
        lsprite.destroy()
    }

    if (nbFoods > 0 && timer > 0) {
        bugs.forEach((bug:Bug) => {
            a.push(bug.health)
            let speed = bugSpeed * (1 + bug.health * 0.1)

            let food: Food = foods.iterate('n', bug.cible, Phaser.Group.RETURN_CHILD)

            if (food) {
                if (Phaser.Rectangle.contains(bug.body, game.input.x, game.input.y)) {
                    hasLine = true
                    Line(bug, food)
                }

                bug.rotation = game.physics.arcade.angleBetween(bug, food) + Math.PI / 2
                game.physics.arcade.moveToObject(bug, food, speed)
                game.physics.arcade.overlap(bug, food, collectFood)
            } else {
                bugCible(bug)
            }
            bug.scale.setTo(0.5 + bug.health / 12, 0.5 + bug.health / 12)
            if (score < bug.health) {
                score = bug.health
            }
        })
    } else {
        End = true
    }

    if (End) {
        text.setText(" GAME OVER     SCORE =  " + score + "                Refresh for restart ")
        game.paused = true
    } else {
        text.setText(text2 + score + "        TIMER  = " + (Math.floor(timer / 100)) / 10)
    }
}