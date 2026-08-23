"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface CustomScriptData {
  headerCode: string;
  footerCode: string;
  pageBodyCodes: Record<string, string>;
}

export function ScriptInjector() {
  const pathname = usePathname();
  const injectedNodesRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadAndInjectScripts() {
      try {
        const res = await fetch("/api/scripts", { cache: "no-store" });
        if (!res.ok) return;
        const data: CustomScriptData = await res.json();
        if (!isMounted) return;

        // Cleanup previously injected nodes to prevent duplicate executions
        injectedNodesRef.current.forEach((node) => {
          if (node && node.parentNode) {
            node.parentNode.removeChild(node);
          }
        });
        injectedNodesRef.current = [];

        // 1. Inject Header Code into <head>
        if (data.headerCode && data.headerCode.trim()) {
          const headerNodes = parseAndCreateNodes(data.headerCode);
          headerNodes.forEach((node) => {
            document.head.appendChild(node);
            injectedNodesRef.current.push(node);
          });
        }

        // 2. Inject Footer Code into <body>
        if (data.footerCode && data.footerCode.trim()) {
          const footerNodes = parseAndCreateNodes(data.footerCode);
          footerNodes.forEach((node) => {
            document.body.appendChild(node);
            injectedNodesRef.current.push(node);
          });
        }

        // 3. Inject Page-Specific Code into <body>
        if (data.pageBodyCodes && typeof data.pageBodyCodes === "object") {
          const currentPathCode = data.pageBodyCodes[pathname];
          if (currentPathCode && currentPathCode.trim()) {
            const pageNodes = parseAndCreateNodes(currentPathCode);
            pageNodes.forEach((node) => {
              document.body.appendChild(node);
              injectedNodesRef.current.push(node);
            });
          }
        }
      } catch (err) {
        console.error("[ScriptInjector] Execution error:", err);
      }
    }

    loadAndInjectScripts();

    return () => {
      isMounted = false;
      injectedNodesRef.current.forEach((node) => {
        if (node && node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
      injectedNodesRef.current = [];
    };
  }, [pathname]);

  return null;
}

/**
 * Safely parses HTML snippet strings into real DOM elements.
 * Correctly re-creates executable <script> tags so the browser executes their inline JS or src.
 */
function parseAndCreateNodes(htmlString: string): HTMLElement[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${htmlString}</body>`, "text/html");
  const nodes: HTMLElement[] = [];

  Array.from(doc.body.childNodes).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      if (el.tagName.toLowerCase() === "script") {
        const scriptEl = document.createElement("script");
        Array.from(el.attributes).forEach((attr) => {
          scriptEl.setAttribute(attr.name, attr.value);
        });
        scriptEl.textContent = el.textContent;
        scriptEl.dataset.injectedByCms = "true";
        nodes.push(scriptEl);
      } else {
        const clone = el.cloneNode(true) as HTMLElement;
        clone.dataset.injectedByCms = "true";
        nodes.push(clone);
      }
    }
  });

  return nodes;
}
