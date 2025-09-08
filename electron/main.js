import { app, BrowserWindow, session, net } from 'electron/main';
import path from 'node:path';
import { readFileSync } from "node:fs";
import { fileURLToPath } from "url";
import Binaryen from "binaryen";
import * as fs from "node:fs";
import express from "express";
import serveIndex from "serve-index";

const isDev = process.env.NODE_ENV === 'development';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "florr.io - AyuScript",
    webPreferences: {
      webSecurity: false
    }
  });
  const fileServer = express();
  fileServer.use('/', express.static(__dirname), serveIndex(__dirname));

  const PORT = 61699;
  fileServer.listen(PORT, () => {
    console.log(`File server running at http://localhost:${PORT}`);
  });

  const filter = { urls: ["https://static.florr.io/*/client.wasm"] };

  session.defaultSession.webRequest.onBeforeRequest(filter, async (details, callback) => {
    console.log("Fetched:", details.url);

    const request = net.request(details.url + "?ayuscript");
    let chunks = [];
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        chunks.push(chunk);
      });
      response.on('end', async () => {
        let buffer = Buffer.concat(chunks);

        try {
          const module = Binaryen.readBinary(buffer);

          const newModule = Binaryen.readBinary(buffer);

          function addJSHooks(fnName, paramTypes, retType) {
            const preName = `pre_${fnName}`;
            const postName = `post_${fnName}`;
            newModule.addFunctionImport(preName, "hooks", preName, paramTypes, Binaryen.i32);
            newModule.addFunctionImport(postName, "hooks", postName, retType, retType);
          }

          const funcNames = {};

          let main = '';
          let malloc = '';

          for (let i = 0; i < module.getNumExports(); i++) {
            const exp = Binaryen.getExportInfo(module.getExportByIndex(i));
            if (exp.name === "kg") {
              main = exp.value;
            }
            if (exp.name === "Of") {
              malloc = exp.value;
            }
          }

          for (let i = 0; i < module.getNumFunctions(); i++) {
            const funcInfo = Binaryen.getFunctionInfo(module.getFunctionByIndex(i));
            const origName = funcInfo.name;

            if (origName.includes("import")) {
              continue;
            }

            funcNames[i] = origName;
          }

          newModule.addGlobal("ayuMap", Binaryen.i32, true, newModule.i32.const(0));
          for (let i = 0; i < module.getNumFunctions(); i++) {
            const funcInfo = Binaryen.getFunctionInfo(module.getFunctionByIndex(i));
            const origName = funcInfo.name;
            const paramTypes = funcInfo.params;
            const retType = funcInfo.results;

            if (origName.includes("import")) {
              continue;
            }

            addJSHooks(origName, paramTypes, retType);

            const origFuncNewName = `_orig_${origName}`;
            newModule.addFunction(origFuncNewName, funcInfo.params, funcInfo.results, funcInfo.vars, funcInfo.body);

            const params = Binaryen.expandType(funcInfo.params).map((t, idx) => newModule.local.get(idx, t));

            let defaultValue;
            switch (retType) {
              case Binaryen.i32:
                defaultValue = newModule.i32.const(0);
                break;
              case Binaryen.i64:
                defaultValue = newModule.i64.const(0);
                break;
              case Binaryen.f32:
                defaultValue = newModule.f32.const(0);
                break;
              case Binaryen.f64:
                defaultValue = newModule.f64.const(0);
                break;
            }
            if (origName === main) {
              const wrapperBody = newModule.block(null, retType === Binaryen.none ? [
                newModule.global.set("ayuMap", newModule.call(malloc, [newModule.i32.const(Object.keys(funcNames).length)], Binaryen.i32)),
                newModule.if(
                  newModule.i32.and(
                    newModule.i32.load8_u(i, 0, newModule.global.get("ayuMap", Binaryen.i32)),
                    newModule.i32.const(1)
                  ),
                  newModule.if(
                    newModule.call(`pre_${origName}`, params, Binaryen.i32),
                    newModule.call(origFuncNewName, params, retType)
                  ),
                  newModule.call(origFuncNewName, params, retType)
                ),
                newModule.if(
                  newModule.i32.and(
                    newModule.i32.load8_u(i, 0, newModule.global.get("ayuMap", Binaryen.i32)),
                    newModule.i32.const(2)
                  ),
                  newModule.call(`post_${origName}`, [], retType),
                )
              ] : [
                newModule.global.set("ayuMap", newModule.call(malloc, [newModule.i32.const(Object.keys(funcNames).length)], Binaryen.i32)),
                newModule.if(
                  newModule.i32.and(
                    newModule.i32.load8_u(i, 0, newModule.global.get("ayuMap", Binaryen.i32)),
                    newModule.i32.const(2)
                  ),
                  newModule.call(`post_${origName}`, [
                    newModule.if(
                      newModule.i32.and(
                        newModule.i32.load8_u(i, 0, newModule.global.get("ayuMap", Binaryen.i32)),
                        newModule.i32.const(1)
                      ),
                      newModule.if(
                        newModule.call(`pre_${origName}`, params, Binaryen.i32),
                        newModule.call(origFuncNewName, params, retType),
                        defaultValue
                      ),
                      newModule.call(origFuncNewName, params, retType)
                    ),
                  ], retType),
                  newModule.if(
                    newModule.i32.and(
                      newModule.i32.load8_u(i, 0, newModule.global.get("ayuMap", Binaryen.i32)),
                      newModule.i32.const(1)
                    ),
                    newModule.if(
                      newModule.call(`pre_${origName}`, params, Binaryen.i32),
                      newModule.call(origFuncNewName, params, retType),
                      defaultValue
                    ),
                    newModule.call(origFuncNewName, params, retType)
                  )
                )
              ], retType);

              newModule.removeFunction(origName);
              newModule.addFunction(origName, funcInfo.params, funcInfo.results, funcInfo.vars, wrapperBody);
            } else {
              const wrapperBody = newModule.block(null, retType === Binaryen.none ? [
                newModule.if(
                  newModule.i32.and(
                    newModule.i32.load8_u(i, 0, newModule.global.get("ayuMap", Binaryen.i32)),
                    newModule.i32.const(1)
                  ),
                  newModule.if(
                    newModule.call(`pre_${origName}`, params, Binaryen.i32),
                    newModule.call(origFuncNewName, params, retType)
                  ),
                  newModule.call(origFuncNewName, params, retType)
                ),
                newModule.if(
                  newModule.i32.and(
                    newModule.i32.load8_u(i, 0, newModule.global.get("ayuMap", Binaryen.i32)),
                    newModule.i32.const(2)
                  ),
                  newModule.call(`post_${origName}`, [], retType),
                )
              ] : [
                newModule.if(
                  newModule.i32.and(
                    newModule.i32.load8_u(i, 0, newModule.global.get("ayuMap", Binaryen.i32)),
                    newModule.i32.const(2)
                  ),
                  newModule.call(`post_${origName}`, [
                    newModule.if(
                      newModule.i32.and(
                        newModule.i32.load8_u(i, 0, newModule.global.get("ayuMap", Binaryen.i32)),
                        newModule.i32.const(1)
                      ),
                      newModule.if(
                        newModule.call(`pre_${origName}`, params, Binaryen.i32),
                        newModule.call(origFuncNewName, params, retType),
                        defaultValue
                      ),
                      newModule.call(origFuncNewName, params, retType)
                    ),
                  ], retType),
                  newModule.if(
                    newModule.i32.and(
                      newModule.i32.load8_u(i, 0, newModule.global.get("ayuMap", Binaryen.i32)),
                      newModule.i32.const(1)
                    ),
                    newModule.if(
                      newModule.call(`pre_${origName}`, params, Binaryen.i32),
                      newModule.call(origFuncNewName, params, retType),
                      defaultValue
                    ),
                    newModule.call(origFuncNewName, params, retType)
                  )
                )
              ], retType);

              newModule.removeFunction(origName);
              newModule.addFunction(origName, funcInfo.params, funcInfo.results, funcInfo.vars, wrapperBody);
            }
          }

          newModule.addFunction("registerHookPre", Binaryen.i32, Binaryen.none, [Binaryen.i32],
            newModule.block(null, [
              newModule.i32.store8(0, 0,
                newModule.i32.add(newModule.global.get("ayuMap", Binaryen.i32), newModule.local.get(0, Binaryen.i32)),
                newModule.i32.or(
                  newModule.i32.load8_u(0, 0,
                    newModule.i32.add(newModule.global.get("ayuMap", Binaryen.i32), newModule.local.get(0, Binaryen.i32))
                  ),
                  newModule.i32.const(1)
                )
              )
            ])
          );
          newModule.addFunctionExport("registerHookPre", "registerHookPre");
          newModule.addFunction("registerHookPost", Binaryen.i32, Binaryen.none, [Binaryen.i32],
            newModule.block(null, [
              newModule.i32.store8(0, 0,
                newModule.i32.add(newModule.global.get("ayuMap", Binaryen.i32), newModule.local.get(0, Binaryen.i32)),
                newModule.i32.or(
                  newModule.i32.load8_u(0, 0,
                    newModule.i32.add(newModule.global.get("ayuMap", Binaryen.i32), newModule.local.get(0, Binaryen.i32))
                  ),
                  newModule.i32.const(2)
                )
              )
            ])
          );
          newModule.addFunctionExport("registerHookPost", "registerHookPost");
          newModule.addFunction("unregisterHookPre", Binaryen.i32, Binaryen.none, [Binaryen.i32],
            newModule.block(null, [
              newModule.i32.store8(0, 0,
                newModule.i32.add(newModule.global.get("ayuMap", Binaryen.i32), newModule.local.get(0, Binaryen.i32)),
                newModule.i32.and(
                  newModule.i32.load8_u(0, 0,
                    newModule.i32.add(newModule.global.get("ayuMap", Binaryen.i32), newModule.local.get(0, Binaryen.i32))
                  ),
                  newModule.i32.const(254)
                )
              )
            ])
          );
          newModule.addFunctionExport("unregisterHookPre", "unregisterHookPre");
          newModule.addFunction("unregisterHookPost", Binaryen.i32, Binaryen.none, [Binaryen.i32],
            newModule.block(null, [
              newModule.i32.store8(0, 0,
                newModule.i32.add(newModule.global.get("ayuMap", Binaryen.i32), newModule.local.get(0, Binaryen.i32)),
                newModule.i32.and(
                  newModule.i32.load8_u(0, 0,
                    newModule.i32.add(newModule.global.get("ayuMap", Binaryen.i32), newModule.local.get(0, Binaryen.i32))
                  ),
                  newModule.i32.const(253)
                )
              )
            ])
          );
          newModule.addFunctionExport("unregisterHookPost", "unregisterHookPost");

          win.webContents.executeJavaScript(`
            window.ayuHooks = window.ayuHooks || {};
        
            const originalInstantiate = WebAssembly.instantiate;
            WebAssembly.instantiate = async function(buffer, imports = {}) {
              const wasmFunctionNames = ${JSON.stringify(funcNames)};
              window.ayuHooks.functions = wasmFunctionNames;
        
              if (!imports.hooks) imports.hooks = {};
        
              Object.values(wasmFunctionNames).forEach(name => {
                const preName = 'pre_' + name;
                const postName = 'post_' + name;
        
                if (!imports.hooks[preName]) {
                  imports.hooks[preName] = (...args) => {
                    // console.log('Calling hook:', preName, 'with args:', args);
                    return window.ayuHooks?.[preName]?.(...args) ? 0 : 1;
                  };
                }
        
                if (!imports.hooks[postName]) {
                  imports.hooks[postName] = (ret) => {
                    // console.log('Calling hook:', postName, 'with return value:', ret);
                    return window.ayuHooks?.[postName]?.(ret) ?? ret;
                  };
                }
              });
        
              return originalInstantiate.call(this, buffer, imports);
            };
          `);

          // await new Promise(resolve=>fs.writeFile("out.wat", newModule.emitText(), resolve));
          console.log("Validate");
          newModule.validate();
          console.log("Validate pass");
          const newBinary = new Buffer(newModule.emitBinary());

          const outPath = path.resolve(__dirname, 'out.wasm');
          fs.writeFile(outPath, newBinary, (err) => {
            callback({ redirectURL: `http://localhost:61699/out.wasm` });
          });
        } catch (err) {
          console.error('WASM patch error', err);
          callback({ cancel: true });
        }
      });
    });
    request.end();
  });

  win.loadURL('https://florr.io/').then(() => {
    win.webContents.executeJavaScript(`
      window.electron = true
    `);
    if (isDev) {
      win.webContents.executeJavaScript(`
        import('http://localhost:5173/__vite-plugin-monkey.install.user.js')
      `);
      win.webContents.openDevTools();
    } else {
      const jsPath = path.join(__dirname, './ayuscript.user.js');
      const code = readFileSync(jsPath, 'utf-8');
      win.webContents.executeJavaScript(code);
    }
  });
  win.on('page-title-updated', (event) => {
    event.preventDefault();
  });
  win.on('close', (event) => {
    event.preventDefault()
    win.destroy();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  app.quit();
});