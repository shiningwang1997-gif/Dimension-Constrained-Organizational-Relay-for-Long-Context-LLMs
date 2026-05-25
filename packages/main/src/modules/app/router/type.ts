
export interface Message {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: string;
}



export interface Robot {
  id: string;
  name: string;
  updTime: string;
  type:string;
  taskCount: number;
  status: string;
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
