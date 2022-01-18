import { EquationType } from "./equationTypeChooser";

export type EquationData = {
    type: EquationType | undefined;
    a: number | undefined;
    b: number | undefined;
    c?: number;
    y: number | undefined;
};

export type Solver = (data: EquationData) => number[];

const solvers = {
    affine: ({ a, b, y }: EquationData) => {
        if (a === undefined) return [];
        if (a === 0) return b === y ? [Infinity] : [];

        return [(-(b || 0) + (y || 0)) / a];
    },
    trinomial: ({ a, b, c, y }: EquationData) => {
        if (a === undefined) return [];
        if (a === 0) return b === y ? [Infinity] : [];

        const delta = Math.pow(-(b || 0), 2) - 4 * a * ((c || 0) - (y || 0));

        if (delta > 0) {
            const x1 = (-(b || 0) - Math.sqrt(delta)) / (2 * a);
            const x2 = (-(b || 0) + Math.sqrt(delta)) / (2 * a);

            return [x1, x2];
        }
        if (delta === 0) {
            const x0 = -(b || 0) / a;
            
            return [x0];
        }
        return [];
    },
};

export function solveEquation(data: EquationData) {
    if (!data.type) return [];
    return solvers[data.type](data);
}
