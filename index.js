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

//Maze generation
//using built in Array creation method and fill method
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
console.log(grid);
