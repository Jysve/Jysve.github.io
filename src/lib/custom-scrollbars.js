const SCROLL_REGIONS = [
  "[data-toc] ul",
  ".filter-popover",
  ".katex-display",
  ".prose-article table",
  ".expressive-code pre",
];

export function setupCustomScrollbars(lenis) {
  if (!matchMedia("(pointer: fine)").matches) return;

  const root = document.documentElement;
  const instances = [];
  let frame = 0;

  const scheduleUpdate = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      instances.forEach((instance) => instance.update());
    });
  };

  const createScrollbar = (target, axis, page, index) => {
    const vertical = axis === "vertical";
    const scrollProperty = vertical ? "scrollTop" : "scrollLeft";
    const scrollSize = vertical ? "scrollHeight" : "scrollWidth";
    const clientSize = vertical ? "clientHeight" : "clientWidth";
    const track = document.createElement("div");
    const thumb = document.createElement("div");

    track.className = "custom-scrollbar";
    track.dataset.scrollbar = axis;
    track.toggleAttribute("data-scrollbar-page", page);
    track.setAttribute("role", "scrollbar");
    track.setAttribute(
      "aria-label",
      page ? "Page scroll" : `${vertical ? "Vertical" : "Horizontal"} scroll`,
    );
    track.setAttribute("aria-orientation", axis);
    track.setAttribute("aria-valuemin", "0");
    track.tabIndex = 0;
    thumb.className = "custom-scrollbar-thumb";
    track.append(thumb);
    document.body.append(track);

    target.toggleAttribute("data-custom-scrollbar", true);
    if (!target.id) target.id = `scroll-region-${index + 1}`;
    track.setAttribute("aria-controls", target.id);

    const instance = {
      target,
      track,
      page,
      visible: page,
      max: 0,
      thumbSize: 0,
      trackSize: 0,
      update: () => {},
    };

    const currentScroll = () => (page ? root[scrollProperty] : target[scrollProperty]);
    const setScroll = (value) => {
      const next = Math.max(0, Math.min(instance.max, value));
      if (page) lenis.scrollTo(next, { immediate: true });
      else target[scrollProperty] = next;
    };

    instance.update = () => {
      const rect = page
        ? { top: 0, right: innerWidth, bottom: innerHeight, left: 0 }
        : target.getBoundingClientRect();
      const viewport = target[clientSize];
      const content = target[scrollSize];
      instance.max = Math.max(0, content - viewport);

      let start;
      let size;
      if (page) {
        start = 8;
        size = innerHeight - 16;
        track.style.left = `${innerWidth - 14}px`;
        track.style.top = `${start}px`;
        track.style.width = "10px";
        track.style.height = `${Math.max(0, size)}px`;
      } else if (vertical) {
        start = Math.max(0, rect.top) + 4;
        const end = Math.min(innerHeight, rect.bottom) - 4;
        size = end - start;
        track.style.left = `${rect.right - 12}px`;
        track.style.top = `${start}px`;
        track.style.width = "10px";
        track.style.height = `${Math.max(0, size)}px`;
      } else {
        start = Math.max(0, rect.left) + 4;
        const end = Math.min(innerWidth, rect.right) - 4;
        size = end - start;
        track.style.left = `${start}px`;
        track.style.top = `${rect.bottom - 12}px`;
        track.style.width = `${Math.max(0, size)}px`;
        track.style.height = "10px";
      }

      instance.trackSize = Math.max(0, size);
      const proportionalSize = content > 0 ? (viewport / content) * size : size;
      instance.thumbSize = Math.max(0, Math.min(size, Math.max(24, proportionalSize)));
      const travel = Math.max(0, size - instance.thumbSize);
      const position = instance.max > 0 ? (currentScroll() / instance.max) * travel : 0;

      if (vertical) {
        thumb.style.width = "100%";
        thumb.style.height = `${instance.thumbSize}px`;
        thumb.style.transform = `translateY(${position}px)`;
      } else {
        thumb.style.width = `${instance.thumbSize}px`;
        thumb.style.height = "100%";
        thumb.style.transform = `translateX(${position}px)`;
      }

      track.setAttribute("aria-valuemax", String(Math.round(instance.max)));
      track.setAttribute("aria-valuenow", String(Math.round(currentScroll())));
      track.hidden =
        !instance.visible ||
        instance.max <= 1 ||
        size <= 24 ||
        (!page && !vertical && (rect.bottom < 0 || rect.bottom > innerHeight + 12));

      if (!page && vertical) target.toggleAttribute("data-lenis-prevent", instance.max > 1);
    };

    let hideTimer;
    const reveal = () => {
      if (page) return;
      track.classList.add("is-active");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => track.classList.remove("is-active"), 700);
    };

    target.addEventListener(
      "scroll",
      () => {
        instance.update();
        reveal();
      },
      { passive: true },
    );

    if (!page) {
      target.addEventListener("pointerenter", () => track.classList.add("is-active"));
      target.addEventListener("pointerleave", () => track.classList.remove("is-active"));
      target.addEventListener("focusin", () => track.classList.add("is-active"));
      target.addEventListener("focusout", (event) => {
        if (!target.contains(event.relatedTarget)) track.classList.remove("is-active");
      });
      track.addEventListener("pointerenter", () => track.classList.add("is-active"));
      track.addEventListener("pointerleave", () => track.classList.remove("is-active"));
    }

    let dragOffset = null;
    const dragTo = (event) => {
      const rect = track.getBoundingClientRect();
      const pointer = vertical ? event.clientY - rect.top : event.clientX - rect.left;
      const travel = instance.trackSize - instance.thumbSize;
      if (travel > 0) setScroll(((pointer - dragOffset) / travel) * instance.max);
    };

    track.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      track.focus({ preventScroll: true });
      const thumbRect = thumb.getBoundingClientRect();
      const pointer = vertical ? event.clientY : event.clientX;
      dragOffset =
        event.target === thumb
          ? pointer - (vertical ? thumbRect.top : thumbRect.left)
          : instance.thumbSize / 2;
      track.setPointerCapture(event.pointerId);
      track.classList.add("is-active", "is-dragging");
      root.classList.add("is-scrollbar-dragging");
      dragTo(event);
    });

    track.addEventListener("pointermove", (event) => {
      if (dragOffset !== null) dragTo(event);
    });

    const stopDragging = (event) => {
      if (dragOffset === null) return;
      dragOffset = null;
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      track.classList.remove("is-dragging");
      root.classList.remove("is-scrollbar-dragging");
    };
    track.addEventListener("pointerup", stopDragging);
    track.addEventListener("pointercancel", stopDragging);

    track.addEventListener("keydown", (event) => {
      const forward = vertical ? "ArrowDown" : "ArrowRight";
      const backward = vertical ? "ArrowUp" : "ArrowLeft";
      const pageStep = Math.max(40, target[clientSize] * 0.8);
      const steps = {
        [forward]: 40,
        [backward]: -40,
        PageDown: pageStep,
        PageUp: -pageStep,
        Home: -instance.max,
        End: instance.max,
      };
      if (!(event.key in steps)) return;
      event.preventDefault();
      setScroll(currentScroll() + steps[event.key]);
    });

    if (!page) {
      track.addEventListener(
        "wheel",
        (event) => {
          event.preventDefault();
          event.stopPropagation();
          let delta = vertical
            ? event.deltaY
            : Math.abs(event.deltaX) > Math.abs(event.deltaY)
              ? event.deltaX
              : event.deltaY;
          if (event.deltaMode === 1) delta *= 16;
          if (event.deltaMode === 2) delta *= target[clientSize];
          setScroll(currentScroll() + delta);
        },
        { passive: false },
      );
    }

    instances.push(instance);
    return instance;
  };

  createScrollbar(root, "vertical", true, 0);
  const targets = document.querySelectorAll(SCROLL_REGIONS.join(","));
  targets.forEach((target, targetIndex) => {
    const style = getComputedStyle(target);
    if (/(auto|scroll)/.test(style.overflowY)) {
      createScrollbar(target, "vertical", false, targetIndex + 1);
    }
    if (/(auto|scroll)/.test(style.overflowX)) {
      createScrollbar(target, "horizontal", false, targetIndex + 1);
    }
  });

  const resizeObserver = new ResizeObserver(scheduleUpdate);
  resizeObserver.observe(root);
  resizeObserver.observe(document.body);
  targets.forEach((target) => resizeObserver.observe(target));

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      instances.forEach((instance) => {
        if (instance.target === entry.target) {
          instance.visible = entry.isIntersecting;
          instance.update();
        }
      });
    });
  });
  targets.forEach((target) => intersectionObserver.observe(target));

  addEventListener("scroll", scheduleUpdate, { passive: true });
  addEventListener("resize", scheduleUpdate, { passive: true });
  document.fonts?.ready.then(scheduleUpdate);
  scheduleUpdate();
}
