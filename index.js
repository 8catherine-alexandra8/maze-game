//boiler plate to access the objects in matter.js
//add Body to list of objects to destructure as this
//is needed to change the velocity of the ball. To
//detect a collision between ball and goal, destructure
//another object from Matter, called Events
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;
//set a variable for the # of cells on either the
//horizontal or vertical side/edge of the maze.  The
//size can be changed, but it will remain a square
//const cells = 6;
//replaced original singular cells variable with x axis cells
//and y axis cells.  cellsVertical is the # of rows.
const cellsHorizontal = 4;
const cellsVertical = 3;
//size of canvas element.  Using the innerWidth and innerHeight
//properties of the window object to make canvas adapt to user's
//current browser window size
const width = window.innerWidth;
const height = window.innerHeight;

//set unit length variable as width/cells
//const unitLength = width / cells;
//replaced unitLength with two different calcs for x and  y 
//axis units
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;
//more boiler plate to create and gain access to
//matter js objects-more detailed explanation
//in Bear notes
const engine = Engine.create();
//disable gravity in the world to make it easier
//to move the ball around the maze
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
	element : document.body,
	engine  : engine,
	options : {
		wireframes : true,
		width,
		height
	}
});
Render.run(render);
Runner.run(Runner.create(), engine);

//walls-the perimeter of the maze.  Using constants for canvas height
//and width, and using those constants in the walls, makes the walls
//flexible so that they auto adapt if/when canvas size changes.
//changed hardcoded width from 40 to 2.
const walls = [
	Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
	Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, 2, height, { isStatic: true })
];
World.add(world, walls);

//MAZE GENERATION

//helper function to randomize the list of a cells neighbors
//(that list generated in stepThroughCell).  It will take
//an array and then radomly re-order the elements inside of it
const shuffle = (arr) => {
	//get the length of the array and assign it to counter
	let counter = arr.length;
	//set up while loop that will run while counter is > 0
	while (counter > 0) {
		//get a random index from inside the array
		const index = Math.floor(Math.random() * counter);
		//then decrease counter variable by 1
		counter--;
		//swap element that is at index of index with the element
		//that is at the index of counter. this ensures that each
		//element will be swapped at least one time
		const temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}
	//return the now randomly ordered array
	return arr;
};

//Create the grid using built in Array creation method and fill method
//the argument passed into Array(), is the # of colums/rows
//it doesn't matter what you pass into fill as it is just
//a place holder for map().  Map replaces each of the three
//null values with an array of 3 false values.  Rows are created
//with the first instance of Array() and columns with the second.
//const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));
//Now that grid will be 4 x 3, the outerarray, which is the number
//of rows in the array needs to reference cellsVertical.  The 
//inner array will be the number of columns, tracked by cellsHorizontal
const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));
//verticals is going to have three rows(for now) so the outer array
//should be passed a 3 while the inner array() should be passed
//two since there are only two columns.  Outer array here changed
//cellsVertical
const verticals = Array(cellsVertical)
    .fill(null)
    //inner array changed to cellsHorizontal
	.map(() => Array(cellsHorizontal - 1).fill(false));
//Outer array will have 2 because there are only 2 rows, while the
//inner will have 3, for the 3 columns.  Outer array here changed
//to cellsVertical and inner array changed to cellsHorizontal
const horizontals = Array(cellsVertical - 1)
	.fill(null)
	.map(() => Array(cellsHorizontal).fill(false));

//generate the starting row cell for the maze. cellsVertical
//corresponds with rows so cells changes to cellsVertical
const startRow = Math.floor(Math.random() * cellsVertical);
//do the same thing to generate starting column cell for maze
const startColumn = Math.floor(Math.random() * cellsHorizontal);

