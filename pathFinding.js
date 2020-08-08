function createBoard(sizeX, sizeY)
{
    var toAdd = document.getElementById('grid');
    var newDiv;
    var i = 0, j = 0;
    while(i < sizeY)
    {
        j = 0;
        while(j < sizeX)
        {
            newDiv = document.createElement('div');
            newDiv.className = "cell";
            newDiv.style.top = i.toString() + "px";
            newDiv.style.left = j.toString() + "px";
            toAdd.appendChild(newDiv);

            j += 20
        }
        i += 20;
    }
}

function activateButtons(type)
{
    var startButton = document.getElementById('startButton');
    startButton.style.cursor = 'pointer';
    startButton.onclick = onClickStartButtonFunction;

    var endButton = document.getElementById('endButton');
    endButton.style.cursor = 'pointer';
    endButton.onclick = onClickEndButtonFunction;

    var obstacleButton = document.getElementById('obstacleButton');
    obstacleButton.style.cursor = 'pointer';
    obstacleButton.onclick = onClickObstacleButtonFunction;

    var pathButton = document.getElementById('pathButton');
    pathButton.style.cursor = 'pointer';
    pathButton.onclick = findPath;
}

function onClickStartButtonFunction()
{
    console.log('Start!')
    var element = document.getElementById('grid');
    element.style.cursor = 'pointer';
    
    var squares = Array.from(document.querySelectorAll('.grid div'));

    
    for(var i=0; i<squares.length; i++)
        squares[i].onclick = function() 
        {
            if(!ifFirstStart)
                return;

            if(this.style.backgroundColor = '#ECECEC')
            {
                var top = this.style.top;
                var topNew = top.replace("px", "");
                var y = parseInt(topNew)/20;
                
                var left = this.style.left;
                var leftNew = left.replace("px", "");
                var x = parseInt(leftNew)/20;

                positions[x + y*sizeX/20] = 2;
                indexOfStart = x + y*sizeX/20;
                ifFirstStart = false;
                this.style.backgroundColor = '#00BB27';
            }
        }
}

function onClickEndButtonFunction()
{
    console.log('End!')
    var element = document.getElementById('grid');
    element.style.cursor = 'pointer';
    
    var squares = Array.from(document.querySelectorAll('.grid div'));

    for(var i=0; i<squares.length; i++)
        squares[i].onclick = function() 
        {
            if(!ifFirstEnd)
                return;

            if(this.style.backgroundColor = '#ECECEC')
            {
                var top = this.style.top;
                var topNew = top.replace("px", "");
                var y = parseInt(topNew)/20;
                
                var left = this.style.left;
                var leftNew = left.replace("px", "");
                var x = parseInt(leftNew)/20;

                positions[x + y*sizeX/20] = 3;
                indexOfEnd = x + y*sizeX/20;
                ifFirstEnd = false;
                this.style.backgroundColor = '#771AAA';
            }           
        }
}

