const webpack = require("webpack");
const Compiler = require("../lib/compiler");
const logger = require("../lib/logger");
const { getDefaultConfig } = require("../lib/utils/config");

jest.mock("webpack");
jest.mock("../lib/logger");
jest.mock("../lib/utils/config");
jest.mock("../lib/utils/env");

describe('compiler', () => {

  beforeEach(() => {
    // todo test fail if we use jest.clearAllMocks() and they should not. Investigate why!
    webpack.mockClear();
  });

  test("sets up the compiler with a provided config", () => {
    const config = { client: "client", server: "server" };
    const options = { config };
    const compiler = new Compiler(options);
    expect(webpack).toHaveBeenCalledWith([config.client, config.server]);
    expect(compiler.config).toBe(config);
    expect(compiler.compiler).toBe(webpack.instance);
  });

  test("sets up the compiler using the default config", () => {
    const config = getDefaultConfig();
    const compiler = new Compiler();
    expect(webpack).toHaveBeenCalledWith([config.client, config.server]);
    expect(compiler.config).toEqual(config);
    expect(compiler.compiler).toBe(webpack.instance);
  });

  test("runs the compiler", async () => {
    await new Compiler().run();
    expect(webpack.instance.run).toHaveBeenCalled();
  });

  test("logs errors and warnings", async () => {
    const error = new Error("Mock Error");
    const warning = "Mock Warning";
    const statsJson = { errors: [error], warnings: [warning], children: [] };
    webpack.stats.toJson.mockImplementation(() => statsJson);
    await new Compiler().run();
    expect(logger.error.mock.calls.length).toBe(1);
    expect(logger.warn.mock.calls.length).toBe(1);
    expect(logger.error).toHaveBeenCalledWith(error);
    expect(logger.warn).toHaveBeenCalledWith(warning);
  });

  test("logs the duration in prod env", async () => {
    const message = "finished transpilation";
    const duration = webpack.maxTime;
    const objContainingDuration = expect.objectContaining({ duration });
    await new Compiler().run();
    expect(logger.info).toHaveBeenCalledWith(message, objContainingDuration);
  });

  test("logs success true in prod env", async () => {
    const message = "finished transpilation";
    const success = true;
    const objContainingSuccess = expect.objectContaining({ success });
    await new Compiler().run();
    expect(logger.info).toHaveBeenCalledWith(message, objContainingSuccess);
  });

  test("logs success false in prod env", async () => {
    const message = "finished transpilation";
    const success = false;
    const error = new Error("Mock Error");
    const statsJson = { errors: [error], warnings: [], children: [] };
    const objContainingSuccess = expect.objectContaining({ success });
    const exit = jest.spyOn(process, "exit").mockImplementation(() => {});
    webpack.stats.toJson.mockImplementation(() => statsJson);
    webpack.stats.hasErrors.mockImplementation(() => !success);
    await new Compiler().run();
    expect(logger.info).toHaveBeenCalledWith(message, objContainingSuccess);
    exit.mockRestore();
  });

  test("exits with status 1", async () => {
    const success = false;
    const error = new Error("Mock Error");
    const statsJson = { errors: [error], warnings: [], children: [] };
    const exit = jest.spyOn(process, "exit").mockImplementation(() => {});
    webpack.stats.toJson.mockImplementation(() => statsJson);
    webpack.stats.hasErrors.mockImplementation(() => !success);
    await new Compiler().run();
    expect(exit).toHaveBeenCalledWith(1);
    exit.mockRestore();
  });

})