//declare a function that will go through the maze creation logic
//and create maze.  Pass in some row and column that we want to visit
//inside of our grid.
const stepThroughCell = (row, column) => {
	//If I have visited the cell at [row, column], then return.
	//This is the same as writing if(grid[row][column] === true)
	//then return
	if (grid[row][column]) {
		return;
	}
	//Mark this cell as being visited by updating the appropriate
	//element inside the grid array to show as true
	grid[row][column] = true;
	//Assemble randomonly ordered list of cell neighbors
	//declare neighbors as an array and list out, in row/column
	//notation, the coordinates of the neighbors around a cell,
	//starting at the top and going clockwise.  wrap the function
	//in shuffle helper function to randomize the order of
	//the neighbors.  added third element to each array to indicate
	//direction so that it can be referenced in 'for neighbor of
	//neigbors loop below'
	const neighbors = shuffle([
		[ row - 1, column, 'up' ],
		[ row, column + 1, 'right' ],
		[ row + 1, column, 'down' ],
		[ row, column - 1, 'left' ]
	]);
	//For each neighbor...Check condition: neighbor is out of bounds
	//check condition: if neighbor visited previously, and if so,
	// move to next neighbor
	//Remove wall from horizontal or verticals array
	//First loop over neighbor cells:
	for (let neighbor of neighbors) {
		//access neighbors and pull a few values out using Array
		//destructuring
		const [ nextRow, nextColumn, direction ] = neighbor;
		//see if neighbor is out of bounds.  If we have a neighbor where
		//any of these conditions is true, then we still want to iterate
		//through the rest of the neighbors, but we don't want to run
		//any additional code on this particular out of bounds neighbor
		//use the "continue" keyword for this condition.  This tells JS
		//"don't leave this for loop, but don't take any additional action
		//on the current iteration of the loop. Instead, just move on to
		//the next neighbor pair now"
		if (
			nextRow < 0 ||
			nextRow >= cellsVertical ||
			nextColumn < 0 ||
			nextColumn >= cellsHorizontal
		) {
			continue;
		}
		//if grid (where we're storing boolean values to represent 'visited'
		//or not) is true for this neighbor cell, then don't do anything
		//with this cell and move on to the next neighbor pair now
		if (grid[nextRow][nextColumn]) {
			continue;
		}
		//decide if we are moving up, down, left or right, and depending
		//on the direction we're heading, update either the verticals
		//or horizontals array to remove the wall.  Up or down means
		//updating the horizontals array and L or R means updating
		//verticals array. To know direction, add a third element to
		//each array in neighbors to indicate direction so that can
		//be referenced here
		//if moving left or right, updating appropriate array index
		//to true which will remove wall:
		if (direction === 'left') {
			verticals[row][column - 1] = true;
		} else if (direction === 'right') {
			verticals[row][column] = true;
		} else if (direction === 'up') {
			//if moving up or down, updating array appropriate array index
			//to true to remove wall:
			horizontals[row - 1][column] = true;
		} else if (direction === 'down') {
			horizontals[row][column] = true;
		}
		stepThroughCell(nextRow, nextColumn);
	}
	//Visit that next cell: call stepThroughCell again and pass
	//in the row and column of the cell we are trying to visit
};

//call stepThroughCell and pass in startRow and startColumn to
//begin maze generation
stepThroughCell(startRow, startColumn);

//Iterate over horizontals array, generated above, to figure out
//where false values are, and use them to draw rectangles (build walls)
//horizontals is a 2d array, so when we do a forEach on it, we will
//receive the inner arrays.  We'll call it each inner array "row"
//then iterate over each row with another forEach. the second
//argument would be the index of the row
horizontals.forEach((row, rowIndex) => {
	//for each row, we'll receive each boolean value as an arguement
	//called open, to represent if this is an open segment of wall
	//or not. if open is true, we don't need to draw a rectangle/wall
	//the second argument here will be columnIndex
	row.forEach((open, columnIndex) => {
		//if open is true, then move on to the next element in the array
		if (open === true) {
			return;
		}
		//create a wall variable to draw walls using the correct
		//arguments for rectangle, so that we draw the correct
		//side of the rectangle, if above coindtion not met.
		const wall = Bodies.rectangle(
			//placement along x axis:
			columnIndex * unitLengthX + unitLengthX / 2,
			//placement along y axis:
			rowIndex * unitLengthY + unitLengthY,
			//define how wide the rectangle
			//should be
			unitLengthX,
			//wall height is somewhat arbitrary.  Needs to be short
			//enough for ball to navigate around
			5,
			//add a label of wall to properties object so that it
			//can be referenced in win condition, to flip isStatic,
			//false
			{
				label    : 'wall',
				isStatic : true
			}
		);
		//add wall to world
		World.add(world, wall);
	});
});
//repeat same logic for vertical wall creation as was used above
//for horizontal wall creation
verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open) {
			return;
		}
		//math for wall creation will be a bit different
		//for verticals than it was for horizontals
		const wall = Bodies.rectangle(
			columnIndex * unitLengthX + unitLengthX,
			rowIndex * unitLengthY + unitLengthY / 2,
			5,
			unitLengthY,
			//add a label of wall to properties object so that it
			//can be referenced in win condition, to flip isStatic,
			//false
			{
				label    : 'wall',
				isStatic : true
			}
		);
		World.add(world, wall);
	});
});

