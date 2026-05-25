<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	// import { browser } from '$app/environment';
	import { initLib } from '$lib/index';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte'

	let { children } = $props();

	onMount(async () => {
		// 使用 store 中的值来设置初始主题
		document.documentElement.setAttribute('data-theme', $theme);
		await initLib();
	});
</script>

{@render children()}
<ConfirmDialog></ConfirmDialog>
