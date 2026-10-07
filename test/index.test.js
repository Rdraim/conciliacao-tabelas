import {test} from 'node:test';import assert from 'node:assert/strict';
import {conciliar} from '../src/index.js';
test('keyed differences reconcile independently of order',()=>{const r=conciliar([{id:'a',v:1},{id:'b',v:2}],[{id:'c',v:4},{id:'a',v:3}]);assert.deepEqual(r.incluidos,['c']);assert.deepEqual(r.removidos,['b']);assert.deepEqual(r.alterados,[{id:'a',diferencas:[{campo:'v',antes:1,depois:3}]}]);});
test('duplicates and missing keys fail',()=>{assert.throws(()=>conciliar([{id:1},{id:'1'}],[]),TypeError);assert.throws(()=>conciliar([{}],[]),TypeError);});
test('input remains untouched and selected fields ignore metadata',()=>{const a=Object.freeze({id:'a',v:2,meta:1});assert.deepEqual(conciliar([a],[{id:'a',v:2,meta:9}],{campos:['v']}).iguais,['a']);});
