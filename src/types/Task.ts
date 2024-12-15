import Example from "./Example";

export default interface Task {
    id: string;
    title: string;
    description: string;
    examples: Example[];
    note: string;
}
