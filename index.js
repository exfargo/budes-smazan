const no_decimal = "no-decimal";
const generate_amount = "generate-amount"
const max_range = "max-range"

const conversion_id = "conversions";
const options_id = "options";

const clear_conversions = () => document.getElementById(conversion_id).innerHTML = "";
const clear_options = () => document.getElementById(options_id).innerHTML = "";

const append_conversions = (node) => document.getElementById(conversion_id).append(node);
const append_options = (node) => document.getElementById(options_id).append(node);

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

class Unit {
    constructor(base_unit, derivatives) {
        this.base_unit = base_unit;
        this.derivatives = derivatives;
    }

    base_unit;
    derivatives;
}

class Value {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    name;
    value;
}

const units = [
    ["Délka", true,
        new Unit(
            new Value("m", 1),
            [
                new Value("Gm", 1.0E-9),
                new Value("Mm", 1.0E-6),
                new Value("km", 0.001),
                new Value("hm", 0.01),
                new Value("m", 1),
                new Value("dm", 1_0),
                new Value("cm", 1_00),
                new Value("mm", 1_000),
                new Value("µm", 1_000_000),
                new Value("nm", 1_000_000_000)
            ]
        )
    ],

    ["Obsah", false,
        new Unit(
            new Value("m^2", 1),
            [
                new Value("Gm^2", 1.0E-18),
                new Value("Mm^2", 1.0E-12),
                new Value("km^2", 1.0E-6),
                new Value("hm^2", 0.0001),
                new Value("ha", 1.0E-4),
                new Value("dam^2", 0.01),
                new Value("a", 0.01),
                new Value("m^2", 1),
                new Value("dm^2", 100),
                new Value("cm^2", 10_000),
                new Value("mm^2", 1_000_000),
                new Value("µm^2", 1_000_000_000_000),
                new Value("nm^2", 1_000_000_000_000_000_000)
            ]
        )
    ],

    ["Objem", false,
        new Unit(
            new Value("m^3", 1),
            [
                new Value("km^3", 1.0E-9),
                new Value("hm^3", 1.0E-6),
                new Value("dam^3", 1.0E-3),

                new Value("m^3", 1),

                new Value("kl", 1),
                new Value("hl", 10),
                new Value("dal", 100),

                new Value("l", 1.0E3),
                new Value("dm^3", 1.0E3),

                new Value("dl", 1.0E4),
                new Value("cl", 1.0E5),

                new Value("cm^3", 1.0E6),
                new Value("ml", 1.0E6),

                new Value("mm^3", 1.0E9),
            ]
        )
    ],

    ["Váha", false,
        new Unit(
            new Value("g", 1),
            [
                new Value("Gg", 1.0E-9),
                new Value("Mh", 1.0E-6),
                new Value("t", 1.0E-6),
                new Value("q", 1.0E-5),
                new Value("kg", 0.001),
                new Value("hg", 0.01),
                new Value("g", 1),
                new Value("dg", 1_0),
                new Value("cg", 1_00),
                new Value("mg", 1_000),
                new Value("µg", 1_000_000),
                new Value("ng", 1_000_000_000)
            ]
        )
    ],

    ["Čas", false,
        new Unit(
            new Value("s", 1),
            [
                new Value("d", 1 / (31536000)),
                new Value("d", 1 / (86400)),
                new Value("h", 1 / 3600),
                new Value("m", 1 / 60),
                new Value("s", 1),
                new Value("ms", 1000),
                new Value("µs", 1.0E6),
                new Value("ns", 1.0E9),
                new Value("ps", 1.0E12),
            ]
        )]
];

window.onload = () => {
    clear_options()
    for (const unit of units) {

        const node = document.createElement("div")
        const label = document.createElement("label")
        const input = document.createElement("input")

        input.type = "checkbox"
        input.id = "label" + unit[0]
        label.for = "label" + unit[0]
        label.innerHTML = unit[0]
        input.defaultChecked = unit[1]

        input.onchange = () => {
            unit[1] = !unit[1]
        }

        node.append(label)
        node.append(input)
        append_options(node)
    }
}

function generate_conversion() {
    clear_conversions();
    const gen_amount = document.getElementById(generate_amount).value;
    const n_decimal = document.getElementById(no_decimal).checked;
    const m_range = document.getElementById(max_range).value;

    for (const unit of units) {
        if (unit[1] !== false) {
            const node = document.createElement("div");
            const heading = document.createElement("h2");
            heading.innerText = unit[0];
            node.append(heading);
            for (let i = 0; i < gen_amount; i++) {
                node.append(generate(unit[2].derivatives, n_decimal, m_range));
            }
            append_conversions(node);
        }
    }
}

function generate(unit, n_decimal, max_range) {
    const node = document.createElement("span");
    let from;
    let to;
    if (max_range === -1) {
        from = unit[randomNumber(0, unit.length)];
        to = unit[randomNumber(0, unit.length)];
    } else {
        const fi = randomNumber(0, unit.length)
        from = unit[fi]
        let ti = fi + randomNumber(-max_range, max_range)
        while (ti < 0 || ti >= unit.length) {
            ti = fi * randomNumber(-max_range, max_range)
        }
        to = unit[ti]
    }

    let value = 0
    if (n_decimal === true) {
        let f = (from.value < 0 ? 1 / from.value : from.value)
        let t = (to.value < 0 ? 1 / to.value : to.value)
        let z = f < t? t/f : f/t;
        console.debug(z)
        value = 0; // TODO generate value that won't have decimal part after transformation
    } else {
        value = 0; // TODo generate any arbitrary value
    }

    node.innerText = value.toLocaleString() + from.name + " => ______ " + to.name;
    return node
}
