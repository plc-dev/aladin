const createIdGenerator = () => {
    const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","m","n","o","p","q","r","s","t","u","v","w","y","z"];
    const number = [0,1,2,3,4,5,6,7,8,9];
    function* idGenerator(alphabet, number) {
        for(let i = 0; i < alphabet.length; i++) {
            for (let j = 0; j < number.length; j++) {
                const id = alphabet[i] + number[j].toString();
                yield id;
            }
        }
    }
    return idGenerator(alphabet, number);
};

const generateFloatInRange = (min, max) => {
    return Math.random() * (max-min) + min;
}

const generateWeight = (minWeight, maxWeight) => {
    return generateFloatInRange(minWeight,maxWeight);
};

const generateCoordinate = scale => {
    const coordinatesObject = Object.keys({x: 0, y: 0}).reduce((coordinates, key) => {
        coordinates[key] = generateFloatInRange(...scale);
        return coordinates;
    }, {x: 0, y: 0});

    return coordinatesObject;
};

const generateAttribute = attribute => {
    const attributePicker = {
        celsius: [-273.15, 10000000],
        height: [-11000, 9000]
    }

    if (Object.keys(attributePicker).includes(attribute)) {
        return generateFloatInRange(...attributePicker[attribute])
    }

    throw Error("falsche Eingabe");
};

const generateNode = (attribute, idGenerator, isUnmeasuredNode, scale) => {
    const {value} = idGenerator.next();
    return {
        id: value,
        coordinates: generateCoordinate(scale),
        attribute: generateAttribute(attribute),
        is_known: isUnmeasuredNode
    };
};

const scaleWeight = (weight, scale, userScale) => {
    const [min, max] = scale;
    const range = max - min;

    const [weightMin, weightMax] = userScale;
    const weightRange = weightMax - weightMin;

    // scales the user defined weight range to a predefined range, that describes the drawn graph in the GUI
    return (((weight - weightMin) * range) / weightRange) + min;
}

const generateVertice = (unmeasuredNode, measuredNode, scale, userScale) => {
    const weight = generateWeight(...userScale);
    return {
        from: unmeasuredNode.id,
        to: measuredNode.id,
        weight,
        scaledDistance: scaleWeight(weight, scale, userScale)
    };
};

const generateTree = (nodeAmount, attribute, userScale) => {
    const idGenerator = createIdGenerator();
    const scale = [0,100];

    const nodes = [];
    const vertices = [];
    for (let i = 0; i < nodeAmount; i++) {
        let node
        if (i == 0) {
            node = generateNode(attribute, idGenerator, false, scale, userScale);
        } else {
            node = generateNode(attribute, idGenerator, true, scale, userScale);
            vertices.push(generateVertice(nodes[0], node, scale, userScale));
        }
        nodes.push(node);
    }

    return {
        nodes, 
        vertices
    };
};