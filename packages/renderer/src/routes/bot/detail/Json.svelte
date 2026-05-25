<script lang="ts">
  import { JSONEditor } from "svelte-jsoneditor";
  import { onMount } from "svelte";
  import { rpc } from "@app/preload";
  import { createMsg } from "$lib/stores/msg";

  let { bid, type } = $props();
  //   console.log("json bid=", bid);

  let loading = $state(true);
  let loadPrompt = $state("正在加载数据");
  let inputMessage = $state(""); // 输入内容．
  let taskName = $state("common");
  let execAll = $state(false); // 是否执行全部剩余任务．
  // 外部数据源 - 使用 $state() 使其响应式
  //   let externalData = $state({});

  const commonTask = { value: "common", label: "正常执行" };
  const taskMapper = {
    novel: [
      commonTask,
      { value: "extract", label: "基础信息" },
      { value: "translate", label: "文本翻译" },
      { value: "code", label: "代码生成" },
      { value: "analysis", label: "数据分析" },
    ],
    wedoc: [
      commonTask,
      { value: "extract", label: "基础信息" },
      { value: "topic", label: "选题海选" },
      { value: "struct", label: "结构确定" },
      { value: "content", label: "正文书写" },
      { value: "reducer", label: "正文生成" },
    ]
  };

  console.log("type=", type);

  let validTasks = $state(taskMapper[type] ? taskMapper[type] : [commonTask]);

  // 编辑器内容 - 也需要响应式
  let content = $state({
    json: {},
  });

  let jsonEditor: JSONEditor;

  // 处理编辑器内容变化
  function handleChange(updatedContent) {
    // content = updatedContent;

    console.log("updated=",updatedContent)
    if(updatedContent.text){
      updatedContent.json = JSON.parse(updatedContent.text);
    }
    // 如果有有效的 JSON，同步到外部数据
    if (updatedContent.json) {
      // 直接赋值，因为 externalData 现在是响应式的
      //   Object.assign(externalData, updatedContent.json);
      saveToExternal(updatedContent.json);
    }
  }

  // 保存到外部数据源的函数
  async function saveToExternal(data) {
    loadPrompt = "正在保存数据";
    loading = true;
    try {
      //   console.log("保存数据:", data);
      await rpc.bots.train.save(bid, data);
    } catch (error) {
      console.error("保存失败:", error);
    } finally {
      loading = false;
    }
  }

  async function dosave() {
    const ctx = $state.snapshot(content)
    console.log(ctx);
  }

  // 从外部加载数据
  async function refresh() {
    loading = true;
    try {
      loadPrompt = "正在加载数据";
      const data = await rpc.bots.train.data(bid);
      if (data) {
        // 更新响应式状态
        // Object.assign(externalData, data);
        // 同时更新编辑器内容
        content = { json: data };
      }
    } catch (error) {
      console.error("加载失败:", error);
    } finally {
      loading = false;
    }
  }

  // 模拟外部数据变化
  function clearAll() {
    // 直接修改响应式状态
    // externalData =  {}
    // 同时更新编辑器内容
    content = { json: {} };
    saveToExternal({});
  }

  async function sendMessage() {
    if (!inputMessage.trim()) return;

    const jsonMsg = {
      req: inputMessage,
      task: taskName,
      execSeq: execAll,
    };
    loadPrompt = "AI正在处理您的命令";
    loading = true;
    try {
      const response = await rpc.bots.train.send(
        createMsg(JSON.stringify(jsonMsg)),
        bid,
        type,
      );
      await refresh();
    } catch (e) {
    } finally {
      loading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  onMount(async () => {
    await refresh();
  });
</script>

<div
  class="container mx-auto p-4 lg:p-6 max-w-7xl h-screen flex flex-col relative"
>
  <!-- 加载遮挡层 -->
  {#if loading}
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div class="card bg-base-100 shadow-2xl">
        <div class="card-body flex-col items-center gap-6 p-8">
          <!-- DaisyUI 加载动画组合 -->
          <div class="relative">
            <!-- 外圈旋转动画 -->
            <div class="absolute inset-0 animate-spin">
              <div
                class="h-16 w-16 border-4 border-primary border-t-transparent rounded-full"
              ></div>
            </div>
            <!-- 内圈脉冲动画 -->
            <div class="h-16 w-16 flex items-center justify-center">
              <div class="h-8 w-8 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>

          <!-- 加载文本 -->
          <div class="text-center">
            <h3 class="text-lg font-bold text-base-content">{loadPrompt}...</h3>
            <p class="text-sm text-base-content/70 mt-1">请稍候片刻</p>
          </div>

          <!-- 进度条动画 -->
          <div class="w-64">
            <progress class="progress progress-primary w-full"></progress>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- 主要内容区域 -->
  <div class="flex flex-col h-full {loading ? 'pointer-events-none' : ''}">
    <!-- 控制按钮区域 -->
    <div class="card bg-base-100 shadow-xl mb-6 flex-shrink-0">
      <div class="card-body">
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start"
        >
          <button
            class="btn btn-primary btn-lg flex-1 sm:flex-none min-w-48 shadow-lg hover:shadow-xl"
            onclick={clearAll}
            disabled={loading}
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            清空
          </button>

          <button
            class="btn btn-secondary btn-lg flex-1 sm:flex-none min-w-48 shadow-lg hover:shadow-xl {loading
              ? 'loading'
              : ''}"
            onclick={refresh}
            disabled={loading}
          >
            {#if loading}
              <span class="loading loading-spinner loading-sm"></span>
              加载中...
            {:else}
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                ></path>
              </svg>
              刷新
            {/if}
          </button>


          <button
            class="btn btn-secondary btn-lg flex-1 sm:flex-none min-w-48 shadow-lg hover:shadow-xl {loading
              ? 'loading'
              : ''}"
            onclick={dosave}
            disabled={loading}
          >
            {#if loading}
              <span class="loading loading-spinner loading-sm"></span>
              加载中...
            {:else}
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                ></path>
              </svg>
              保存
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="bg-base-100 border-t border-base-300 shadow-lg">
      <div class="p-4">
        <div class="max-w-4xl mx-auto flex space-x-3">
          <div class="avatar">
            <div class="w-10 rounded-full bg-info">
              <div
                class="flex items-center justify-center h-full text-white font-bold"
              >
                U
              </div>
            </div>
          </div>

          <div class="flex-1 flex space-x-2">
            <textarea
              bind:value={inputMessage}
              onkeydown={handleKeyPress}
              placeholder="输入你的命令..."
              class="textarea textarea-bordered flex-1 resize-none min-h-12 max-h-32"
              rows="1"
            ></textarea>

            <button
              onclick={sendMessage}
              disabled={!inputMessage.trim()}
              class="btn btn-neutral btn-square self-end"
              aria-label="发送消息"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>

            <!-- 任务选择下拉菜单 -->
            <div class="dropdown dropdown-end self-end">
              <div tabindex="0" role="button" class="btn btn-ghost btn-square">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </div>
              <ul
                class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow border border-base-300"
              >
                {#each validTasks as task}
                  <li>
                    <button
                      class="text-sm {taskName === task.value ? 'active' : ''}"
                      onclick={() => (taskName = task.value)}
                    >
                      {task.label}
                    </button>
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>

        <div
          class="max-w-4xl mx-auto flex justify-between items-center mt-2 text-xs text-base-content/60 ml-13"
        >
          <span>按 Enter 发送，Shift + Enter 换行</span>
          <div class="flex items-center space-x-3">
            <!-- execAll 变量绑定的 checkbox -->
            <div class="form-control">
              <label class="label cursor-pointer">
                <input
                  type="checkbox"
                  bind:checked={execAll}
                  class="checkbox checkbox-xs"
                />
                <span class="label-text text-xs ml-1">执行后续</span>
              </label>
            </div>
            <div class="badge badge-outline badge-xs">
              {taskName ? `任务: ${taskName}` : "未选择任务"}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- JSON编辑器容器 - 占用剩余全部高度 -->
    <div class="card bg-base-100 shadow-xl flex-1 flex flex-col min-h-0">
      <div class="card-body p-0 flex flex-col flex-1">
        <div class="flex-1 p-6 min-h-0">
          <JSONEditor
            bind:this={jsonEditor}
            {content}
            onChange={handleChange}
            mainMenuBar={true}
            navigationBar={true}
            statusBar={true}
          />
        </div>
      </div>
    </div>
  </div>
</div>
