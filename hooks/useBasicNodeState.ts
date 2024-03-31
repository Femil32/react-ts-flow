import { useCallback, useEffect, useMemo, useState } from "react";
import { useHandleConnections } from "@xyflow/react";
import { countriesData } from "@/data/countries";

// import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { type ZodObject } from "zod";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateNodeData } from "@/redux/features/nodeSlice";

const usePlaylistLogic = (id: string, formSchema?: ZodObject<any>) => {
  const dispatch = useAppDispatch();

  const { node, fileData } = useAppSelector((state) => ({
    node: state.node,
    fileData: state.fileData,
  }));

  const { nodes } = node;

  const [isValid, setIsValid] = useState(false);
  const [state, setState] = useState({
    currentCSV: "countries",
    csvData: countriesData,
    inputColumns: [],
    inputData: [],
  });

  const form = formSchema
    ? useForm({
        resolver: formSchema,
        shouldUnregister: false,
        mode: "all",
      })
    : undefined;

  const { formState, register } = form ?? {};

  const getNodeData = useCallback(
    (id: string) => {
      console.log("nodes", nodes, id);
      return nodes.find((node) => node.id === id)?.data;
    },
    [nodes]
  );

  const targetConnections = useHandleConnections({
    type: "target",
    nodeId: id,
  });

  const sourceConnections = useHandleConnections({
    type: "source",
    nodeId: id,
  });

  const total = 30;
  // const total = useMemo(
  //   () =>
  //     Array.isArray(state.csvData)
  //       ? state.csvData.reduce((acc, curr) => acc + (curr ?? 0), 0)
  //       : 0,
  //   [state]
  // );

  useEffect(() => {
    let invalidNodesCount = 0;
    const playlistIdsSet = new Set<string>();
    const playlistsSet = new Set();

    if (!targetConnections?.length) {
      setState({
        ...state,
        currentCSV: "countries",
        csvData: [],
      });
      return;
    }

    targetConnections.forEach((connection) => {
      console.log("connection", connection);
      console.log("connection.source", connection.source);

      const target = getNodeData(connection.source);
      if (!target) return;
      console.log("target", target);

      const {
        playlistId,
        playlistIds,
        total,
        name,
        description,
        image,
        owner,
        playlists,
      } = target;

      const hasPlaylistId = Boolean(playlistId);
      const hasPlaylistIds = Boolean(playlistIds && playlistIds.length > 0);

      if (!hasPlaylistId && !hasPlaylistIds) {
        invalidNodesCount++;
      }

      setIsValid(hasPlaylistId || hasPlaylistIds);

      const playlist = { playlistId, name, description, image, owner, total };
      console.log("playlist", playlist);

      playlistsSet.add(playlist);
      playlistIdsSet.add(playlistId);

      (playlistIds || []).forEach((id) => playlistIdsSet.add(id as string));
      (playlists || []).forEach((pl) => playlistsSet.add(pl as Playlist));
    });

    const { inputColumns, inputData } = fileData;
    setState({
      inputColumns,
      inputData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetConnections, getNodeData, total, fileData]);

  useEffect(() => {
    const currentNodeData = getNodeData(id);
    console.log("currentNodeData", currentNodeData);

    if (
      JSON.stringify(currentNodeData?.inputData) !==
      JSON.stringify(state.inputData)
    ) {
      dispatch(
        updateNodeData({
          id,
          data: {
            inputColumns: state.inputColumns,
            inputData: state.inputData,
          },
        })
      );
    }
  }, [
    targetConnections,
    getNodeData,
    total,
    sourceConnections,
    id,
    state.inputColumns,
    dispatch,
    state.inputData,
  ]);

  return {
    state,
    setState,
    isValid: 0,
    targetConnections,
    sourceConnections,
    nodeData: getNodeData(id),
    getNodeData,
    updateNodeData,
    ...(formSchema
      ? {
          form,
          formState,
          register,
        }
      : {}),
  };
};

export default usePlaylistLogic;
