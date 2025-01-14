(function ($) {

	"use strict";

	// Define namespace
	var VanillePlugin = {};

	// Override plugin
	VanillePlugin.override = function (plugin) {

		const timeout = plugin.timeout || 0;
		plugin.timeout = parseInt(timeout) * 1000;

		const restful = plugin.restful || 0;
		plugin.restful = (parseInt(restful) === 1) ? true : false;

		const debug = plugin.debug || 0;
		plugin.debug = (parseInt(debug) === 1) ? true : false;

		// Extend plugin
		plugin = $.extend({
			baseUrl: '/',
			assetUrl: '/',
			ajaxUrl: '/',
			restUrl: '/',
			adminUrl: '/',
			loginUrl: '/',
			logoutUrl: '/',
			namespace: null,
			name: null,
			lang: null,
			linking: {},
			inputs: {},
			strings: {},
			overrided: true
		}, plugin);

		return plugin;
	}

	// Initialize plugin
	VanillePlugin.init = function (plugin, options) {

		// Define self
		const self = this;

		// Define global options
		self.reloading = false;

		// Overrided plugin
		if (!plugin?.overrided) {
			plugin = self.override(plugin);
		}

		// Extend options
		options = $.extend({
			color: '#000',
			submission: 'inter',
		}, options);

		// Form submission
		if (options.submission == 'inter'
			&& options.submission !== 'exter') {
			$('form').on('submit', function (e) {
				e.preventDefault();
				self.doLog('Default submit disabled');
			});
		}

		// Override empty <a> behavior
		$('a[href="#"]').click(function (e) {
			e.preventDefault();
			self.doLog('Default click disabled');
		});

		// Ajax request
		VanillePlugin.request = function (args) {

			// Extend args
			args = $.extend({
				type: 'POST',
				dataType: 'JSON',
				data: {},
				url: plugin.ajaxUrl,
				timeout: plugin.timeout,
				success: function (response) { },
				error: function (xhr, status, error) { },
				complete: function () { }
			}, args);

			// Send ajax
			$.ajax(args);

		};

		// Custom Ajax request
		VanillePlugin.doAjax = function (element, args) {

			if (typeof element == 'string') {
				element = $(element);
			}

			const type = element?.prop('tagName');
			if (!type) {
				self.doLog('Missing element (ajax)');
				return;
			}

			// Extend args
			args = $.extend({
				data: {},
				files: [], // Array
				silent: false,
				loading: true,
				successCb: function () { },
				errorCb: function () { },
				completeCb: function () { }
			}, args);

			// Do loading
			if (args.loading) {
				self.loading(element);
			}

			// Set action
			let action = args.data.action || null;
			if (!action) {
				if (type == 'FORM') {
					action = element.find('input[name="action"]').val()
						|| element.data('action');

				} else {
					action = element.attr('data-action');
				}
			}

			// Format action
			action = self.applyNamesapce(action);
			if (action) {
				args.data['--action'] = action;
			}

			// Set token
			let token = args.data.token || null;
			if (!token) {
				if (type == 'FORM') {
					token = element.find('input[name="token"]').val()
						|| element.data('token');

				} else {
					const parent = element.parent('div');
					token = parent.find('[data-token]').attr('data-token')
						|| element.attr('data-token');
				}
			}

			// Format token
			args.data['--token'] = token || plugin.token;

			// Extend callbacks
			args = $.extend({
				success: function (response) {

					args.successCb(response);

					// Message
					const silent = response?.content?.silent || args.silent;
					const message = response?.message || null;
					const status = response?.status || 'info';

					if (message && silent === false) {
						self.notify(message, status);
					}

					// Reload
					const reload = response?.content?.reload || self.reloading;
					if (reload === true) {
						self.reload(1500);
						return;
					}

					// Redirect
					const redirect = response?.content?.redirect || null;
					if (typeof redirect == 'string') {
						self.redirect(redirect);
						return;
					}

				},
				error: function (xhr, status, error) {

					args.errorCb(error);

					if (args.silent === false) {
						const message = self.getString('error') || 'error';
						self.notifyMore(message, error, 'error');
					}

				},
				complete: function () {

					args.completeCb();
					self.unloading(element);

				}
			}, args);

			// Set files data
			if (args.files.length) {

				const files = args.files;

				// Init form data
				const fd = new FormData();

				// Add files to form
				files.forEach((file, i) => {
					fd.append(i, file);
				});

				// Add data to form
				$.each(args.data, function (key, value) {
					fd.append(key, value);
				});

				// Set files settings
				args.data = fd;
				args.processData = false;
				args.contentType = false;

			}

			// Send request
			self.request(args);
		}

		// Fetch API request
		VanillePlugin.fetch = async function (url, args) {
			try {
				const response = await fetch(url, args);
				return response;
			} catch (error) {
				throw error;
			}
		};

		// Custom Fetch API request
		VanillePlugin.doFetch = function (element, args) {

			if (typeof element == 'string') {
				element = $(element);
			}

			const type = element?.prop('tagName');
			if (!type) {
				self.doLog('Missing element (fetch)');
				return;
			}

			// Extend args
			args = $.extend({
				method: 'POST',
				headers: {},
				data: {},
				timeout: plugin.timeout,
				silent: false,
				loading: true,
				successCb: function () { },
				errorCb: function () { },
				completeCb: function () { }
			}, args);

			// Do loading
			if (args.loading) {
				self.loading(element);
			}

			// Set action (path)
			let action = args.data.action || null;
			if (!action) {
				if (type == 'FORM') {
					action = element.find('input[name="action"]').val()
						|| element.data('action');

				} else {
					action = element.attr('data-action');
				}
			}

			// Format action
			action = self.applyNamesapce(action) || '';

			// Set token (X-Token)
			let token = args.data.token || null;
			if (!token) {
				if (type == 'FORM') {
					token = element.find('input[name="token"]').val()
						|| element.attr('data-token');

				} else {
					const parent = element.parent('div');
					token = parent.find('[data-token]').attr('data-token')
						|| element.attr('data-token');
				}
			}

			// Format token
			token = token || plugin.token;

			// Extend headers
			const headers = $.extend({
				'Content-Type': 'application/json',
				'X-Token': token
			}, args.headers);

			// Set url
			const url = self.formatUrl(`${plugin.restUrl}/${action}/`);

			// Fetch response
			self.fetch(url, {
				headers: headers,
				method: args.method,
				signal: AbortSignal.timeout(args.timeout),
				body: JSON.stringify(args.data)

			}).then(response => {

				if (!response.ok) {
					throw new Error(response.statusText);
				}
				return response.json();

			}).then(response => {

				args.successCb(response);

				// Message
				const silent = response?.content?.silent || args.silent;
				const message = response?.message || null;
				const status = response?.status || 'info';

				if (message && silent === false) {
					self.notify(message, status);
				}

				// Reload
				const reload = response?.content?.reload || self.reloading;
				if (reload === true) {
					self.reload(1500);
					return;
				}

				// Redirect
				const redirect = response?.content?.redirect || null;
				if (typeof redirect == 'string') {
					self.redirect(redirect);
					return;
				}

			}).catch(error => {

				args.errorCb(error.message);

				if (args.silent === false) {
					const message = self.getString('error') || 'error';
					self.notifyMore(message, error, 'error');
				}

			}).finally(() => {

				args.completeCb();
				self.unloading(element);

			});

		};

		// saveHooks
		VanillePlugin.saveHooks = function (group, form, args) {

			if (!plugin.hooks) return;

			const hooks = plugin.hooks[group] || {};
			if (self.isEmpty(hooks)) return;

			const data = {};
			$.each(hooks, function (key) {

				// Set element
				const element = form.find(`[name="${key}"]`);
				const tag = element?.prop('tagName');

				if (!tag || tag == 'BUTTON' || tag == 'p') {
					return;
				}

				if (element.length) {

					const type = element.attr('type') || 'text';
					const step = element.attr('step') || false;
					let val;

					if (tag == 'CHECKBOX') {
						val = self.toBool(element.is(':checked'));

					} else if (tag == 'INPUT' && type == 'number') {
						if (step !== false) {
							val = self.toFloat(element.val());

						} else {
							val = self.toInt(element.val());
						}

					} else {
						val = self.toStr(element.val());
					}

					const saved = self.toStr(hooks[key]);
					if (val !== saved) {
						data[group] = {};
						data[group][key] = val;
					}

				}

			});

			if (self.isEmpty(data)) return;

			// Extend args
			args = $.extend({
				action: 'save-hooks',
				endpoint: 'hooks',
				token: false,
				silent: true,
				loading: false
			}, args);

			// Set data
			args.data = { hooks: data };

			if (plugin.restful == true) {
				self.doFetch(form, args);

			} else {
				const token = form.find('input[name="hook-token"]').val();
				args.token = token;
				self.doAjax(form, args);
			}

		}

		// isLoading
		VanillePlugin.isLoading = function (element) {

			if (typeof element == 'string') {
				element = $(element);
			}

			const type = element?.prop('tagName');
			if (!type) {
				self.doLog('Missing element (isLoading)');
				return;
			}

			if (type == 'FORM') {
				return element.find('[type="submit"]').hasClass('icon-loading');
			}

			return element.hasClass('icon-loading');

		}

		// unloading
		VanillePlugin.unloading = function (element) {

			if (typeof element == 'string') {
				element = $(element);
			}

			const type = element?.prop('tagName');
			if (!type) {
				self.doLog('Missing element (unloading)');
				return;
			}

			if (type == 'FORM') {
				const button = element.find('[type="submit"]');
				if (button.length) {
					button.removeClass('icon-loading');
					button.prop('disabled', false);
				}

			} else {
				element.removeClass('icon-loading');
			}

		}

		// loading
		VanillePlugin.loading = function (element) {

			if (typeof element == 'string') {
				element = $(element);
			}

			const type = element?.prop('tagName');
			if (!type) {
				self.doLog('Missing element (loading)');
				return;
			}

			if (type == 'FORM') {
				const button = element.find('[type="submit"]');
				if (button.length) {
					button.addClass('icon-loading');
					button.prop('disabled', true);
				}

			} else {
				element.addClass('icon-loading');
			}

		}

		// popup
		VanillePlugin.popup = function (title, type, html) {

			if (typeof swal === 'undefined') {
				self.doLog('Missing popup library (SWAL)');
				return;
			}

			title = title || '';
			html = html || '';
			type = type || 'success';

			swal.fire({
				icon: type,
				title: title,
				html: html,
				heightAuto: false,
				confirmButtonColor: options.color,
				allowOutsideClick: false
			});

		}

		// popupMore
		VanillePlugin.popupMore = function (title, text, type) {
			const message = `${title}<br><small>${text}</small>`;
			self.popup(message, type);
		}

		// notify
		VanillePlugin.notify = function (message, type, timeout) {

			message = message || false;
			type = type || 'success';
			timeout = (timeout !== undefined) ? timeout : 3000;

			const selector = '.toast.--notification';
			const body = $('body');
			let toast = $(selector);
			let p = toast.find('.toast-body p');
			let i = toast.find('.toast-body i');
			let icon = 'bi-check-circle';

			if (type == 'error') {
				icon = 'bi-x-circle';

			} else if (type == 'warning') {
				icon = 'bi-exclamation-circle';

			} else if (type == 'info') {
				icon = 'bi-question-circle';
			}

			icon = `bi ${icon}`;

			if (!toast.length) {

				const config = {
					className: `toast --notification`,
					role: "alert",
					ariaLive: "assertive",
					ariaAtomic: "true",
					dataDelay: timeout
				};

				const button = {
					type: "button",
					className: "btn-close",
					dataDismiss: "toast",
					ariaLabel: "Close",
				};

				let output = `
                <div class="${config.className}" 
                    role="${config.role}" 
                    aria-live="${config.ariaLive}" 
                    aria-atomic="${config.ariaAtomic}" 
                    data-type="${type}" 
                    data-bs-delay="${config.dataDelay}">
                `;

				output += `
                <div class="toast-body">
                    <i class="${icon}"></i>
                    <p>${message}</p>
                </div>
                `;

				output += `
                <button type="${button.type}" 
                    class="${button.className}" 
                    data-bs-dismiss="${button.dataDismiss}" 
                    aria-label="${button.ariaLabel}">
                </button>
                </div>
                `;

				body.find(selector).remove();
				body.append(output);

				toast = $(selector);
				p = toast.find('.toast-body p');
				i = toast.find('.toast-body i');

			} else {
				toast.attr('data-bs-delay', timeout);
				toast.attr('data-type', type);
				i.attr('class', '').addClass(icon);
				p.html(message);
			}

			if (timeout > 0) {
				setTimeout(() => {
					toast.removeClass('show');
					p.html('{}');
				}, timeout);
			}

			toast.find('.btn-close').on('click', function (e) {
				e.preventDefault();
				toast.removeClass('show');
				p.html('{}');
			});

			toast.addClass('show');
		}

		// notifyMore
		VanillePlugin.notifyMore = function (message, more, type, timeout) {
			message = `${message}<br><small>${more}</small>`;
			self.notify(message, type, timeout);
		}

		// confirm
		VanillePlugin.confirm = function (args) {

			if (typeof $.confirm !== 'function') {
				self.doLog('Missing confirm library');
				return;
			}

			// extend args
			args = $.extend({
				element: null,
				message: null,
				confirmCb: null,
				cancelCb: null
			}, args);

			const element = args.element;

			// default confirm callback
			const confirmCb = args.confirmCb || function () { };

			// default cancel callback
			const cancelCb = args.cancelCb || function () {
				if (element) {
					self.unloading(element);
				}
				return;
			};

			const strings = self.getString();
			const message = args.message || strings.confirm || '';
			const title = strings.confirmation || 'confirmation';
			const yes = strings.yes || 'yes';
			const cancel = strings.cancel || 'cancel';

			$.confirm({
				title: title,
				content: message,
				animation: 'none',
				buttons: {
					confirm: {
						text: yes,
						btnClass: 'btn-primary',
						action: confirmCb
					},
					cancel: {
						text: cancel,
						action: cancelCb
					}
				}
			});

		};

		// wait
		VanillePlugin.wait = async function (callback, timer) {
			timer = timer || 500;
			await new Promise(resolve => setTimeout(resolve, timer));
			if (typeof callback === 'function') {
				callback();
			}
		}

		// parseInputs
		VanillePlugin.parseInputs = function (group, form) {

			if (!plugin.inputs) return;

			const inputs = plugin.inputs[group].values || {};
			if (self.isEmpty(inputs)) return;

			let data = {};
			$.each(inputs, function (input, args) {

				const type = args?.type + '[name="' + input + '"]';
				const element = form.find(type);
				let val;

				if (args?.format == 'bool') {
					val = self.toBool(element.is(':checked'));

				} else if (args?.format == 'int') {
					val = self.toInt(element.val());

				} else if (args?.format == 'float') {
					val = self.toFloat(element.val());

				} else {
					val = self.toStr(element.val());
				}

				data[input] = val;

			});

			return data;

		}

		// parseFiles
		VanillePlugin.parseFiles = function (element) {
			let files = [];
			const inputs = element.find('.file-upload input[type="file"]');
			if (inputs.length) {
				inputs.each(function () {
					const temp = $(this).prop('files');
					for (let i = 0; i < temp.length; i++) {
						files.push(temp[i]);
					}
				});
			}
			return files;
		}

		// Copy clipboard
		VanillePlugin.copyClipboard = async function (text) {
			if (navigator.clipboard) {
				try {
					await navigator.clipboard.writeText(text);
				} catch (err) { }

			} else {
				await self.copyClipboardLegacy(text);
			}
		}

		// Get string date
		VanillePlugin.getStringDate = function () {

			const today = new Date();
			const y = today.getFullYear();
			const m = today.getMonth() + 1;
			const d = today.getDate();
			const h = today.getHours();
			const mi = today.getMinutes();
			const s = today.getSeconds();
			return `${y}-${m}-${d}-${h}-${mi}-${s}`;

		}

		// Download blob file
		VanillePlugin.downloadFile = function (text, fileType, fileName) {

			const blob = new Blob([text], { type: fileType });
			const a = document.createElement('a');

			a.download = fileName;
			a.href = URL.createObjectURL(blob);
			a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
			a.style.display = 'none';

			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);

			setTimeout(function () {
				URL.revokeObjectURL(a.href);
			}, 1000);
		}

		// Init code editor
		VanillePlugin.initCodeEditor = function (selector, args) {

			if (typeof CodeMirror === 'undefined') {
				self.doLog('Missing editor library (CodeMirror)');
				return;
			}

			const textarea = document.querySelector(selector);
			if (!textarea) return;

			// Extend args
			const mode = textarea.getAttribute('data-mode') || 'html';
			const theme = textarea.getAttribute('data-theme') || 'monokai';
			args = $.extend({
				mode: mode,
				theme: theme,
				lineNumbers: true,
				autoRefresh: true,
				autofocus: true,
				autoCloseTags: true,
				autoCloseBrackets: true,
				matchBrackets: true,
				indentWithTabs: true,
				indentUnit: 2,
				tabSize: 2,
				scrollbarStyle: 'simple',
				placeholder: 'HTML code'
			}, args);

			const editor = CodeMirror.fromTextArea(textarea, args);
			if (!editor) return;

			editor.on('change', function () {
				textarea.value = editor.getValue();
			});

		}

		// Check duplication
		VanillePlugin.isDuplicated = function () {

			if (typeof window.IsDuplicate !== 'function') {
				self.doLog('Missing duplicated window library');
				return;
			}

			if (window.IsDuplicate()) {
				const message = self.getString('opened') || 'opened';
				self.notify(message, 'warning', 10000);
			}

			return this;
		}

		// Check connection
		VanillePlugin.isConnected = function (callback) {
			$(window).on('online', function () {
				self.online(callback);
			});
			$(window).on('offline', function () {
				self.offline(callback);
			});
		}

		// Reload
		VanillePlugin.reload = function (time) {
			time = time || 1000;
			self.wait(() => {
				location.reload();
			}, time)
		}

		// Redirect
		VanillePlugin.redirect = function (url, time) {
			if (typeof url == 'string') {
				time = time || 1000;
				self.wait(() => {
					self.goTo(url);
				}, time);
			}
		}

		// activate
		VanillePlugin.activate = function (form) {

			if (typeof form == 'string') {
				form = $(form);
			}

			form = form || $('form[name="activate"]');
			if (!self.isForm(form)) {
				self.doLog('Missing form (activate)');
				return;
			}

			form.on('submit', function (e) {

				e.preventDefault();
				const form = $(this);
				if (self.isLoading(form)) return;

				self.doAjax(form, {
					data: {
						activation: self.parseInputs('activation', form)
					},
					timeout: plugin.timeout * 10,
					success: function (response) {

						self.saveHooks('activation', form);
						self.toStorage('nav-tab', '#activation-tab', 10000);

						const title = response.message;
						const message = response.content.message;
						self.popupMore(title, message, response.status);

						if (response.content?.reload) {
							self.reload(1500);
						}

					},
					error: function (error) {

						const strings = self.getString('activation');
						const title = strings.error || 'activation';

						const globalStrings = self.getString('global');
						const message = globalStrings.error || 'error';

						self.popupMore(title, message, 'error');

					}
				});
			});

		}

		// register
		VanillePlugin.register = function (form) {

			if (typeof form == 'string') {
				form = $(form);
			}

			form = form || $('form[name="register"]');
			if (!self.isForm(form)) {
				self.doLog('Missing form (register)');
				return;
			}

			form.on('submit', function (e) {

				e.preventDefault();
				const form = $(this);
				if (self.isLoading(form)) return;

				const files = self.parseFiles(form);
				if (!files.length) {
					self.unloading(form);
					const strings = self.getString('upload');
					const message = strings.error || 'error';
					self.notify(message, 'warning');
					return;
				}

				self.doAjax(form, {
					files: files,
					timeout: plugin.timeout * 10
				});

			});

		}

		// unregister
		VanillePlugin.unregister = function (element) {

			if (typeof element == 'string') {
				element = $(element);
			}

			if (!element.length) {
				self.doLog('Missing element (unregister)');
				return;
			}

			element.on('click', function (e) {

				e.preventDefault();
				const el = $(this);
				if (self.isLoading(el)) return;

				(plugin.restful == true)
					? self.doFetch(el)
					: self.doAjax(el);
			});
		}

		// saveSettings
		VanillePlugin.saveSettings = function (form) {

			if (typeof form == 'string') {
				form = $(form);
			}

			form = form || $('form[name="settings"]');
			if (!self.isForm(form)) {
				self.doLog('Missing form (settings)');
				return;
			}

			form.on('submit', function (e) {

				e.preventDefault();
				const form = $(this);
				if (self.isLoading(form)) return;

				const args = {
					data: self.parseInputs('settings', form),
					successCb: function (response) {
						self.saveHooks('settings', form);
					}
				};

				(plugin.restful == true)
					? self.doFetch(form, args)
					: self.doAjax(form, args);

			});

		}

		// purgeCache
		VanillePlugin.purgeCache = function (element) {

			if (typeof element == 'string') {
				element = $(element);
			}

			element = element || $('[data-name="purge-cache"]');
			if (!element?.length) {
				self.doLog('Missing element (purge cache)');
				return;
			}

			element.on('click', function (e) {

				e.preventDefault();
				const el = $(this);
				if (self.isLoading(el)) return;

				self.confirm({
					confirmCb: function () {

						const action = el.attr('data-action')
							|| '/admin/cache/';

						const method = el.attr('data-method')
							|| 'DELETE';

						const data = { '--token': plugin.token };
						const url = self.getBaseUrl(action, true);
						const timeout = plugin.timeout * 10;
						const args = { url: url, type: method, timeout: timeout, data: data };

						(plugin.restful == true)
							? self.doFetch(el, args)
							: self.doAjax(el, args);

					}

				});

			});

		}

		// update
		VanillePlugin.update = function () {

			const page = $('body').attr('data-page') || null;
			if (!page) {
				self.doLog(`Page not found, Nothing to update`);
				return;
			}

			const form = $(`form[name="${page}"]`);
			if (!form.length) {
				self.doLog(`Form '${page}' not found`);
				return;
			}

			form.on('submit', function (e) {

				e.preventDefault();
				const form = $(this);
				if (self.isLoading(form)) return;

				self.confirm({
					confirmCb: function () {

						const action = form.attr('action')
							|| form.data('action')
							|| window.location.pathname;

						const method = form.attr('method')
							|| form.data('method')
							|| 'POST';

						let data = form.serializeArray();
						data.push({ name: '--token', value: plugin.token });
						data = self.toObject(data);

						const url = self.getBaseUrl(action, true);
						const timeout = plugin.timeout * 10;
						const args = { url: url, type: method, data: data, timeout: timeout };

						(plugin.restful == true)
							? self.doFetch(form, args)
							: self.doAjax(form, args);

					}

				});

			});
		}

		// login
		VanillePlugin.login = function (form) {

			if (typeof form == 'string') {
				form = $(form);
			}

			form = form || $('form[name="login"]');
			if (!self.isForm(form)) {
				self.doLog('Missing form (login)');
				return;
			}

			form.on('submit', function (e) {

				e.preventDefault();
				const form = $(this);
				if (self.isLoading(form)) return;

				const args = {
					url: plugin.loginUrl,
					data: {
						"user": form.find('input[name="user"]').val(),
						"pswd": form.find('input[name="pswd"]').val()
					},
					success: function (response) {

						const message = response?.message || 'error';
						const status = response?.status || 'error';

						self.notify(message, status);

						if (status == 'success') {
							self.wait(() => {
								self.goTo(plugin.adminUrl);
							}, 1000);
						}

					},
					error: function (xhr) {

						const message = xhr?.responseJSON?.message || 'error';
						const status = xhr?.responseJSON?.status || 'error';

						self.notify(message, status);

					}
				};

				(plugin.restful == true)
					? self.doFetch(form, args)
					: self.doAjax(form, args);

			});
		}

		// logout
		VanillePlugin.logout = function (element) {

			if (typeof element == 'string') {
				element = $(element);
			}

			element = element || $('.logout');
			if (!element?.length) {
				self.doLog('Missing element (logout)');
				return;
			}

			let url = `${plugin.logoutUrl}?--token=${plugin.token}`;
			url = self.getBaseUrl(url);

			element.on('click', function (e) {

				e.preventDefault();
				$('body').trigger('click');
				self.notify(self.getString('logout'), 'warning');
				self.wait(() => {
					self.goTo(url);
				}, 1000);

			});
		}

		// initTooltip
		VanillePlugin.initTooltip = function (args) {

			if (typeof $.tooltipster === 'undefined') {
				self.doLog('Missing tooltipster library');
				return;
			}

			args = $.extend({
				item: 'tooltip',
				theme: false,
				width: 400
			}, args);

			let item = args.item || 'tooltip';
			item = self.applyNamesapce(item);

			const parent = 'tooltipster-default';
			const theme = args.theme || [parent, `${item}-theme`];

			$(`.${item}:not(".tooltipstered")`).tooltipster({
				maxWidth: parseInt(args.width),
				theme: theme
			});

		}

		// initSwitcher
		VanillePlugin.initSwitcher = function (selector) {
			if (typeof $.switcher !== 'function') {
				self.doLog('Missing switcher library');
				return;
			}
			$(selector).switcher();
		}

		// onSwitchChange
		VanillePlugin.onSwitchChange = function (selector, callback) {
			$('body').delegate(selector, 'switcher-changed', callback);
		}

		// initColorPicker
		VanillePlugin.initColorPicker = function (selector, args) {

			if (typeof $.colorPick !== 'function') {
				self.doLog('Missing color picker library');
				return;
			}

			// Extend args
			args = $.extend({
				initial: '',
				label: '',
				recent: false,
				custom: true,
				selectCb: function () {
					const target = this.element.attr('data-name');
					const color = this.color;
					this.element.css({
						backgroundColor: color,
						color: color
					});
					$(`input[name="${target}"]`).val(color);
				}
			}, args);

			// Init
			$(selector).colorPick({
				initialColor: args.initial,
				paletteLabel: args.label,
				allowRecent: args.recent,
				recentMax: 0,
				allowCustomColor: args.custom,
				onColorSelected: args.selectCb
			});

			// Reset
			$('[data-name="reset-color"]').click(function (e) {
				e.preventDefault();
				const group = $(this).parent('.form-group');
				group.find(selector).css('background', '#d8d8d8');
				group.find('.form-control').val('');
			});

		}

		// modal
		VanillePlugin.modal = function (selector, args) {

			if (typeof $.modal !== 'function') {
				self.doLog('Missing modal library');
				return;
			}

			// Dynamic selector
			if (!selector) {
				selector = '[data-modal]';
			}

			// Extend args
			args = $.extend({
				duration: 150,
				close: false
			}, args);

			const element = $(selector);
			element.on('click', function (e) {
				e.preventDefault();

				const target = $(this).attr('data-modal');
				if (!target) return;

				const modal = $(`.${target}-modal`);
				modal.modal({
					fadeDuration: args.duration,
					showClose: args.close,
					escapeClose: false,
					clickClose: false
				});

			});

		}

		// initUpload
		VanillePlugin.initUpload = function (selector) {

			// Init dynamic selector
			if (!selector) {
				selector = 'input[type="file"]';
			}

			// Check element
			const element = $(selector);
			if (element?.prop('tagName') !== 'INPUT') return;

			// Check parent
			const parent = element.parent('div');
			if (!parent.length) return;
			if (!parent.hasClass('file-upload')) {
				parent.addClass('file-upload');
			}

			// Check label
			const label = parent.find('label');
			if (!label.length) return;
			if (label.attr('for') !== element.attr('id')) {
				return;
			}

			// Set default args
			const args = {
				accept: '.txt',
				type: 'text',
				size: 1 * (1024 * 1024)
			};

			// Set accept
			if (!element.attr('accept')) {
				element.attr('accept', args.accept);
			}

			// Set type
			if (!element.attr('data-type')) {
				element.attr('data-type', args.type);
			}

			// Set required
			if (!element.attr('data-required')) {
				element.attr('data-required', 'false');
			}

			// Remove multiple
			element.removeAttr('multiple');

			// Set title
			const title = label.find('span')?.text() || label.text();
			element.attr('data-title', title);

			// Set form (optional)
			const form = element.parents('form');
			let button;
			if (form.length) {
				button = form.find('button[type="submit"]');
			}

			// Add file
			element.on('change', function (e) {
				e.preventDefault();

				// Set input
				const input = $(this);

				// Set file
				const file = e.target.files[0];
				if (!file) return;

				// Set response strings
				const strings = self.getString('upload');

				// Check file size
				if (file.size > args.size) {
					self.notify(strings.size, 'warning', 0);
					input.val('');
					return;
				}

				// Enable button
				const requried = input.attr('data-required');
				if (button && requried == 'true') {
					button.prop('disabled', false);
				}

				// Init required content
				const parent = input.parent('div');
				const label = parent.find('label');

				// Init optional content
				const icon = label.find('i');
				const span = label.find('span');
				const small = label.find('small');
				const link = label.find('a');
				const accept = input.attr('accept');
				const title = input.attr('data-title');

				// Set content
				parent.addClass('uploaded');
				if (span.length) {
					span.text(strings.added);
				} else {
					label.appendChild(`<span>${strings.added}</span>`)
				}

				if (icon.length) {
					icon.addClass('icon-check');
					icon.removeClass('icon-cloud-upload');
				}

				if (small.length) {
					small.text(`(${file.name})`);
				}

				if (link.length) {

					link.css('visibility', 'visible');

					// Remove file
					link.on('click', function (e) {
						e.preventDefault();

						// Disable button
						const requried = input.attr('data-required');
						if (button && requried == 'true') {
							button.prop('disabled', true);
						}

						// Reset content
						input.val('');
						parent.removeClass('uploaded');
						icon.removeClass('icon-check');
						icon.addClass('icon-cloud-upload');
						span.text(title);
						small.text(`(${accept})`);
						$(this).css('visibility', 'hidden');

					});

				}

			});

		}

		// openInNewTab
		VanillePlugin.openInNewTab = function (url) {
			window.open(url, '_blank');
			return;
		}

		// navigateTab
		VanillePlugin.navigateTab = function (element, link, ttl = 10000) {

			// Namespaced tab
			let url = window.location.href;
			if (!url.includes(plugin.namespace)) {
				return;
			}

			// Save current tab
			element.on('click', function () {
				const id = $(this).attr('id');
				if (id) {
					self.toStorage('nav-tab', '#' + id, ttl);
				}
			});

			// Load saved tab
			const id = self.getStorage('nav-tab');
			if ($(id).length) {
				$(id).tab('show');
			}

			// Click tab link
			link.on('click', function (e) {
				e.preventDefault();
				const id = $(this).attr('data-target');
				const target = '#' + id;
				if ($(target).length) {
					$(target).tab('show');
				}
			});

		}

		// toStorage
		VanillePlugin.toStorage = function (key, value, ttl) {
			key = self.applyNamesapce(key);
			const data = {
				value: value,
				ttl: (ttl) ? Date.now() + parseInt(ttl) : false
			};
			localStorage.setItem(key, JSON.stringify(data));
		}

		// getStorage
		VanillePlugin.getStorage = function (key) {

			const _key = key;
			key = self.applyNamesapce(key);

			let data = localStorage.getItem(key);
			data = JSON.parse(data);
			let value;

			if (data && data?.ttl > Date.now()) {
				value = data?.value;

			} else {
				self.removeStorage(_key);
			}

			return value;

		}

		// removeStorage
		VanillePlugin.removeStorage = function (key) {
			key = self.applyNamesapce(key);
			localStorage.removeItem(key);
		}

		// purgeStorage
		VanillePlugin.purgeStorage = function () {
			localStorage.clear();
		}

		// applyNamesapce
		VanillePlugin.applyNamesapce = function (value) {
			if (plugin.namespace) {
				value = `${plugin.namespace}-${value}`;
			}
			return value;
		}

		// online
		VanillePlugin.online = function (callback) {
			if (typeof callback === 'function') {
				callback();

			} else {
				const message = self.getString('online') || 'online';
				self.notify(message, 'success');
			}
		}

		// offline
		VanillePlugin.offline = function (callback) {
			if (typeof callback === 'function') {
				callback();

			} else {
				const message = self.getString('offline') || 'offline';
				self.notify(message, 'error', 0);
			}
		}

		// serviceWorker
		VanillePlugin.serviceWorker = function (file) {
			if ('serviceWorker' in navigator) {
				file = file || '/public/assets/admin/js/service-worker.js';
				file = self.getBaseUrl(file);
				navigator.serviceWorker.register(file)
					.then(reg => self.doLog(`Service worker registered : ${reg.scope}`))
					.catch(error => self.doLog(`Service worker registration failed : ${error}`));
			}
		}

		// detectOS
		VanillePlugin.detectOS = function () {

			const os = navigator.userAgent || navigator.vendor || window.opera;
			var isWindows = /windows phone/i.test(os);
			var isAndroid = /android/i.test(os);
			var isIOS = /iPad|iPhone|iPod/.test(os) && !window.MSStream;

			if (isWindows) {
				$('.windows-device').addClass('is-active');
				$('.mobile-device').addClass('is-active');

			} else if (isAndroid) {
				$('.android-device').addClass('is-active');
				$('.mobile-device').addClass('is-active');

			} else if (isIOS) {
				$('.ios-device').addClass('is-active');
				$('.mobile-device').addClass('is-active');

			} else {
				$('.non-mobile-device').addClass('is-active');
			}
		}

		// darkMode
		VanillePlugin.darkMode = function () {

			const key = 'dark-mode';
			const className = 'is-dark-mode';
			const body = $('body');
			const switcher = $('[data-name="dark-mode"]');

			const applyDark = () => {
				if (!body.hasClass(className)) {
					body.addClass(className);
				}
			};

			const disableDark = () => {
				if (body.hasClass(className)) {
					body.addClass(className);
				}
			};

			const isActive = () => {
				const status = self.getStorage(key);
				return (parseInt(status) === 1);
			};

			if (isActive()) {
				applyDark();
				switcher.attr('checked', true);

			} else {
				disableDark();
				switcher.attr('checked', false);
			}

			// Change
			switcher.on('change', function () {
				if (isActive()) {
					applyDark();
					localStorage.setItem(key, 0);
					switcher.attr('checked', false);

				} else {
					body.addClass(active);
					switcher.attr('checked', true);
					localStorage.setItem(key, 1);
				}
			});

			switcher.on('change', function () {
				switcher.prop('checked', this.checked);
			});

		}

		// initTable
		VanillePlugin.initTable = function (selector, args) {

			const table = $(selector);
			if (!table.length) return table;

			args = $.extend({
				dom: 'rtip', // Bfrtipl
				ajax: {},
				order: [0, 'asc'], // [[0,"asc"]]
				language: { url: '' },
				searching: true,
				ordering: true,
				pageLength: 5,
				info: true,
				paging: true,
				select: false,
				stateSave: false,
				autoWidth: false,
				destroy: false,
				processing: false,
				serverSide: false,
				deferRender: false,
				lengthMenu: false, // [[10,25,50,-1], [10,25,50,"All"]]
				pagingType: 'simple_numbers',
				columnDefs: [],
				buttons: [],
				initComplete: function () { },
				createdRow: function () { },
				fnDrawCallback: function () { }
			}, args);

			return table.DataTable({
				dom: settings.dom,
				ajax: settings.ajax,
				order: settings.order,
				language: settings.language,
				searching: settings.searching,
				ordering: settings.ordering,
				pageLength: settings.pageLength,
				info: settings.info,
				paging: settings.paging,
				select: settings.select,
				stateSave: settings.stateSave,
				autoWidth: settings.autoWidth,
				destroy: settings.destroy,
				processing: settings.processing,
				serverSide: settings.serverSide,
				deferRender: settings.deferRender,
				lengthMenu: settings.lengthMenu,
				pagingType: settings.pagingType,
				columnDefs: settings.columnDefs,
				buttons: settings.buttons,
				initComplete: settings.initComplete,
				createdRow: settings.createdRow,
				fnDrawCallback: settings.fnDrawCallback
			});
		};

		// doNavbarScroll
		VanillePlugin.doNavbarScroll = function (selector, navbarClass) {

			selector = selector || '#main-nav';
			navbarClass = navbarClass || 'navbar-shrink';

			const element = $(selector);
			if (!element.length) return;

			if ($(window).scrollTop() === 0) {
				element.removeClass(navbarClass);
			} else {
				element.addClass(navbarClass);
			}
		}

		// doNavToggle
		VanillePlugin.doNavToggle = function (nav, offset) {

			nav = nav || '#main-nav';
			offset = offset || 50;
			const navbar = $(nav);

			if (navbar.length) {
				$('body').scrollspy({
					target: nav,
					offset: offset
				});
			}

			const toggle = $('.navbar-toggler');
			const item = $('#mobile-nav .nav-link');

			item.on('click', function () {
				if (toggle.css('display') !== 'none') {
					toggle.click();
				}
			});

		}

		// cookie
		VanillePlugin.cookie = function (display = true) {

			if (!display) return;

			const name = window.location.hostname;
			if (document.cookie.includes(name)) return;

			const strings = self.getString('cookie');
			const more = self.getString('more');
			const title = strings.title || 'title';
			const message = strings.message || 'message';
			const accept = strings.accept || 'accept';
			const decline = strings.decline || 'decline';

			let link = self.getLinking('privacy');
			link = self.getBaseUrl(link, true);
			const close = true;
			const icon = true;

			let output = `
			<div class="cookie-wrapper">
			<div class="cookie-header">
			`;

			if (icon === true) {
				output += '<span class="cookie-icon"></span>';
			}

			output += `
			<span class="cookie-title">${title}</span>
			</div>
			<div class="cookie-message">
			<p>${message}.
			`;

			if (link) {
				output += `<br><a href="${link}" rel="nofollow">${more}</a>`;
			}

			output += `
			</p>
			</div>
			<div class="cookie-action">
			<button class="cookie-button" data-action="accept">${accept}</button>
			`;

			if (close === true) {
				output += `<button class="cookie-button" data-action="decline">${decline}</button>`;
			}

			output += '</div></div>';

			$('body').append(output);

			const cookieBox = $('.cookie-wrapper');
			const cookieButtons = $('.cookie-button');
			cookieBox.addClass('show');

			cookieButtons.on('click', function (e) {
				e.preventDefault();

				cookieBox.removeClass('show');
				const action = $(this).attr('data-action');

				if (action === 'accept') {
					const days = 30;
					const expire = 60 * 60 * 24 * days;
					document.cookie = 'COOKIES=' + name + '; max-age=' + expire + '; path=/';
				}
			});
		}

		// click
		VanillePlugin.click = function (element) {

			if (typeof element == 'string') {
				element = $(element);
			}

			element = element || $('[data-target]');
			if (!element?.length) {
				self.doLog('Missing element (click)');
				return;
			}

			element.on('click', function (e) {

				e.preventDefault();

				const element = $(this);
				const link = element.attr('data-target');
				if (!link) return;

				const blank = element.attr('data-new') == 'true' ? true : false;

				if (link == 'up') {
					self.scrollTo();

				} else if (link.startsWith('#') || link.startsWith('.')) {
					self.scrollTo(link);

				} else if (link.startsWith('/')) {
					self.goTo(self.getBaseUrl());

				} else if (link.startsWith('http') && blank) {
					self.goTo(link, true);

				} else if (link.startsWith('http')) {
					self.goTo(link);
				}
			});
		}

		// scrollTo
		VanillePlugin.scrollTo = function (selector) {
			if (selector === undefined) {
				$('html, body').animate({
					scrollTop: 0
				}, 'smooth');
			} else {
				const tartet = $(selector);
				if (tartet.length) {
					const space = 30;
					$('html, body').animate({
						scrollTop: tartet.offset().top - space
					}, 'smooth');
				}
			}
		}

		// onVisible
		VanillePlugin.onVisible = function (selector, callback, threshold = 0.5) {

			if (!selector || typeof callback !== "function") {
				self.doLog('Selector & callback required');
				return;
			}

			const element = document.querySelector(selector);
			if (!element) {
				return;
			}

			self.doLog(`Observing element: ${selector}`);

			// Set up the Intersection Observer
			const observer = new IntersectionObserver(
				(entries, observer) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							self.doLog(`Element is visible: ${selector}`);
							callback(entry.target);
							observer.unobserve(entry.target);
						}
					});
				},
				{
					root: null,
					threshold: threshold,
				}
			);

			observer.observe(element);
		};

		// getBaseUrl
		VanillePlugin.getBaseUrl = function (url, trailing = false) {
			let getBaseUrl = plugin.baseUrl || '';
			if (typeof url == 'string') {
				getBaseUrl = `${getBaseUrl}/${url}`;
			}
			if (trailing === true) {
				getBaseUrl = `${getBaseUrl}/`;
			}
			return self.formatUrl(getBaseUrl, trailing);
		}

		// setDefaultImage
		VanillePlugin.setDefaultImage = function (img) {
			img = img || `${plugin.assetUrl}/img/default.jpg`;
			const src = self.getBaseUrl(img);
			$('img').on('error', function () {
				$(this).off('error').attr('src', src);
			});
		}

		// doLog
		VanillePlugin.doLog = function (data) {
			if (self.isDebug()) {
				console.log(data);
			}
		}

		// isDebug
		VanillePlugin.isDebug = function () {
			return plugin.debug === true;
		}

		// getString
		VanillePlugin.getString = function (item) {
			const strings = plugin.strings;
			if (item !== undefined) {
				return strings[item] ?? null;
			}
			return strings;
		}

		// getLinking
		VanillePlugin.getLinking = function (item) {
			const urls = plugin.linking;
			if (item !== undefined) {
				return urls[item] ?? null;
			}
			return urls;
		}

		// goTo
		VanillePlugin.goTo = function (url, blank) {
			blank = blank || false;
			url = url || '/';
			if (blank === true) {
				window.open(link, '_blank');
				return;
			}
			window.location.href = url;
		}

		// getCurrentUrl
		VanillePlugin.getCurrentUrl = function (url, trailing = false) {
			const protocol = window.location.protocol;
			const host = window.location.host;
			let currentUrl = `${protocol}//${host}`;
			if (typeof url == 'string') {
				currentUrl = `${currentUrl}/${url}`;
			}
			if (trailing === true) {
				currentUrl = `${currentUrl}/`;
			}
			return self.formatUrl(currentUrl, trailing);
		}

		// formatUrl
		VanillePlugin.formatUrl = function (url, trailing = false) {
			if (typeof url == 'string') {
				url = url.replace(/\\/g, '/');
				url = url.replace(/([^:]\/)\/+/g, '$1');
				url = url.replace(/^\/{2,}/, '/');
				if (trailing !== true) {
					url = url.replace(/\/+$/, '');
				}
			}
			return url;
		}

		// toDate
		VanillePlugin.toDate = function (string) {

			const from = string.split('/');
			const to = new Date(from[2], from[1] - 1, from[0]);

			const d = ('0' + to.getDate()).slice(-2);
			const m = ('0' + (to.getMonth() + 1)).slice(-2);
			const y = to.getFullYear();

			return `${y}-${m}-${d}`;

		}

		// isValidUrl
		VanillePlugin.isValidUrl = function (url) {
			const pattern = /^(https?:)?\/\//i;
			return pattern.test(url);
		}

		// isProtocol
		VanillePlugin.isProtocol = function (url, protocol) {
			for (let i = 0; i < protocol.length; i++) {
				if (url.indexOf(protocol[i] + ':') !== -1) {
					return true;
				}
			}
			return false;
		}

		// isForm
		VanillePlugin.isForm = function (form) {
			return form?.length && form?.prop('tagName') === 'FORM';
		}

		// capitalize
		VanillePlugin.capitalize = function (string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		// toBool
		VanillePlugin.toBool = function (val) {
			return "bool|" + (val ? 1 : 0);
		}

		// toInt
		VanillePlugin.toInt = function (val) {
			return "int|" + parseInt(val);
		}

		// toFloat
		VanillePlugin.toFloat = function (val) {
			return "float|" + parseFloat(val);
		}

		// toStr
		VanillePlugin.toStr = function (val) {
			if (val === undefined || val === null) {
				val = '';
			}
			return val.toString();
		}

		// parseObject
		VanillePlugin.parseObject = function (obj) {
			let data = {};
			if (typeof obj === 'object') {
				$.each(obj, (item, i) => {
					const key = Object.keys(item)[0];
					data[key] = item[key];
				});
			}
			return data;
		}

		// toObject
		VanillePlugin.toObject = function (data) {
			if (Array.isArray(data)) {
				return data.reduce((obj, item) => {
					obj[item.name] = item.value;
					return obj;
				}, {});
			}
			return {};
		}

		// isEmpty
		VanillePlugin.isEmpty = function (item) {
			if (typeof item === 'object') {
				return (Object.values(item).length === 0);
			}
			if (typeof item === 'array') {
				return (item.length === 0);
			}
			return (item === '');
		}

		// splitString
		VanillePlugin.splitString = function (string, max, end) {
			if (!typeof string == 'string') {
				return string;
			}
			end = end || '...';
			max = max || 0;
			const split = string.substring(0, max) + add;
			return (string.length > max) ? split : string
		}

		// stripString
		VanillePlugin.stripString = function (string) {
			if (!typeof string == 'string') {
				return string;
			}
			return string.replace(/<\/?[^>]+(>|$)/g, '');
		}

		// highlightShortcode
		VanillePlugin.highlightShortcode = function () {
			if (self.isDebug()) {
				const regex = /(\{[^}]*\}|\[[^\]]*\])/g;
				const text = document.body.innerHTML;
				const highlight = text.replace(regex, (match) => {
					return `<span class="--debug-shortcode">${match}</span>`;
				});
				document.body.innerHTML = highlight;
			}
		}

		// Return object
		return this;

	};

	// Attach to global jQuery object
	$.VanillePlugin = VanillePlugin;

})(jQuery);
