const no_decimal = "no-decimal";
const generate_amount = "generate-amount"
const max_range = "max-range"
const range = "range"

const conversion_id = "conversions";
const options_id = "options";

const clear_conversions = () => document.getElementById(conversion_id).innerHTML = "";
const clear_options = () => document.getElementById(options_id).innerHTML = "";

const append_conversions = (node) => document.getElementById(conversion_id).append(node);
const append_options = (node) => document.getElementById(options_id).append(node);

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

class Unit {
    base_unit;
    derivatives;

    constructor(base_unit, derivatives) {
        this.base_unit = base_unit;
        this.derivatives = derivatives;
    }
}

class Value {
    name;
    value;
    exponent;

    constructor(name, value, exponent) {
        this.name = name;
        this.value = value;
        this.exponent = exponent;
    }
}

const units = [["Délka", true, new Unit(new Value("m", 1), [new Value("Gm", 1.0E-9, 5), new Value("Mm", 1.0E-6, 4), new Value("km", 0.001, 3), new Value("hm", 0.01, 2), new Value("dam", 0.1, 1), new Value("m", 1, 0), new Value("dm", 1_0, -1), new Value("cm", 1_00, -2), new Value("mm", 1_000, -3), new Value("µm", 1_000_000, -4), new Value("nm", 1_000_000_000, -5)])],

    ["Obsah", false, new Unit(new Value("m^2", 1), [new Value("Gm^2", 1.0E-18, 5), new Value("Mm^2", 1.0E-12, 4), new Value("km^2", 1.0E-6, 3), new Value("hm^2", 0.0E-4, 2), new Value("ha", 1.0E-4, 2), new Value("dam^2", 0.01, 1), new Value("a", 0.01, 1), new Value("m^2", 1, 0), new Value("dm^2", 100, -1), new Value("cm^2", 10_000, -2), new Value("mm^2", 1_000_000, -3), new Value("µm^2", 1_000_000_000_000, -4), new Value("nm^2", 1_000_000_000_000_000_000, -5)])],

    ["Objem", false, new Unit(new Value("m^3", 1), [new Value("km^3", 1.0E-9, 3), new Value("hm^3", 1.0E-6, 2), new Value("dam^3", 1.0E-3, 1),

        new Value("m^3", 1, 0),

        new Value("kl", 1, 0), new Value("hl", 10, -1), new Value("dal", 100, -2),

        new Value("l", 1.0E3, -3), new Value("dm^3", 1.0E3, -3),

        new Value("dl", 1.0E4, -4), new Value("cl", 1.0E5, -5),

        new Value("cm^3", 1.0E6, -6), new Value("ml", 1.0E6, -6),

        new Value("mm^3", 1.0E9, -7),])],

    ["Váha", false, new Unit(new Value("g", 1), [new Value("Gg", 1.0E-9, 5), new Value("Mh", 1.0E-6, 4), new Value("t", 1.0E-6, 4), new Value("q", 1.0E-5, 3), new Value("kg", 0.001, 2), new Value("hg", 0.01, 1), new Value("g", 1, 0), new Value("dg", 1_0, -1), new Value("cg", 1_00, -2), new Value("mg", 1_000, -3), new Value("µg", 1_000_000, -4), new Value("ng", 1_000_000_000, -5)])],

    ["Čas", false,
        new Unit(
            new Value("s", 1),
            [
                new Value("r", 1 / (31536000), 4),
                new Value("d", 1 / (86400), 3),
                new Value("h", 1 / 3600, 2),
                new Value("m", 1 / 60, 1),
                new Value("s", 1, 0),
                new Value("ms", 1000, -1),
                new Value("µs", 1.0E6, -2),
                new Value("ns", 1.0E9, -3),
                new Value("ps", 1.0E12, -4),]
        )
    ]
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
    const i_range = document.getElementById(range).checked;

    for (const unit of units) {
        if (unit[1] !== false) {
            const node = document.createElement("div");
            const heading = document.createElement("h2");
            heading.innerText = unit[0];
            node.append(heading);
            for (let i = 0; i < gen_amount; i++) {
                node.append(generate(unit[2].derivatives, n_decimal, i_range, m_range));
            }
            append_conversions(node);
        }
    }
}

function generate(unit, n_decimal, range, max_range) {
    const node = document.createElement("span");
    let from;
    let to;
    let value = 0;
    while (value === 0) {
        if (range === true && max_range > 0) {
            let from_index = randomNumber(0, unit.length);
            let x = unit.filter((it) => {
                return Math.abs(it.exponent - unit[from_index].exponent) <= max_range
            })
            from = unit[from_index]
            do {
                to = x[randomNumber(0, x.length)]
            } while (from === to)
        } else {
            from = unit[randomNumber(0, unit.length)];
            do {
                to = unit[randomNumber(0, unit.length)];
            } while (from === to)
        }

        let f = 0;
        let t = 0;
        if (from.value % 1 !== 0) {
            f = Math.pow(from.value, -1)
        } else {
            f = from.value
        }
        if (to.value % 1 !== 0) {
            t = Math.pow(to.value, -1)
        } else {
            t = to.value
        }

        if (to.value > from.value) {
            value = randomNumber(1, 100) / (to.value / from.value)
        } else {
            value = randomNumber(1, 100) / 10 * (from.value / to.value)
        }
    }

    console.debug(from.value + " / " + to.value + " = " + (to.value / from.value))
    console.debug(value)

    if (value < 1) {
        value = (value.toFixed(regexIndexOf(value.toLocaleString({}, {maximumFractionDigits: 20}), "[1-9]") - 1))
    } else {
        value = Math.round(value)
    }
    node.innerText = value + from.name + " => ______ " + to.name;
    return node
}


function regexIndexOf(string, regex, startpos) {
    var indexOf = string.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}