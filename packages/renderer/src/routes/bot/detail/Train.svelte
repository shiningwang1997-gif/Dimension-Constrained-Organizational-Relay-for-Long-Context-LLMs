<script lang="ts">
  import { onMount } from "svelte";
  import dayjs from "dayjs";
  import Markdown from "svelte-exmarkdown";
  import { ensureStore } from "$lib/stores/msg";
  import { ensureBot } from "$lib/stores/bot";

  let { bid } = $props();
  const bot = ensureBot(bid, "");
  // console.log("bot=", $bot.bot.type);

  let inputMessage = $state("");

  // console.log("bid=", bid);
  const messageStore = ensureStore(bid);
  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const typeValue = String($bot.bot.type).trim();
    console.log("type=", typeValue);
    // 添加用户消息
    messageStore.sendMessage(inputMessage, typeValue);

    // // 保存用户输入用于AI响应
    // const userInput = inputMessage;
    // inputMessage = "";

    // // 模拟AI回复
    // messageStore.simulateAIResponse(userInput);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const scrollToLatestMessage = () => {
    setTimeout(() => {
      const element = document.getElementById(
        `message-${$messageStore.latestMessageId}`,
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // 监听latestMessageId变化，自动滚动
  $effect(() => {
    if ($messageStore.latestMessageId && !$messageStore.thinking) {
      scrollToLatestMessage();
    }
  });

  // 组件挂载时加载消息（如果需要）
  onMount(() => {
    messageStore.loadMessages();
  });
</script>

<!-- 固定顶部输入区域 -->
<div class="sticky top-0 z-50 bg-base-100 shadow-lg border-b border-base-300">
  <!-- 聊天头部 -->
  <div class="navbar bg-neutral text-neutral-content">
    <div class="flex-1">
      <div class="flex items-center space-x-3">
        <div class="avatar online">
          <div class="w-10 rounded-full bg-success">
            <div
              class="flex items-center justify-center h-full text-white font-bold"
            >
              AI
            </div>
          </div>
        </div>
        <div>
          <h1 class="text-lg font-bold">AI 助手</h1>
          <p class="text-sm opacity-80">
            {$messageStore.isTyping ? "正在思考..." : "等待中"}
          </p>
        </div>
      </div>
    </div>
    <div class="flex-none">
      <div class="badge badge-accent">
        {$messageStore.messages.length} 次发言
      </div>
    </div>
  </div>

  <!-- 输入区域 -->
  <div class="bg-base-100 p-4">
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
          placeholder="输入你的消息..."
          class="textarea textarea-bordered flex-1 resize-none min-h-12 max-h-32"
          rows="1"
          disabled={$messageStore.isTyping}
        ></textarea>

        <button
          onclick={sendMessage}
          disabled={!inputMessage.trim() || $messageStore.isTyping}
          class="btn btn-neutral btn-square self-end"
          aria-label="发送消息"
        >
          {#if $messageStore.isTyping}
            <span class="loading loading-spinner loading-sm"></span>
          {:else}
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
          {/if}
        </button>
      </div>
    </div>

    <div
      class="max-w-4xl mx-auto flex justify-between items-center mt-2 text-xs text-base-content/60 ml-13"
    >
      <span>按 Enter 发送，Shift + Enter 换行</span>
      <div class="flex items-center space-x-2">
        <div class="badge badge-outline badge-xs">最新消息在顶部</div>
        <div class="badge badge-outline badge-xs">AI支持Markdown</div>
      </div>
    </div>
  </div>
</div>

<!-- 主要内容区域 -->
<div class="min-h-screen bg-base-200 pt-4 pb-20">
  <div class="max-w-4xl mx-auto px-4">
    <!-- AI正在输入指示器 -->
    {#if $messageStore.isTyping}
      <div class="chat chat-start animate-pulse mb-6">
        <div class="chat-image avatar">
          <div class="w-12 rounded-full bg-success">
            <div
              class="flex items-center justify-center h-full text-white font-bold"
            >
              AI
            </div>
          </div>
        </div>
        <div
          class="chat-bubble bg-success/20 text-success-content border border-success/30"
        >
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            <div
              class="w-2 h-2 bg-current rounded-full animate-bounce"
              style="animation-delay: 0.1s;"
            ></div>
            <div
              class="w-2 h-2 bg-current rounded-full animate-bounce"
              style="animation-delay: 0.2s;"
            ></div>
            <div class="ai-markdown-content w-full opacity-60">
              <Markdown md={$messageStore.thinking} />
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- 聊天消息列表 -->
    <div class="space-y-6">
      {#each $messageStore.messages as message (message.id)}
        <div
          id="message-{message.id}"
          class="chat {message.sender === 'user'
            ? 'chat-end'
            : 'chat-start'} animate-slide-in"
        >
          <div class="chat-image avatar">
            <div
              class="w-12 rounded-full {message.sender === 'user'
                ? 'bg-info'
                : 'bg-success'}"
            >
              <div
                class="flex items-center justify-center h-full text-white font-bold"
              >
                {message.sender === "user" ? "U" : "AI"}
              </div>
            </div>
          </div>

          <div class="chat-header mb-1">
            <span class="text-sm font-medium opacity-80">
              {message.sender === "user" ? "用户" : "AI 助手"}
            </span>
            <time class="text-xs opacity-50 ml-2">
              {dayjs(message.timestamp).fromNow()}
            </time>
          </div>

          <div
            class="chat-bubble w-full shadow-lg
                        {message.sender === 'user'
              ? 'bg-info/20 text-info-content border border-info/30 max-w-xs md:max-w-md lg:max-w-2xl'
              : 'bg-success/20 text-success-content border border-success/30 max-w-full'}"
          >
            {#if message.sender === "ai"}
              <!-- AI消息使用Markdown渲染 -->
              <div class="ai-markdown-content w-full">
                <Markdown md={message.content} />
              </div>
            {:else}
              <!-- 用户消息保持原样 -->
              <div class="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- 历史消息提示 -->
    {#if $messageStore.messages.length > 3}
      <div class="text-center py-8">
        <div class="divider">
          <span class="text-xs text-base-content/40"
            >向下滚动查看更多历史消息</span
          >
        </div>
      </div>
    {/if}

    <!-- 底部间距 -->
    <div class="h-20"></div>
  </div>
</div>

<!-- 回到顶部按钮 -->
<div class="fixed bottom-6 right-6 z-40">
  <button
    onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    class="btn btn-circle btn-neutral shadow-lg hover:shadow-xl transition-all duration-300"
    aria-label="回到顶部"
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
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      />
    </svg>
  </button>
</div>

<style>
  .animate-slide-in {
    animation: slideIn 0.4s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .textarea {
    field-sizing: content;
  }

  /* AI Markdown 内容自适应样式 - 覆盖 @tailwindcss/typography 的限制 */
  .ai-markdown-content {
    width: 100%;
  }

  .ai-markdown-content :global(*) {
    color: inherit !important;
    max-width: none !important;
    width: 100% !important;
  }

  .ai-markdown-content :global(h1),
  .ai-markdown-content :global(h2),
  .ai-markdown-content :global(h3),
  .ai-markdown-content :global(h4),
  .ai-markdown-content :global(h5),
  .ai-markdown-content :global(h6) {
    margin-top: 0.75em;
    margin-bottom: 0.5em;
    font-weight: 600;
  }

  .ai-markdown-content :global(p) {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    line-height: 1.6;
    width: 100%;
  }

  .ai-markdown-content :global(ul),
  .ai-markdown-content :global(ol) {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    padding-left: 1.5rem;
    width: 100%;
  }

  .ai-markdown-content :global(li) {
    margin-top: 0.25em;
    margin-bottom: 0.25em;
  }

  .ai-markdown-content :global(code) {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco,
      Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .ai-markdown-content :global(pre) {
    background-color: rgba(0, 0, 0, 0.1);
    margin-top: 0.75em;
    margin-bottom: 0.75em;
    padding: 0.75rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    width: 100%;
    max-width: none !important;
  }

  .ai-markdown-content :global(pre code) {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: inherit;
  }

  .ai-markdown-content :global(blockquote) {
    border-left: 4px solid rgba(34, 197, 94, 0.4);
    padding-left: 1rem;
    margin: 0.75em 0;
    font-style: italic;
    width: 100%;
  }

  .ai-markdown-content :global(strong) {
    font-weight: 600;
  }

  .ai-markdown-content :global(em) {
    font-style: italic;
  }

  /* 确保所有内容都能自适应宽度 */
  .ai-markdown-content :global(.prose),
  .ai-markdown-content :global(.prose *) {
    max-width: none !important;
    width: 100% !important;
  }
</style>
