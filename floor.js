floor = new emptyModelFeatures();
floor.rotXXOn = false
floor.rotYYOn = false
floor.rotZZOn = false
floor.sx = floor.sy = floor.sz = 1.0

/*
for(let i = -25; i< 25; i++){
    tmpsq = new simpleSquareModel()
    for(let indx = 0; indx < tmpsq.vertices.length/3; indx++){
        tmpsq.vertices[indx*3] *= 0.24
        tmpsq.vertices[indx*3 + 1] *= 0.24
        tmpsq.vertices[indx*3 + 2] *= 0.24
        //tmpsq.vertices[indx*3] += k * 0.5
        tmpsq.vertices[indx*3 + 1] += -1.0
        tmpsq.vertices[indx*3 + 2] += i * 0.5
        
        tmpsq.colors[indx*3] = tmpsq.colors[indx*3 + 1] = tmpsq.colors[indx*3 + 2] = (i%2) ? 0.0 : 0.5 
    }
    floor.vertices = floor.vertices.concat(tmpsq.vertices)
    floor.colors = floor.colors.concat(tmpsq.colors)

}
*/

for(let i = -25; i< 25; i++){
    for(let k = -25; k< 25; k++){
        tmpsq = new simpleSquareModel()
        for(let indx = 0; indx < tmpsq.vertices.length/3; indx++){
            tmpsq.vertices[indx*3] *= 0.24
            tmpsq.vertices[indx*3 + 1] *= 0.24
            tmpsq.vertices[indx*3 + 2] *= 0.24
            tmpsq.vertices[indx*3] += k * 0.5
            tmpsq.vertices[indx*3 + 1] += -1.0
            tmpsq.vertices[indx*3 + 2] += i * 0.5
            
            tmpsq.colors[indx*3] = tmpsq.colors[indx*3 + 1] = tmpsq.colors[indx*3 + 2] = (i%2) ? 0.0 : 0.5 
        }
        floor.vertices = floor.vertices.concat(tmpsq.vertices)
        floor.colors = floor.colors.concat(tmpsq.colors)
    }
}

console.log(floor.vertices)

computeVertexNormals( floor.vertices, floor.normals)
sceneModels.push(floor)

