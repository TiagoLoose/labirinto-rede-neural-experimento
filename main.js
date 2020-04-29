var baseRobotJson = null
var timeInterval = null;
function Main(){
    this.rows = 20;
    this.cols = 20;
    this.population = 20
    this.robots = this.createPopulation(this.population, baseRobotJson)
    this.world = new World(this.rows, this.cols, this.robots)
    this.world.draw()
}

Main.prototype = {
    createPopulation: function (quant, baseRobotJson){
        let robots = []
        for(let i = 0; i < quant; i++){
            let robot = new Robot(0, 0, baseRobotJson)
            robots.push(robot)
        }
    
        return robots
    },

    goRobots: function(){
        for(let i in this.robots){
            if(this.robots[i].state === this.robots[i].STATE_DEAD){
                //let json = robots[i].network.toJSON()
                //robots[i] = new Robot(0, 0, json)
                this.robots[i].x = 0
                this.robots[i].y = 0
                this.robots[i].state = this.robots[i].STATE_LIVE
            }
            this.robots[i].move(this.world.obstacles)
        }
        this.world.draw()
    }
}

var main = new Main()
startEvolution()
function startEvolution(){
    timeInterval = setInterval(function(){main.goRobots()}, 100);
}

function stopEvolution (){
    clearInterval(timeInterval)
}