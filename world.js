function World(rows, cols, robots){
    this.rows = rows
    this.cols = cols
    this.robots = robots
    this.obstacles = this.createObstacles()

}

World.prototype = {
    draw: function (){
        let html = '<table>';
        for(let row = 0; row < this.rows; row++){
            html += '<tr>'
            for(let col = 0; col < this.cols; col++){
                let obstacle = this.obstacles[row][col];
                let robot = null
                for(i in this.robots){
                    if(this.robots[i].x === row && this.robots[i].y === col){
                        robot = this.robots[i]
                        break
                    }
                }
            
                html += '<td '
                if(robot){
                    let classStr = 'robot'
                    if(robot.state === robot.STATE_DEAD){
                        classStr = 'robot-dead'
                    }
                    html += ' class=\''+classStr+'\''
                }else if(obstacle === 1){
                    html += ' class=\'obstacle\''
                }
                html += ' >'
                html += this.obstacles[row][col];
                html += '</td>'
            }
            html += '</tr>'
        }
        html += '</table>'
    
        document.getElementById("content").innerHTML = html;
    },

    createObstacles: function (){
        let obstacles = []
        for(let row = 0; row < this.rows; row++){
            obstacles[row] = [];
            let lastRandom = 0;
            for(let col = 0; col < this.cols; col++){
                let obstacle = 0
                if((row > 0 && row % 4 === 0) || (col > 0 && col % 4 === 0)){
                    obstacle = Math.floor(Math.random()*(2-lastRandom))
                }
                obstacles[row][col] = obstacle;
                lastRandom = obstacle 
            }
        }
        return obstacles
    }
}