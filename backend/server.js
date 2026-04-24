const express = require('express');
const cors = require('cors');
const path  = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Identity (update these before submission) ──────────────────────────────
const USER_ID            = 'sujalfuldevare_17091999';
const EMAIL_ID           = 'sf5160@srmist.edu.in';
const COLLEGE_ROLL_NUMBER = 'RA2311003011769';
// ──────────────────────────────────────────────────────────────────────────

/** Returns true if a trimmed entry is a valid X->Y edge (single uppercase letters, no self-loop) */
function isValidEdge(entry) {
  return /^[A-Z]->[A-Z]$/.test(entry) && entry[0] !== entry[3];
}

/**
 * Build hierarchies from a list of valid, non-duplicate edges.
 * Returns an array of hierarchy objects.
 */
function buildHierarchies(edges) {
  // adjacency list: parent -> [child, ...]  (first-parent wins for each child)
  const children = {};   // parent -> [children]
  const parentOf  = {};  // child  -> parent  (first-parent wins)
  const allNodes  = new Set();

  for (const edge of edges) {
    const [p, c] = edge.split('->');
    allNodes.add(p);
    allNodes.add(c);

    if (!children[p]) children[p] = [];

    // multi-parent rule: first parent wins
    if (parentOf[c] !== undefined) continue;   // already has a parent → discard
    parentOf[c] = p;
    children[p].push(c);
  }

  // ── Find connected components (undirected) ──────────────────────────────
  const visited    = new Set();
  const components = [];

  function dfsComponent(node, component) {
    if (visited.has(node)) return;
    visited.add(node);
    component.add(node);
    (children[node] || []).forEach(c => dfsComponent(c, component));
    // also traverse upward so isolated parents are included
    Object.keys(children).forEach(p => {
      if ((children[p] || []).includes(node)) dfsComponent(p, component);
    });
  }

  for (const node of allNodes) {
    if (!visited.has(node)) {
      const comp = new Set();
      dfsComponent(node, comp);
      components.push(comp);
    }
  }

  // ── Process each component ──────────────────────────────────────────────
  const hierarchies = [];

  for (const comp of components) {
    // Roots = nodes in this component with no parent
    const roots = [...comp].filter(n => parentOf[n] === undefined);

    // Cycle detection: DFS looking for back-edges
    function hasCycle(start) {
      const stack = new Set();
      function dfs(node) {
        if (stack.has(node)) return true;
        stack.add(node);
        for (const child of (children[node] || [])) {
          if (dfs(child)) return true;
        }
        stack.delete(node);
        return false;
      }
      return dfs(start);
    }

    // Determine the actual root(s)
    let root;
    if (roots.length === 0) {
      // pure cycle — use lex-smallest node
      root = [...comp].sort()[0];
    } else {
      root = roots.sort()[0];   // lex-smallest root if multiple
    }

    const cyclic = hasCycle(root) || [...comp].some(n => hasCycle(n));

    if (cyclic) {
      hierarchies.push({ root, tree: {}, has_cycle: true });
      continue;
    }

    // Build nested tree object
    function buildTree(node) {
      const obj = {};
      for (const child of (children[node] || [])) {
        obj[child] = buildTree(child);
      }
      return obj;
    }

    const tree = { [root]: buildTree(root) };

    // Depth = number of nodes on longest root-to-leaf path
    function maxDepth(node) {
      const kids = children[node] || [];
      if (kids.length === 0) return 1;
      return 1 + Math.max(...kids.map(maxDepth));
    }

    const depth = maxDepth(root);
    hierarchies.push({ root, tree, depth });
  }

  return hierarchies;
}

// ── POST /bfhl ─────────────────────────────────────────────────────────────
app.post('/bfhl', (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: '`data` must be an array of strings.' });
  }

  const invalid_entries  = [];
  const duplicate_edges  = [];
  const seenEdges        = new Set();
  const validEdges       = [];

  for (const raw of data) {
    const entry = typeof raw === 'string' ? raw.trim() : String(raw).trim();

    if (!isValidEdge(entry)) {
      // Spec: trim first, then validate; push the trimmed form (or original if empty)
      invalid_entries.push(entry || raw);
      continue;
    }

    if (seenEdges.has(entry)) {
      // only push once per duplicate
      if (!duplicate_edges.includes(entry)) duplicate_edges.push(entry);
      continue;
    }

    seenEdges.add(entry);
    validEdges.push(entry);
  }

  const hierarchies = buildHierarchies(validEdges);

  // Summary
  const nonCyclic = hierarchies.filter(h => !h.has_cycle);
  const cyclic    = hierarchies.filter(h =>  h.has_cycle);

  let largest_tree_root = '';
  if (nonCyclic.length > 0) {
    const maxDepth = Math.max(...nonCyclic.map(h => h.depth));
    const tied     = nonCyclic.filter(h => h.depth === maxDepth).map(h => h.root).sort();
    largest_tree_root = tied[0];
  }

  return res.json({
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: COLLEGE_ROLL_NUMBER,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees:       nonCyclic.length,
      total_cycles:      cyclic.length,
      largest_tree_root,
    },
  });
});

// ── GET /bfhl (health check) ───────────────────────────────────────────────
app.get('/bfhl', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BFHL API running on port ${PORT}`));