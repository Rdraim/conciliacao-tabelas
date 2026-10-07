/** Generic keyed reconciliation. Duplicate keys fail instead of disappearing. */
export function conciliar(anterior, atual, { chave = 'id', campos } = {}) {
  const indexar = (lista) => {
    if (!Array.isArray(lista)) throw new TypeError('Expected an array');
    const mapa = new Map();
    for (const item of lista) {
      if (!item || !Object.hasOwn(item, chave) || !['string','number'].includes(typeof item[chave]) || !String(item[chave]).trim()) throw new TypeError('Missing key');
      const id = String(item[chave]);
      if (mapa.has(id)) throw new TypeError('Duplicate key: ' + id);
      mapa.set(id, item);
    }
    return mapa;
  };
  if (campos !== undefined && (!Array.isArray(campos) || campos.some(c=>typeof c !== 'string'))) throw new TypeError('Invalid fields');
  const a = indexar(anterior), b = indexar(atual);
  const incluidos = [], removidos = [], alterados = [], iguais = [];
  for (const [id, item] of a) {
    if (!b.has(id)) {removidos.push(id);continue;}
    const depois = b.get(id);
    const nomes = campos ?? [...new Set([...Object.keys(item),...Object.keys(depois)])].filter(c=>c!==chave);
    const diferencas = nomes.filter(c=>!Object.is(item[c], depois[c])).map(c=>({campo:c,antes:item[c],depois:depois[c]}));
    if (diferencas.length) alterados.push({id,diferencas});else iguais.push(id);
  }
  for (const id of b.keys()) if (!a.has(id)) incluidos.push(id);
  return {incluidos, removidos, alterados, iguais};
}
