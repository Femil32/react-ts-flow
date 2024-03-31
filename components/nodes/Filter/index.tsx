"use client";

import { Handle, Position } from "@xyflow/react";
import React from "react";

import { InfoIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { CardWithHeader } from "../Primitives/Card";
import InputPrimitive from "../Primitives/Input";

import * as z from "zod";

import { Form } from "@/components/ui/form";
import Link from "next/link";
import useBasicNodeState from "@/hooks/useBasicNodeState";
// import Debug from "../Primitives/Debug";

type PlaylistProps = {
  id: string;
  data: any;
};

type Playlist = {
  playlistId?: string;
  name?: string;
  description?: string;
  image?: string;
  total?: number;
  owner?: string;
};

const formSchema = z.object({
  filterKey: z.string().min(1, {
    message: "Playlist is required.",
  }),
  operation: z.string().min(1, {
    message: "Operation is required.",
  }),
  filterValue: z.string().min(1, {
    message: "Value is required.",
  }),
});

const selectOptions = [
  { label: "Less than (<)", value: "<" },
  { label: "Less than or equal to (<=)", value: "<=" },
  { label: "Equal to (==)", value: "==" },
  { label: "Greater than or equal to (>=)", value: ">=" },
  { label: "Greater than (>)", value: ">" },
  { label: "Not equal to (!=)", value: "!=" },
];

const CustomFilter = ({
  id, data
}: PlaylistProps) => {
  const {
    state,
    isValid,
    targetConnections,
    sourceConnections,
    form,
    formState,
    register,
    getNodeData,
    updateNodeData,
  } = useBasicNodeState(id, formSchema);

  React.useEffect(() => {
    if (data) {
      const parsedData = {
        filterKey: data.filterKey,
        operation: data.filterValue?.substring(0, 2).trim(),
        filterValue: data.filterValue?.substring(2).trim(),
      };
      form!.reset(parsedData);
      form?.setValue("operation", parsedData.operation);
    }
  }, [data]);

  const watch = form!.watch();
  const prevWatchRef = React.useRef(watch);

  React.useEffect(() => {
    if (JSON.stringify(prevWatchRef.current) !== JSON.stringify(watch)) {
      const filterValue =
        watch.filterValue && watch.operation
          ? `${watch.operation} ${watch.filterValue}`
          : undefined;

      updateNodeData(id, {
        filterKey: watch.filterKey,
        filterValue: filterValue,
      });
    }
    prevWatchRef.current = watch;
  }, [watch]);

  const formValid = formState!.isValid;

  const nodeValid = React.useMemo(() => {
    return formValid && isValid;
  }, [formValid, isValid]);

  return (
    <CardWithHeader
      title={`Remove Match`}
      id={id}
      type="Filter"
      status={nodeValid ? "success" : "error"}
    >
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
      />
      <Form {...form!}>
        <form onSubmit={form!.handleSubmit((data) => console.log(data))}>
          <div className="flex flex-col gap-4">
            <InputPrimitive
              control={form!.control}
              name="filterKey"
              inputType={"select"}
              label={"Column Name"}
              placeholder={
                watch.operation
                  ? selectOptions.find(
                    (option) => option.value === watch.operation,
                  )!.label
                  : "Select an operation"
              }
              selectOptions={selectOptions}
              register={register!}
            />
            <Separator />
            <InputPrimitive
              control={form!.control}
              name="operation"
              inputType={"select"}
              label={"Operation"}
              placeholder={
                watch.operation
                  ? selectOptions.find(
                    (option) => option.value === watch.operation,
                  )!.label
                  : "Select an operation"
              }
              selectOptions={selectOptions}
              register={register!}
            />
            <Separator />
            <InputPrimitive
              control={form!.control}
              name="filterValue"
              inputType={"text"}
              label={"Match Value"}
              placeholder="Ichiko Aoba"
              register={register!}
            />
          </div>
        </form>
      </Form>
      {/* <Debug
        id={id}
        isValid={nodeValid}
        TargetConnections={targetConnections}
        SourceConnections={sourceConnections}
      /> */}
    </CardWithHeader>
  );
}


export default CustomFilter;
