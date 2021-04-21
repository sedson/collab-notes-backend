const flattenItem = (item) => {
  if (item.text) {
    return item.text + '\n';
  }

  if (item.children) {
    return item.children.reduce((a, child) => a + flattenItem(child), '');
  }

  return '';
}

module.exports = (slateDoc) => {
  return slateDoc.reduce((a, node) => a + flattenItem(node), '').trim();
}
