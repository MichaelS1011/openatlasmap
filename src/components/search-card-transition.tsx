import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { searchResources, type Resource } from "@/lib/resources";

type CardSnapshot = {
  id: string;
  matched: boolean;
  node: HTMLAnchorElement;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  rotation: string;
  scale: string;
  opacity: number;
};

export type SearchCardTransitionHandle = {
  prepare: (term: string) => void;
  cancel: () => void;
};

type SearchCardTransitionProps = {
  query: string;
  showResults: boolean;
  onTargetsChange: (ids: string[]) => void;
};

function prepareClone(source: HTMLAnchorElement) {
  const clone = source.cloneNode(true) as HTMLAnchorElement;
  clone.removeAttribute("href");
  clone.removeAttribute("aria-label");
  clone.removeAttribute("tabindex");
  clone
    .querySelectorAll<HTMLElement>("[tabindex], a, button, input, select, textarea")
    .forEach((element) => {
      element.removeAttribute("tabindex");
      element.removeAttribute("href");
    });
  clone.inert = true;
  return clone;
}

export const SearchCardTransition = forwardRef<
  SearchCardTransitionHandle,
  SearchCardTransitionProps
>(function SearchCardTransition({ query, showResults, onTargetsChange }, ref) {
  const layerRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<{ term: string; cards: CardSnapshot[] } | null>(null);
  const animationsRef = useRef<Animation[]>([]);
  const activeTermRef = useRef("");
  const runRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  const cancel = useCallback(() => {
    runRef.current += 1;
    pendingRef.current = null;
    activeTermRef.current = "";
    animationsRef.current.forEach((animation) => animation.cancel());
    animationsRef.current = [];
    layerRef.current?.replaceChildren();
    onTargetsChange([]);
  }, [onTargetsChange]);

  useImperativeHandle(
    ref,
    () => ({
      prepare(term) {
        cancel();
        const cleanTerm = term.trim();
        if (
          cleanTerm.length < 2 ||
          window.innerWidth < 760 ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          typeof Element.prototype.animate !== "function"
        ) {
          return;
        }

        const sources = Array.from(
          document.querySelectorAll<HTMLAnchorElement>(
            ".index-card-slot[data-resource-id] .index-card",
          ),
        );
        const resourcesById = new Map<string, Resource>(
          searchResources(cleanTerm).map((resource) => [resource.id, resource]),
        );
        const cards: CardSnapshot[] = [];
        for (const source of sources) {
          const slot = source.closest<HTMLElement>(".index-card-slot");
          const id = slot?.dataset["resourceId"];
          if (!slot || !id || !slot.getClientRects().length) continue;
          const rect = source.getBoundingClientRect();
          const style = getComputedStyle(slot);
          cards.push({
            id,
            matched: resourcesById.has(id),
            node: prepareClone(source),
            width: source.offsetWidth,
            height: source.offsetHeight,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            rotation: style.rotate,
            scale: style.scale,
            opacity: Number(style.opacity),
          });
        }
        pendingRef.current = cards.length ? { term: cleanTerm, cards } : null;
      },
      cancel,
    }),
    [cancel],
  );

  useEffect(() => {
    setMounted(true);
    return () => {
      runRef.current += 1;
      pendingRef.current = null;
      animationsRef.current.forEach((animation) => animation.cancel());
      animationsRef.current = [];
    };
  }, []);

  useLayoutEffect(() => {
    if (animationsRef.current.length && (!showResults || activeTermRef.current !== query.trim())) {
      cancel();
      return;
    }
    const pending = pendingRef.current;
    if (!pending || !showResults || query.trim() !== pending.term || !layerRef.current) {
      if (pending) cancel();
      return;
    }

    const targets = new Map<string, DOMRect>();
    const resultCards = Array.from(
      document.querySelectorAll<HTMLElement>(".resource-card[data-resource-id]"),
    );
    resultCards.forEach((card) => {
      card.style.animation = "none";
    });
    resultCards.forEach((card) => {
      const id = card.dataset["resourceId"];
      const rect = card.getBoundingClientRect();
      if (
        id &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth
      ) {
        targets.set(id, rect);
      }
    });
    resultCards.forEach((card) => {
      card.style.animation = "";
    });
    if (!targets.size) {
      cancel();
      return;
    }

    pendingRef.current = null;
    activeTermRef.current = query.trim();
    const targetIds = pending.cards
      .filter((card) => card.matched && targets.has(card.id))
      .map((card) => card.id);
    onTargetsChange(targetIds);
    const layer = layerRef.current;
    const animations: Animation[] = [];

    for (const card of pending.cards) {
      const target = card.matched ? targets.get(card.id) : undefined;
      const node = card.node;
      node.className = "transition-card index-card";
      node.style.left = `${card.centerX - card.width / 2}px`;
      node.style.top = `${card.centerY - card.height / 2}px`;
      node.style.width = `${card.width}px`;
      node.style.height = `${card.height}px`;
      node.style.rotate = card.rotation;
      node.style.scale = card.scale;
      node.style.opacity = String(card.opacity);
      layer.append(node);

      if (target) {
        const left = target.left;
        const top = target.top;
        animations.push(
          node.animate(
            [
              {
                left: node.style.left,
                top: node.style.top,
                width: `${card.width}px`,
                height: `${card.height}px`,
                rotate: card.rotation,
                scale: card.scale,
                opacity: card.opacity,
              },
              {
                left: `${left}px`,
                top: `${top}px`,
                width: `${target.width}px`,
                height: `${target.height}px`,
                rotate: "0deg",
                scale: "1",
                opacity: 0.96,
                offset: 0.82,
              },
              {
                left: `${left}px`,
                top: `${top}px`,
                width: `${target.width}px`,
                height: `${target.height}px`,
                rotate: "0deg",
                scale: "1",
                opacity: 0,
              },
            ],
            {
              duration: 760,
              easing: "cubic-bezier(0.2, 0.75, 0.2, 1)",
              fill: "forwards",
            },
          ),
        );
      } else {
        const direction = card.centerX < window.innerWidth / 2 ? -1 : 1;
        animations.push(
          node.animate(
            [
              {
                left: node.style.left,
                top: node.style.top,
                rotate: card.rotation,
                scale: card.scale,
                opacity: card.opacity,
              },
              {
                left: `${card.centerX - card.width / 2 + direction * 72}px`,
                top: `${card.centerY - card.height / 2 + 24}px`,
                rotate: card.rotation === "0deg" ? "4deg" : `calc(${card.rotation} + 4deg)`,
                scale: "0.82",
                opacity: 0,
              },
            ],
            {
              duration: 420,
              easing: "cubic-bezier(0.4, 0, 1, 1)",
              fill: "forwards",
            },
          ),
        );
      }
    }

    animationsRef.current = animations;
    const run = ++runRef.current;
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (runRef.current !== run) return;
      animationsRef.current = [];
      activeTermRef.current = "";
      layer.replaceChildren();
      onTargetsChange([]);
    });
  }, [cancel, onTargetsChange, query, showResults]);

  if (!mounted) return null;
  return createPortal(
    <div ref={layerRef} className="search-card-transition" aria-hidden="true" inert />,
    document.body,
  );
});
