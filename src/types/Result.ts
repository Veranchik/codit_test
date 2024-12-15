export default interface Result {
    taskId: string;
    status: 'success' | 'failure';
    error?: string;
    output?: string;
}
