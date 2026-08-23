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
  const injectedNodesRef = useRef<Node[]>([]);

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

        // 3. Inject Page-Specific Body Code into <body> (check global or path match)
        if (data.pageBodyCodes && typeof data.pageBodyCodes === "object") {
          // Check for global / all pages body code or pathname specific code
          const globalCode = data.pageBodyCodes["global"] || data.pageBodyCodes["/"];
          const currentPathCode = data.pageBodyCodes[pathname];

          const combinedCode = [globalCode, currentPathCode !== globalCode ? currentPathCode : null]
            .filter(Boolean)
            .join("\n");

          if (combinedCode.trim()) {
            const pageNodes = parseAndCreateNodes(combinedCode);
            pageNodes.forEach((node) => {
              if (document.body.firstChild) {
                document.body.insertBefore(node, document.body.firstChild);
              } else {
                document.body.appendChild(node);
              }
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
 * Safely parses HTML snippet strings into real DOM elements, scripts, meta, link, and comment nodes.
 * Correctly re-creates executable <script> tags so the browser executes their inline JS or src.
 */
function parseAndCreateNodes(htmlString: string): Node[] {
  if (!htmlString || !htmlString.trim()) return [];

  // Fix typos like <!--test-> to <!--test--> so comments never corrupt DOM parser
  const sanitized = htmlString.replace(/<!--([\s\S]*?)(?:->|-->)/g, (_, content) => `<!--${content.trim()}-->`);

  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitized, "text/html");
  const nodes: Node[] = [];

  const allChildren = [
    ...Array.from(doc.head.childNodes),
    ...Array.from(doc.body.childNodes),
  ];

  allChildren.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      if (el.tagName.toLowerCase() === "script") {
        const scriptEl = document.createElement("script");
        Array.from(el.attributes).forEach((attr) => {
          scriptEl.setAttribute(attr.name, attr.value);
        });
        scriptEl.textContent = el.textContent;
        scriptEl.setAttribute("data-injected-by-cms", "true");
        nodes.push(scriptEl);
      } else {
        const clone = el.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-injected-by-cms", "true");
        nodes.push(clone);
      }
    } else if (child.nodeType === Node.COMMENT_NODE) {
      const commentEl = document.createComment(child.nodeValue || "");
      nodes.push(commentEl);
    }
  });

  return nodes;
}
