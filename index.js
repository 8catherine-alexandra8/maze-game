//boiler plate to access the objects in matter.js
const { Engine, Render, Runner, World, Bodies } = Matter;
//set a variable for the # of cells on either the
//horizontal or vertical side/edge of the maze.  The
//size can be changed, but it will remain a square
const cells = 3;
//size of canvas element
const width = 600;
const height = 600;

//more boiler plate to create and gain access to
//matter js objects-more detailed explanation
//in Bear notes
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	element : document.body,
	engine  : engine,
	options : {
		wireframes : false,
		width,
		height
	}
});
Render.run(render);
Runner.run(Runner.create(), engine);

//walls-the perimeter of the maze.  Using constants for canvas height
//and width, and using those constants in the walls, makes the walls
//flexible so that they auto adapt if/when canvas size changes
const walls = [
	Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
	Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
	Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
	Bodies.rectangle(width, height / 2, 40, height, { isStatic: true })
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
const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));
//verticals is going to have three rows(for now) so the outer array
//should be passed a 3 while the inner array() should be passed
//two since there are only two columns
const verticals = Array(cells)
	.fill(null)
	.map(() => Array(cells - 1).fill(false));
//Outer array will have 2 because there are only 2 rows, while the
//inner will have 3, for the 3 columns
const horizontals = Array(cells - 1)
	.fill(null)
	.map(() => Array(cells).fill(false));

//generate the starting row cell for the maze
const startRow = Math.floor(Math.random() * cells);
//do the same thing to generate starting column cell for maze
const startColumn = Math.floor(Math.random() * cells);

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
	//the neighbors
	const neighbors = shuffle([
		[ row - 1, column ],
		[ row, column + 1 ],
		[ row + 1, column ],
		[ row, column - 1 ]
	]);
	//For each neighbor...
	//See if that neighbor is out of bounds
	//See if we have visited that neighbor, if so, then continue to
	//next neighbor
	//Remove a wall from the horizontals or verticals arrays
	//Visit that next cell: call stepThroughCell again and pass
	//in the row and column of the cell we are trying to visit
};

//call stepThroughCell and pass in startRow and startColumn to
//begin maze generation
stepThroughCell(startRow, startColumn);
