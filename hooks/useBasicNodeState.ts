import { useCallback, useEffect, useMemo, useState } from "react";
import { useHandleConnections } from "@xyflow/react";
import { countriesData } from "@/data/countries";

type Playlist = {
  playlistId?: string;
  name?: string;
  description?: string;
  image?: string;
  owner?: string;
  total?: number;
};

// import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { type ZodObject } from "zod";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateNodeData } from "@/redux/features/nodeSlice";

const usePlaylistLogic = (id: string, formSchema?: ZodObject<any>) => {
  const dispatch = useAppDispatch();

  const { node } = useAppSelector((state) => ({
    node: state.node,
  }));

  const { nodes } = node;

  const [isValid, setIsValid] = useState(false);
  const [state, setState] = useState({
    currentCSV: "countries",
    csvData: countriesData,
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
    (id: string) => nodes.find((node) => node.id === id)?.data,
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

  const total = useMemo(
    () =>
      Array.isArray(state.playlists)
        ? state.playlists.reduce((acc, curr) => acc + (curr.total ?? 0), 0)
        : 0,
    [state.playlists]
  );
  useEffect(() => {
    let invalidNodesCount = 0;
    const playlistIdsSet = new Set<string>();
    const playlistsSet = new Set<Playlist>();

    if (!targetConnections?.length) {
      setState({
        currentCSV: "countries",
        csvData: [],
      });
      return;
    }

    targetConnections.forEach((connection) => {
      console.log("connection", connection);

      const target = getNodeData(connection.source);
      if (!target) return;

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
      playlistsSet.add(playlist);
      playlistIdsSet.add(playlistId as string);

      (playlistIds || []).forEach((id) => playlistIdsSet.add(id as string));
      (playlists || []).forEach((pl) => playlistsSet.add(pl as Playlist));
    });

    const combinedPlaylistIds = Array.from(playlistIdsSet).filter(Boolean);
    const combinedPlaylists = Array.from(playlistsSet)
      .filter(Boolean)
      .filter((playlist) => Object.keys(playlist).length !== 0)
      .filter((playlist) => playlist.playlistId);

    setState({
      playlistIds: combinedPlaylistIds,
      playlists: combinedPlaylists,
      invalidNodesCount,
      summary: {
        total,
      },
    });
  }, [targetConnections, getNodeData, total]);

  useEffect(() => {
    const currentNodeData = getNodeData(id);
    if (
      JSON.stringify(currentNodeData?.playlistIds) !==
      JSON.stringify(state.playlistIds)
    ) {
      dispatch(
        updateNodeData({
          id,
          data: {
            playlistIds: state.playlistIds,
            playlists: state.playlists,
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
    state.playlistIds,
    state.playlists,
    dispatch,
  ]);

  return {
    state,
    setState,
    isValid:
      isValid && state.invalidNodesCount === 0 && targetConnections.length > 0,
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
