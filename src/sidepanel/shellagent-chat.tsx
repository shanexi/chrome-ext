import { Chat } from "@myshell-run/agent-ui";
import { cn } from "@myshell-run/common-ui";
import { useInjection } from "inversify-react";
import { ShellAgentChatModel } from "./shellagent-chat.model";
export const ShellAgentChat = () => {
  const model = useInjection(ShellAgentChatModel);
  return <Chat />;
};
