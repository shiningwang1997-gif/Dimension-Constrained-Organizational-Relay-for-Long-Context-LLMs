<script lang="ts">
  import { createForm } from "felte";
  import { validator } from "@felte/validator-zod";
  import { bots, type Robot } from "$lib/stores/bots";
  import { z } from "zod";
  import { clone } from "remeda";

  // 使用 $props() 替代 export let
  interface Props {
    open: boolean;
    bot: Robot | null;
  }

  let { open = $bindable(false), bot = $bindable(null) }: Props = $props();

  // 定义表单数据类型
  interface FormData {
    name: string;
    type: string;
    textInput: string;
    voiceInput: string;
    imageInput: string;
    videoInput: string;
    textOutput: string;
    voiceOutput: string;
    imageOutput: string;
    videoOutput: string;
    [key: string]: string; // 添加索引签名
  }

  const deftxtio = "deepseek";
  // 固定的选项值
  const textOptions = [{ value: "deepseek", label: "Deepseek(默认)" }];

  const disabledOptions = [{ value: "disabled", label: "暂不支持" }];

  const schema = z.object({
    name: z.string().min(3, "名称至少3个字符"),
    type: z.string(),
    textInput: z.string().min(1, "请选择文本输入模型"),
    voiceInput: z.string(),
    imageInput: z.string(),
    videoInput: z.string(),
    textOutput: z.string().min(1, "请选择文本输出模型"),
    voiceOutput: z.string(),
    imageOutput: z.string(),
    videoOutput: z.string(),
  });

  // 显式类型注解
  const { form, errors, isValid, reset, setData, setFields } =
    createForm<FormData>({
      initialValues: {
        name: bot?.name ?? "",
        type: bot?.type ?? "",
        textInput: bot?.config?.input?.text ?? deftxtio,
        voiceInput: "disabled",
        imageInput: "disabled",
        videoInput: "disabled",
        textOutput: bot?.config?.output?.text ?? deftxtio,
        voiceOutput: "disabled",
        imageOutput: "disabled",
        videoOutput: "disabled",
      },
      extend: validator({ schema }), // 修改：使用 extend 而不是 validate
      onSubmit: (values: FormData) => {
        // console.log("form values=", values);
        const config = {
          input: {
            text: values.textInput,
            voice: values.voiceInput,
            image: values.imageInput,
            video: values.videoInput,
          },
          output: {
            text: values.textOutput,
            voice: values.voiceOutput,
            image: values.imageOutput,
            video: values.videoOutput,
          },
        };
        if (bot) {
          const updBot = clone(bot);
          updBot.name = values.name;
          updBot.type = values.type ?? "";
          updBot.config = config;
          bots
            .updateRobot(updBot)
            .then((num) => {
              console.log("update bot count:", num);
            })
            .finally(() => {
              closeModal();
            });
        } else {
          console.log("new bots values:", values);
          bots
            .addRobot({
              name: values.name,
              type: values.type ?? "",
              taskCount: 0,
              status: "pending",
              config,
            })
            .then((id) => {
              console.log("id=", id);
            })
            .finally(() => {
              closeModal();
            });
        }
      },
    });

  function checkData() {
    // 在这里执行你的数据检查逻辑
    console.log("当前机器人数据:", bot);
    const nameValue = bot ? bot.name : "";
    const typeValue = bot?.type ?? "";
    const textInput = bot ? bot.config?.input?.text : deftxtio;
    const textOutput = bot ? bot.config?.output?.text : deftxtio;
    const newData = {
      name: nameValue,
      type: typeValue,
      textInput: textInput,
      textOutput: textOutput,
      // 其他字段保持默认值
      voiceInput: "disabled",
      imageInput: "disabled",
      videoInput: "disabled",
      voiceOutput: "disabled",
      imageOutput: "disabled",
      videoOutput: "disabled",
    };
    console.log("setdata=", newData);
    setData(newData);
    setFields("name", nameValue, false);
    setFields("type", typeValue, false);
    setFields("textInput", textInput, false);
    setFields("textOutput", textOutput, true);
  }

  $effect(() => {
    if (open) {
      // 弹窗打开时执行的函数
      checkData();
    }
  });

  function closeModal() {
    open = false;
    reset();
  }
</script>

