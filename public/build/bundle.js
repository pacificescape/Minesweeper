
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Header.svelte generated by Svelte v3.24.1 */

    const file = "src/Header.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let h30;
    	let t0;
    	let t1;
    	let t2;
    	let h31;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			h30 = element("h3");
    			t0 = text("Time is ");
    			t1 = text(/*date*/ ctx[0]);
    			t2 = space();
    			h31 = element("h3");
    			h31.textContent = `date2 is ${/*date2*/ ctx[1]}`;
    			attr_dev(h30, "class", "svelte-ehh4l7");
    			add_location(h30, file, 9, 4, 141);
    			attr_dev(h31, "class", "svelte-ehh4l7");
    			add_location(h31, file, 10, 4, 169);
    			add_location(div, file, 8, 2, 131);
    			attr_dev(main, "class", "svelte-ehh4l7");
    			add_location(main, file, 7, 0, 122);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, h30);
    			append_dev(h30, t0);
    			append_dev(h30, t1);
    			append_dev(div, t2);
    			append_dev(div, h31);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*date*/ 1) set_data_dev(t1, /*date*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let date = Date();
    	const date2 = Date();
    	setInterval(() => $$invalidate(0, date = Date()), 500);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Header", $$slots, []);
    	$$self.$capture_state = () => ({ date, date2 });

    	$$self.$inject_state = $$props => {
    		if ("date" in $$props) $$invalidate(0, date = $$props.date);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [date, date2];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/Minesweeper/Minesweeper.svelte generated by Svelte v3.24.1 */

    const { console: console_1 } = globals;
    const file$1 = "src/Minesweeper/Minesweeper.svelte";

    function create_fragment$1(ctx) {
    	let canvas_1;
    	let canvas_1_height_value;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "width", /*vw*/ ctx[1]);
    			attr_dev(canvas_1, "height", canvas_1_height_value = 500);
    			attr_dev(canvas_1, "class", "svelte-10lqciz");
    			add_location(canvas_1, file$1, 147, 0, 4351);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[2](canvas_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*vw*/ 2) {
    				attr_dev(canvas_1, "width", /*vw*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[2](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let elemLeft = 0;
    	let elemTop = 0;
    	let canvas;
    	const sleep = millis => new Promise(resolve => setTimeout(resolve, millis));
    	let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    	let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    	window.addEventListener("resize", () => {
    		$$invalidate(1, vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0));
    		vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    		console.log("vw", vw);
    		console.log("vh", vh);
    		elemLeft = canvas.offsetLeft + canvas.clientLeft;
    		elemTop = canvas.offsetTop + canvas.clientTop;
    	}); // for (let [row, line] of lands.entries()) {
    	//     line.forEach((land, col) => {
    	//       lands[line][row].posX = vw * 0.11 + line * vw * 0.1
    	//       lands[line][row].posY = vw * 0.11 + col * vw * 0.1

    	//     })}
    	console.log("vw", vw);

    	console.log("vh", vh);
    	const lands = [];

    	for (let l = 0; l < 64; l++) {
    		const line = Math.floor(l / 8);
    		const col = l % 8;
    		lands[line] = lands[line] || [];

    		lands[line].push({
    			color: "rgba(77,155,77,1)",
    			posX: vw * 0.11 + line * vw * 0.1,
    			posY: vw * 0.11 + col * vw * 0.1,
    			state: false
    		});
    	}

    	onMount(() => {
    		elemLeft = canvas.offsetLeft + canvas.clientLeft;
    		elemTop = canvas.offsetTop + canvas.clientTop;

    		canvas.addEventListener("click", evt => {
    			click(evt);
    			cancelAnimationFrame(loop);
    		});

    		requestAnimationFrame(loop);
    	});

    	function loop() {
    		requestAnimationFrame(loop);
    		const ms = new Date();
    		const ctx = canvas.getContext("2d");
    		ctx.clearRect(0, 0, vw, vh);

    		for (let [row, line] of lands.entries()) {
    			line.forEach((land, col) => {
    				if (land.state) return;

    				if (canvas.getContext) {
    					land.posY = vw * 0.05 + row * vw * 0.1 + Math.ceil(row / 8) * 6 * row; // отступы
    					land.posX = vw * 0.05 + col * vw * 0.1 + Math.ceil(col / 8) * 6 * col;
    					ctx.beginPath();
    					ctx.lineCap = "round";
    					ctx.lineWidth = 2;
    					ctx.moveTo(land.posX, land.posY);
    					ctx.strokeStyle = `rgb(${Math.floor(255 - 32.5 * row)},${Math.floor(255 - 34.5 * col)},102)`;
    					ctx.lineTo(land.posX + vw * 0.1, land.posY);
    					ctx.lineTo(land.posX + vw * 0.1, land.posY + vw * 0.1);
    					ctx.stroke();
    					ctx.closePath();
    					ctx.beginPath();
    					ctx.lineCap = "round";
    					ctx.lineWidth = 2;
    					ctx.moveTo(land.posX + vw * 0.1, land.posY + vw * 0.1);
    					ctx.strokeStyle = `rgb(${Math.floor(255 - 20 * line)},${Math.floor(255 - 20 * col)},122)`;
    					ctx.lineTo(land.posX, land.posY + vw * 0.1);
    					ctx.lineTo(land.posX, land.posY);
    					ctx.stroke();
    					ctx.closePath();
    					ctx.fillStyle = land.color;
    					ctx.fillRect(land.posX, land.posY, vw * 0.1, vw * 0.1);
    				}
    			});
    		}

    		ctx.fillStyle = "#ccc";
    		ctx.font = "50px serif";
    		let date = new Date();
    		let text = date.getHours() + ":" + date.getMinutes() + ":" + date.getMilliseconds() + " " + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    		let width = ctx.measureText(text).width;
    		ctx.fillText(text, 250 - width / 2, 50);
    		ctx.font = "20px serif";
    		ctx.fillText(new Date() - ms + "ms", 20, 480);
    	}

    	function click(event) {
    		let x = event.pageX, y = event.pageY - elemTop;

    		for (let [row, line] of lands.entries()) {
    			const target = line.map((land, col) => {
    				const posY = lands[col][row].posY;
    				const posX = lands[col][row].posX;
    				let xx = true;
    				let yy = true;

    				if (x >= posX && x <= posX + vw * 0.1) {
    					console.log(posX);
    					console.log(x);
    					xx = false;
    				}

    				

    				// debugger
    				if (y >= posY && y <= posY + vw * 0.1) {
    					console.log(posY);
    					console.log(y);
    					yy = false;
    				}

    				
    				debugger;

    				if (!xx && !yy) {
    					lands[col][row].state = true;
    					console.log([row, col]);
    					console.log([y, x]);
    				}
    			});
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Minesweeper> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Minesweeper", $$slots, []);

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			canvas = $$value;
    			$$invalidate(0, canvas);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		elemLeft,
    		elemTop,
    		canvas,
    		sleep,
    		vw,
    		vh,
    		lands,
    		loop,
    		click
    	});

    	$$self.$inject_state = $$props => {
    		if ("elemLeft" in $$props) elemLeft = $$props.elemLeft;
    		if ("elemTop" in $$props) elemTop = $$props.elemTop;
    		if ("canvas" in $$props) $$invalidate(0, canvas = $$props.canvas);
    		if ("vw" in $$props) $$invalidate(1, vw = $$props.vw);
    		if ("vh" in $$props) vh = $$props.vh;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [canvas, vw, canvas_1_binding];
    }

    class Minesweeper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Minesweeper",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.24.1 */
    const file$2 = "src/App.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let header;
    	let t;
    	let minesweeper;
    	let current;
    	header = new Header({ $$inline: true });
    	minesweeper = new Minesweeper({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(minesweeper.$$.fragment);
    			attr_dev(main, "class", "svelte-1u52bhl");
    			add_location(main, file$2, 5, 0, 118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t);
    			mount_component(minesweeper, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(minesweeper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(minesweeper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(minesweeper);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Header, Minesweeper });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {

    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
