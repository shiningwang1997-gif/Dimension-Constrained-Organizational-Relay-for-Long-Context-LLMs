<script lang="ts">
	import { confirmStore, handleConfirmResult } from '$lib/utils/ui/confirm';
</script>

{#if $confirmStore.isOpen}
	<!-- 使用DaisyUI的modal组件 -->
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="text-lg font-bold">
				{$confirmStore.options.title || '确认'}
			</h3>
			<p class="py-4">{$confirmStore.options.message}</p>
			<div class="modal-action">
				<button class="btn btn-outline" on:click={() => handleConfirmResult(false)}>
					取消
				</button>
				<button class="btn btn-error" on:click={() => handleConfirmResult(true)}>
					确认
				</button>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button on:click={() => handleConfirmResult(false)}>close</button>
		</form>
	</div>
{/if}