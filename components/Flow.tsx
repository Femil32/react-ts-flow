"use client";

import { Background, Controls, MiniMap, Panel, ReactFlow } from "@xyflow/react";
import { DragEvent, useCallback, useRef } from "react";

import "@xyflow/react/dist/style.css";

import FilterNodeComponent from "./nodes/Filter";

import { addEdge, addNode, onEdgesChange, onNodesChange, onNodesDelete, setReactFlowInstance } from "@/redux/features/nodeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import DefaultInputComponent from "./nodes/Input/Default";
import { Button } from "./ui/button";
import { PlayIcon, SaveIcon } from "lucide-react";
import reactFlowToWorkflow from "@/utils/reactFlowToWorkflow";
import { filterData } from "@/helpers/fn";

const nodeTypes = {
  // data
  "Input.default": DefaultInputComponent,

  // operations
  "Filter.filter": FilterNodeComponent,

};

const minimapStyle = {
  height: 120,
};

export default function App() {
  const dispatch = useAppDispatch()
  const reactFlowWrapper = useRef(null);
  const { node } = useAppSelector(state => ({
    node: state.node
  }));

  const { nodes, edges } = node

  const router = useRouter();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = {
        x: 10,
        y: 20,
      }
      // const position = reactFlowInstance!.screenToFlowPosition({
      //   x: event.clientX,
      //   y: event.clientY,
      // });
      const newNode = {
        type,
        position,
        data: {},
      };

      dispatch(addNode(newNode))

    },
    [dispatch],
  );


  async function handleRun() {
    const { workflowResponse, errors } = await reactFlowToWorkflow({
      nodes,
      edges,
      nodeState: node
    });
    console.log('workflowResponse', {
      workflowResponse, errors
    });
    // const aa = filterData(

    // )
    // const runResponse = await runWorkflow(workflowResponse);
    console.log('runResponse', runResponse);

  }

  async function handleSave() {
    // const { workflowResponse, errors } = await reactFlowToWorkflow({
    //   nodes,
    //   edges,
    // });


    // const saveResponse = await saveWorkflow(workflowResponse);
    // router.push(`/flow?id=${saveResponse.id}`);
  }

  return (
    <div className="dndflow h-full w-full">
      <div className="reactflow-wrapper h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(e) => dispatch(onNodesChange(e))}
          onEdgesChange={(e) => dispatch(onEdgesChange(e))}
          onConnect={e => dispatch(addEdge(e))}
          onInit={e => dispatch(setReactFlowInstance(e))}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodesDelete={e => dispatch(onNodesDelete(e))}
          fitView
          snapToGrid={true}
          nodeTypes={nodeTypes}
          snapGrid={[20, 20]}
          // zoomOnPinch={false}
          // zoomOnScroll={false}
          zoomOnDoubleClick={false}
          deleteKeyCode={["Backspace", "Delete"]}
          onPaneContextMenu={(e) => {
            e.preventDefault();
          }}
          minZoom={0.001}
          maxZoom={1}
        // // figma like
        // panOnScroll
        // selectionOnDrag
        // panOnDrag={[1, 2]}
        // selectionMode={SelectionMode.Partial}
        >
          <Controls />
          <Panel position="top-right" className="pt-20">
            <div className="flex flex-row items-center gap-4">
              <Button className="flex-grow" onClick={handleSave}>
                <SaveIcon size={16} />
                <span>Save</span>
              </Button>
              <Button className="flex-grow" onClick={handleRun}>
                <PlayIcon size={16} />
                <span>Run</span>
              </Button>
              {/* <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex flex-row gap-2 bg-card bg-opacity-80 text-foreground outline outline-1 outline-slate-700 hover:bg-opacity-100 hover:text-background">
                    <SettingsIcon size={16} className="opacity-80" />
                    Settings
                  </Button>
                </DialogTrigger>
                <SettingsDialog />
              </Dialog> */}
            </div>
          </Panel>
          <MiniMap pannable zoomable />
          <Background
            color="#aaaaaa"
            gap={20}
            className="bg-background"
            size={2}
            patternClassName="opacity-20"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
