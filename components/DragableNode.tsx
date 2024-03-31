import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addNode } from "@/redux/features/nodeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { GripVertical, InfoIcon } from "lucide-react";
import { addEdge } from "reactflow";

type DragableNodeProps = {
  nodeType: string;
  title: string;
  description: string;
  type: string;
};
export const DragableNode = ({
  nodeType,
  title,
  description,
  type,
}: DragableNodeProps) => {

  const dispatch = useAppDispatch()

  const onDragStart = (event) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const { node } = useAppSelector(state => ({
    node: state.node
  })
  )

  const { nodes } = node

  const onClick = async (event: Event) => {
    event.preventDefault();
    const newNodePosition =
      nodes.length > 0
        ? { x: nodes[0]!.position.x + 450, y: nodes[0]!.position.y }
        : { x: 100, y: 100 };

    const newNode = dispatch(
      addNode({
        type: nodeType,
        position: newNodePosition,
        data: {},
      })
    )

    if (nodes.length > 0) {
      dispatch(addEdge({
        source: nodes[0]!.id,
        target: newNode.id,
      }))
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <div className="h-min-content group w-full">
          <div
            className="flex w-full flex-row items-center justify-between gap-2 rounded-md p-2 dark:bg-accent"
            onDragStart={onDragStart}
            onClick={e => onClick(e)}
            draggable
          >
            <div className="flex flex-row gap-2">
              {/* <span className="text-sm font-medium">{type} :</span> */}
              <span className="flex flex-row gap-2 text-sm font-medium">
                <TooltipTrigger className="hidden w-0 group-hover:block group-hover:w-min">
                  <InfoIcon size={12} />
                </TooltipTrigger>
                {title}
              </span>
            </div>
            <GripVertical size={16} className="cursor-grab" />
          </div>
        </div>
        <TooltipContent>{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DragableNode;
