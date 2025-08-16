import { createRoot } from "react-dom/client";
import "./styles.css";

import {
  AgentChatInputHandlers,
  AgentChatInputPlugin,
  agentChatInputPluginsModule,
  ChatInputActionPlugin,
  ChatInputContextPlugin,
  ChatInputStructuredInputPlugin,
  ChatInputUploadPlugin,
} from "@myshell-run/agent-chat-input-plugins";
import { agentMessagePluginsModule } from "@myshell-run/agent-message-plugins";
import { UploadEndpoint } from "@myshell-run/common-def";
import { ChatCommonHandlers, commonUIModule } from "@myshell-run/common-ui";
import { Container, ContainerModule, interfaces } from "inversify";
import { agentUIModule } from "@myshell-run/agent-ui";
import { ShellAgentChatModel } from "./sidepanel/shellagent-chat.model";
import { Provider as InversifyProvider } from "inversify-react";
import { ShellAgentChat } from "./sidepanel/shellagent-chat";

const mod = new ContainerModule(
  (
    bind: interfaces.Bind,
    unbind: interfaces.Unbind,
    isBound: interfaces.IsBound,
    rebind: interfaces.Rebind
  ) => {
    bind(UploadEndpoint).toConstantValue("http://localhost:3333/api/upload");
    bind(ShellAgentChatModel).toSelf().inSingletonScope();
    rebind(AgentChatInputHandlers).toDynamicValue((ctx) => {
      return ctx.container.get(ShellAgentChatModel);
    });
    bind(ChatCommonHandlers).toDynamicValue((ctx) => {
      return ctx.container.get(ShellAgentChatModel);
    });
    rebind<AgentChatInputPlugin[]>(AgentChatInputPlugin).toConstantValue([
      ChatInputContextPlugin,
      ChatInputUploadPlugin,
      ChatInputStructuredInputPlugin,
      ChatInputActionPlugin,
    ]);
  }
);

const container = new Container();
container.load(agentUIModule);
container.load(commonUIModule);
container.load(agentMessagePluginsModule);
container.load(agentChatInputPluginsModule);

container.load(mod);

const root = createRoot(
  document.getElementById("sidepanel-root") as HTMLElement
);
root.render(
  <InversifyProvider container={container}>
    <ShellAgentChat />
  </InversifyProvider>
);