function onClickObstacleButtonFunction()
{
    console.log('Obstacles!')
    
    var element = document.getElementById('grid');
    element.style.cursor = 'pointer';
    
    var squares = Array.from(document.querySelectorAll('.grid div'));

    for(var i=0; i<squares.length; i++)
        squares[i].onclick = function() 
        {
            if(this.style.backgroundColor = '#ECECEC')
            {
                var top = this.style.top;
                var topNew = top.replace("px", "");
                var y = parseInt(topNew)/20;
                
                var left = this.style.left;
                var leftNew = left.replace("px", "");
                var x = parseInt(leftNew)/20;

                positions[x + y*sizeX/20] = 4;
                this.style.backgroundColor = '#50575D';

                indexesOfObstacles.push(x + y*sizeX/20);
            }      
    
        }
}
function update()
{
    var squares = Array.from(document.querySelectorAll('.grid div'));
    var count = 0;
    for(var i=0; i<squares.length; i++)
    {
        if(positions[i] == 0)
        {
            squares[i].style.backgroundColor = '#ECECEC';
            count++;
        }
        if(positions[i] == 1)
            squares[i].style.backgroundColor = '#64A1F4';
        if(positions[i] == 2)
            squares[i].style.backgroundColor = '#00BB27';
        if(positions[i] == 3)
            squares[i].style.backgroundColor = '#771AAA';
        if(positions[i] == 4)
            squares[i].style.backgroundColor = '#50575D';
    }
    return count;
}
function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addFields(prevN)
{
    var i = indexOfStart;
    var n = prevN + 1;
    var flag;
    var newIndexesOfCircuit = [];
    for(var i=-n + 1; i < n; i++)
    {
        for(var j=-n + 1; j < n; j++)
        {
            flag = false;
            
            for(var k=0; k<indexesOfCircuit.length; k++)
            {
                if(indexOfStart + i*sizeX/20 + j == indexesOfCircuit[k])
                {
                    flag = true;
                    break;
                }
            }
            if(!flag)
                continue;

            if(checkIfGoalAchieved(i, j))
                return [n, true];

            if(positions[indexOfStart + (i-1)*sizeX/20 + j] != 4)
            {
                if(checkObstacles(i - 1, j))
                    continue;
                if(indexesOfPrev[indexOfStart + (i-1)*sizeX/20 + j] == 0)
                    indexesOfPrev[indexOfStart + (i-1)*sizeX/20 + j] = indexOfStart + i*sizeX/20 + j;
                drawAnUpdatePositions(i-1,j);
                newIndexesOfCircuit.push(indexOfStart + (i-1)*sizeX/20 + j);
            }
            if(positions[indexOfStart + i*sizeX/20 + j-1] != 4)
            {
                if(checkObstacles(i, j-1))
                    continue;
                if(indexesOfPrev[indexOfStart + i*sizeX/20 + j-1]==0)
                    indexesOfPrev[indexOfStart + i*sizeX/20 + j-1] = indexOfStart + i*sizeX/20 + j;                   
                drawAnUpdatePositions(i,j-1);
                newIndexesOfCircuit.push(indexOfStart + i*sizeX/20 + j-1);
            }
            
            if(positions[indexOfStart + i*sizeX/20 + j+1] != 4)
            {
                if(checkObstacles(i, j+1))
                    continue;
                if(indexesOfPrev[indexOfStart + i*sizeX/20 + j + 1]==0)
                    indexesOfPrev[indexOfStart + i*sizeX/20 + j + 1] = indexOfStart + i*sizeX/20 + j;
                drawAnUpdatePositions(i,j+1);
                newIndexesOfCircuit.push(indexOfStart + i*sizeX/20 + j+1);
            }
             
            if(positions[indexOfStart + (i+1)*sizeX/20 + j] != 4)
            {
                if(checkObstacles(i+1, j))
                    continue;
                if(indexesOfPrev[indexOfStart + (i+1)*sizeX/20 + j] == 0)
                    indexesOfPrev[indexOfStart + (i+1)*sizeX/20 + j] = indexOfStart + i*sizeX/20 + j;
                drawAnUpdatePositions(i+1,j);
                newIndexesOfCircuit.push(indexOfStart + (i+1)*sizeX/20 + j);
            }
        }
    }
    indexesOfCircuit = newIndexesOfCircuit;
    return [n, false];
}
function checkIfGoalAchieved(i, j)
{
    if(positions[indexOfStart + (i-1)*sizeX/20 + j] == 3)
    {
        goal(indexOfStart + i*sizeX/20 + j);
        return true;
    }
    if(positions[indexOfStart + i*sizeX/20 + j - 1] == 3)
    {
        goal(indexOfStart + i*sizeX/20 + j);
        return true;
    }
    if(positions[indexOfStart + i*sizeX/20 + j + 1] == 3)
    {
        goal(indexOfStart + i*sizeX/20 + j);
        return true;
    }
    if(positions[indexOfStart + (i+1)*sizeX/20 + j] == 3)
    {
        goal(indexOfStart + i*sizeX/20 + j);
        return true;
    }
}
async function goal(index)
{
    var squares = Array.from(document.querySelectorAll('.grid div'));
    
    while(index != indexOfStart)
    {
        squares[index].style.backgroundColor = '#FF6601';  
        index = indexesOfPrev[index];
        await sleep(delay);  
    }
}
function drawAnUpdatePositions(i, j)
{
    var squares = Array.from(document.querySelectorAll('.grid div'));

    positions[indexOfStart + i*sizeX/20 + j] = 1;
    if(indexOfStart + i*sizeX/20 + j != indexOfStart)
    {
        if(!checkObstacles(i, j))
            squares[indexOfStart + i*sizeX/20 + j].style.backgroundColor = '#64A1F4';
    }

}
function checkObstacles(i, j)
{
    if(indexOfStart%(sizeX/20) + j < 0)
        return true;
    if(indexOfStart%(sizeX/20) + j > sizeX/20-1)
        return true;
    if(Math.floor(indexOfStart/(sizeX/20)) + i < 0)
        return true;
    if(Math.floor(indexOfStart/(sizeX/20)) + i > sizeY/20-1)
        return true;

    return false;
}
async function findPath()
{
    if(ifFirstEnd || ifFirstStart)
        return;

    console.log('Find path!');
    delay = 100;
    var n = 0;
    positions[indexOfStart] = 1;
    indexesOfCircuit.push(indexOfStart);

    while(true)
    {
        res = addFields(n);
        n = res[0];
        if(res[1])
            break;
        await sleep(delay);
    }
}

var ifFirstStart = true;
var ifFirstEnd = true;
var positions = [];
var indexOfStart;
var indexOfEnd;
var indexesOfObstacles = [];
var indexesOfCircuit = [];
var sizeX = 900;
var sizeY = 500;
var indexesOfPrev = []

for(var i=0; i<sizeX*sizeY/400; i++)
{
    positions[i] = 0;
    indexesOfPrev[i] = 0;
}

createBoard(900, 500);
var type;
activateButtons();
