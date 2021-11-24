let transformed = [];

const generateItem = (item) => {
    if (item.children.length <= 0) {
        return;
    }
    item.children.forEach((child) => {
        transformed.push(child);
        return generateItem(child);
    });
};

module.exports = (items) => {
    let nodes = [...items];

    //initialize children array for each object
    //set parent to 0 for sorting
    nodes.forEach((node) => {
        if (!node.parent) {
            node.parent = 0;
        }
        node.children = [];
    });

    //get children for each object
    nodes.forEach((node) => {
        node.children = [
            ...node.children,
            ...items.filter((item) => node.id === item.parent),
        ];
    });

    //sort object by their seqId
    nodes.sort((a, b) => {
        if (a.seqId < b.seqId) {
            return -1;
        }
        if (a.seqId > b.seqId) {
            return 1;
        }
        return 0;
    });

    //sort object by their parents
    nodes.sort((a, b) => {
        if (a.parent < b.parent) {
            return -1;
        }
        if (a.parent > b.parent) {
            return 1;
        }
        return 0;
    });

    //sort children for each object
    nodes.forEach((node) => {
        node.children.sort((a, b) => {
            if (a.seqId < b.seqId) {
                return -1;
            }
            if (a.seqId > b.seqId) {
                return 1;
            }
            return 0;
        });
    });

    //
    nodes.forEach((node) => {
        if (transformed.filter((e) => e.id === node.id).length === 0) {
            transformed.push(node);
            generateItem(node);
        }
    });

    //revert setting of 0 parent values to null
    transformed.forEach((item) => {
        delete item.children;
        if (item.parent === 0) {
            item.parent = null;
        }
    });

    return transformed;
};
