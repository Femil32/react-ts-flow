"use client";

import { Input } from "@/components/ui/input";
import reactFlowToWorkflow from "@/utils/reactFlowToWorkflow";


import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/redux/hooks";
import { ClockIcon, PlayIcon } from "lucide-react";
import { useState } from "react";

function RightBar() {
  const { node } = useAppSelector(state => ({
    node: state.node,
  }));

  const { nodes, edges } = node

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onDrop = (event: DragEvent) => {
    return;
  };

  function handleRun() {
    const workflow = reactFlowToWorkflow({ nodes, edges });
    const blob = new Blob([JSON.stringify(workflow)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    // link.download = "workflow.json";
    // link.href = url;
    // link.click();
  }

  const [openAlert, setOpenAlert] = useState(false);

  // useEffect(() => {
  //   if (alert) {
  //     setOpenAlert(true);
  //   }
  // }, [alert]);

  // function handleOpenChange() {
  //   setOpenAlert(false);
  //   setAlertStore(null);
  // }

  return (
    <aside
      className="col-span-1 flex max-h-[50svh] flex-col justify-start gap-4 border-l"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex flex-col gap-6">
        <div className="flex-none px-6 pt-[4rem]">
          <div className="flex flex-col justify-between gap-6">
            <div className="flex flex-row justify-between"></div>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-6">
          <h2 className="font-bold tracking-wider">Workflow Builder</h2>
          {/* <p className="flex flex-row gap-1 text-xs font-normal opacity-80">
            Drag and drop nodes to the canvas to create a workflow
          </p> */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email" className="opacity-90">
              Title
            </Label>
            <Input type="email" id="email" placeholder="Workflow title" />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email" className="opacity-90">
              Description
            </Label>
            {/* <Textarea
              id="email"
              placeholder="A short description for your workflow"
            /> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-6 pb-4">
        {/* <AlertDialog open={openAlert} onOpenChange={handleOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{alert?.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {alert?.message.split("\n").map((line, index) => (
                  <code>
                    <p key={index} className={index === 0 ? "font-medium" : ""}>
                      {line}
                    </p>
                  </code>
                ))}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={handleOpenChange}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}
        <div className="flex w-full gap-2">
          <Button className="flex-grow" onClick={handleRun}>
            <PlayIcon size={16} />
            <span>Run</span>
          </Button>
          <Button className="flex flex-row gap-1">
            <ClockIcon size={16} />
            <span>Schedule</span>
          </Button>
        </div>
        <Button>Save Workflow</Button>
      </div>
    </aside>
  );
}

export default RightBar;
