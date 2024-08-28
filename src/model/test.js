let is3Dduplicate = false;

function validFirstInput(input) {
    let trimmedInput = input.map(e => e.trim().slice(0, 1));
    if (trimmedInput.length !== 2 && trimmedInput.length !== 3) {
        throw Error("Invalid input length");
    }
    if (trimmedInput.length === 2) {
        for (let shape of ["c", "s", "t"]) {
            if (!trimmedInput.includes(shape)) {
                trimmedInput.push(shape);
                break;
            }
        }
    }
    if (!(trimmedInput.includes("t") && trimmedInput.includes("c") && trimmedInput.includes("s"))) {
        throw Error("Invalid symbols");
    }
    return trimmedInput;
}

function validSecondInput(input) {
    let validSymbols = ["sp", "cy", "co", "cu", "pr", "py"];
    let trimmedInput = input.map(e => e.trim().slice(0, 2));
    for (let symbol of trimmedInput) {
        if (!validSymbols.includes(symbol)) {
            throw Error("Invalid symbol");
        }
    }
    return trimmedInput;
}

function swap(arrangement, firstGroup, secondGroup, firstSymbol, secondSymbol) {
    if (!arrangement[firstGroup].includes(firstSymbol) ||
        !arrangement[secondGroup].includes(secondSymbol) ||
        firstSymbol === secondSymbol ||
        firstGroup === secondGroup) {
        throw Error("Invalid swap parameters");
    }
    arrangement[firstGroup] = arrangement[firstGroup].filter((symbol) => symbol !== firstSymbol);
    arrangement[firstGroup].push(secondSymbol);
    arrangement[secondGroup] = arrangement[secondGroup].filter((symbol) => symbol !== secondSymbol);
    arrangement[secondGroup].push(firstSymbol);
    return arrangement;
}

function generateSuccessors(arrangement) {
    let successors = [];
    let instructions = [];
    let swapGroups = [
        ["c", "t"],
        ["c", "s"],
        ["t", "c"],
        ["s", "c"],
        ["s", "t"],
        ["t", "s"]
    ];
    let positions = ["LEFT", "MID", "RIGHT"];
    let shapes = {
        s: "SQUARE",
        c: "CIRCLE",
        t: "TRIANGLE"
    };
    for (let [firstGroupIndex, secondGroupIndex] of [
        [0, 1],
        [0, 2],
        [1, 2]
    ]) {
        for (let [firstSymbol, secondSymbol] of swapGroups) {
            try {
                let newState = swap(JSON.parse(JSON.stringify(arrangement)), firstGroupIndex, secondGroupIndex, firstSymbol, secondSymbol);
                let instruction = `Excise ${shapes[firstSymbol]} from ${positions[firstGroupIndex]}, Excise ${shapes[secondSymbol]} from ${positions[secondGroupIndex]}`;
                successors.push(newState);
                instructions.push(instruction);
            } catch (error) {
                continue;
            }
        }
    }
    return [successors, instructions];
}

function nodeSuccess(currentState, targetState) {
    if (currentState.length !== targetState.length) {
        return false;
    }
    for (let i = 0; i < currentState.length; i++) {
        let setCurrent = new Set(currentState[i]);
        let setTarget = new Set(targetState[i]);
        if (!areSetsEqual(setCurrent, setTarget)) {
            return false;
        }
    }
    return true;
}

function areSetsEqual(setA, setB) {
    if (setA.size !== setB.size) {
        return false;
    }
    for (let item of setA) {
        if (!setB.has(item)) {
            return false;
        }
    }
    return true;
}

function generateSwaps(innerShapes, outerShapes) {
    let [successors, instructions] = (function findSolution(innerShapes, outerShapes) {
        let queue = [
            [innerShapes, []]
        ];
        let visited = new Set();
        while (queue.length > 0) {
            let [currentState, currentInstructions] = queue.shift();
            if (nodeSuccess(currentState, outerShapes)) {
                return [currentState, currentInstructions];
            }
            let currentStateString = JSON.stringify(currentState.map(group => group.join("")));
            if (visited.has(currentStateString)) {
                continue;
            }
            visited.add(currentStateString);
            let [newStates, newInstructions] = generateSuccessors(currentState);
            newStates.forEach((state, index) => {
                queue.push([state, currentInstructions.concat([newInstructions[index]])]);
            });
        }
        return [null, []];
    })(innerShapes, outerShapes);
    console.log("RESULT NODE IS:", successors);
    console.log("RESULT INSTRUCTIONS ARE:", instructions);
    return instructions;
}

function createOrder(innerShapes, outerShapes) {
    let mappedShapes = outerShapes.map(symbol => {
        switch (symbol) {
            case "sp":
                return ["c", "c"];
            case "cy":
                return ["c", "s"];
            case "co":
                return ["c", "t"];
            case "cu":
                return ["s", "s"];
            case "pr":
                return ["s", "t"];
            case "py":
                return ["t", "t"];
            default:
                throw Error("Invalid symbol");
        }
    });
    if (mappedShapes.length === 2) {
        let countMap = {
            c: 0,
            s: 0,
            t: 0
        };
        mappedShapes.forEach(group => {
            let joinedGroup = Array.isArray(group) ? group.join("") : group;
            ["c", "s", "t"].forEach(shape => {
                countMap[shape] += (joinedGroup.match(RegExp(shape, "g")) || []).length;
            });
        });
        let missingSymbols = [];
        Object.keys(countMap).forEach(shape => {
            for (let i = 0; i < 2 - countMap[shape]; i++) {
                missingSymbols.push(shape);
            }
        });
        mappedShapes.push(missingSymbols);
    }
    let nodeOrder = innerShapes.map(shape => {
        switch (shape) {
            case "c":
                return ["s", "t"];
            case "s":
                return ["c", "t"];
            case "t":
                return ["c", "s"];
            default:
                throw Error("Invalid shape");
        }
    });
    let swaps = generateSwaps(mappedShapes, nodeOrder);
    console.log("SWAPS ARE:", swaps);
    swaps.forEach((swapInstruction, index) => {
        console.log(`${index}. ${swapInstruction}`);
    });
}

// Example usage:
// Assuming command-line input or other forms of input handling for shapes and symbols
let innerShapes = ["c", "t", "s"];
let outerShapes = ["sp", "cy"];

try {
    innerShapes = validFirstInput(innerShapes);
    console.log("INSIDE SHAPES ARE:", innerShapes);
    outerShapes = validSecondInput(outerShapes);
    console.log("OUTSIDE SHAPES ARE:", outerShapes);
    console.log("SWAPS ARE:");
    createOrder(innerShapes, outerShapes);
    console.log("====================");
} catch (error) {
    console.error(error.message);
}