//GOAL CREATION

//declare a goal and pass in arguments to place it
//in the correct spot
const goal = Bodies.rectangle(
	//x coordinate
	width - unitLengthX / 2,
	//y coordinate
	height - unitLengthY / 2,
	//height of rectangle, scalable with unitLength
	unitLengthX * 0.7,
	//width of rectangle, scaleable
	unitLengthY * 0.7,
	//add in an options object to give goal a custom name
	//that can be used to detect when the ball hits the goal
	//this will distinguish from when ball hits rectangle walls
	{
		label    : 'goal',
		isStatic : true
	}
);
//make goal visible in world
World.add(world, goal);

//BALL CREATION
//because we replaced unitLength with unitLengthX and unitLengthY
//we need to add a new variable for ball radius so that we calculate 
//radius using the smaller of the two unitLengths
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
//declare a ball and pass in arguments to place in
//in the correct spot
const ball = Bodies.circle(
	//x coordinate for center of circle
	unitLengthX / 2,
	//y coordinate for center of circle placement in cell
	unitLengthY / 2,
	//radius of ball
	ballRadius,
	//add in an options object to give ball a custom name
	//that can be used to detect when the ball hits the goal
	{
		label : 'ball'
	}
);
//make ball visible in the world
World.add(world, ball);

//event listener to detect key depression and receive event
//object
document.addEventListener('keydown', (event) => {
	//get current velocity of ball, using destructuring
	//when the ball isn't moving, x and y will be 0
	const { x, y } = ball.velocity;
	//add condition for if user presses W to go up
	//87 is w's keycode
	if (event.keyCode === 87) {
		//update the velocity in the up direction. x will be set
		//to equal current velocity of x since
		//we don't want to increase velocity
		//on the x axix. Subtract 5 from y to move up
		//writing it this way causes ball to continue
		//to increase speed if W is pressed multiple times
		//consecutively
		Body.setVelocity(ball, { x, y: y - 5 });
	}
	//move right/press d
	if (event.keyCode === 68) {
		Body.setVelocity(ball, { x: x + 5, y });
	}
	//move down/ press s
	if (event.keyCode === 83) {
		Body.setVelocity(ball, { x, y: y + 5 });
	}
	//move left/ press a
	if (event.keyCode === 65) {
		Body.setVelocity(ball, { x: x - 5, y });
	}
});

//WIN CONDITION

//Utilize events object, destructured from Matter, to listen
//for a collision event, add a callback function that will
//be called with an event object.  It will be invoked upon collision
Events.on(engine, 'collisionStart', (event) => {
	event.pairs.forEach((collision) => {
		const labels = [ 'ball', 'goal' ];

		if (
			labels.includes(collision.bodyA.label) &&
			labels.includes(collision.bodyB.label)
		) {
			//at this point, the user won. to indicate this
			//we will turn gravity back on. this will cause shapes
			//to fall toward bottom of canvas
			world.gravity.y = 1;
			//loop over all the shapes, determine which ones are labeled
			//'wall' and remove static flag from each.  label is set
			//on both horizontals and verticals.
			//of them so that they can fall in response to gravity
			world.bodies.forEach((body) => {
				if (body.label === 'wall') {
					Body.setStatic(body, false);
				}
			});
		}
	});
});
