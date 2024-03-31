"use client";

import { Handle, Position } from "@xyflow/react";
import React from "react";


import Image from "next/image";

import { CardWithHeader } from "../Primitives/Card";
import InputPrimitive from "../Primitives/Input";

import * as z from "zod";

import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
// import Debug from "../Primitives/Debug";
import useBasicNodeState from "@/hooks/useBasicNodeState";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { countriesData } from "@/data/countries";

import { InputColumn, InputData, setInputColumns, setInputData } from "@/redux/features/fileDataSlice";

type PlaylistProps = {
  id: string;
  // TODO type on playlist
  data: Playlist;
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
  defaultCSVinput: z.string().min(1, {
    message: "DefaultCSVinput is required.",
  }),
});

const selectOptions = [
  { label: "Countries CSV", value: "countries" },
  { label: "Ufo CSV", value: "ufo" },
];

function DefaultInputComponent({ id, data }: PlaylistProps) {
  const [search, setSearch] = React.useState("");

  const dispatch = useAppDispatch()

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

  const { node } = useAppSelector((state) => ({
    node: state.node,
  }));

  const { userPlaylists } = node;


  const watch = form!.watch();

  React.useEffect(() => {
    const { defaultCSVinput } = watch
    let fileData = null;
    let column: InputColumn = [];
    let data: InputData = [];
    switch (defaultCSVinput) {
      case 'countries':
        fileData = countriesData
        column = fileData[0]
        data = fileData.slice(1)
        break;
      case 'ufo':
        break;

      default:
        break;
    }

    dispatch(setInputColumns({
      column
    }))

    dispatch(setInputData(data))

  }, [dispatch, watch])



  React.useEffect(() => {
    if (data) {
      form?.setValue("defaultCSVinput", "countries");
    }
  }, [data, form]);


  return (
    <CardWithHeader
      title={`Example Data`}
      id={id}
      type="Source"
      status={formState!.isValid ? "success" : "error"}
      info="Select csv as input data."
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
        <form onSubmit={form!.handleSubmit((data) => console.log('data', data))}>
          <div className="flex flex-col gap-4">
            <InputPrimitive
              control={form!.control}
              name="defaultCSVinput"
              inputType={"select"}
              label={"Column Name"}
              placeholder={
                watch.defaultCSVinput
                  ? selectOptions.find(
                    (option) => {
                      return option.value === watch.defaultCSVinput
                    }
                  )!.label
                  : "Select an operation"
              }
              selectOptions={selectOptions}
              register={register!}
            />
          </div>
        </form>
      </Form>
    </CardWithHeader>
  );
}

export default DefaultInputComponent;
