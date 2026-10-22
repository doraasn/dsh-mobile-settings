window.__ModuleLoader__.load({
	id: "dsh-mobile-settings",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		const { createElement: h, useEffect, useState } = react;

		/** 只需要 UI 槽位注册表。 */
		const inject = ["slots"];

		/**
		 * dsh-mobile 把「移动访问」注册在 `sidebar.footer.action` 槽位，按钮类名固定为
		 * `.dsh-mobile-control__trigger`，面板容器是 `.dsh-mobile-control`（fixed，
		 * z-index 1000）。这里只做两件事：
		 *   1. 隐藏侧栏按钮（保留 DOM，仍可被程序点击）；
		 *   2. 把面板抬到设置弹窗之上，使设置页里的按钮能把面板打开。
		 */
		const STYLE = [
			".dsh-mobile-control__trigger{display:none!important}",
			".dsh-mobile-control{z-index:3000!important}",
		].join("\n");

		const TEXT_PRIMARY = "var(--dsw-alias-label-primary, #16181d)";
		const TEXT_SECONDARY = "var(--dsw-alias-label-secondary, #606873)";
		const TEXT_TERTIARY = "var(--dsw-alias-label-tertiary, #8b929c)";
		const BORDER = "var(--dsw-alias-border-l3, #cfd5dd)";

		/**
		 * 点击设置页的按钮后，dsh-mobile 挂在 document 上的「点外面就关」监听会
		 * 立刻把刚打开的面板关掉（它只排除面板内部和 trigger 自身）。把点击推迟到
		 * 当前事件冒泡结束之后，就能绕开这次关闭。
		 */
		function openMobileAccess() {
			window.setTimeout(() => {
				const trigger = document.querySelector(".dsh-mobile-control__trigger");
				if (trigger === null) return;
				if (trigger.getAttribute("aria-expanded") !== "true") trigger.click();
			}, 30);
		}

		function MobileAccessSection() {
			const [available, setAvailable] = useState(false);
			useEffect(() => {
				setAvailable(document.querySelector(".dsh-mobile-control__trigger") !== null);
			}, []);
			return h(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						gap: 12,
						maxWidth: 640,
						padding: "4px 0 8px",
						color: TEXT_PRIMARY,
						fontSize: 13,
						lineHeight: "20px",
					},
				},
				h(
					"p",
					{ style: { margin: 0, color: TEXT_SECONDARY } },
					"移动访问已从侧栏收进这里。局域网 / 远程通道、配对二维码、已配对设备和连接诊断都在同一个面板里。"
				),
				h(
					"div",
					{ style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } },
					h(
						"button",
						{
							type: "button",
							onClick: openMobileAccess,
							disabled: !available,
							style: {
								minHeight: 36,
								padding: "6px 14px",
								border: `1px solid ${BORDER}`,
								borderRadius: 10,
								background: "transparent",
								color: "inherit",
								font: "inherit",
								cursor: available ? "pointer" : "not-allowed",
								opacity: available ? 1 : 0.55,
							},
						},
						"打开移动访问"
					),
					h(
						"span",
						{ style: { fontSize: 12, color: TEXT_TERTIARY } },
						available ? "dsh-mobile 已加载" : "未检测到 dsh-mobile，请先在「插件」页启用它"
					)
				),
				h(
					"p",
					{ style: { margin: 0, fontSize: 12, lineHeight: "18px", color: TEXT_TERTIARY } },
					"面板打开后浮在设置弹窗之上，配置完点面板右上角 × 关闭即可。"
				)
			);
		}

		function apply(ctx) {
			const style = document.createElement("style");
			style.dataset.dshMobileSettings = "true";
			style.textContent = STYLE;
			document.head.appendChild(style);

			const removeStyle = ctx.effect(
				() => () => style.remove(),
				"dsh-mobile-settings: hide the sidebar entry"
			);

			ctx.slots.inject("settings.section", () =>
				ctx.slots.register(
					{
						id: "mobile-access",
						name: "settings.section",
						order: 200,
						label: () => "移动访问",
					},
					MobileAccessSection
				)
			);

			return () => {
				if (typeof removeStyle === "function") removeStyle();
				style.remove();
			};
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	},
});
