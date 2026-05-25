<!-- +page.svelte -->
<script lang="ts">
  import ConfigPanel from "./ConfigPanel.svelte";
</script>

<div class="container mx-auto p-4 h-screen">
  <h1 class="text-2xl font-bold mb-4">环境设置</h1>

  <div class="card bg-base-200 h-[calc(100vh-120px)]">
    <div class="card-body p-0">
      <ConfigPanel />
    </div>
  </div>
</div>
