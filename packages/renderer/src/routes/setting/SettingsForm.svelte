<!-- SettingsForm.svelte -->
<script lang="ts">
    import type { ConfigItem } from "./types";
    import { createForm } from "felte";
    import { validator } from "@felte/validator-zod"; // 使用 zod 验证器 [[1]][doc_1]
    import { z } from "zod"; // 导入 zod [[1]][doc_1]
    // 导入 iconify 图标
    import EyeIcon from "~icons/bi/eye"; // 使用 @iconify-json/bi 包中的图标 [[2]][doc_2]
    import EyeSlashIcon from "~icons/bi/eye-slash"; // 使用 @iconify-json/bi 包中的图标 [[2]][doc_2]
    import AlertIcon from "~icons/bi/exclamation-triangle"; // 错误图标 [[2]][doc_2]
    import CheckIcon from "~icons/bi/check-circle"; // 成功图标 [[2]][doc_2]
    import { createSettingStore } from "$lib/stores/setting";
    import { onMount } from 'svelte'
  
    export let item: ConfigItem;
  
    const settingStore = createSettingStore(item.id);
  
    let showPassword = false;
    let isSubmitting = false;
    let submitSuccess = false;
  
    const schema = z.object({
      value: z.string().min(1, { message: "值不能为空" }),
    });
  
    // 使用 felte 1.3.0 创建表单 [[1]][doc_1]
    const { form, errors, isValid, setFields } = createForm({
      initialValues: {
        value: item.value || "",
      },
      extend: validator({ schema }),
      onSubmit: async (values) => {
        isSubmitting = true;
        submitSuccess = false;
        try {
        //   console.log("values=", values)
          await settingStore.save(values.value);

          // 确保表单保持当前值，不会重置
          setFields("value", values.value);
          submitSuccess = true;
          // 3秒后隐藏成功提示
          setTimeout(() => {
            submitSuccess = false;
          }, 3000);
        } catch (error) {
          console.error("保存失败:", error);
        } finally {
          isSubmitting = false;
        }
      },
    });
  
    onMount(async () => {
      const value = await settingStore.load();
      setFields("value", value || "");
    });
  
    function toggleShowPassword() {
      showPassword = !showPassword;
    }
</script>

<!-- 浮动成功提示 Toast -->
{#if submitSuccess}
  <div class="toast toast-top toast-center z-50">
    <div class="alert alert-success shadow-lg animate-bounce-in">
      <CheckIcon class="w-5 h-5" />
      <span class="font-medium">配置保存成功！</span>
    </div>
  </div>
{/if}

<!-- 加载中状态 -->
{#if $settingStore.loading}
  <div class="card bg-base-100 shadow-md p-4">
    <div class="flex flex-col items-center justify-center py-8 space-y-4">
      <!-- 使用 daisyui 的 loading spinner [[3]][doc_3] -->
      <span class="loading loading-spinner loading-lg text-primary"></span>
      <p class="text-base-content/70">加载配置中...</p>
    </div>
  </div>

<!-- 错误状态 -->
{:else if $settingStore.error}
  <div class="card bg-base-100 shadow-md p-4">
    <div class="alert alert-error">
      <AlertIcon class="w-5 h-5" />
      <div>
        <h3 class="font-bold">加载失败</h3>
        <div class="text-xs">{$settingStore.error}</div>
      </div>
    </div>
    
    <!-- 重试按钮 -->
    <div class="mt-4 flex justify-center">
      <button 
        class="btn btn-outline btn-sm"
        on:click={() => settingStore.load()}
      >
        重试
      </button>
    </div>
  </div>

<!-- 正常状态 -->
{:else}
  <div class="card bg-base-100 shadow-md p-4">
    <h2 class="text-xl font-bold mb-2">{item.name}</h2>
    <p class="text-sm text-base-content/70 mb-4">分类: {item.cate}</p>

    <form use:form class="space-y-4">
      <div class="form-control w-full">
        <label for="value-input" class="label">
          <span class="label-text">API-KEY</span>
        </label>
        
        <div class="join w-full">
          <input
            id="value-input"
            type={showPassword ? "text" : "password"}
            name="value"
            placeholder="请输入配置值"
            class="input input-bordered join-item flex-1"
            class:input-error={$errors.value}
            disabled={isSubmitting}
          />
          <button
            type="button"
            class="btn btn-square btn-outline join-item"
            class:btn-disabled={isSubmitting}
            on:click|preventDefault={toggleShowPassword}
            aria-label={showPassword ? "隐藏密码" : "显示密码"}
          >
            <!-- 使用 unplugin-icons 导入的图标组件 [[2]][doc_2] -->
            {#if showPassword}
              <EyeSlashIcon class="w-4 h-4" />
            {:else}
              <EyeIcon class="w-4 h-4" />
            {/if}
          </button>
        </div>

        <!-- 表单验证错误提示 -->
        {#if $errors.value}
          <label class="label">
            <span class="label-text-alt text-error flex items-center gap-1">
              <AlertIcon class="w-3 h-3" />
              {$errors.value[0]}
            </span>
          </label>
        {/if}

        <div class="flex justify-end mt-4">
          <button 
            type="submit" 
            class="btn btn-primary min-w-20"
            class:btn-disabled={!$isValid || isSubmitting}
            disabled={!$isValid || isSubmitting}
          >
            {#if isSubmitting}
              <!-- 提交中的加载动画 -->
              <span class="loading loading-spinner loading-sm"></span>
              保存中...
            {:else}
              保存
            {/if}
          </button>
        </div>
      </div>
    </form>
  </div>
{/if}

<style>
  /* 使用 tailwindcss-animated 添加动画效果 [[3]][doc_3] */
  .animate-bounce-in {
    animation: bounceIn 0.5s ease-out;
  }
  
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: translateY(-20px) scale(0.9);
    }
    50% {
      transform: translateY(-5px) scale(1.05);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>