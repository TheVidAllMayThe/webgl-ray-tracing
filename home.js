//////////////////////////////////////////////////////////////////////////////
//
//  WebGL_example_24_GPU_per_vertex.js 
//
//  Phong Illumination Model on the GPU - Per vertex shading - Several light sources
//
//  Reference: E. Angel examples
//
//  J. Madeira - November 2017 + November 2018
//
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//
var width = null;
var height = null;

var gl = null; // WebGL context

var shaderProgram = null;

var file = null;

var triangleVertexPositionBuffer = null;

var triangleVertexColorBuffer = null;

var triangleVertexNormalBuffer = null;	

// The GLOBAL transformation parameters

var globalAngleYY = 0.0;

var globalAngleXX = 0.0;

var globalAngleZZ = 0.0;


var globalTz = -2.5;

var globalTx = 0.0;

var globalTy = 0.0;

// GLOBAL Animation controls

var globalRotationYY_ON = 0;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

// To allow choosing the way of drawing the model triangles

var pyramidPos = null

var primitiveType = null;

// To allow choosing the projection type

// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [ 0.0, 0.0, 0.0, 1.0 ];


//----------------------------------------------------------------------------
//
// NEW - To count the number of frames per second (fps)
//

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();;


//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex Coordinates and the Vertex Normal Vectors

function initBuffers( model ) {	
	
	// Vertex Coordinates
		
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems =  model.vertices.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Vertex Normal Vectors
		
	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;			

	// Associating to the vertex shader
	
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
			triangleVertexNormalBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);	

    // Colors
    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = 3;
    triangleVertexColorBuffer.numItems = model.colors.length / 3;

    // Associating to the vertex shader
    
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
            triangleVertexColorBuffer.itemSize,
            gl.FLOAT, false, 0 , 0);
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input
	
	// Concatenate with the particular model transformations
	
    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader
	
	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Normal Vectors
	
	initBuffers(model);
	
	// Material properties
	
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"), 
		flatten(model.kAmbi) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );
    
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );

	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"), 
		model.nPhong );

    // Light Sources
	
	var numLights = lightSources.length;
	
	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"), 
		numLights );


	
	for(var i = 0; i < lightSources.length; i++ )
	{
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );
	
		
		lightPos = vec4()
		if(lightSources[i].getPosition()[3] == 1.0){
			lightPos[0] = Number(lightSources[i].getPosition()[0]) + globalTx
			lightPos[1] = Number(lightSources[i].getPosition()[1]) + globalTy
			lightPos[2] = Number(lightSources[i].getPosition()[2]) + globalTz
		}
		else{
			lightPos[0] = lightSources[i].getPosition()[0]
			lightPos[1] = lightSources[i].getPosition()[1]
			lightPos[2] = lightSources[i].getPosition()[2]
		}
		lightPos[3] = lightSources[i].getPosition()[3]

		/*
		if(i){
			console.log('Global T: ' + vec3(globalTx, globalTy, globalTz))
			console.log('LightSourcePos: ' + lightSources[i].getPosition())
			console.log('LightPos: ' + lightPos)
			console.log('\n')
		}
		*/
		
		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightPos));
    
		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );

		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].ambientIntensities"),
			flatten(lightSources[i].getAmbIntensity()) );
    }
	// Drawing 
    gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems);
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	
	var pMatrix;
	
	var mvMatrix = mat4();
	
	// Clearing the frame-buffer and the depth-buffer
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Computing the Projection Matrix
	
    // A standard view volume.
    
    // Viewer is at (0,0,0)
    
    // Ensure that the model is "inside" the view volume
    
    pMatrix = perspective( 45, width/height, 0.001, 100 );
    
    // Global transformation !!
    
    //globalTz = -2.5;

    // NEW --- The viewer is on (0,0,0)
    
    pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;
    
    pos_Viewer[3] = 1.0;  
    
    // TO BE DONE !
    
    // Allow the user to control the size of the view volume
	
	// Passing the Projection Matrix to apply the current projection
	
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// NEW --- Passing the viewer position to the vertex shader
	
	gl.uniform4fv( gl.getUniformLocation(shaderProgram, "viewerPosition"),
        flatten(pos_Viewer) );
	
	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	/*

	mvMatrix = mult( translationMatrix( globalTx, globalTy, globalTz ),
		rotationYYMatrix( globalAngleYY ) );

	mvMatrix = mult(rotationXXMatrix(globalAngleXX), mvMatrix)

	mvMatrix = mult(rotationZZMatrix(globalAngleZZ), mvMatrix)
	// NEW - Updating the position of the light sources, if required
	*/

	mvMatrix = rotationYYMatrix( globalAngleYY );

	mvMatrix = mult(rotationXXMatrix(globalAngleXX), mvMatrix)

	mvMatrix = mult(rotationZZMatrix(globalAngleZZ), mvMatrix)

	mvMatrix = mult(mvMatrix, translationMatrix( globalTx, globalTy, globalTz ))

	// FOR EACH LIGHT SOURCE
	    
	for(var i = 0; i < lightSources.length; i++ )
	{
		// Animating the light source, if defined
		    
		var lightSourceMatrix = mat4();

		if( !lightSources[i].isOff() ) {
				
			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES

			if( lightSources[i].isRotYYOn() || globalAngleYY != 0 ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleYY() + globalAngleYY ) );
			}

			if( lightSources[i].isRotXXOn() || globalAngleYY != 0 ) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleXX() + globalAngleXX ) );
			}

			if( lightSources[i].isRotZZOn() || globalAngleZZ != 0) 
			{
				lightSourceMatrix = mult( 
						lightSourceMatrix, 
						rotationYYMatrix( lightSources[i].getRotAngleZZ() + globalAngleZZ ) );
			}
		}
		
		// NEW Passing the Light Souree Matrix to apply
	
		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights["+ String(i) + "].lightSourceMatrix");
	
		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}
			
	// Instantianting all scene models
	
	

	for(var i = 0; i < sceneModels.length; i++ )
	{
		drawModel( sceneModels[i],
			   mvMatrix,
	           (sceneModels[i].primitiveType == 'Triangles' ? primitiveType : gl.LINE_LOOP));
	}
	           
}

