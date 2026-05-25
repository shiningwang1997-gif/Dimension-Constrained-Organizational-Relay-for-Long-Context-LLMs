// import { apiClient } from './net/api';
import { eventBus } from "./events/bus";

export async function initLib(): Promise<void> {
  eventBus.init();
  // @todo:是否不需要等待？ 因为apiClient主要职责是ping server.并且真实的请求发生事，会自动等待ping结束的。
  // await apiClient.init();
}
