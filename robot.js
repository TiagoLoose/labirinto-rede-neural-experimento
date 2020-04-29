function Robot(x, y, netWorkJson){

    this.STATE_LIVE = 1
    this.STATE_DEAD = 0
    this.STATE_WINNER = 2
    this.DIRECTION_UP = 1
    this.DIRECTION_LEFT = 2
    this.DIRECTION_DOWN = 3
    this.DIRECTION_RIGHT = 4

    this.x = x
    this.y = y
    this.state = this.STATE_LIVE
    this.network = new NetworkBuilder(netWorkJson).build()

}

Robot.prototype = {
    move: function (worldObstacles){
        if(this.state === this.STATE_DEAD){
          console.log('estou morto e não me movo')  
          return
        }
        if(this.state === this.STATE_WINNER){
            console.log('ja ganhei uhulll')  
            return
        }
        //
        let sensorSignal = this.getSensorSignal(worldObstacles)
        let discoveredDirection = this.discoverNextMoveDirection(worldObstacles, sensorSignal)
        let direction = Math.round(discoveredDirection[0]*4)
    
        let newX = this.x
        let newY = this.y
        if(direction === this.DIRECTION_UP){
            newX = this.x-1
    
        } else if(direction === this.DIRECTION_LEFT){
            newY = this.y-1
    
        } else if(direction === this.DIRECTION_DOWN){
            newX = this.x+1
    
        }else if(direction === this.DIRECTION_RIGHT){
            newY = this.y+1
        } else{
            console.log('direção desconhecida ', direction)
            return
        }
    
        let desiredTarget = discoveredDirection
        let isCrash = this.isCrash(worldObstacles, newX, newY)
        if(isCrash){
            desiredTarget = this.createDesiredTarget(sensorSignal)
            this.state = this.STATE_DEAD
        } else{
            this.x = newX
            this.y = newY
    
            let isWinner = this.isWinner(worldObstacles, newX, newY)
            if(isWinner){
                this.state = this.STATE_WINNER
            }
        }
        this.learning(desiredTarget)
    },

    discoverNextMoveDirection: function (worldObstacles, sensorSignal){
        let networkOutput = this.network.activate(sensorSignal)
    
        return networkOutput
    },

    getSensorSignal: function (worldObstacles){
        let whatIsAbove = (this.x === 0 
            || worldObstacles[this.x-1][this.y] === 1) ? 1 : 0
    
        let whatIsLeft = (this.y === 0 
            || worldObstacles[this.x][this.y-1] === 1) ? 1 : 0
    
        let whatIsBellow = (this.x === (worldObstacles.length-1)
            || worldObstacles[this.x+1][this.y] === 1) ? 1 : 0
            
        let whatIsRight = (this.y === (worldObstacles[0].length-1)
            || worldObstacles[this.x][this.y+1] === 1) ? 1 : 0
        
        return [whatIsAbove, whatIsLeft, whatIsBellow, whatIsRight]
    },

    learning: function (target){
        let learningRate = .3
        this.network.propagate(learningRate, target)
    },

    createDesiredTarget: function (sensorSignal){
        let target = []
        if(sensorSignal[3] === 0){
            target = [4/4]
        } else if(sensorSignal[2] === 0){
            target = [3/4]
        } else if(sensorSignal[0] === 0){
            target = [1/4]
        } else if(sensorSignal[1] === 0){
            target = [2/4]
        }
    
        return target
    },
    
    isCrash: function (worldObstacles, x, y){
        if(x < 0 || x >= worldObstacles.length 
         || y < 0 || y >= worldObstacles[0].length) return true
    
        return worldObstacles[x][y] === 1
    },

    isWinner: function (worldObstacles, x, y){
        if(x === worldObstacles.length -1
        && y === worldObstacles[0].length-1) return true
        else return false

    }
}