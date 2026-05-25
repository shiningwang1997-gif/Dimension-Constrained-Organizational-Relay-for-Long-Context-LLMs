import { writable, type Writable } from "svelte/store";
import { rpc } from "@app/preload";
import dayjs from "$lib/utils/dayjs";
import { clone } from "remeda";

export interface Robot {
  id: string;
  name: string;
  updTime: string;
  taskCount: number;
  status: string;
  type: string; // 机器人内建类型，如果为空或comm，需要培训．
  input?: {
    txt: string;
    img: string;
    video: string;
    voice: string;
  };
  output?: {
    txt: string;
    img: string;
    video: string;
    voice: string;
  };
  [key: string]: any; // 允许其他属性
}


interface RobotsState {
  data: Robot[];
  loading: boolean;
  error: string | null;
}

interface RobotsStore extends Writable<RobotsState> {
  loadRobots(): Promise<void>;
  addRobot(robot: Omit<Robot, "id">): Promise<string>;
  updateRobot(robot: Robot): Promise<number>;
  deleteRobot(id: string): Promise<boolean>;
}

export const createRobotsStore = (): RobotsStore => {
  const initialState: RobotsState = {
    data: [],
    loading: true,
    error: null,
  };

  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    set,
    update,

    // 程序方法来更新状态
    async loadRobots(): Promise<void> {
      update((state) => ({ ...state, loading: true, error: null }));

      try {
        const result = await rpc.bots.find();
        // const response = await fetch('/api/robots');
        // if (!result.ok) {
        //     throw new Error(`HTTP error! status: ${result.error}`);
        // }
        // const robots: Robot[] = await response.json();
        set({ data: result, loading: false, error: null });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        update((state) => ({ ...state, loading: false, error: errorMessage }));
      }
    },

    async addRobot(robot: Omit<Robot, "id">): Promise<string> {
      const id = robot.id ?? crypto.randomUUID();
      const updTime = robot.updTime ?? dayjs().format();
      const data = clone(robot);
      data.id = id;
      data.updTime = updTime;
      if (!data.taskCount) data.taskCount = 0;
      if (!data.status) {
        data.status = "pending";
      }
      update((state) => ({
        ...state,
        data: [
          ...state.data,
          { name: "", taskCount: 0, type: "",status: "", ...robot, id, updTime },
        ],
      }));
      // console.log("add robot=", data);
      await rpc.bots.insert(data);
      return id;
    },

    async updateRobot(robot: Robot): Promise<number> {
      if (!robot.id) {
        return 0;
      }

      // 先调用RPC
      const result = await rpc.bots.update(robot);

      update((state) => ({
        ...state,
        data: state.data.map(
          (existingRobot) =>
            existingRobot.id === robot.id
              ? { ...robot } // 更新匹配的机器人
              : existingRobot // 保持其他机器人不变
        ),
      }));
      // console.log("add robot=", data);
      return result;
    },

    async deleteRobot(id: string): Promise<boolean> {
      // console.log("call rmbyid:", id)
      const result = await rpc.bots.rmById(id);
      update((state) => ({
        ...state,
        data: state.data.filter((robot) => robot.id !== id),
      }));
      return result;
    },
  };
};


export const bots = createRobotsStore();