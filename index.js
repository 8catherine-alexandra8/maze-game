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

//walls-the perimeter of the maze
const walls = [
Bodies.rectangle(width / 2, 0, width, 40, { isStatic = true }),
Bodies.rectangle(width / 2, height, width, 40, { isStatic = true }),
Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
Bodies.rectangle(width, height / 2, 40, height, { isStatic: true}),
];
World.add(world, walls);
