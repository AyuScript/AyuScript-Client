import { decode } from "@webassemblyjs/wasm-parser";
import { traverse } from "@webassemblyjs/ast";

export function parseRules(wasmBytes, rules) {
  const ast = decode(wasmBytes);

  const funcs = [];

  traverse(ast, {
    Func({ node }) {
      if (node.signature) {
        funcs.push(node);
      }
    }
  });

  function matchParams(wasmParams, ruleParams) {
    if (!ruleParams) return true;
    const paramTypes = wasmParams.map(p => p.valtype);
    return JSON.stringify(paramTypes) === JSON.stringify(ruleParams);
  }

  function matchBody(instrs, ruleBody) {
    if (!ruleBody) return true;
    let j = 0;
    for (let i = 0; i < instrs.length && j < ruleBody.length; i++) {
      const instr = instrs[i];
      const pat = ruleBody[j];
      const actualInstr = instr.object ? instr.object + '.' + instr.id : instr.id;
      if (actualInstr === pat) {
        j++;
      } else {
        j = 0;
      }
    }
    return j === ruleBody.length;
  }

  const matches = {};
  for (let i = 0; i < funcs.length; i++) {
    const type = funcs[i].signature;
    const body = funcs[i].body;
    if(funcs[i].name.value=="func_2564"){
      debugger;
    }

    for (const rule of rules) {
      if (
        matchParams(type?.params || [], rule.param) &&
        matchBody(body, rule.body)
      ) {
        if (rule.parsedName) {
          if (matches[rule.parsedName] !== undefined) {
            throw new Error(
              `Rule "${rule.parsedName}" is matching multiple functions: [${matches[rule.parsedName]}, ${funcs[i].name.value}]`
            );
          }
          matches[rule.parsedName] = funcs[i].name.value;
        }
      }
    }
  }

  for (const rule of rules) {
    if (rule.parsedName && !Object.keys(matches).includes(rule.parsedName)) {
      throw new Error(`Rule "${rule.parsedName}" is not matching any functions`);
    }
  }
  return matches;
}
