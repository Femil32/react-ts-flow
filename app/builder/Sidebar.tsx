"use client";

// import reactFlowToWorkflow from "../utils/reactFlowToWorkflow";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { DragableNode } from "@/components/DragableNode";

import { useAppSelector } from "@/redux/hooks";
import React, { useEffect, useState } from "react";
function Sidebar() {
  const { node } = useAppSelector(
    (state) => ({
      node: state.node,
    }),
  );

  const { nodes, edges, alert } = node

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: Event) => {
    return;
  };

  // function handleRun() {
  //   const workflow = reactFlowToWorkflow({ nodes, edges });
  //   const blob = new Blob([JSON.stringify(workflow)], {
  //     type: "application/json",
  //   });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   // link.download = "workflow.json";
  //   // link.href = url;
  //   // link.click();
  // }

  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    if (alert) {
      setOpenAlert(true);
    }
  }, [alert]);

  // function handleOpenChange() {
  //   setOpenAlert(false);
  //   setAlertStore(null);
  // }

  return (
    <aside
      className="col-span-1 flex h-full max-h-screen flex-col justify-between border-r select-none"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex flex-col gap-6">
        <div className="flex-none px-6 pt-[4rem]">
          <div className="flex flex-col justify-between gap-6">
            <div className="flex flex-row justify-between"></div>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-6">
          <h2 className="font-bold tracking-wider">Workflow Builder</h2>
          <p className="flex flex-row gap-1 text-xs font-normal opacity-80">
            Drag and drop nodes to the canvas to create a workflow
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="px-6"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Inputs</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
              <DragableNode
                nodeType="Input.default"
                title="Default"
                description="Default source"
                type="Source"
              />
              {/* <DragableNode
                nodeType="Library.likedTracks"
                title="Liked Tracks"
                description="Liked tracks"
                type="Source"
              />
              <DragableNode
                nodeType="Library.saveAsNew"
                title="Save as new"
                description="Saves workflow output to a new playlist"
                type="Target"
              />
              <DragableNode
                nodeType="Library.saveAsAppend"
                title="Save as append"
                description="Saves workflow output to an existing playlist by appending"
                type="Target"
              />
              <DragableNode
                nodeType="Library.saveAsReplace"
                title="Save as replace"
                description="Saves workflow output to an existing playlist by replacing all tracks"
                type="Target"
              /> */}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Filters</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
              {/* <DragableNode
                nodeType="Filter.dedupeTracks"
                title="Dedupe Tracks"
                description="Remove duplicate tracks"
                type="Filter"
              />
              <DragableNode
                nodeType="Filter.dedupeArtists"
                title="Dedupe Artists"
                description="Remove duplicate artists"
                type="Filter"
              /> */}
              <DragableNode
                nodeType="Filter.filter"
                title="Remove Match"
                description="Match and remove tracks"
                type="Filter"
              />
              {/* <DragableNode
                nodeType="Filter.limit"
                title="Limit"
                description="Limit number of tracks"
                type="Filter"
              /> */}
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </aside>
  );
}

export default React.memo(Sidebar);
