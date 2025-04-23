const a ="hola mundo 2"

console.log(a.toLowerCase().replace(/\s+/g, '-'))
console.log(a.split(/\s+/g)
.map(w => w.charAt(0).toUpperCase() + w.slice(1))
.join('') + 'Component')