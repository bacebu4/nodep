class Node {
  constructor(subUrl, children = []) {
    if (!subUrl) {
      throw new Error();
    }
    this.subUrl = subUrl;
    this.children = children;
  }

  findChildrenBySubUrl(subUrl) {
    return this.children.find((n) => n.subUrl === subUrl);
  }

  addNodeChildren(node) {
    this.children.push(node);
  }

  addChildrenBySubUrls(subUrls) {
    let prevNode = new Node(subUrls[0]);

    this.addNodeChildren(prevNode);

    for (let i = 1; i < subUrls.length; ++i) {
      const currentNode = new Node(subUrls[i]);
      prevNode.addNodeChildren(currentNode);
      prevNode = currentNode;
    }

    return this;
  }
}

class URLTree {
  constructor() {
    this.root = new Node('/');
  }

  add(url) {
    const subUrls = url.split('/');

    let currentNode = this.root;

    for (let i = 0; i < subUrls.length; ++i) {
      const currentSubUrl = subUrls[i];
      const foundNode = currentNode.findChildrenBySubUrl(currentSubUrl);
      if (foundNode) {
        currentNode = foundNode;
      } else {
        currentNode.addChildrenBySubUrls(subUrls.slice(i));
        return this;
      }
    }

    return this;
  }

  find(url) {
    if (url === '') {
      return this.root;
    }

    const subUrls = url.split('/');
    let currentNode = this.root;

    for (let i = 0; i < subUrls.length - 1; ++i) {
      const currentSubUrl = subUrls[i];
      const foundNode = currentNode.findChildrenBySubUrl(currentSubUrl);
      if (foundNode) {
        currentNode = foundNode;
      } else {
        return null;
      }
    }

    const lastSubUrl = subUrls[subUrls.length - 1];
    const foundNode = currentNode.findChildrenBySubUrl(lastSubUrl);
    if (foundNode) {
      return foundNode;
    } else {
      return null;
    }
  }
}
