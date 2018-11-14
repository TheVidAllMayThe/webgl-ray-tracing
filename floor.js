for(let i = 0; i< 50; i++){
        sceneModels.push(new simpleSquareModel())
        sceneModels[i].rotXXOn = false
        sceneModels[i].rotYYOn = false
        sceneModels[i].rotZZOn = false
        sceneModels[i].sx = sceneModels[i].sy = sceneModels[i].sz = 0.24
        sceneModels[i].ty = -1.0
        sceneModels[i].tz = i < 25 ? - 0.5 * (25 - i) : 0.5 * (i - 25)
}

/*
sq = new simpleSquareModel()
sq.rotXXOn = false
sq.rotYYOn = false
sq.rotZZOn = false

sceneModels.push(sq)
*/