const wro = require("weighted-random-object"),
    add = (name, weight) => {
        return { name, weight };
    };

const list = [
 // Add the list here. 
]

const getItems = () => {
    const item = wro(list);
    return item
}

module.exports = {
    getItems,
    list
}