export type EquationType = "affine" | "trinomial";
type Listener = (val: EquationType) => void;

let equationType: EquationType = "affine";
let initialized = false;
let listeners: Listener[] = [];

function init() {
    const storageVal = localStorage.getItem("equationType")
    equationType = storageVal !== null ? storageVal as EquationType : "affine";

    initialized = true;
}

export function getValue() {
    if(!initialized) init();
    return equationType;
}

export function setValue(val: EquationType) {
    equationType = val;
    localStorage.setItem("equationType", equationType);

    listeners.forEach(l => l(equationType));
}

export function addChangeListener(cb: Listener) {
    if(!initialized) init();

    listeners.push(cb);
}

export function removeChangeListener(cb: Listener) {
    if(!initialized) init();

    // keep all listeners that do not equal the one passed as argument.
    listeners = listeners.filter(l => l !== cb);
}