//----------------------------------------------------------------------------
//
//  NEW --- Animation
//

// Animation --- Updating transformation parameters

var lastTime = 0;

function animate() {
	
	var timeNow = new Date().getTime();
	
	if( lastTime != 0 ) {
		
		var elapsed = timeNow - lastTime;
		
		// Global rotation
		
		if( globalRotationYY_ON ) {

			globalAngleYY += globalRotationYY_DIR * globalRotationYY_SPEED * (90 * elapsed) / 1000.0;
	    }

		// For every model --- Local rotations
		
		for(var i = 0; i < sceneModels.length; i++ )
	    {
			if( sceneModels[i].rotXXOn ) {

				sceneModels[i].rotAngleXX += sceneModels[i].rotXXDir * sceneModels[i].rotXXSpeed * (90 * elapsed) / 1000.0;
			}

			if( sceneModels[i].rotYYOn ) {

				sceneModels[i].rotAngleYY += sceneModels[i].rotYYDir * sceneModels[i].rotYYSpeed * (90 * elapsed) / 1000.0;
			}

			if( sceneModels[i].rotZZOn ) {

				sceneModels[i].rotAngleZZ += sceneModels[i].rotZZDir * sceneModels[i].rotZZSpeed * (90 * elapsed) / 1000.0;
			}
		}
		
		// Rotating the light sources
	
		for(var i = 0; i < lightSources.length; i++ )
	    {
			if( lightSources[i].isRotYYOn() ) {

				var angle = lightSources[i].getRotAngleYY() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
		
				lightSources[i].setRotAngleYY( angle );
			}

			if( lightSources[i].isRotXXOn() ) {

				var angle = lightSources[i].getRotAngleXX() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
		
				lightSources[i].setRotAngleXX( angle );
			}

			if( lightSources[i].isRotZZOn() ) {

				var angle = lightSources[i].getRotAngleZZ() + lightSources[i].getRotationSpeed() * (90 * elapsed) / 1000.0;
		
				lightSources[i].setRotAngleZZ( angle );
			}
		}
}
	
	lastTime = timeNow;
}


//----------------------------------------------------------------------------

// Timer

function tick() {
	
	requestAnimFrame(tick);

    handleKeys();
	
	drawScene();
	
	animate();
}


//----------------------------------------------------------------------------
//
//  User Interaction
//

function outputInfos(){
}

//----------------------------------------------------------------------------
var currentlyPressedKeys = {};

