<!-- ConfigPanel.svelte -->
<script lang="ts">
  import type { ConfigItem } from "./types";
  import SettingsForm from "./SettingsForm.svelte";

  export let items: ConfigItem[] = [
    { id: "deepseek", name: "DeepSeek", cate: "官方大语言模型", value: "deepseek" },
    // { id: "2", name: "数据库用户名", cate: "数据库", value: "db-user" },
    // { id: "3", name: "Redis密码", cate: "缓存", value: "redis-password" },
    // { id: "4", name: "测试API密钥", cate: "API设置", value: "test-api-key" },
    // { id: "5", name: "生产API密钥", cate: "API设置", value: "prod-api-key" },
  ];
  let selectedItem: ConfigItem | null = null;

  // 按分类组织配置项
  $: categories = items.reduce(
    (acc, item) => {
      if (!acc[item.cate]) {
        acc[item.cate] = [];
      }
      acc[item.cate].push(item);
      return acc;
    },
    {} as Record<string, ConfigItem[]>,
  );

  function handleSelect(item: ConfigItem) {
    selectedItem = item;
  }

  function handleSave(event: CustomEvent<{ item: ConfigItem; value: string }>) {
    const updatedItem = event.detail.item;
    const updatedValue = event.detail.value;

    // 更新列表中的项
    items = items.map((item) => {
      if (item.id === updatedItem.id) {
        return { ...item, value: updatedValue };
      }
      return item;
    });
  }
</script>

<div class="flex h-full w-full">
  <!-- 左侧分类面板 -->
  <div class="w-1/3 border-r border-base-300 overflow-y-auto bg-base-200 p-2">
    {#each Object.entries(categories) as [cateName, cateItems]}
      <div class="collapse collapse-arrow bg-base-100 my-2">
        <input type="checkbox" class="peer" />
        <div class="collapse-title font-medium">
          {cateName}
        </div>
        <div class="collapse-content">
          <ul class="menu menu-sm">
            {#each cateItems as item}
              <li>
                <a
                  href="#{item.id}"
                  class="hover:bg-base-300 rounded-lg {selectedItem?.id ===
                  item.id
                    ? 'bg-primary text-primary-content'
                    : ''}"
                  on:click|preventDefault={() => handleSelect(item)}
                >
                  {item.name}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    {/each}
  </div>

  <!-- 右侧设置面板 -->
  <div class="w-2/3 p-4 bg-base-100">
    {#if selectedItem}
      <SettingsForm item={selectedItem} on:save={handleSave} />
    {:else}
      <div class="flex h-full items-center justify-center text-base-content/50">
        <p>请从左侧选择一个配置项</p>
      </div>
    {/if}
  </div>
</div>
