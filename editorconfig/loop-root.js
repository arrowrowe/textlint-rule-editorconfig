const loopRoot = (root, fn) => {
  // MUST use `let` here......
  for (let pattern in root) { // eslint-disable-line prefer-const
    if (pattern === 'root') {
      continue;
    }

    fn(root[pattern], pattern, root);
  }

  return root;
};

export default loopRoot;
