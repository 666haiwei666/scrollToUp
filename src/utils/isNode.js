export default function(node) {
  return node && typeof node === 'object' && node.nodeType === 1 && typeof node.nodeName === 'string'
}
