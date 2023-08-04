import { Command, ValidationError } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";

new Command()
  .name("hoge")
  .version("v0.0.1")
  .env("OPENAI_ACCESS_TOKEN=<value:string>", "ACCESS TOKEN")
  .env("OPENAI_API_KEY=<value:string>", "API KEY")
  .action(async(options) => {

    if(options.openaiApiKey === undefined && options.openaiAccessToken === undefined) {
      throw new ValidationError("Any of the environment variables are required")
    }
  })
  .parse(Deno.args);
