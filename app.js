
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const drawScoreHere = document.querySelector('.score')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            
            platforms.forEach(platform => {
               /*  if (doodlerBottomSpace > 200 && doodlerBottomSpace < 400){
                    platform.bottom -= 10
                } else if (doodlerBottomSpace > 400 && doodlerBottomSpace < 540){
                    platform.bottom -= 20
                   
                } else if (doodlerBottomSpace > 540){
                    platform.bottom -= 40
                
                } */
                platform.bottom -= 6
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'
            
            if (platform.bottom < 10){
                let firstPlatform = platforms[0].visual
                firstPlatform.classList.remove('platform')
                platforms.shift()
                score++
                drawScoreHere.innerHTML = score
                let newPlatform = new Platform(600)
                platforms.push(newPlatform)
            }
            
            })
        }
    }
    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 15
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200) {
                fall()
            }
        }, 35)
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 10
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) && //cause 15px height
                    ((doodlerLeftSpace + 60) >= platform.left) && //cause 60px width
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log("landed")
                    startPoint = doodlerBottomSpace
                    jump()
                }
            })
        }, 30)
    }

    function gameOver() {
        console.log('game over')
        isGameOver = true
        while (grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = "Game over"
        
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e) {
        if (e.key === "ArrowLeft") {
            moveLeft()
        } else if (e.key === "ArrowRight") {
            moveRight()
        } else if (e.key === "ArrowUp") {
            moveStraight()
        }
    }

    function moveLeft() {
        if (isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        if (isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= -20 ) {
                doodlerLeftSpace -=5 
                doodler.style.left = doodlerLeftSpace + 'px'
            } else {
                doodlerLeftSpace = 400
                doodlerLeftSpace -=5 
                doodler.style.left = doodlerLeftSpace + 'px'
            }// or moveRight() // Now we have a teleport here
            
        },20)
    }

    function moveRight(){
        if (isGoingLeft){
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        if (isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function(){
            if (doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else {
                doodlerLeftSpace = -20
                doodlerLeftSpace +=5 
                doodler.style.left = doodlerLeftSpace + 'px'
            }// ormoveLeft()// We need a teleport here
        },20)
    }

function moveStraight(){
    isGoingRight = false
    isGoingLeft = false
    clearInterval(rightTimerId)
    clearInterval(leftTimerId)
}

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }

    start()
})