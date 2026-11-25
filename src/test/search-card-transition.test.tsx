import { act, render } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SearchCardTransition,
  type SearchCardTransitionHandle,
} from "@/components/search-card-transition";
import { searchResources } from "@/lib/resources";

const TERM = "weather";

type AnimStub = { finished: Promise<void>; cancel: () => void; settle: () => void };

const rects = new WeakMap<Element, DOMRect>();
let animations: AnimStub[] = [];
let originalAnimate: PropertyDescriptor | undefined;
let originalRects: PropertyDescriptor | undefined;
let originalRect: PropertyDescriptor | undefined;
let originalWidth: PropertyDescriptor | undefined;
let originalHeight: PropertyDescriptor | undefined;

function rect(left: number, top: number, width = 220, height = 130): DOMRect {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
  } as DOMRect;
}

function seedStage(slotIds: string[], resultIds: string[]) {
  document.body.innerHTML = "";
  slotIds.forEach((id, index) => {
    const slot = document.createElement("div");
    slot.className = "index-card-slot";
    slot.dataset["resourceId"] = id;
    const card = document.createElement("a");
    card.className = "index-card";
    card.href = `https://example.test/${id}`;
    card.tabIndex = 0;
    card.appendChild(document.createElement("button"));
    slot.appendChild(card);
    document.body.appendChild(slot);
    rects.set(slot, rect(80 + index * 260, 120));
    rects.set(card, rect(80 + index * 260, 120));
  });
  resultIds.forEach((id, index) => {
    const card = document.createElement("article");
    card.className = "resource-card";
    card.dataset["resourceId"] = id;
    document.body.appendChild(card);
    rects.set(card, rect(60 + index * 320, 400));
  });
}

function mountTransition(query: string, showResults: boolean) {
  const ref = createRef<SearchCardTransitionHandle>();
  const onTargetsChange = vi.fn();
  const view = render(
    <SearchCardTransition
      ref={ref}
      query={query}
      showResults={showResults}
      onTargetsChange={onTargetsChange}
    />,
  );
  return { ref, onTargetsChange, view };
}

function expectNoFlight(onTargetsChange: ReturnType<typeof vi.fn>) {
  const reported = onTargetsChange.mock.calls.map((call) => call[0] as string[]);
  expect(reported.every((ids) => ids.length === 0)).toBe(true);
  expect(document.querySelectorAll(".search-card-transition *")).toHaveLength(0);
}

beforeEach(() => {
  animations = [];
  originalAnimate = Object.getOwnPropertyDescriptor(Element.prototype, "animate");
  originalRects = Object.getOwnPropertyDescriptor(Element.prototype, "getClientRects");
  originalRect = Object.getOwnPropertyDescriptor(Element.prototype, "getBoundingClientRect");
  originalWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
  originalHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");

  Object.defineProperty(Element.prototype, "getBoundingClientRect", {
    configurable: true,
    writable: true,
    value() {
      return rects.get(this) ?? rect(0, 0);
    },
  });
  Object.defineProperty(Element.prototype, "getClientRects", {
    configurable: true,
    writable: true,
    value() {
      return [rects.get(this) ?? rect(0, 0)];
    },
  });
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    writable: true,
    value: 220,
  });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    writable: true,
    value: 130,
  });
  Object.defineProperty(Element.prototype, "animate", {
    configurable: true,
    writable: true,
    value() {
      let settle!: () => void;
      const finished = new Promise<void>((resolve) => {
        settle = resolve;
      });
      const animation: AnimStub = { finished, cancel: () => settle(), settle };
      animations.push(animation);
      return animation as unknown as Animation;
    },
  });
});

