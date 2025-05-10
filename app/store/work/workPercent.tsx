import _api from "@/app/_endpoints";
import axiosInstance from "@/app/admin/payment/utils/axios";
import { createContext, ReactElement, useContext, useState } from "react";

type WorkPercentProps = {
  workPercents: WorkPercentRecords;
  pendingGet: boolean;
  pendingPost: boolean;
  getWorkPercentForPost: (
    postId: string,
    options?: {
      refresh: boolean;
    }
  ) => Promise<WorkPercentGet[]>;
  setWorkPercentForPost: (
    postId: string,
    data: WorkPercentPost[]
  ) => Promise<WorkPercentGet[]>;
};

export const WorkPercentContext = createContext<WorkPercentProps>({
  workPercents: {},
  pendingGet: false,
  pendingPost: false,
  getWorkPercentForPost: async () => [],
  setWorkPercentForPost: async () => [],
});

export const useWorkPercentStore = () => useContext(WorkPercentContext);

export const WorkPercentProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [workPercents, setWorkPercents] = useState<WorkPercentRecords>({});
  const [pendingGet, setPendingGet] = useState(false);
  const [pendingPost, setPendingPost] = useState(false);

  const getWorkPercentForPost = async (
    postId: string,
    options?: { refresh: boolean }
  ) => {
    if (workPercents[postId] && !options?.refresh)
      return workPercents[postId];
    const response = await axiosInstance.get<WorkPercentGet[]>(
      _api.works.getPercentage(postId)
    );
    setWorkPercents((workPercents) => ({
      ...workPercents,
      [postId]: response.data,
    }));
    return response.data;
  };

  const setWorkPercentForPost = async (
    postId: string,
    data: WorkPercentPost[]
  ) => {
    try {
      setPendingPost(true);
      await axiosInstance.put(_api.works.putPercentage(postId), {
        workPercents: data,
      });
      const response = await getWorkPercentForPost(postId, { refresh: true });
      setPendingPost(false);
      return response;
    } catch (error) {
      setPendingPost(false);
      throw error;
    }
  };

  return (
    <WorkPercentContext.Provider
      value={{
        getWorkPercentForPost,
        pendingGet,
        pendingPost,
        setWorkPercentForPost,
        workPercents,
      }}
    >
      {children}
    </WorkPercentContext.Provider>
  );
};
