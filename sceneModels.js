//////////////////////////////////////////////////////////////////////////////
//
//  For instantiating the scene models.
//
//  J. Madeira - November 2018
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Constructors
//


function emptyModelFeatures() {

	// EMPTY MODEL

	this.vertices = [];

	this.normals = [];

    this.colors = [];

	// Transformation parameters

	// Displacement vector
	
	this.tx = 0.0;
	
	this.ty = 0.0;
	
	this.tz = 0.0;	
	
	// Rotation angles	
	
	this.rotAngleXX = 0.0;
	
	this.rotAngleYY = 0.0;
	
	this.rotAngleZZ = 0.0;	

	// Scaling factors
	
	this.sx = 0.1;
	
	this.sy = 0.1;
	
	this.sz = 0.1;		
	
	// Animation controls
	
	this.rotXXOn = true;
	
	this.rotYYOn = true;
	
	this.rotZZOn = true;
	
	this.rotXXSpeed = 1.0;
	
	this.rotYYSpeed = 1.0;
	
	this.rotZZSpeed = 1.0;
	
	this.rotXXDir = 1;
	
	this.rotYYDir = 1;
	
	this.rotZZDir = 1;
	
	// Material features
	
	this.kAmbi = [ 0.2, 0.2, 0.2 ];
	
	this.kDiff = [ 0.7, 0.7, 0.7 ];

	this.kSpec = [ 0.7, 0.7, 0.7 ];

	this.nPhong = 100;
}

function singleTriangleModel( ) {
	
	var triangle = new emptyModelFeatures();
	
	// Default model has just ONE TRIANGLE

	triangle.vertices = [

		// FRONTAL TRIANGLE
		 
		-0.5, -0.5,  0.5,
		 
		 0.5, -0.5,  0.5,
		 
		 0.5,  0.5,  0.5,
	];

	while(triangle.colors.length < triangle.vertices.length){
		triangle.colors.push(0.0)
	}

	triangle.normals = [

		// FRONTAL TRIANGLE
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
		 
		 0.0,  0.0,  1.0,
	];

	return triangle;
}





function simpleCubeModel( ) {
	
	var cube = new emptyModelFeatures();
	
	cube.vertices = [

		-1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000, -1.000000,  1.000000,
		 1.000000, -1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
         1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000,  1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000,  1.000000,  1.000000, 
        -1.000000, -1.000000, -1.000000, 
        -1.000000,  1.000000, -1.000000,
         1.000000,  1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
         1.000000,  1.000000, -1.000000, 
         1.000000, -1.000000, -1.000000, 
        -1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000,  1.000000,  1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000,  1.000000, 
		 1.000000,  1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		-1.000000, -1.000000, -1.000000,
		 1.000000, -1.000000, -1.000000, 
		-1.000000, -1.000000,  1.000000, 
		 1.000000, -1.000000, -1.000000, 
		 1.000000, -1.000000,  1.000000, 	 
	];

	while(cube.colors.length < cube.vertices.length){
		cube.colors.push(0.0)
	}

	computeVertexNormals( cube.vertices, cube.normals );

	return cube;
}


function cubeModel( subdivisionDepth = 0 ) {
	
	var cube = new simpleCubeModel();
	
	midPointRefinement( cube.vertices, subdivisionDepth );
	
	while(cube.colors.length < cube.vertices.length){
		cube.colors.push(0.0)
	}

	computeVertexNormals( cube.vertices, cube.normals );
	
	return cube;
}


function simpleTetrahedronModel( ) {
	
	var tetra = new emptyModelFeatures();
	
	tetra.vertices = [

		-1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         0.000000, -1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000, 
         0.000000,  1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000,
	];
	
	while(tetra.colors.length < tetra.vertices.length){
		tetra.colors.push(0.0)
	}

	computeVertexNormals( tetra.vertices, tetra.normals );

	return tetra;
}


function tetrahedronModel( subdivisionDepth = 0 ) {
	
	var tetra = new simpleTetrahedronModel();
	
	midPointRefinement( tetra.vertices, subdivisionDepth );
	
	while(tetra.colors.length < tetra.vertices.length){
		tetra.colors.push(0.0)
	}

	computeVertexNormals( tetra.vertices, tetra.normals );
	
	return tetra;
}


function sphereModel( subdivisionDepth = 2 ) {
	
	var sphere = new simpleCubeModel();
	
	midPointRefinement( sphere.vertices, subdivisionDepth );
	
	moveToSphericalSurface( sphere.vertices )
	
	while(sphere.colors.length < sphere.vertices.length){
		sphere.colors.push(0.0)
	}

	computeVertexNormals( sphere.vertices, sphere.normals );
	
	return sphere;
}


function simpleSquareModel( ) {

	var square = new emptyModelFeatures();

	square.vertices = [
		-1.0, 0.0, -1.0,
		-1.0, 0.0,  1.0,
		 1.0, 0.0, -1.0,

		 1.0, 0.0, -1.0,
		-1.0, 0.0,  1.0,
		 1.0, 0.0,  1.0 
	]
	/*
	square.colors = [
		 1.0, 1.0, 1.0,
		 1.0, 1.0, 1.0,
		 1.0, 1.0, 1.0,
		 1.0, 1.0, 1.0,
		 1.0, 1.0, 1.0,
		 1.0, 1.0, 1.0	
	]*/
	
	while(square.colors.length < square.vertices.length){
		square.colors.push(0.0)
	}
	

	computeVertexNormals( square.vertices, square.normals)

	return square
}


//----------------------------------------------------------------------------
//
//  Instantiating scene models
//

var sceneModels = [];