function handleKeys() {
    //W
	if (currentlyPressedKeys[87]) {

		globalTz += Math.cos(radians(globalAngleYY)) * 0.1;
		globalTx += -Math.sin(radians(globalAngleYY)) * 0.1;
	}
    //A
    if (currentlyPressedKeys[65]) {
		globalTx += Math.cos(radians(globalAngleYY)) * 0.1;
		globalTz += Math.sin(radians(globalAngleYY)) * 0.1;
		
	}
    //S
    if (currentlyPressedKeys[83]) {
		globalTz -= Math.cos(radians(globalAngleYY)) * 0.1;
		globalTx -= -Math.sin(radians(globalAngleYY)) * 0.1;
		
		//globalTz -= 0.1;
    }
    //D
    if (currentlyPressedKeys[68]) {
		globalTx -= Math.cos(radians(globalAngleYY)) * 0.1;
		globalTz -= Math.sin(radians(globalAngleYY)) * 0.1;
		
	}
	
	//E
	if (currentlyPressedKeys[69]) {
		globalTy -= 0.1;
	}

	//Q
	if (currentlyPressedKeys[81]) {
		globalTy += 0.1;
	}
	
	//SPACEBAR
	if (currentlyPressedKeys[32]) {
		if(pyramidPos != null){
			sceneModels.splice(pyramidPos)
			pyramidPos = null
		}

		/*
		pyramidTrans = mult( translationMatrix( -globalTx, -globalTy, -globalTz ),
		rotationYYMatrix( -globalAngleYY ) );
		pyramidTrans = mult(rotationXXMatrix(-globalAngleXX), pyramidTrans)
		pyramidTrans = mult(rotationZZMatrix(-globalAngleZZ), pyramidTrans)
		*/
		pyramid = new simplepyramidViewerModel()
		//console.log(pyramid.vertices)
		//pyramid.applyTransformation(pyramidTrans)
		pyramid.applyTransformation(-globalTx, -globalTy, -globalTz, -globalAngleXX, -globalAngleYY, -globalAngleZZ)
		//console.log(pyramid.vertices)
		sceneModels.push(pyramid)
		
		pyramidPos = sceneModels.length - 1

		// Get the snackbar DIV
		var x = document.getElementById("snackbar");

		// Add the "show" class to DIV
		x.className = "show";
	
		// After 3 seconds, remove the show class from DIV
		setTimeout(function(){ x.className = x.className.replace("show", ""); }, 1500);

	}

}

// credits for this function: https://stackoverflow.com/questions/30970648/changing-hex-codes-to-rgb-values-with-javascript
function hex_to_RGB(hex) {
    var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    return {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16)
    };
}