<div class="modal {open ? 'modal-open' : ''}" role="dialog">
  <div class="modal-box w-11/12 max-w-2xl">
    <h3 class="mb-6 text-lg font-bold">机器人入职</h3>

    <form use:form class="space-y-6">
      <!-- 基本信息 -->
      <div class="form-control">
        <label class="label" for="name">
          <span class="label-text">名称</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          class="input input-bordered w-full {$errors.name
            ? 'input-error'
            : ''}"
          placeholder="名称(建议以职位命名)"
        />
        {#if $errors.name}
          <span class="mt-1 text-sm text-error">{$errors.name[0]}</span>
        {/if}
      </div>

      <!-- 内建岗位信息 -->
      <div class="form-control">
        <label class="label" for="name">
          <span class="label-text">岗位</span>
        </label>
        <input
          type="text"
          id="type"
          name="type"
          class="input input-bordered w-full {$errors.type
            ? 'input-error'
            : ''}"
          placeholder="已有岗位(ad,novel,wedoc)"
        />
        {#if $errors.type}
          <span class="mt-1 text-sm text-error">{$errors.type[0]}</span>
        {/if}
      </div>

      <!-- 输入配置 -->
      <div class="divider">
        <span class="text-base font-semibold">输入能力</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 文本输入 -->
        <div class="form-control">
          <label class="label" for="textInput">
            <span class="label-text">文本输入</span>
          </label>
          <select
            id="textInput"
            name="textInput"
            class="select select-bordered w-full {$errors.textInput
              ? 'select-error'
              : ''}"
          >
            <option value="">请选择文本输入模型</option>
            {#each textOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
          {#if $errors.textInput}
            <span class="mt-1 text-sm text-error">{$errors.textInput[0]}</span>
          {/if}
        </div>

        <!-- 语音输入 -->
        <div class="form-control">
          <label class="label" for="voiceInput">
            <span class="label-text">语音输入</span>
          </label>
          <select
            id="voiceInput"
            name="voiceInput"
            class="select select-bordered w-full"
            disabled
          >
            {#each disabledOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <!-- 图像输入 -->
        <div class="form-control">
          <label class="label" for="imageInput">
            <span class="label-text">图像输入</span>
          </label>
          <select
            id="imageInput"
            name="imageInput"
            class="select select-bordered w-full"
            disabled
          >
            {#each disabledOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <!-- 视频输入 -->
        <div class="form-control">
          <label class="label" for="videoInput">
            <span class="label-text">视频输入</span>
          </label>
          <select
            id="videoInput"
            name="videoInput"
            class="select select-bordered w-full"
            disabled
          >
            {#each disabledOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <!-- 输出配置 -->
      <div class="divider">
        <span class="text-base font-semibold">输出能力</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 文本输出 -->
        <div class="form-control">
          <label class="label" for="textOutput">
            <span class="label-text">文本输出</span>
          </label>
          <select
            id="textOutput"
            name="textOutput"
            class="select select-bordered w-full {$errors.textOutput
              ? 'select-error'
              : ''}"
          >
            <option value="">请选择文本输出模型</option>
            {#each textOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
          {#if $errors.textOutput}
            <span class="mt-1 text-sm text-error">{$errors.textOutput[0]}</span>
          {/if}
        </div>

        <!-- 语音输出 -->
        <div class="form-control">
          <label class="label" for="voiceOutput">
            <span class="label-text">语音输出</span>
          </label>
          <select
            id="voiceOutput"
            name="voiceOutput"
            class="select select-bordered w-full"
            disabled
          >
            {#each disabledOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <!-- 图像输出 -->
        <div class="form-control">
          <label class="label" for="imageOutput">
            <span class="label-text">图像输出</span>
          </label>
          <select
            id="imageOutput"
            name="imageOutput"
            class="select select-bordered w-full"
            disabled
          >
            {#each disabledOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <!-- 视频输出 -->
        <div class="form-control">
          <label class="label" for="videoOutput">
            <span class="label-text">视频输出</span>
          </label>
          <select
            id="videoOutput"
            name="videoOutput"
            class="select select-bordered w-full"
            disabled
          >
            {#each disabledOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="modal-action pt-6">
        <button type="button" class="btn" onclick={closeModal}>取消</button>
        <button type="submit" class="btn btn-primary" disabled={!$isValid}>
          保存配置
        </button>
      </div>
    </form>
  </div>

  <div
    class="modal-backdrop"
    onclick={closeModal}
    onkeydown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        closeModal();
      }
    }}
    role="button"
    tabindex="0"
  ></div>
</div>
