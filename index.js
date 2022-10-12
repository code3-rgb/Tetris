const board = document.getElementsByClassName('board')[0]


const WIDTH = 15
const HEIGHT = 20



const Arena = []
for(let i=0; i<20; i++){
    Arena.push(new Array(15).fill(0))
}

// Arena[0][2] = 1
// Arena[0][5] = 1
// Arena[0][6] = 1
// Arena[0][8] = 1
// Arena[4][2] = 1
// Arena[6][2] = 1
// Arena[9][2] = 1


// console.table(Arena)

const tetromino = [
    [
        [1,1,1],
        [0,1,0],
        [0,0,0],
    ],
    [
        [2,2,0],
        [0,2,2],
        [0,0,0],
    ],
    [
        [3,3],
        [3,3],
    ],
    [
        [0,4,0],
        [0,4,0],
        [0,4,4],
    ],
    [
        [0,5,0],
        [0,5,0],
        [5,5,0],
    ],
    [
        [0,6,0,0],
        [0,6,0,0],
        [0,6,0,0],
        [0,6,0,0],
    ],
    [
        [0,7,7],
        [7,7,0],
        [0,0,0],
    ],
]

const colors = [
    'white',
    'green',
    'red',
    'blue',
    'purple',
    'orange',
    'pink',
    'black',
]

const player = {
    matrix: tetromino[0],
    x: 7,
    y: 0,
}





const Left = ()=>{
    player.x--
    if(Collide()) {
        player.x++
    }
}
const Right = ()=>{
    player.x++
    if(Collide()) {
        player.x--
    }
}

const GetId = (id)=>{
    return document.getElementById(id)
}
const ColorById = (id,color)=>{
    document.getElementById(id).style.background = colors[color]
}




const Clear = ()=>{

    for(let i=0; i<HEIGHT; i++){
        for(let j=0; j<WIDTH; j++){
            ColorById(`${i}-${j}`,0)
        }
    }

}

const ArenaSwipe = ()=>{
    outer:for(let y=Arena.length-1;y>0; --y){
        for(let x=0; x<Arena[y].length; ++x){
            if(Arena[y][x] === 0) {
                continue outer
            } 
        }

        const row = Arena.splice(y,1)[0].fill(0)
        Arena.unshift(row)
        --y
    }
    console.table(Arena)
}


function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}


const Collide = ()=>{
    for(let y = 0; y<player.matrix.length; y++){
        for(let x =0; x<player.matrix[y].length; x++){
            if(player.matrix[y][x]!==0 && (
                Arena[y + player.y] && Arena[y + player.y][x + player.x]
            )!== 0 ) {
                return true
            }
        }
    }
    return false
}

const Reset = ()=>{
    const rand = Math.floor(Math.random() * 7)
    player.matrix = tetromino[rand]
   
    // if(Collide()) {
    //     for(let i=0; i<Arena.length; i++) {
    //         for(let j=0; j<Arena[i].length; j++) {
    //             ColorById(`${i}-${j}`,0)
    //         }
    //     }
    // }

}


const Merge = ()=>{
    for(let y =0; y<player.matrix.length; y++){
        for(let x=0; x<player.matrix[y].length; x++){
            if(player.matrix[y][x] !== 0) {
                Arena[y + player.y][x + player.x] = player.matrix[y][x]
            }
        }
    }
}

const Rotate = ()=>{
    const rotate = ()=>{
        for(let i=0; i<player.matrix.length; i++){
            for(let j=0; j<i; j++){
                [
                    player.matrix[j][i],
                    player.matrix[i][j],
                ] = [
                    player.matrix[i][j],
                    player.matrix[j][i],
                ]
            }
        }
        player.matrix.reverse()
    }

    rotate()
    let offset = 1
    let x = player.x
    while(Collide()) {
        player.x += offset
        offset =- (offset+(offset > 0 ? 1 : -1))
        if(offset > player.matrix[0].length) {
            rotate()
            player.x = x
            return 
        }
    }

}



const PlayerDrop = ()=>{
    player.y++
    if(Collide()) {
        console.log('Collision Detected!')
        player.y--;
        Merge()
        Reset()
        ArenaSwipe()
        player.y = 0
        player.x = 7
    }


}


const Interval = ()=>{
    setInterval(()=>{
        Clear()
        Draw()
        PlayerDrop()

    },700)
}

const Draw = ()=>{
    DrawMatrix(player.matrix,player.y,player.x)
    DrawMatrix(Arena,0,0)

}

const DrawMatrix = (matrix,yy,xx)=>{
    matrix.forEach((block,y)=>{
        block.forEach((ele,x)=>{
            if(ele !== 0) {
                ColorById(`${y + yy}-${x + xx}`,ele)
            }
        })
})
}

const CreateBoard = ()=>{
    for(let i=0; i<HEIGHT; i++){
        for(let j=0; j<WIDTH; j++){
            const cell = document.createElement('div')
            cell.id = `${i}-${j}`
            cell.className = 'cell'
            board.appendChild(cell)
        }   
    }
    Interval()
}


document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        Left()
    } else if (event.keyCode === 39) {
        Right()
    } else if (event.keyCode === 40) {
        PlayerDrop()
    } else if (event.keyCode === 38) {
        Rotate()
    }
});


CreateBoard()


// Arena.forEach((val,y)=>{
//     val.forEach((ele,x)=>{
//         if(ele === 1) {
//             board.children[`${y}-${x}`].style.background = 'green'
//         }
//     })
// })

// board.children[`${y}-${x}`].style.background = 'green'
// board.children['0-0'].style.background = 'green'
