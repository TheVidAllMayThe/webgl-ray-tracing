//////////////////////////////////////////////////////////////////////////////
//
//  Functions for processing triangle mesh models
//
//	NEW VERSION - Handling just vertex coordinates
//
//  J. Madeira - Oct. 2015 + Nov. 2018
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Recursive triangle subdivision, using the midpoints of edges
//

function recSubdivisionMidPoint( v1, v2, v3, 
								 coordsArray,
								 recursionDepth ) {

	// Recursive midpoint subdivision of one triangle
	
	if( recursionDepth == 0 ) {
		
		// Storing coordinates and colors in the destination arrays
 
        coordsArray.push( v1[0], v1[1], v1[2] );
		
		coordsArray.push( v2[0], v2[1], v2[2] );
		
		coordsArray.push( v3[0], v3[1], v3[2] );
	}
	else {
		
		// Compute the midpoints and proceed recursively
		
        var mid12 = computeMidPoint( v1, v2 );

        var mid23 = computeMidPoint( v2, v3 );
        
        var mid31 = computeMidPoint( v3, v1 );
                
        // 4 recursive calls 

        recSubdivisionMidPoint( v1, mid12, mid31,
                                coordsArray, recursionDepth - 1 );

        recSubdivisionMidPoint( v2, mid23, mid12,
                                coordsArray, recursionDepth - 1 );

        recSubdivisionMidPoint( v3, mid31, mid23,
                                coordsArray, recursionDepth - 1 );

        recSubdivisionMidPoint( mid12, mid23, mid31,
                                coordsArray, recursionDepth - 1 );
	}
}

//----------------------------------------------------------------------------

function midPointRefinement( coordsArray, 
						     recursionDepth ) {
	
	// Mesh refinement - Higher-level function
	
	// Each triangle is subdivided into 4 smaller ones - Lower-level recursive function
	
	// Vertices are duplicated, whenever needed !!
	
	// recursionDepth controls the final number of triangles and vertices 
    
    var origArrayLength = coordsArray.length;

    // Copying
    
    var origCoords = coordsArray.slice();
    
    // Clearing the arrays
    
    coordsArray.splice( 0, origArrayLength );
    
    var origIndex;
    
    // Each triangle is recursively subdivided into 4 triangles
    
    // Iterate through the original triangular faces
    
    for( origIndex = 0; origIndex < origArrayLength; origIndex += 9 )
    {
        /* Call the recursive subdivision function */
        
        recSubdivisionMidPoint( origCoords.slice( origIndex, origIndex + 3 ),
								origCoords.slice( origIndex + 3, origIndex + 6 ),
								origCoords.slice( origIndex + 6, origIndex + 9 ),
								coordsArray,
								recursionDepth );
    }
}

//----------------------------------------------------------------------------
////  Recursive triangle subdivision, using the triangle centroid
//

function recSubdivisionCentroid( v1, v2, v3, 
								 coordsArray,
								 recursionDepth ) {

	// Recursive centroid subdivision of one triangle
	
	if( recursionDepth == 0 ) {
		
		// Storing coordinates and colors in the destination arrays
 
        coordsArray.push( v1[0], v1[1], v1[2] );
		
		coordsArray.push( v2[0], v2[1], v2[2] );
		
		coordsArray.push( v3[0], v3[1], v3[2] );
	}
	else {
		
		// Compute the centroid and proceed recursively
		
        var centroid = computeCentroid( v1, v2, v3 );

        // 3 recursive calls 

        recSubdivisionCentroid( v1, v2, centroid,
                                coordsArray, recursionDepth - 1 );

        recSubdivisionCentroid( v2, v3, centroid,
                                coordsArray, recursionDepth - 1 );

        recSubdivisionCentroid( v3, v1, centroid,
                                coordsArray, recursionDepth - 1 );
    }
}

//----------------------------------------------------------------------------

function centroidRefinement( coordsArray, 
						     recursionDepth ) {
	
	// Mesh refinement - Higher-level function
	
	// Each triangle is subdivided into 3 smaller ones - Lower-level recursive function
	
	// Vertices are duplicated, whenever needed !!
	
	// recursionDepth controls the final number of triangles and vertices 
    
    var origArrayLength = coordsArray.length;

    // Copying
    
    var origCoords = coordsArray.slice();
    
    // Clearing the arrays
    
    coordsArray.splice( 0, origArrayLength );
    
    var origIndex;
    
    // Each triangle is recursively subdivided into 3 triangles
    
    // Iterate through the original triangular faces
    
    for( origIndex = 0; origIndex < origArrayLength; origIndex += 9 )
    {
        /* Call the recursive subdivision function */
        
        recSubdivisionCentroid( origCoords.slice( origIndex, origIndex + 3 ),
								origCoords.slice( origIndex + 3, origIndex + 6 ),
								origCoords.slice( origIndex + 6, origIndex + 9 ),
								coordsArray,
								recursionDepth );
    }
}

