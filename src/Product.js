class Product {
    constructor(price) {
        this.price = price || 0;
    }

    set name(name) {
        this.name = name;
    }

    get name() {
        return this.name;
    }
}
