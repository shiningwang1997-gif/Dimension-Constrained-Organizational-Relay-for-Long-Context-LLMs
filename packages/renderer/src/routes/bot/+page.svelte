<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import IconPlus from "~icons/bi/plus-lg";
  import dayjs from "$lib/utils/dayjs";

  // 导入需要的图标组件，使用unplugin-icons
  import IconEdit from "~icons/mdi/pencil-outline";
  import IconDelete from "~icons/mdi/delete-outline";
  import { showConfirm } from "$lib/utils/ui/confirm";

  import { bots, type Robot } from "$lib/stores/bots";

  import NewbotDialog from "./NewBot.svelte";

  let showNewbot = false;
  let currentBot: Robot | null = null;

  onMount(async () => {
    await bots.loadRobots();
  });

  // 处理卡片点击
  function handleCardClick(robot: Robot) {
    console.log("打开机器人详情页:", robot.id);
    // 这里可以添加导航逻辑
    goto(`/bot/detail#id=${robot.id}&type=${robot.type}`);
  }

  // 处理编辑按钮点击
  function handleEdit(event: Event, robot: Robot) {
    event.stopPropagation(); // 阻止事件冒泡到卡片
    currentBot = robot;
    showNewbot = true;
    console.log("currentBot=", currentBot);
    console.log("编辑机器人:", robot.id);
  }

  // 处理删除按钮点击
  function handleDelete(event: Event, robot: Robot) {
    event.stopPropagation(); // 阻止事件冒泡到卡片
    showConfirm(
      {
        title: `删除机器人<<${robot.name ?? ""}>>`,
        message: `确认删除机器人<<${robot.name ?? ""}>>及其全部工作成果吗？这一操作不可恢复.`,
      },
      (confirmed: boolean) => {
        if (confirmed) {
          bots.deleteRobot(robot.id).then((result) => {
            console.log("删除机器人:", robot.id, result);
          });
        }
      },
    );
  }

  // 处理添加新项目
  function handleAddRobot() {
    // 实现添加项目的逻辑
    console.log("机器人入职");
    currentBot = null;
    showNewbot = true;
  }
</script>

<NewbotDialog bind:open={showNewbot} bind:bot={currentBot} />
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
          <li class="font-medium">机器人列表</li>
        </ul>
      </div>

      <!-- 功能按钮 -->
      <div class="flex gap-2">
        <button class="btn btn-primary btn-sm" on:click={handleAddRobot}>
          <IconPlus class="h-4 w-4" />
          <span>机器人入职</span>
        </button>
      </div>
    </div>
  </div>
</div>

<div class="container mx-auto p-4">
  <!-- 机器人卡片网格 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each $bots.data as robot (robot.id)}
      <div
        class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        on:click={() => handleCardClick(robot)}
        on:keydown={(e) => e.key === "Enter" && handleCardClick(robot)}
        role="button"
        tabindex="0"
        aria-label="查看机器人 {robot.name} 详情"
      >
        <div class="card-body p-4">
          <div class="flex justify-between items-start">
            <h3 class="card-title text-lg font-medium">
              {robot.name}
              <!-- 状态指示器 -->
               {#if !robot.type || robot.type == 'comm'}
              <span
                class="badge {robot.status === 'active'
                  ? 'badge-success'
                  : 'badge-error'} badge-sm ml-2"
              >
                {robot.status === "active" ? "已培训" : "未培训"}
              </span>
              {:else}
              <span
                class="badge bg-blue-500 badge-sm ml-2"
              >
                {robot.type}
              </span>
              {/if}
            </h3>
            <!-- 操作按钮 -->
            <div class="flex space-x-1">
              <button
                class="btn btn-ghost btn-xs text-info"
                on:click={(e) => handleEdit(e, robot)}
                aria-label="编辑机器人 {robot.name}"
              >
                <IconEdit class="w-3.5 h-3.5" />
              </button>
              <button
                class="btn btn-ghost btn-xs text-error"
                on:click={(e) => handleDelete(e, robot)}
                aria-label="删除机器人 {robot.name}"
              >
                <IconDelete class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- 机器人信息 -->
          <div class="mt-2 text-sm">
            <div class="flex justify-between text-base-content/70">
              <span>最后任务时间:</span>
              <span>{dayjs(robot.updTime).fromNow()}</span>
            </div>
            <div class="flex justify-between mt-1">
              <span class="text-base-content/70">任务数量:</span>
              <span class="font-semibold">{robot.taskCount}</span>
            </div>
          </div>

          <!-- 底部进度条，可选 -->
          <progress
            class="progress progress-primary w-full mt-3"
            value={robot.status === "active" ? 100 : 30}
            max="100"
            aria-label="机器人状态进度"
          ></progress>
        </div>
      </div>
    {/each}
  </div>

  <!-- 如果没有机器人数据 -->
  {#if $bots.data.length === 0}
    <div class="alert alert-info shadow-lg">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="stroke-current flex-shrink-0 w-6 h-6"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path></svg
        >
        <span>暂无机器人数据。请添加新机器人。</span>
      </div>
    </div>
  {/if}
</div>
