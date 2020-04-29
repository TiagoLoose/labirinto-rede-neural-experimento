
//input
//draw
//intelligence
//move controller

var rows = 20;
var cols = 20;
var obstacles = [];
var robotPositionX = 0;
var robotPositionY= 0;

var network = createNetWork();

function init(){
    setObstacles();

    setInterval(function(){
        discoverNextRobotPosition()
    }, 50);
}

function setObstacles(){
    for(let row = 0; row < rows; row++){
        obstacles[row] = [];
        let lastRandom = 0;
        for(let col = 0; col < cols; col++){
            let obstacle = 0
            if(row % 4 === 0 || col % 4 === 0){
                obstacle = Math.floor(Math.random()*(2-lastRandom))
            }
            obstacles[row][col] = obstacle;
            lastRandom = obstacle 
        }
    }
}

function discoverNextRobotPosition(){
    let whatIsAbove = (robotPositionX === 0 
                      || obstacles[robotPositionX-1][robotPositionY] === 1) ? 1 : 0
    let whatIsLeft = (robotPositionY === 0 
                      || obstacles[robotPositionX][robotPositionY-1] === 1) ? 1 : 0
    let whatIsBellow = (robotPositionX === (rows-1)
                      || obstacles[robotPositionX+1][robotPositionY] === 1) ? 1 : 0
    let whatIsRight = (robotPositionY === (cols-1)
                      || obstacles[robotPositionX][robotPositionY+1] === 1) ? 1 : 0

    let networkOutput = network.activate([whatIsAbove, whatIsLeft, whatIsBellow, whatIsRight])

    let target = networkOutput
    let bateu = false
    let output = Math.round(networkOutput[0]*4)
    if(output === 1){
        if(whatIsAbove === 0){
            robotPositionX -= 1
        } else{
            console.log('bateu [up]')
            bateu = true
        }
    }
    if(output === 2){
        if(whatIsLeft === 0){
            robotPositionY -= 1
        } else{
            console.log('bateu [left]')
            bateu = true
        }
    }
    if(output === 3){
        if(whatIsBellow === 0){
            robotPositionX += 1
        } else{
            console.log('bateu [down]')
            bateu = true
        }
    }
    if(output === 4){
        if(whatIsRight === 0){
            robotPositionY += 1
        } else{
            console.log('bateu [right]')
            bateu = true
        }
    }

    if(bateu){
        if(whatIsRight === 0){
            target = [4/4]
        } else if(whatIsBellow === 0){
            target = [3/4]
        } else if(whatIsAbove === 0){
            target = [1/4]
        } else if(whatIsLeft === 0){
            target = [2/4]
        }
        reset()
    }

    let learningRate = .3
    network.propagate(learningRate, target)

    draw()
    if(robotPositionX === (rows-1) && robotPositionY === (cols-1)){
        reset()
    }
}

function reset(){
    robotPositionX = 0
    robotPositionY = 0
}

function createNetWork(){
    this.network = new synaptic.Architect.Perceptron(4, 6, 1)
    //console.log(trainnerNetWork(network))
    return network
}

function trainnerNetWork(network){
    var trainer = new synaptic.Trainer(network)
    var trainingSet = [
        {
          input: [1,1,0,1],
          output: [3]
        },
        {
          input: [1,1,1,0],
          output: [4]
        },
        {
          input: [1, 0, 1, 1],
          output: [2]
        },
        {
            input: [0, 1, 1, 1],
            output: [1]
        },
        {
            input: [1, 1, 0, 0],
            output: [4]
        }
      ]
    trainer.train(trainingSet)
}

function draw(){
    let html = '<table>';
    for(let row = 0; row < rows; row++){
        html += '<tr>'
        for(let col = 0; col < cols; col++){
            let obstacle = obstacles[row][col];
            
            html += '<td '
            if(robotPositionX === row && robotPositionY === col){
                html += ' class=\'robot\''
            } else if(obstacle === 1){
                html += ' class=\'obstacle\''
            }
            html += ' >'
            html += obstacles[row][col];
            html += '</td>'
        }
        html += '</tr>'
    }
    html += '</table>'

    document.getElementById("content").innerHTML = html;
}

init();