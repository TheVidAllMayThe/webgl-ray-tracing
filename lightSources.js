//////////////////////////////////////////////////////////////////////////////
//
//  A class for instantiating light sources.
//
//  J. Madeira - Oct. 2015 + November 2017
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Constructor
//

function LightSource( ) {
	
	// A new light source is always on
	
	this.isOn = true;
	
	// And is directional
	
	this.position = [ 0.0, 0.0, 1.0, 0.0 ];
	
	// White light
	
	this.intensity = [ 1.0, 1.0, 1.0 ];
	
	// Ambient component
	
	this.ambientIntensity = [ 0.2, 0.2, 0.2 ];
	
	// Animation controls
	
	this.rotXXOn = false;
	
	this.rotYYOn = false;
	
	this.rotZZOn = false;
	
	// Rotation angles	
	
	this.rotAngleXX = 0.0;
	
	this.rotAngleYY = 0.0;
	
	this.rotAngleZZ = 0.0;	
	
	// NEW --- Rotation speed factor - Allow different speeds
	
	this. rotationSpeed = 1.0;
}

//----------------------------------------------------------------------------
//
//  Methods
//

LightSource.prototype.isOff = function() {
	
	return this.isOn == false;
}

LightSource.prototype.switchOn = function() {
	
	this.isOn = true;
}

LightSource.prototype.switchOff = function() {
	
	this.isOn = false;
}

LightSource.prototype.isDirectional = function() {
	
	return this.position[3] == 0.0;
}

LightSource.prototype.getPosition = function() {
	
	return this.position;
}

LightSource.prototype.setPosition = function( x, y, z, w ) {
	
	this.position[0] = x;
	
	this.position[1] = y;
	
	this.position[2] = z;
	
	this.position[3] = w;
}

LightSource.prototype.getIntensity = function() {
	
	return this.intensity;
}

LightSource.prototype.setIntensity = function( r, g, b ) {
	
	this.intensity[0] = r;
	
	this.intensity[1] = g;
	
	this.intensity[2] = b;
}

LightSource.prototype.getAmbIntensity = function() {
	
	return this.ambientIntensity;
}

LightSource.prototype.setAmbIntensity = function( r, g, b ) {
	
	this.ambientIntensity[0] = r;
	
	this.ambientIntensity[1] = g;
	
	this.ambientIntensity[2] = b;
}

LightSource.prototype.isRotYYOn = function() {
	
	return this.rotYYOn;
}

LightSource.prototype.isRotXXOn = function() {
	
	return this.rotXXOn;
}

LightSource.prototype.isRotZZOn = function() {
	
	return this.rotZZOn;
}

LightSource.prototype.switchRotYYOn = function() {
	
	this.rotYYOn = true;
}

LightSource.prototype.switchRotYYOff = function() {
	
	this.rotYYOn = false;
}

LightSource.prototype.switchRotXXOn = function() {
	
	this.rotXXOn = true;
}

LightSource.prototype.switchRotXXOff = function() {
	
	this.rotXXOn = false;
}

LightSource.prototype.switchRotZZOn = function() {
	
	this.rotZZOn = true;
}

LightSource.prototype.switchRotZZOff = function() {
	
	this.rotZZOn = false;
}

LightSource.prototype.getRotAngleYY = function() {
	
	return this.rotAngleYY;
}

LightSource.prototype.setRotAngleYY = function( angle ) {
	
	this.rotAngleYY = angle;
}

LightSource.prototype.getRotAngleXX = function() {
	
	return this.rotAngleXX;
}

LightSource.prototype.setRotAngleXX = function( angle ) {
	
	this.rotAngleXX = angle;
}

LightSource.prototype.getRotAngleZZ = function() {
	
	return this.rotAngleZZ;
}

LightSource.prototype.setRotAngleZZ = function( angle ) {
	
	this.rotAngleZZ = angle;
}

LightSource.prototype.getRotationSpeed = function() {
	
	return this.rotationSpeed;
}

LightSource.prototype.setRotationSpeed = function( s ) {
	
	this.rotationSpeed = s;
}

// COMPLETE THE MISSING METHODS !!


//----------------------------------------------------------------------------
//
//  Instantiating light sources
//

var lightSources = [];

lightSources.push(new LightSource());
lightSources[0].setIntensity(0.0,0.0,0.0);
lightSources[0].setAmbIntensity(1.0, 1.0, 1.0);
