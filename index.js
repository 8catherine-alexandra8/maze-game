//boiler plate to access the objects in matter.js
const { Engine, Render, Runner, World, Bodies } = Matter;

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

//Maze generation, starting with a blank array and using a double nested
//for loop
const grid = [];

for (let i = 0; i < 3; i++) {
	//in outerloop,push in each individual row
	grid.push([]);
	//in the inner loop, process all the rows and
	//add in starting values of false
	for (let j = 0; j < 3; j++) {
		grid[i].push(false);
	}
}
console.log(grid);
