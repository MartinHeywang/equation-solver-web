import { EquationData, solveEquation } from "./equationSolver";
import * as equationType from "./equationTypeChooser";

declare global {
    interface ObjectConstructor {
        typedKeys<T>(obj: T): Array<keyof T>;
    }
}

Object.typedKeys = <T>(v: T) => Object.keys(v) as Array<keyof T>;

const querySelector = <T extends Element>(s: string) => document.querySelector<T>(s);

// "e" stands for elements (in contrary to "v" for values)
const e = {
    equation: {
        type: {
            affine: querySelector<HTMLButtonElement>(".equation__type--affine")!,
            trinomial: querySelector<HTMLButtonElement>(".equation__type--trinomial")!,
        },
        def: {
            affine: {
                full: querySelector<HTMLParagraphElement>(".equation__def--affine")!,
                a: querySelector<HTMLSpanElement>(".equation__def-affine-a")!,
                b: querySelector<HTMLSpanElement>(".equation__def-affine-b")!,
                y: querySelector<HTMLSpanElement>(".equation__def-affine-y")!,
            },
            trinomial: {
                full: querySelector<HTMLParagraphElement>(".equation__def--trinomial")!,
                a: querySelector<HTMLSpanElement>(".equation__def-trinomial-a")!,
                b: querySelector<HTMLSpanElement>(".equation__def-trinomial-b")!,
                c: querySelector<HTMLSpanElement>(".equation__def-trinomial-c")!,
                y: querySelector<HTMLSpanElement>(".equation__def-trinomial-y")!,
            },
        },
    },
    compute: querySelector<HTMLButtonElement>(".compute")!,
    result: {
        zone: querySelector<HTMLDivElement>(".result__zone")!,
        count: querySelector<HTMLParagraphElement>(".result__count")!,
        solutions: querySelector<HTMLParagraphElement>(".result__solutions")!,
    },
};

e.equation.type.affine.addEventListener("click", () => equationType.setValue("affine"));
e.equation.type.trinomial.addEventListener("click", () => equationType.setValue("trinomial"));

function changeSelectedEquationType(newValue: equationType.EquationType) {
    Object.typedKeys(e.equation.type).forEach(type => {
        e.equation.type[type].classList.remove("button-group-option--selected");
    });
    Object.typedKeys(e.equation.def).forEach(type => {
        e.equation.def[type].full.style.display = "none";
    });

    e.equation.type[newValue].classList.add("button-group-option--selected");
    e.equation.def[newValue].full.style.display = "";
}

equationType.addChangeListener(changeSelectedEquationType);
changeSelectedEquationType(equationType.getValue());

e.compute.addEventListener("click", () => {
    const type = equationType.getValue();

    const data: EquationData = {
        type,
        a: undefined,
        b: undefined,
        y: undefined,
    };

    Object.typedKeys(e.equation.def[type]).forEach(part => {
        if (part === "full") return;

        data[part] = parseFloat(e.equation.def[type][part].textContent || "0");
    });

    const solutions = solveEquation(data);

    e.result.count.innerHTML = `
        There ${solutions.length !== 1 ? "are" : "is"} ${solutions.length} solution to this equation!`;
    e.result.solutions.innerHTML = `<strong>${solutions.join("</strong>, <strong>")}</strong>`;
    e.result.zone.classList.add("result__zone--complete");
});
