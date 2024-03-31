interface WorkflowObject {
  id?: string;
  name: string;
  description?: string;
  sources: Source[];
  operations: Operation[];
  connections: Connection[];
}