afterEach(() => {
  const restore = (key: string, descriptor: PropertyDescriptor | undefined) => {
    if (descriptor) Object.defineProperty(Element.prototype, key, descriptor);
    else delete (Element.prototype as never as Record<string, unknown>)[key];
  };
  restore("animate", originalAnimate);
  restore("getClientRects", originalRects);
  restore("getBoundingClientRect", originalRect);
  if (originalWidth) Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalWidth);
  if (originalHeight) Object.defineProperty(HTMLElement.prototype, "offsetHeight", originalHeight);
});

describe("SearchCardTransition", () => {
  it("flies only the matched cards and reports them as hidden targets", async () => {
    const matched = searchResources(TERM)
      .slice(0, 2)
      .map((resource) => resource.id);
    const unmatched = "open-meteo";
    const slotIds = [...matched, unmatched];
    seedStage(slotIds, matched);

    const { ref, onTargetsChange, view } = mountTransition("", false);
    act(() => ref.current?.prepare(TERM));
    view.rerender(
      <SearchCardTransition ref={ref} query={TERM} showResults onTargetsChange={onTargetsChange} />,
    );

    expect(onTargetsChange).toHaveBeenCalledWith(matched);
    const layer = document.querySelector<HTMLDivElement>(".search-card-transition");
    expect(layer).not.toBeNull();
    expect(layer?.getAttribute("aria-hidden")).toBe("true");
    expect(layer?.children).toHaveLength(slotIds.length);
    expect(layer?.querySelectorAll("a[href], [tabindex]")).toHaveLength(0);
    for (const clone of Array.from(layer?.children ?? [])) {
      expect((clone as HTMLElement).inert).toBe(true);
    }

    await act(async () => {
      animations.forEach((animation) => animation.settle());
    });
    expect(onTargetsChange).toHaveBeenLastCalledWith([]);
    expect(layer?.children).toHaveLength(0);
  });

  it("stays passive for a term shorter than two characters", () => {
    const matched = searchResources(TERM).map((resource) => resource.id);
    seedStage(matched.slice(0, 1), matched.slice(0, 1));
    const { ref, onTargetsChange, view } = mountTransition("", false);
    act(() => ref.current?.prepare("w"));
    view.rerender(
      <SearchCardTransition ref={ref} query="w" showResults onTargetsChange={onTargetsChange} />,
    );
    expectNoFlight(onTargetsChange);
  });

  it("stays passive when the reader asked for reduced motion", () => {
    const reduce = vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));
    const matched = searchResources(TERM).map((resource) => resource.id);
    seedStage(matched.slice(0, 1), matched.slice(0, 1));
    const { ref, onTargetsChange, view } = mountTransition("", false);
    act(() => ref.current?.prepare(TERM));
    view.rerender(
      <SearchCardTransition ref={ref} query={TERM} showResults onTargetsChange={onTargetsChange} />,
    );
    expectNoFlight(onTargetsChange);
    reduce.mockRestore();
  });

  it("stays passive below the card breakpoint", () => {
    const width = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: 600 });
    const matched = searchResources(TERM).map((resource) => resource.id);
    seedStage(matched.slice(0, 1), matched.slice(0, 1));
    const { ref, onTargetsChange, view } = mountTransition("", false);
    act(() => ref.current?.prepare(TERM));
    view.rerender(
      <SearchCardTransition ref={ref} query={TERM} showResults onTargetsChange={onTargetsChange} />,
    );
    expectNoFlight(onTargetsChange);
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: width,
    });
  });

  it("cancels a pending flight when the query changes before results show", () => {
    const matched = searchResources(TERM).map((resource) => resource.id);
    seedStage(matched.slice(0, 2), matched.slice(0, 2));
    const { ref, onTargetsChange, view } = mountTransition("", false);
    act(() => ref.current?.prepare(TERM));
    view.rerender(
      <SearchCardTransition
        ref={ref}
        query="climate"
        showResults
        onTargetsChange={onTargetsChange}
      />,
    );
    expect(onTargetsChange).toHaveBeenLastCalledWith([]);
    expect(document.querySelectorAll(".search-card-transition *")).toHaveLength(0);
  });
});
