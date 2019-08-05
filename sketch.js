var board = [];
var buttons = [];
var solving = false;

//var gameState = 	'000001000000000000000006000000400000000080000209000007000000000000003000000000000';//illustration of how it solves it
//var gameState = 	'000084010080050900140000285400003060006100009309800004000000401003400700010062300';//unsolvable, not enough givens
var gameState   = 	'006008500000070613000000009000090001001000800400530000107053000050064000300100060';
//var gameState = 	'020456789457080236689237040005362974274090653396574800040618397761040528938725060';

function setup() {
	frameRate(20);
	createCanvas(windowWidth,windowHeight);
	background(255);

	for (let i = 0; i<9; i++){
		board[i] = [];
		for (let j = 0; j<9; j++){
			board[i][j] = new Board(j,i,gameState[(i*9)+j]);
		}
	}

	easierButtons('Solve',0,0,function(){solving = true;});
	easierButtons('New Data',50,0,function(){gameState = ''+prompt();setup();});
	easierButtons('Reset',125,0,function(){setup();});
}

function draw(){
	let colWidth = windowWidth/9;
	let rowHeight = windowHeight/9;
	let width;
	if (colWidth > rowHeight) width = rowHeight;
	if (colWidth < rowHeight) width = colWidth;

	for(let i = 0; i<9; i++){
		for (let j = 0; j<9; j++){
			board[i][j].show(width,width);
		}
	}

	if(solving == true){
		for (let k = 0; k<5; k++){
			for (let i = 0; i<9; i++){
				for (let j = 0; j<9; j++){
					if(board[i][j].val == ' '){
						let canBe = board[i][j].check();
						if(canBe.length == 1){
							board[i][j] = new Board(j,i,canBe);
						}
					}
				}
			}
		}
		solving = false;
	}

	stroke(20);
	strokeWeight(10);
	line(width*3,0,width*3,width*9);
	line(width*6,0,width*6,width*9);
	line(0,width*3,width*9,width*3)
	line(0,width*6,width*9,width*6)

	noFill();
	stroke(0);
	rect(0,0,width*9,width*9);

	fill(255);
	noStroke();
	rect(width*9,0,windowWidth,windowHeight);
	rect(0,width*9,windowWidth,windowHeight);
}

function returnRow(j){
	let str = '';
	for (let k = 0; k<9; k++){
		if(board[j][k].val != ' '){
			str += (''+board[j][k].val)
		}
	}
	return str;
}
function returnCol(j){
	let str = '';
	for (let k = 0; k<9; k++){
		if(board[k][j].val != ' '){
			str += (''+board[k][j].val)
		}
	}
	return str;
}
function returnSquare(i,j){
	let str = '';
	let lStop, lStart, kStop, kStart;
	if(i+1%3 == 0){lStart = i-(i%3)-3;lStop = i-(i%3);}else{lStart = i-(i%3);lStop = i-(i%3)+3;}
	if(j+1%3 == 0){kStart = j-(j%3)-3;kStop = j-(j%3);}else{kStart = j-(j%3);kStop = j-(j%3)+3;}
	for (let k = lStart; k<lStop; k++){
		for (let l = kStart; l<kStop; l++){
			if(board[k][l].val != ' '){
				str+=(''+board[k][l].val);
			}
		}
	}
	return str;
}

class Board{
	constructor(i,j,val){
		this.i = i;
		this.j = j;
		this.val = val;
		if (this.val == '0')this.val = ' ';
	}

	show(x,y){
		fill(255);
		stroke(20);
		strokeWeight(3);
		rect(this.i*x, this.j*y, (this.i+1)*x, (this.j+1)*y);

		fill(40);
		stroke(40);
		strokeWeight(.3);
		textSize(30);
		textAlign(CENTER);
		text(this.val, (this.i*x + (this.i+1)*x)/2, (this.j*y + (this.j+1)*y)/2);

		/*show coords
		fill(0);
		stroke(0);
		textSize(10);
		text(this.i + ' ' + this.j, (this.i*x + (this.i+1)*x)/2, (this.j*y + (this.j+1)*y)/2+20);
		*/
	}

	check(){
		let unsortedCantBeUsed = (returnRow(this.j)+''+returnCol(this.i)+''+returnSquare(this.j,this.i));
		let cantBeUsed = sortAndRemove(unsortedCantBeUsed.split('')).toString().replace(/,/g,'');
		let canBeUsed = '';
		for(let i = 1; i<10; i++){
			if(cantBeUsed.indexOf(''+i) <= -1){
				canBeUsed += (''+i);
			}
		}
		return canBeUsed;
	}
}

function sortAndRemove(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

function easierButtons(buttonName, x, y, func){
	buttons.push(createButton(buttonName));
	buttons[buttons.length-1].position(x,y);
	buttons[buttons.length-1].mousePressed(func);
}
