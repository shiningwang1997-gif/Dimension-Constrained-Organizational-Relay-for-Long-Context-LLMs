<script lang="ts">
  import { onMount } from "svelte";
  import IconPlus from "~icons/bi/plus-lg";

  import Train from "./Train.svelte";
  import { ensureBot } from "$lib/stores/bot";
  import { idFromHash, typeFromHash } from "$lib/utils/url";
  import Test from "./Test.svelte";
  import Json from "./Json.svelte";

  const bid = idFromHash();
  const type = typeFromHash();
  const bot = ensureBot(bid, type);

  let selectedTab = "training"; // 默认选中的 tab

  const tabs = [
    { id: "tasks", label: "任务列表", component: null },
    { id: "training", label: "培训", component: Train },
    { id: "methods", label: "本体-流程", component: null },
    { id: "datastructure", label: "本体-数据", component: Json },
    { id: "test", label: "测试", component: null },
  ];

  // tab 切换处理函数
  function handleTabChange(tabId: string) {
    if (selectedTab !== tabId) {
      selectedTab = tabId;

      // 调用自定义函数
      // onTabSwitch(tabId);
    }
  }

  function isTrainBot() {
    return !$bot.bot.type || $bot.bot.type == "train";
  }

  // 自定义的 tab 切换函数
  // function onTabSwitch(tabId) {
  //   console.log(`切换到 tab: ${tabId}`);

  //   // 根据不同的 tab 执行不同逻辑
  //   switch (tabId) {
  //     case "training":
  //       console.log("加载培训数据...");
  //       break;
  //     case "methods":
  //       console.log("加载工作方法数据...");
  //       break;
  //     case "datastructure":
  //       console.log("加载数据结构信息...");
  //       break;
  //     case "tasks":
  //       console.log("加载任务列表...");
  //       break;
  //   }
  // }

  onMount(async () => {
    await bot.load();
    if (!$bot.bot.status || $bot.bot.status === "pending") {
      selectedTab = "training";
    }
  });
</script>

<!-- 功能条 -->
<div class="z-10 bg-base-200 px-4 py-3 shadow-sm">
  <!-- sticky功能条，位于顶部菜单下方 -->
  <div class="container mx-auto">
    <div
      class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
    >
      <!-- 面包屑导航 -->
      <div class="breadcrumbs text-sm">
        <ul>
          <!-- <li><a href="/dashboard">控制台</a></li> -->
          <li class="font-medium"><a href="/bot">机器人列表</a></li>
          <li class="font-medium">
            {#if $bot.loading}
              <div class="flex items-center gap-2">
                <span class="loading loading-spinner loading-xs"></span>
                <div class="skeleton h-4 w-16"></div>
              </div>
            {:else}
              {$bot.bot.name}
            {/if}
          </li>
        </ul>
      </div>

      <!-- 功能按钮 -->
      <div class="flex gap-2">
        {#if selectedTab === "tasks"}
          <button class="btn btn-primary btn-sm">
            <IconPlus class="h-4 w-4" />
            <span>新任务</span>
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>

<div class="container mx-auto p-4">
  <!-- name of each tab group should be unique -->
  <div class="tabs tabs-lift">
    {#each tabs as tab}
      <input
        type="radio"
        name="my_tabs_3"
        class="tab"
        aria-label={tab.label}
        value={tab.id}
        checked={selectedTab === tab.id}
        onchange={() => handleTabChange(tab.id)}
      />
      <div class="tab-content bg-base-100 border-base-300 p-6">
        {#if tab.id === "training" && selectedTab === tab.id}
          <Train {bid} />
        {:else if tab.id === "methods" && selectedTab === tab.id}
          <div class="text-center">工作方法内容</div>
        {:else if tab.id === "datastructure" && selectedTab === tab.id}
          <Json {bid} {type}/>
        {:else if tab.id === "tasks" && selectedTab === tab.id}
          <div class="text-center">任务列表内容</div>
        {:else if tab.id === "test" && selectedTab === tab.id}
          <Test {bid} />
        {/if}
      </div>
    {/each}
  </div>
</div>
