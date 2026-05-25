<script lang="ts">
  import { createForm } from "felte";
  import { validator } from "@felte/validator-zod";
  import { z } from "zod";
  import { rpc } from "@app/preload";
  import type { Message } from "$lib/stores/msg";
  import dayjs from "$lib/utils/dayjs";
  import Markdown from "svelte-exmarkdown";

  let { bid } = $props();
  console.log("bid=", bid);

  // 表单验证schema
  const schema = z.object({
    jsonInput: z
      .string()
      .min(1, "请输入JSON数据")
      .refine((val) => {
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      }, "请输入有效的JSON格式"),
    textInput: z.string().min(1, "请输入描述文字"),
  });

  let markdownResult: string = $state("");
  let isLoading: boolean = $state(false);
  let errorMessage: string = $state("");

  // JSON占位符文本
  const jsonPlaceholder = '{\n  "key": "value",\n  "array": [1, 2, 3]\n}';

  function getMessage(
    content: string,
    sender: "user" | "ai" = "user",
  ): Message {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender,
      timestamp: dayjs().format(),
    };
    return newMessage;
  }

  // 使用felte创建表单
  const { form, errors, isValid } = createForm({
    extend: validator({ schema }),
    onSubmit: async (values) => {
      isLoading = true;
      errorMessage = "";

      try {
        const msg = {
          json: values.jsonInput,
          text: values.textInput,
        };
        const response = await rpc.bots.train.send(
          getMessage(JSON.stringify(msg)),
          bid,
          "test",
        );

        if (!response) {
          throw new Error("服务器响应错误");
        }

        markdownResult = response.content || "";
      } catch (error) {
        errorMessage =
          error instanceof Error ? error.message : "处理失败，请重试";
      } finally {
        isLoading = false;
      }
    },
  });

  // 格式化JSON输入
  function formatJSON() {
    const textarea = document.getElementById(
      "jsonInput",
    ) as HTMLTextAreaElement;
    try {
      const parsed = JSON.parse(textarea.value);
      textarea.value = JSON.stringify(parsed, null, 2);
    } catch (error) {
      // 忽略格式化错误
    }
  }

  // 复制到剪贴板
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(markdownResult);
    } catch (err) {
      console.error("复制失败:", err);
    }
  }
</script>

<div class="container mx-auto p-6 max-w-6xl">
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-6">
        <span class="text-primary">测试</span> 并回应
        <span class="text-secondary">Markdown</span> 工具
      </h2>

      <form use:form class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- JSON输入区域 -->
          <div class="form-control">
            <div class="label">
              <label for="jsonInput" class="label-text font-semibold"
                >JSON 数据</label
              >
              <button
                type="button"
                class="btn btn-outline btn-xs"
                onclick={formatJSON}
              >
                格式化
              </button>
            </div>
            <textarea
              id="jsonInput"
              name="jsonInput"
              class="textarea textarea-bordered h-64 font-mono text-sm"
              class:textarea-error={$errors.jsonInput}
              placeholder={jsonPlaceholder}
            ></textarea>
            {#if $errors.jsonInput}
              <div class="label">
                <span class="label-text-alt text-error"
                  >{$errors.jsonInput[0]}</span
                >
              </div>
            {/if}
          </div>

          <!-- 文字输入区域 -->
          <div class="form-control">
            <label for="textInput" class="label">
              <span class="label-text font-semibold">描述文字</span>
            </label>
            <textarea
              id="textInput"
              name="textInput"
              class="textarea textarea-bordered h-64"
              class:textarea-error={$errors.textInput}
              placeholder="请输入索引左方JSON的Langchain Template..."
            ></textarea>
            {#if $errors.textInput}
              <div class="label">
                <span class="label-text-alt text-error"
                  >{$errors.textInput[0]}</span
                >
              </div>
            {/if}
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="form-control">
          <button
            type="submit"
            class="btn btn-primary"
            class:loading={isLoading}
            disabled={!$isValid || isLoading}
          >
            {#if isLoading}
              <span class="loading loading-spinner"></span>
              处理中...
            {:else}
              生成 Markdown
            {/if}
          </button>
        </div>

        <!-- 错误提示 -->
        {#if errorMessage}
          <div class="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        {/if}
      </form>

      <!-- Markdown结果显示区域 -->
      {#if markdownResult}
        <!-- <div class="divider">结果</div> -->
        <div class="form-control">
          <div class="label">
            <label for="markdownOutput" class="label-text font-semibold"
              >生成的 Markdown</label
            >
            <button
              type="button"
              class="btn btn-outline btn-sm"
              onclick={copyToClipboard}
            >
              复制
            </button>
          </div>

          <div class="divider">↓↓↓结果↓↓↓</div>

          <div class="ai-markdown-content w-full">
            <Markdown md={markdownResult} />
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .textarea {
    resize: vertical;
  }
</style>
