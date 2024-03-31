interface WorkflowObject {
  id?: string;
  name: string;
  description?: string;
  sources: Source[];
  operations: Operation[];
  connections: Connection[];
}

interface RFState {
  position: Position;
  data: Data;
  computed: Computed;
  selected: boolean;
  dragging: boolean;
}

interface Operation {
  id: string;
  type: "Filter.filter" | "Filter.match" | "Filter.limit";
  params: Record<string, any>;
  sources: string[];
  tracks?: SpotifyApi.PlaylistTrackObject[];
  rfstate: RFState;
}
interface WorkflowResponse {
  id?: string;
  name: string;
  workflow?: WorkflowObject;
  cron?: string;
}