function setEventListeners(canvas){

	canvas.onmousedown = handleMouseDown;
    
    document.onmouseup = handleMouseUp;
    
    document.onmousemove = handleMouseMove;

    document.onkeydown = function(event){
        currentlyPressedKeys[event.keyCode] = true;
    }

    document.onkeyup = function(event){
        currentlyPressedKeys[event.keyCode] = false;
    }
    
    document.getElementById("object-type").onchange = function(evt){
        var t = document.getElementById("object-type").selectedIndex;
        if(t == 2) document.getElementById("obj-file").click();
    }
	
    document.getElementById("object-form-predefined").onsubmit = function(evt){
        evt.preventDefault();

        var reader = new FileReader();
        
        reader.onload = function( progressEvent ){
            
            // Entire file read as a string
            
            // The file lines
            
            var lines = this.result.split('\n');
            
            // The new vertices
            
            var newVertices = [];
            
            // The new normal vectors
            
            var newNormals = [];
            
            // Check every line and store 

            for(var line = 0; line < lines.length; line++){
      
                // The tokens/values in each line

                // Separation between tokens is 1 or mode whitespaces

                var tokens = lines[line].split(/\s\s*/);
                
                // Array of tokens; each token is a string
                
                if( tokens[0] == "v" ) 
                {
                    // For every vertex we have 3 floating point values
            
                    for( j = 1; j < 4; j++ ) {
                    
                        newVertices.push( parseFloat( tokens[ j ] ) );
                    }
                }

                if( tokens[0] == "vn" ) 
                {
                    // For every normal we have 3 floating point values
            
                    for( j = 1; j < 4; j++ ) {
                    
                        newNormals.push( parseFloat( tokens[ j ] ) );
                    }
                }
            }	
                        
            // Assigning to the current model
            var model = new emptyModelFeatures();
            
            model.vertices = newVertices.slice();
            
            model.normals = newNormals.slice();
            
            // Checking to see if the normals are defined on the file
            
            if( model.normals.length == 0 )
            {
                computeVertexNormals( model.vertices, model.normals );
            }

            model.tx = Number(document.getElementById("x-pos").value);
            model.ty = Number(document.getElementById("y-pos").value);
            model.tz = Number(document.getElementById("z-pos").value);

            model.sx = model.sy = model.sz = document.getElementById("size-object").value;
                        
            // To render the model just read
            model.colors = [];
            var rgb = hex_to_RGB(document.getElementById("rgb-object").value);
            var colorArray = [rgb["r"]/255, rgb["g"]/255, rgb["b"]/255];
            
            while(model.colors.length < model.vertices.length){
                model.colors = model.colors.concat(colorArray);
            }

            sceneModels.push(model);
        }

        var model = null;

        var t = document.getElementById("object-type").selectedIndex;
        switch(t) {
            case 0: model = new cubeModel();
                break;
            case 1: model = new sphereModel();
                break;
            case 2: reader.readAsText( file );
                break;
        }

        if( t < 2 ){
            model.colors = [];
            var rgb = hex_to_RGB(document.getElementById("rgb-object").value);
            var colorArray = [rgb["r"]/255, rgb["g"]/255, rgb["b"]/255];
            
            while(model.colors.length < model.vertices.length){
                model.colors = model.colors.concat(colorArray);
            }
            
            model.tx = Number(document.getElementById("x-pos-predefined").value);
            model.ty = Number(document.getElementById("y-pos-predefined").value);
            model.tz = Number(document.getElementById("z-pos-predefined").value);
            model.sx = model.sy = model.sz = Number(document.getElementById("size-object").value);
                        
            sceneModels.push(model);
        }
    }

    document.getElementById("camera-frame").onclick = function(evt){
        var x = (evt.offsetX/500) - 1;
        var y = (evt.offsetY/500) + 0.6; 
        var vector = [x , y, 1];

        var origin = sceneModels[pyramidPos];
        
        var p2 = intersectionPoint( origin.ver[4], vector, sceneModels ); 
        if(p2 != null){
            var line = new lineModel();
            line.vertices = [];
            line.vertices.push(origin.tx);
            line.vertices.push(origin.ty);
            line.vertices.push(origin.tz);
            line.vertices.push(p2[0]);
            line.vertices.push(p2[1]);
            line.vertices.push(p2[2]);
   
            console.log(line.vertices);

            sceneModels.push(line);
        }
    }

    document.getElementById("light-form").onsubmit = function(evt){
        evt.preventDefault();

        var lightSource = new LightSource();
        var t = document.getElementById("light-type").selectedIndex;

        lightSource.setPosition( document.getElementById("x-pos-light").value , document.getElementById("y-pos-light").value, document.getElementById("z-pos-light").value, t);

        
        if (t < 2){
            var rgb = hex_to_RGB(document.getElementById("rgb-light").value);

            lightSource.setIntensity( rgb["r"]/255, rgb["g"]/255, rgb["b"]/255 );

            lightSource.setAmbIntensity( 0.0, 0.0, 0.0 );

            lightSources.push( lightSource );
        }
        
    }

	document.getElementById("obj-file").onchange = function(){
        file = this.files[0];
	}

    document.getElementById("reset-button").onclick = function(){
        sceneModels = sceneModels.slice(0,1);
        lightSources = lightSources.slice(0,1);
        globalAngleYY = 0.0;
        globalAngleXX = 0.0;
        globalAngleZZ = 0.0;
        globalTz = -2.5;
        globalTx = 0.0;
        globalTy = 0.0;
    }
}



//----------------------------------------------------------------------------

// Handling mouse events

// Adapted from www.learningwebgl.com


var mouseDown = false;

var lastMouseX = null;

var lastMouseY = null;

function handleMouseDown(event) {
	
    mouseDown = true;
  
    lastMouseX = event.clientX;
  
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {

    mouseDown = false;
}

function handleMouseMove(event) {

    if (!mouseDown) {
	  
      return;
    } 
  
    // Rotation angles proportional to cursor displacement
    
    var newX = event.clientX;
  
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    
    globalAngleYY -= radians( 10 * deltaX  )


    var deltaY = newY - lastMouseY;
    
    globalAngleXX -= radians( 10 * deltaY  )
	
	//globalTy += radians( 10 * deltaY  )/ 10

    lastMouseX = newX
    
    lastMouseY = newY;
  }
//----------------------------------------------------------------------------



//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL( canvas ) {
	try {
		
		// Create the WebGL context
		
		// Some browsers still need "experimental-webgl"
		
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		
		// DEFAULT: The viewport occupies the whole canvas 
		
		// DEFAULT: The viewport background color is WHITE
		
		// NEW - Drawing the triangles defining the model
		
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		
		// Enable FACE CULLING
		
		gl.enable( gl.CULL_FACE );
		
		// DEFAULT: The BACK FACE is culled!!
		
		// The next instruction is not needed...
		
		gl.cullFace( gl.BACK );
		
		// Enable DEPTH-TEST
		
		gl.enable( gl.DEPTH_TEST );
        
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	initWebGL( canvas );
    height = canvas.height;
    width = canvas.width;

	shaderProgram = initShaders( gl );
	
	setEventListeners(canvas);
	
	tick();		// A timer controls the rendering / animation    


	outputInfos();
}