//----------------------------------------------------------------------------
//
//  Moving vertices to the spherical surface of radius 1
//

function moveToSphericalSurface( coordsArray ) {
	
	// Each vertex is moved to the spherecial surface of radius 1
    // and centered at (0,0,0)
    
    // This is done by handling each vertex as if it were a prosition vector,
    // and normalizing
	
    var arrayLength = coordsArray.length;
    
    for( origIndex = 0; origIndex < arrayLength; origIndex += 3 )
    {
        var v =  coordsArray.slice( origIndex, origIndex + 3 );
        
        normalize( v );
        
        var i;
        
        for( i = 0; i < 3; i++ ) {
            
            coordsArray[origIndex + i] = v[i];
        }
    }
}

//----------------------------------------------------------------------------
//
//  NEW --- Computing the triangle unit normal vector
//
//  And associating to every vertex
//

function computeVertexNormals( coordsArray, normalsArray ) {
	
	// Clearing the new normals array
	
	normalsArray.splice( 0, normalsArray.length );
	
    // Taking 3 vertices from the coordinates array 

    for( var index = 0; index < coordsArray.length; index += 9 )
    {
		// Compute unit normal vector for each triangle
			
        var normalVector = computeNormalVector( coordsArray.slice(index, index + 3),
												coordsArray.slice(index + 3, index + 6),
												coordsArray.slice(index + 6, index + 9) );

        // Store the unit normal vector for each vertex 

        for( var j = 0; j < 3; j++ )
        {
            normalsArray.push( normalVector[0], normalVector[1], normalVector[2] ); 
		}
	}
}

function isPointInTriangle( point, triangle, N ){
    var A = triangle.slice(0,3);
    var B = triangle.slice(3,6);
    var C = triangle.slice(6,9);
    var PC = [point[0] - C[0], point[1] - C[1], point[2] - C[2]];
    var PB = [point[0] - B[0], point[1] - B[1], point[2] - B[2]];
    var PA = [point[0] - A[0], point[1] - A[1], point[2] - A[2]];
    var a = dotProduct(N, crossProduct(PB, PC));
    var b = dotProduct(N, crossProduct(PC, PA));
    var c = dotProduct(N, crossProduct(PA, PB));
    return a >= 0 && b >= 0 && c >= 0;
}

function distance(a, b){
    return Math.pow(Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2) + Math.pow(a[2]-b[2],2) , 0.5);

}

function crossProduct(a, b){
    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
}

function dotProduct(a, b){
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function intersectionPoint( origin, directionVector, model) {
    var result = null;
    var minDistance = Math.max();
    var normalsArray = [];
    computeVertexNormals( model.vertices, normalsArray );
    
    for( var index = 0; index < model.vertices.length; index += 9){
        //vector normal to plane
        var n = [normalsArray[index], normalsArray[index+1] ,normalsArray[index+2]];
        //point in plane
        //HOW TO APPLY ROTATION
        var p0 = [model.sx*model.vertices[index]+Number(model.tx) , model.sy*model.vertices[index+1]+Number(model.ty), model.sz*model.vertices[index+2]+Number(model.tz)];
        
        var ln = dotProduct(n, directionVector);
        //if ln == 0 then plane and line are parallel
        if( ln != 0 ){
            var p0l0 = [p0[0] - origin[0], p0[1] - origin[1], p0[2] - origin[2]];
            var d = dotProduct(p0l0, n) / ln;

            //Point of intersection of plane and line
            var intersectPoint = [ d*directionVector[0] + origin[0], d*directionVector[1] + origin[1], d*directionVector[2] + origin[2]  ];
            
            //In case point is indeed in the triangle then see if it's the closest one to the origin point so far
            var triangleVertices = model.vertices.slice(index, index+9);
            for (var j = 0; j < triangleVertices.length; j += 3){
                triangleVertices[j] = model.sx*triangleVertices[j] + Number(model.tx);
                triangleVertices[j+1] = model.sy*triangleVertices[j+1] + Number(model.ty);
                triangleVertices[j+2] = model.sz*triangleVertices[j+2] + Number(model.tz);
            }
            if ( isPointInTriangle( intersectPoint, triangleVertices ,n )){
                if (result == null){
                    result = intersectPoint;
                }
                else{
                   if (distance(intersectPoint, origin) < minDistance){
                        minDistance = distance(intersectPoint, origin);
                        result = intersectPoint;
                    }
                }
            }
        }
    }
    return result;
}

